<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Traits;

use App\Entity;
use App\Language;
use App\PropAllowedValue;
use App\Property;
use App\Value;
use App\ValueText;

trait PropertyValuesFormTrait {

    // We don't do "use GetMultilingualConceptName;" because that generates a collision error when this trait on Controllers
    // We do need to make sure though that we do both "use PropertyValuesFormTrait, GetMultilingualConceptName;" when using this trait

    private function getCurrentValues($property, $entityId) {
        if ($property->requires_translation) {
            $currentValues = ValueText::whereHas('value', function($query) use ($property, $entityId) {
                $query->where([
                    'property_id' => $property->id,
                    'entity_id' => $entityId
                ]);
            })->select('text AS value')->whereNull('deleted_at')->get()->pluck('value');
        } else {
            $currentValues = Value::where([
                'property_id' => $property->id,
                'entity_id' => $entityId
            ])->whereNull('deleted_at')->select('value')->get()->pluck('value');
        }
        return $currentValues->count() > 0 ? ($property->multiple_values ? $currentValues : $currentValues->first()) : null;
    }

    private function getEnumPropertyValues ($property, $userLangId, $formValues) {
        $propAllowedValues = PropAllowedValue::where('property_id', $property->id)
            ->whereNull('deleted_at')->select('id', 'state')->get();
        foreach ($propAllowedValues as $propAllowedValue) {
            list($propAllowedValue->language_id, $propAllowedValue->value) = $this->getMultilingualConceptName('prop_allowed_value_name',
                'name', 'p_a_v_id', $propAllowedValue->id, $userLangId, true);
            $propAllowedValue->language_abbrv = Language::where('id', $propAllowedValue->language_id)->first()->abbrv;
        }
        // For formValues return in [value, label] form, else return [id, state, value, language_id, language_abbrv] form
        return $formValues ? $this->transformForFormValues($propAllowedValues) : $propAllowedValues;
    }

    private function getPropRefPropertyValues ($property, $userLangId, $formValues) {
        //  When a property is of type prop_ref, if defined, we get the property's values from its fkProperty (e.g. names of car types)
        //  If not defined, we get its values from its fkEntity's internal ids instead.
        if ($property->fk_property_id) {
            $fkProperty = Property::find($property->fk_property_id);
            $values = Value::where('property_id', $fkProperty->id)
                ->whereNull('deleted_at')->select('id', 'state', 'value')->get();
            // If fkProperty has requires_translation flag, get its value from the value_text table
            foreach ($values as $value) {
                if ($fkProperty->requires_translation) {
                    list($value->language_id, $value->value) = $this->getMultilingualConceptName('value_text',
                        'text', 'value_id', $value->id, $userLangId, true);
                    $value->language_abbrv = Language::where('id', $value->language_id)->first()->abbrv;
                }
            }
            // For formValues return in [value, label] form, else return [id, state, value, language_id, language_abbrv] form
            return $formValues ? $this->transformForFormValues($values) : $values;
        } else {
            // In case fk_property isn't specified, get the fk_entity_type's instances (entities) and display value as its internal ids.
            return $this->getEntityRefPropertyValues($property->fk_entity_type_id, $formValues);
        }
    }

    private function transformForFormValues($values) {
        return $values->map(function($formValue) {
            return ['value' => $formValue->id, 'label' => $formValue->value];
        });
    }

    private function getEntityRefPropertyValues($referencedEntType, $formValues) {
        return Entity::where('ent_type_id', $referencedEntType)
            ->when($formValues, function($formPossibleValues) {
                $formPossibleValues->select('id as value', 'internal_id as label');
            }, function ($else) {
                $else->select('entity.*', 'internal_id as value');
            })
            ->whereNull('deleted_at')
            ->get();
    }

}
