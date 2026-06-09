<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Traits;

use App\Entity;
use App\EntityDetail;
use App\Property;
use App\Users;
use App\Value;

trait ConceptDetailsTrait
{
    // We don't do 'use GetMultilingualConceptName;' because that generates a collision error when using this trait on Controllers
    // We do need to make sure though that we do both "use GetMultilingualConceptName, ConceptDetailsTrait;" when using this trait

    private function getConceptDetailsInfo($conceptDetails, $entityId, $langId, $detailsInfo = array()) {

        foreach ($conceptDetails as $conceptDetail) {

            // On 'user details' entities, always have as a 'detail' the user's name which that entity belongs to.
            if ($conceptDetail->property_id === 'user') {
                $detailedUser = Users::where('entity_id', $entityId)
                    ->whereNull('deleted_at')->first();
                if ($detailedUser) {
                    $detailsInfo[$conceptDetail->property_id][] = $detailedUser->name;
                }
                continue;
            }
            // Get the property's info
            $property = Property::find($conceptDetail->property_id);
            // Get the assigned values to this property in the current entity
            $entityValues = Value::where([
                ['entity_id', $entityId],
                ['property_id', $property->id]
            ])->whereNull('deleted_at')->get();

            // Initialize array if property has values in the current entity, and it hasn't been initialized in a previous entity
            if ($entityValues->count() && !isset($detailsInfo[$property->id])) {
                $detailsInfo[$property->id] = array();
            }

            // For each entityValue from the value table, get the 'real' value to showcase to the user
            foreach($entityValues as $entityValue) {
                if ($property->value_type === 'prop_ref') {

                    // If property has a fkProperty, get the referenced value of this property
                    if ($property->fk_property_id) {
                        // Check if the property is a 'requires translation' property
                        $fkProperty = Property::find($property->fk_property_id);
                        if ($fkProperty->requires_translation) {
                            // If it's a 'requires translation' fkProperty, get its referenced value from the valueText table
                            $propertyValue = $this->getMultilingualConceptName('value_text', 'text',
                            'value_id', $entityValue->value, $langId);
                        } else {
                            // If it's not a 'requires translation' fkProperty, get its referenced value from the value table
                            $propertyValue = Value::find($entityValue->value)->value;
                        }
                        $detailsInfo[$property->id][] = $propertyValue;
                    } else {
                        // The 'value' in the 'value' table refers to an entity with entity_type = property->fk_entity_type_id
                        $detailsInfo[$property->id][] = Entity::find($entityValue->value)->internal_id;
                    }

                } else if ($property->value_type === 'enum') {

                    // If it's an 'enum' property, get its value from the 'prop_allowed_value_name'
                    $propAllowedValueName = $this->getMultilingualConceptName('prop_allowed_value_name', 'name',
                        'p_a_v_id', $entityValue->value, $langId);
                    $detailsInfo[$property->id][] = $propAllowedValueName;

                } else {

                    // If it's any other type of property, just check if the property is a 'requires translation' property
                    if ($property->requires_translation) {
                        // If it is, get its value from the valueText table
                        $detailsInfo[$property->id][] =$this->getMultilingualConceptName('value_text', 'text',
                            'value_id', $entityValue->value, $langId);
                    } else {
                        // If not, we already have its value in the 'entityValue' variable
                        $detailsInfo[$property->id][] = $entityValue->value;
                    }

                }
            }
        }
        return $detailsInfo;
    }

    private function joinConceptDetailsByProperty($conceptDetails, $langId) {
        // Initialize the array to save the property-values tuples to showcase to user
        $detailsInfo = array();
        // For each conceptDetails, save its info as  'propertyName: propertyValues'
        foreach($conceptDetails as $propertyId => $entityValues) {

            // On 'user details' entities, always have as a 'detail' the user's name which that entity belongs to.
            if ($propertyId === 'user') {
                $detailsInfo[] = $entityValues;
                continue;
            }

            // Showcase the concept details' as 'propertyName: propertyValues'
            $propertyName = $this->getMultilingualConceptName('property_name', 'name',
                'property_id', $propertyId, $langId);
            $detailsInfo[] = $propertyName . ': ' . implode(", ", $entityValues);

        }

        return $detailsInfo;
    }

    private function getEntityInstancesWithDetails($actionId, $entTypeId, $userLangId, $processToGetInstancesFrom = null) {
        // Get the entType's id_name/name (if there's no id_name) to display in the selection box
        $entTypeName = $this->getMultilingualConceptName('ent_type_name', 'id_name',
            'ent_type_id', $entTypeId, $userLangId);
        if (!$entTypeName) {
            $entTypeName = $this->getMultilingualConceptName('ent_type_name', 'name',
                'ent_type_id', $entTypeId, $userLangId);
        }
        // Get every instance of this action's entType in the current process
        $entityInstances = Entity::where('ent_type_id', $entTypeId)
            ->when($processToGetInstancesFrom, function($query) use ($processToGetInstancesFrom) {
                $query->whereHas('transaction', function ($transaction) use ($processToGetInstancesFrom) {
                    $transaction->where('process_id', $processToGetInstancesFrom);
                });
            })->whereNull('deleted_at')->get();
        $entityDetails = EntityDetail::where('action_id', $actionId)->whereNull('deleted_at')->get();
        // For each instance, get the defined entityDetails and form an array to then showcase them to the user
        foreach ($entityInstances as $entityInstance) {
            $entityInstance->ent_type_name = $entTypeName;
            $entityDetailsInfo = $this->getConceptDetailsInfo($entityDetails, $entityInstance->id, $userLangId);
            $entityInstance->details = $this->joinConceptDetailsByProperty($entityDetailsInfo, $userLangId);
        }
        return $entityInstances;
    }
}
