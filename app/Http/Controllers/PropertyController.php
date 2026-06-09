<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\ActionProp;
use App\Http\Resources\PropertyResource;
use App\Http\Resources\ReferencedPropertyValue;
use App\Http\Traits\FormUpdatingTrait;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use App\PropAllowedValue;
use App\PropAllowedValueName;
use App\Property;
use App\PropertyName;
use App\Query;
use App\Value;
use DB;
use Illuminate\Http\Request;
use Log;

class PropertyController extends Controller
{
    use HTTPResponseTrait, FormUpdatingTrait, GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $properties = Property::whereNull('deleted_at')->get();

        foreach($properties as $property) {
            // If a 'prop ref'/'enum' property already has ValueRecords created, can't change the valueType/fkEntType,
            // So it doesn't disrupt the already stored values.
            $property->cantChangeValueTypeFkEntType = ($property->value_type === 'prop_ref' || $property->value_type === 'enum' ) &&
                Value::where('property_id', $property->id)->whereNull('deleted_at')->exists();
            $this->getPropertyFKNamesAndValues($property, $userLangId);
        }

        return PropertyResource::collection($properties);
    }

    public function show(Request $request, $propertyId)
    {
        $userLangId = $request->user()->language_id;

        $property = Property::find($propertyId);
        $this->getPropertyFKNamesAndValues($property, $userLangId);

        return new PropertyResource($property);
    }

    private function getPropertyFKNamesAndValues ($property, $userLangId, $formValues = false, $entityId = null) {
        list($property->language_id, $property->name) = $this->getMultilingualConceptName('property_name', 'name',
            'property_id', $property->id, $userLangId, true);
        $property->language_abbrv = Language::find($property->language_id)->abbrv;
        $property->ent_type_name = $this->getMultilingualConceptName('ent_type_name', 'name',
            'ent_type_id', $property->ent_type_id, $userLangId);

        if ($property->value_type === 'enum') {
            $property->propertyValues = $this->getEnumPropertyValues($property, $userLangId, $formValues);
        } else if ($property->value_type === 'prop_ref') {
            $property->propertyValues = $this->getPropRefPropertyValues($property, $userLangId, $formValues);
            $property->fkEntityTypeProperties = $this->getFkEntityTypeProperties($property, $userLangId);
        }
        if ($entityId) {
            $property->currentValues = $this->getCurrentValues($property, $entityId);
        }
    }

    private function getFkEntityTypeProperties($property, $userLangId) {
        $fkEntTypeProperties = Property::where('ent_type_id', $property->fk_entity_type_id)
            ->whereNull('deleted_at')
            ->select('id')
            ->get();
        foreach($fkEntTypeProperties as $property) {
            $property->name = $this->getMultilingualConceptName('property_name', 'name',
           'property_id', $property->id, $userLangId);
        }
        return $fkEntTypeProperties;
    }

    public function store(Request $request) {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {

            $property = Property::create([
                'ent_type_id' => $request->input('ent_type_id'),
                'value_type' => $request->input('value_type'),
                'scope' => $request->input('scope'),
                'unit_type_id' => $request->input('unit_type_id'),
                'state' => $request->input('state'),
                'fk_property_id' => $request->input('fk_property_id'),
                'fk_entity_type_id' => $request->input('fk_entity_type_id'),
                'part_of' => $request->input('part_of'),
                'requires_translation' => $request->input('requires_translation'),
                'editable' => $request->input('editable'),
                'soft_delete' => $request->input('soft_delete'),
                'is_a' => $request->input('is_a'),
                'is_dependent' => $request->input('is_dependent'),
                'multiple_values' => $request->input('multiple_values'),
                'updated_by' => $userId
            ]);

            $propertyName = PropertyName::create([
                'property_id' => $property->id,
                'language_id' => $langId,
                'name' => $request->input('name'),
                'updated_by' => $userId
            ]);

            if ($request->input('property_values')) {
                $this->dealPropAllowedValues($request->input('property_values'), $property->id, $userId, $langId);
            }

            DB::commit();
            $success = true;
            // all good
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
            // something went wrong
        }
        return (string)$success;
    }

    public function update(Request $request, $propertyId)
    {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        $property = Property::find($propertyId);

        $oldPropertyValueType = $property->value_type;
        $oldReferencedProperty = $property->value_type === 'prop_ref' ? $property->fk_property_id : null;
        $oldReferencedEntType = $property->value_type === 'prop_ref' ? $property->fk_ent_type_id : null;

        $propertyName = PropertyName::where([
            'property_id' => $property->id,
            'language_id' => $langId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $property->update([
                'ent_type_id' => $request->input('ent_type_id'),
                'value_type' => $request->input('value_type'),
                'scope' => $request->input('scope'),
                'unit_type_id' => $request->input('unit_type_id'),
                'state' => $request->input('state'),
                'fk_property_id' => $request->input('fk_property_id'),
                'fk_entity_type_id' => $request->input('fk_entity_type_id'),
                'part_of' => $request->input('part_of'),
                'requires_translation' => $request->input('requires_translation'),
                'editable' => $request->input('editable'),
                'soft_delete' => $request->input('soft_delete'),
                'is_a' => $request->input('is_a'),
                'is_dependent' => $request->input('is_dependent'),
                'multiple_values' => $request->input('multiple_values'),
                'updated_by' => $userId
            ]);
            $propertyName->update([
                'name' => $request->input('name'),
                'updated_by' => $userId
            ]);

            // Update the property's label in forms using this property
            $this->updateFormsUsingThisObject('propertyLabel', $property, $userId, $langId);

            if ($property->value_type === 'enum' && $request->input('property_values')) {
                // Update the property's propAllowedValues
                $this->dealPropAllowedValues($request->input('property_values'), $property->id, $userId, $langId);
                // Update the 'select'/'radio' components' options of forms containing this property
                $this->updateFormsUsingThisObject('propertyValues', $property, $userId, $langId);
            }

            // For property valueType changes or flag changes (multiple values flag)
            $property->oldPropertyValueType = $oldPropertyValueType;
            $property->oldReferencedProperty = $oldReferencedProperty;
            $property->oldReferencedEntType = $oldReferencedEntType;
            $this->updateFormsUsingThisObject('propertyInformation', $property, $userId, $langId);

            if ($property->oldReferencedProperty != $property->fk_property_id) {
                $this->updateReferencedValuesDueToFkPropertyChange($property, $userId);
            }

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string) $success;
    }

    public function destroy(Request $request, $propertyId)
    {
        $userId = $request->user()->id;

        $property = Property::find($propertyId);
        $propertyNames = PropertyName::where('property_id', $propertyId)->get();

        $propertyUsageCheck = $this->checkPropertyUsageBeforeDeleting($propertyId);

        if ($propertyUsageCheck) {
            return $propertyUsageCheck;
        }

        DB::beginTransaction();
        try {

            foreach($propertyNames as $propertyName) {
                $propertyName->update([
                    'deleted_by' => $userId
                ]);
                $propertyName->delete();
            }

            $property->update([
                'deleted_by' => $userId
            ]);
            $property->delete();

            $propAllowedValues = PropAllowedValue::where('property_id', $propertyId)
                ->whereNull('deleted_at')->get();
            foreach ($propAllowedValues as $propAllowedValue) {
                $this->deletePropAllowedValue($propAllowedValue, $userId);
            }

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string) $success;
    }

    private function checkPropertyUsageBeforeDeleting($propertyId)
    {
        // Check if property is being used in an active Action (User Input)
        $isUsedInUserInputAction = ActionProp::where('prop_id', $propertyId)
            ->whereHas('action', function($action) {
                $action->whereNull('deleted_at');
            })->whereNull('deleted_at')->first();


        $isUsedInQuery = false;

        // Check if property is being used in an active Query (as result)
        $isUsedInQueryResult = Query::whereHas('queryResult.property', function($queryResult) use ($propertyId) {
            $queryResult->where('property_id', $propertyId);
        })->whereNull('deleted_at')->first();


        // Check if property is being used in an active Query (as filter)
        $isUsedInQueryTerms = $this->isPropertyUsedInQueryFilters($propertyId);

        if ($isUsedInQueryResult || $isUsedInQueryTerms) {
            $isUsedInQuery = true;
        }

        // If it's being used in an action or in a query, don't allow the user to delete the property
        if ($isUsedInUserInputAction || $isUsedInQuery) {
            $usageIn = $isUsedInUserInputAction ? ( $isUsedInQuery ? 'actionsAndQueries' : 'actions' ) : 'queries';
            return response()->json([
                'inUsage' => true,
                'usageIn' => $usageIn
            ]);
        }

        return false;
    }

    private function isPropertyUsedInQueryFilters($propertyId)
    {
        // Get all active queries' query builder to inspect the usage of the property in its filters
        $queriesBuilder = Query::whereNull('deleted_at')->get()->pluck('query_builder');

        foreach ($queriesBuilder as $queryBaseBuilder) {
            // Decode JSON as an associative array
            $queryBuilderJson = json_decode($queryBaseBuilder, true);
            // Check if the property is used in this query's filters
            $isUsedInQuery = $this->checkPropertyUsageInQueryRule($propertyId, $queryBuilderJson);
            if ($isUsedInQuery) {
                return true;
            }
        }

        return false;
    }

    private function checkPropertyUsageInQueryRule($propertyId, $rule)
    {
        // Check if the rule has a 'rules' key and iterate through its elements
        if (isset($rule['rules']) && is_array($rule['rules'])) {
            foreach ($rule['rules'] as $subRule) {
                if ($this->checkPropertyUsageInQueryRule($propertyId, $subRule)) {
                    // If found in any sub-rule, return true
                    return true;
                }
            }
        }

        // Base case: if the rule contains 'field' and matches the given propertyId
        if (isset($rule['field']) && $rule['field'] == $propertyId) {
            return true;
        }

        return false;
    }

    public function translate(Request $request) {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {
            $property = Property::find($request->input('id'));
            // Check if there has been a PropertyName for this property on the user's language that was soft_deleted
            // Or if the property that is being translated already has a previously defined name. This can happen if
            // the user is translating new PropAllowedValues after already translating the Property itself.
            $hasPreviousNameRecord = PropertyName::withTrashed()
                ->where([
                    'property_id' => $property->id,
                    'language_id' => $langId
                ])->first();
            // In case there was, restore that record (in case it was a deleted record) and update it, so that it reflects
            // the most recent name inserted [as we can't have another entry in the DB for the same property_id & language_id combo]
            if ($hasPreviousNameRecord) {
                if ($hasPreviousNameRecord->trashed()) {
                    $hasPreviousNameRecord->restore();
                    $hasPreviousNameRecord->update(['deleted_by' => null]);
                }
                $translatedPropertyName = $hasPreviousNameRecord->update([
                    'deleted_by' => null,
                    'name' => $request->input('name'),
                    'updated_by' => $userId
                ]);
            } else {
                // If there isn't, create a new record for the inserted name
                $translatedPropertyName = PropertyName::create([
                    'property_id' => $property->id,
                    'language_id' => $langId,
                    'name' => $request->input('name'),
                    'updated_by' => $userId
                ]);
            }

            // Update the property's label in forms using this property
            $this->updateFormsUsingThisObject('propertyLabel', $property, $userId, $langId);

            if ($property->value_type === 'enum' && $request->input('property_values')) {
                // Translate the property's propAllowedValues
                $this->translatePropAllowedValues($request->input('property_values'), $userId, $langId);
                // Update the 'select'/'radio' components' options of forms containing this property
                $this->updateFormsUsingThisObject('propertyValues', $property, $userId, $langId);
            }

            DB::commit();
            $success = true;
            // all good
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
            // something went wrong
        }
        return (string)$success;
    }

    private function dealPropAllowedValues($propAllowedValues, $propertyId, $userId, $langId) {
        // Array to store propAllowedValues that have been created or updated, so we then know which ones have been deleted
        $dealtPropAllowedValues = [];
        foreach ($propAllowedValues as $propAllowedValue) {
            if ($propAllowedValue['id']) {
                $this->updatePropAllowedValue($propAllowedValue, $userId, $langId);
                $dealtPropAllowedValues[] = $propAllowedValue['id'];
            } else {
                $propAllowedValueCreated = $this->createPropAllowedValue($propAllowedValue, $propertyId, $userId, $langId);
                $dealtPropAllowedValues[] = $propAllowedValueCreated->id;
            }
        }
        // Delete the prop_allowed_values that were deleted in the client-side [weren't passed as property_values]
        $propAllowedValuesToDelete = PropAllowedValue::where('property_id', $propertyId)
            ->whereNotIn('id', $dealtPropAllowedValues)
            ->whereNull('deleted_at')->get();
        foreach ($propAllowedValuesToDelete as $propAllowedValueToDelete) {
            $this->deletePropAllowedValue($propAllowedValueToDelete, $userId);
        }
    }

    private function createPropAllowedValue($propAllowedValue, $propertyId, $userId, $langId) {
        $propAllowedValueRecord = PropAllowedValue::create([
            'property_id' => $propertyId,
            'state' => $propAllowedValue['state'],
            'updated_by' => $userId
        ]);
        $propAllowedValueNameRecord = PropAllowedValueName::create([
            'p_a_v_id' => $propAllowedValueRecord->id,
            'language_id' => $langId,
            'name' => $propAllowedValue['value'],
            'updated_by' => $userId
        ]);
        return $propAllowedValueRecord;
    }

    private function updatePropAllowedValue($propAllowedValue, $userId, $langId) {
        $propAllowedValueRecord = PropAllowedValue::find($propAllowedValue['id']);
        $propAllowedValueRecord->update([
            'state' => $propAllowedValue['state'],
            'updated_by' => $userId
        ]);
        $propAllowedValueNameRecord = PropAllowedValueName::where([
            'p_a_v_id' => $propAllowedValueRecord->id,
            'language_id' => $langId
        ])->whereNull('deleted_at')->first();
        $propAllowedValueNameRecord->update([
            'name' => $propAllowedValue['value'],
            'updated_by' => $userId
        ]);
    }

    private function deletePropAllowedValue($propAllowedValue, $userId) {
        $propAllowedValueRecord = PropAllowedValue::find($propAllowedValue['id']);
        $propAllowedValueRecord->update([
            'updated_by' => $userId
        ]);
        $propAllowedValueRecord->delete();
        $propAllowedValueNameRecords = PropAllowedValueName::where([
            'p_a_v_id' => $propAllowedValueRecord->id
        ])->whereNull('deleted_at')->get();
        foreach ($propAllowedValueNameRecords as $propAllowedValueNameRecord) {
            $propAllowedValueNameRecord->update([
                'updated_by' => $userId
            ]);
            $propAllowedValueNameRecord->delete();
        }
    }

    private function translatePropAllowedValues($propAllowedValues, $userId, $langId) {
        foreach ($propAllowedValues as $propAllowedValue) {
            // The prop allowed value's name may have been updated in the translation, or it may have a previously deleted name in the user's language
            $previouslyTranslated = PropAllowedValueName::withTrashed()
            ->where([
                'p_a_v_id' => $propAllowedValue['id'],
                'language_id' => $langId
            ])->first();
            if ($previouslyTranslated) {
                // In case the previous propAllowedValueName record was soft_deleted, restore that record
                // [as we can't have another entry in the DB for the same p_a_v_id & language_id combo]
                if ($previouslyTranslated->trashed()) {
                    $previouslyTranslated->restore();
                    $previouslyTranslated->update(['deleted_by' => null]);
                }
                // Update it, so that it reflects the most recent name inserted
                $translatedPropAllowedValue = $previouslyTranslated->update([
                    'name' => $propAllowedValue['value'],
                    'updated_by' => $userId
                ]);
            } else {
                // If there wasn't any previous name record for it, create a new record for the inserted name
                $translatedPropAllowedValue = PropAllowedValueName::create([
                    'p_a_v_id' => $propAllowedValue['id'],
                    'language_id' => $langId,
                    'name' => $propAllowedValue['value'],
                    'updated_by' => $userId
                ]);
            }
        }
    }

    public function getPropertiesForEntityType(Request $request, $entTypeId, $entityId = null) {
        $userLangId = $request->user()->language_id;

        $properties = Property::where('ent_type_id', $entTypeId)
            ->whereNull('deleted_at')->get();

        foreach($properties as $property) {
            $this->getPropertyFKNamesAndValues($property, $userLangId, true, $entityId);
        }

        return PropertyResource::collection($properties);
    }

    public function getReferencedPropertiesWithValues(Request $request) {
        $userLangId = $request->user()->language_id;

        $referencedProperties = Property::whereHas('associatedProperties')
            ->whereNull('deleted_at')->get();

        foreach ($referencedProperties as $referencedProperty) {
            $this->getCreatedValuesForReferencedProperty($referencedProperty, $userLangId);
        }

        return ReferencedPropertyValue::collection($referencedProperties);
    }

    private function getCreatedValuesForReferencedProperty ($referencedProperty, $userLangId) {
        $this->getPropertyFKNamesAndValues($referencedProperty, $userLangId);
        $referencedProperty->propertyValues = Value::where('property_id', $referencedProperty->id)
            ->whereNull('deleted_at')->get();
        if ($referencedProperty->requires_translation) {
            foreach ($referencedProperty->propertyValues as $referencedPropertyValue) {
                list($referencedPropertyValue->language_id, $referencedPropertyValue->value) = $this->getMultilingualConceptName('value_text',
                    'text', 'value_id', $referencedPropertyValue->id, $userLangId, true);
                $referencedPropertyValue->language_abbrv = Language::find($referencedPropertyValue->language_id)->abbrv;
            }
        }
        foreach ($referencedProperty->associatedProperties as $associatedProperty) {
            $this->getPropertyFKNamesAndValues($associatedProperty, $userLangId);
        }
    }

    private function updateReferencedValuesDueToFkPropertyChange($property, $userId) {
        // Get the valueRecords that have already been created for this property
        $alreadyCreatedValueRecords = Value::where('property_id', $property->id)->whereNull('deleted_at')->get();
        // Update all of them so that the new referencedProperty remains a valid working link to the previously selected value
        foreach($alreadyCreatedValueRecords as $alreadyCreatedValueRecord) {
            $alreadyCreatedValueRecord->update([
                'value' => $this->getNewReferencedPropertyValue($alreadyCreatedValueRecord->value, $property),
                'updated_by' => $userId
            ]);
        }
    }

    private function getNewReferencedPropertyValue($currentValueRecordValue, $property)
    {
        // Check if the property's previous version specified a referenced property (fk property)
        // If it did, get the currentValueRecord's entityId through getting the stored value's (referenced value) entityId
        // If it didn't, it means it referenced the entity directly, no specific referenced property.
        $currentValueEntityId = $property->oldReferencedProperty ? Value::find($currentValueRecordValue)->entity_id :
            $currentValueRecordValue;

        // For the new value, check if it has a specific referenced property now (fk property)
        if ($property->fk_property_id) {
            // If it does, get that fkProperty's value through the currentValue
            $newReferencedPropertyValue = Value::where([
                'property_id' => $property->fk_property_id,
                'entity_id' => $currentValueEntityId
            ])->whereNull('deleted_at')->first()->id;
        } else {
            $newReferencedPropertyValue = $currentValueEntityId;
        }

        return $newReferencedPropertyValue;
    }
}
