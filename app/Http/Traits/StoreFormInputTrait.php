<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Traits;

use App\ActionPropForm;
use App\Entity;
use App\EntType;
use App\InterProcDep;
use App\Property;
use App\Rules\hasCharacter;
use App\Rules\hasWord;
use App\Rules\maxWordLength;
use App\Rules\minWordLength;
use App\Rules\Negation;
use App\Rules\NotBelongsRange;
use App\Transaction;
use App\UserInputLog;
use App\UserInputLogHasValue;
use App\Users;
use App\ValidationCond;
use App\ValidationCondLog;
use App\Value;
use App\ValueText;
use DB;
use Illuminate\Http\Request;
use Log;

trait StoreFormInputTrait
{
    // We don't do 'use GetMultilingualConceptName;' because that generates a collision error when using this trait on Controllers
    // We do need to make sure though that we do both "use GetMultilingualConceptName, StoreFormInputTrait;" when using this trait

    use FormUpdatingTrait;

    private function getOrCreateUserInputLog($actionId, $transactionStateId, $userId) {
        $userInputLog = UserInputLog::where([
            'transaction_state_id' => $transactionStateId,
            'action_id' => $actionId
        ])->whereNull('deleted_at')->first();
        if (!$userInputLog) {
            $userInputLog = UserInputLog::create([
                'transaction_state_id' => $transactionStateId,
                'action_id' => $actionId,
                'updated_by' => $userId
            ]);
        }
        return $userInputLog;
    }

    private function saveEntityValues($valueLabel, $valueInput, $processId, $userInputLogId, $userId, $langId) {
        // Transform, for example: 'entType16' into '16' which corresponds to the entTypeId
        $entTypeId = str_replace('entType', '', $valueLabel);
        // $valueInput here equals the different ent type instances submitted through the dataGrid component
        foreach ($valueInput as $entTypeInstanceValues) {
            // Only save the dataGrid row [entity] if one or more of its properties have a defined value - don't save empty rows.
            if (!$this->isEntityEmpty($entTypeInstanceValues)) {
                // Create entity for this instance and automatically fill the ent type's 'part of' property
                $entityId = $entTypeInstanceValues['entity_id'] ?? $this->createEntityForHasManyEntType($entTypeId, $processId, $userId)->id;
                // Remove the 'entity_id' key and value from the array so that we're only left with pairs of 'property' => 'submitted value(s)'
                unset($entTypeInstanceValues['entity_id']);
                // Get values for each property in this instance and store it in the database
                foreach($entTypeInstanceValues as $propId => $value) {
                    $property = Property::find($propId);
                    $this->saveSubmittedPropertyValues($property, $value, $entityId, $userInputLogId, $userId, $langId);
                }
            }
        }
    }

    private function isEntityEmpty($entTypeInstanceValues): bool {
        // Check whether the dataGrid row [entity] has one or more of its properties with a defined value
        foreach($entTypeInstanceValues as $value) {
            if ($value) {
                return false;
            }
        }
        return true;
    }

    private function getOrCreateEntity($property, $transactionId, $userId) {
        // Get the entity id if there's already one or, if not, create an entity for the ent_type + transactionState combination
        // For transactions that initiate inside an existing process, we can have many entities of the same type, one for each transaction
        $entity = Entity::where([
            'ent_type_id' => $property->ent_type_id,
            'transaction_id' => $transactionId
        ])->whereNull('deleted_at')->first();
        if (!$entity) {
            $entity = $this->createEntity($property, $transactionId, $userId);
        }
        return $entity;
    }

    private function createEntity($property, $transactionId, $userId) {
        // Create an entity based on the property's entType
        $entType = EntType::find($property->ent_type_id);
        $entity = Entity::create([
            'internal_id' => $entType->last_internal_id + 1,
            'ent_type_id' => $entType->id,
            'state' => 'active',
            'transaction_id' => $transactionId,
            'updated_by' => $userId
        ]);
        // Update the entType's last_internal_id (which is now +1 than it was)
        $entType->update([
            'last_internal_id' => $entity->internal_id,
            'updated_by' => $userId
        ]);
        return $entity;
    }

    private function createEntityForHasManyEntType($entTypeId, $processId, $userId) {
        $entType = EntType::find($entTypeId);
        $transaction = Transaction::where([
            'transaction_type_id' => $entType->transaction_type_id,
            'state' => 'active',
            'process_id' => $processId
        ])->whereNull('deleted_at')->first();
        $entity = Entity::create([
            'internal_id' => $entType->last_internal_id + 1,
            'ent_type_id' => $entTypeId,
            'state' => 'active',
            'transaction_id' => $transaction->id,
            'updated_by' => $userId
        ]);
        $entType->update([
            'last_internal_id' => $entity->internal_id,
            'updated_by' => $userId
        ]);
        // Deal with [fill automatically] 'part of' property [isn't passed from client-side]
        $this->fillPartOfProperty($entTypeId, $entity->id, $processId, $userId);
        return $entity;
    }

    private function fillPartOfProperty($entTypeId, $entityId, $processId, $userId) {
        // Get the part_of property from the current ent_type
        $partOfProperty = Property::where([
            'part_of' => 1,
            'ent_type_id' => $entTypeId
        ])->whereNull('deleted_at')->first();

        // Get the part_of property's fk_property value on the current process.
        if ($partOfProperty->fk_property_id) {
            // If it refers to a specific property in the entType
            $partOfPropertyValueInCurrentProcess = Value::where([
                'property_id' => $partOfProperty->fk_property_id,
                'state' => 'active'
            ])->whereHas('entity.transaction', function($query) use ($processId) {
                $query->where('process_id', $processId);
            })->whereNull('deleted_at')->first();
        } else {
            // If it refers to just the entTypeId (without having a fkProperty, only has fkEntityType)
            $partOfPropertyValueInCurrentProcess = Entity::where('ent_type_id', $partOfProperty->fk_entity_type_id)
            ->whereHas('transaction', function($query) use ($processId) {
                $query->where('process_id', $processId);
            })->whereNull('deleted_at')->first();
        }

        // Assign the previous value to the part_of property
        $partOfPropertyValue = Value::create([
            'entity_id' => $entityId,
            'property_id' => $partOfProperty->id,
            'value' => $partOfPropertyValueInCurrentProcess->id,
            'state' => 'active',
            'updated_by' => $userId
        ]);
    }

    private function savePropertyValue($valueLabel, $valueInput, $entityId, $transactionId, $userInputLogId, $userId, $langId) {
        $property = Property::find($valueLabel);
        // When we're on a 'edit entity instance' action, we already have the entityId from the client-side
        $entityId =  $entityId ?? $this->getOrCreateEntity($property, $transactionId, $userId)->id;
        $this->saveSubmittedPropertyValues($property, $valueInput, $entityId, $userInputLogId, $userId, $langId);
    }

    private function saveSubmittedPropertyValues($property, $submittedValue, $entityId, $userInputLogId, $userId, $langId) {
        // Check if the properties being submitted had already been assigned value(s) for the current transaction
        // If they have, delete them before inserting the new value(s)
        $previousValues = $this->getPropertyPreviousValuesToDelete($property, $entityId, $submittedValue);

        if (!$previousValues->isEmpty()) {
            if ($property->soft_delete) {
                // Soft_delete == 1: maintain history: 'delete' current value (or valueText if prop has the flag requires_translation) and create another one.
                $this->softDeletePreviousValues($property, $previousValues, $userId, $langId);
            } else {
                // If soft_delete == 0: update the current value (or valueText if prop has the flag requires_translation) record.
                if ($property->multiple_values) {
                    $this->updateToCurrentMultipleValues($property, $previousValues, $submittedValue, $entityId, $userInputLogId, $userId, $langId);
                } else {
                    // If soft_delete == 0: update the current value (or valueText if prop has the flag requires_translation) record.
                    $this->updatePreviousValue($property, $previousValues->first(), $submittedValue, $userId, $langId);
                }
                // All values and inter process dependencies are updated, so the function finishes its execution
                return;
            }
        }

        // Create an entry in the value table to store the value inserted/chosen by the user
        // If property requires translation, insert the value inserted in the 'value_text' table
        if ($property->multiple_values) {
            $this->saveMultipleValuesProperty($property, $submittedValue, $previousValues, $entityId, $userInputLogId, $userId, $langId);
        } else {
            $this->saveNewValueProperty($property, $submittedValue, $previousValues->first(), $entityId, $userInputLogId, $userId, $langId);
        }

        // Clean up inter process dependencies (inter proc dep) in case an 'edit entity instance' action has occurred
        // and a dependency is no longer necessary because the depended_on_process's values have been soft deleted
        $this->cleanupPreviousInterProcDep($property, $entityId, $userId);
    }

    private function getPropertyPreviousValuesToDelete($property, $entityId, $newPropertyValues) {
        // Get property's previous values that are no longer viable after the last form filling
        return Value::where([
            'property_id' => $property->id,
            'entity_id' => $entityId
        ])->when($property->multiple_values, function ($query) use ($newPropertyValues) {
            // When property has flag 'multiple values'
            $query->where(function ($query) use ($newPropertyValues) {
                $query->whereNotIn('value', $newPropertyValues)
                    ->orWhereHas('valueText', function($query) use ($newPropertyValues) {
                        $query->whereNotIn('text', $newPropertyValues);
                    });
            });
        }, function($query) use ($newPropertyValues) {
            // When property doesn't have flag 'multiple values', meaning it can only have 1 value at a time
            $query->where(function($query) use ($newPropertyValues) {
                $query->where('value', '!=', $newPropertyValues)
                    ->orWhereHas('valueText', function($query) use ($newPropertyValues) {
                        $query->where('text', '!=', $newPropertyValues);
                    });
            });
        })->whereNull('deleted_at')->get();
    }

    private function softDeletePreviousValues($property, $previousValues, $userId, $langId) {
        foreach ($previousValues as $previousValue) {
            if ($property->requires_translation && $property->value_type !== 'enum') {
                $valueText = ValueText::where([
                    'value_id' => $previousValue->id,
                    'language_id' => $langId
                ])->whereNull('deleted_at')->first();
                $valueText->update([
                    'deleted_by' => $userId
                ]);
                $valueText->delete();
            } else {
                $previousValue->update([
                    'deleted_by' => $userId
                ]);
                $previousValue->delete();
            }
        }
    }

    private function updateToCurrentMultipleValues($property, $previousValues, $currentValues, $entityId, $userInputLogId, $userId, $langId) {
        // If soft_delete == 0: update the current value (or valueText if prop has the flag requires_translation) record.
        // If it has more values than it had, change the current values and create new values.
        // If it has fewer values than it had, change some that it already had and then force delete the rest to really erase from the DB.
        foreach ($previousValues as $previousValue) {
            $updatedPreviousValue = false;
            // While the previous value hasn't been updated and there are still currentValues to insert in the DB
            while (!$updatedPreviousValue && count($currentValues)) {
                $currentValue = array_shift($currentValues);
                // If property value is already in the DB from a previous filling [value unchanged], no need to insert it again
                $propertyValueAlreadyStored = $this->propertyValueAlreadyStored($property, $entityId, $currentValue);
                if (!$propertyValueAlreadyStored) {
                    // Update previous value to contain the new value
                    $this->updatePreviousValue($property, $previousValue, $currentValue, $userId, $langId);
                    $updatedPreviousValue = true;
                }
            }
            // If the previous value hasn't been updated and there are no more current values to update it, force delete to really erase from the DB.
            if (!$updatedPreviousValue) {
                $this->forceDeleteValue($property, $previousValue, $langId);
            }
        }
        // For the remaining new values that couldn't be inserted due to not having more previous values, create new entries for them in the DB
        $this->saveMultipleValuesProperty($property, $currentValues, null, $entityId, $userInputLogId, $userId, $langId);
    }

    private function propertyValueAlreadyStored($property, $entityId, $propertyValue) {
        // Check if the form submitted value is already in the DB from a previous form filling
        if ($property->requires_translation && $property->value_type !== 'enum') {
            return Value::where([
                'entity_id' => $entityId,
                'property_id' => $property->id
            ])->whereHas('valueText', function($query) use ($propertyValue) {
                $query->where('text', $propertyValue)
                    ->whereNull('deleted_at');
            })->whereNull('deleted_at')->first();
        } else {
            return Value::where([
                'entity_id' => $entityId,
                'property_id' => $property->id,
                'value' => $propertyValue
            ])->whereNull('deleted_at')->first();
        }
    }

    private function forceDeleteValue($property, $previousValue, $langId) {
        if ($property->requires_translation && $property->value_type !== 'enum') {
            $valueText = ValueText::where([
                'value_id' => $previousValue->id,
                'language_id' => $langId
            ])->whereNull('deleted_at')->first();
            $valueText->forceDelete();
            // If value record doesn't have other languages referenced in the 'value_text' table, soft_delete the value record as well
            $valueHasOtherLanguages = ValueText::where('value_id', $previousValue->id)->whereNull('deleted_at')->count() > 0;
            if (!$valueHasOtherLanguages) {
                $this->forceDeleteValueRecord($previousValue);
            }
        } else {
            $this->forceDeleteValueRecord($previousValue);
        }
    }

    private function forceDeleteValueRecord($previousValue) {
        // Delete the logs and inter process dependencies that contain references to this value record
        $this->forceDeleteValueLogs($previousValue);
        $this->forceDeleteInterProcDep($previousValue);
        // Delete the value record
        $previousValue->forceDelete();
    }

    private function forceDeleteValueLogs($valueToBeForceDeleted) {
        $userInputLogHasValues = UserInputLogHasValue::where('value_id', $valueToBeForceDeleted->id)->get();
        foreach ($userInputLogHasValues as $userInputLogHasValue) {
            $userInputLogHasValue->forceDelete();
        }
    }

    private function forceDeleteInterProcDep($valueToBeForceDeleted) {
        if ($valueToBeForceDeleted->property->value_type === 'prop_ref') {
            $propertyProcess = $valueToBeForceDeleted->entity->transaction->process_id;
            // Get the previous value's corresponding process
            $valueProcess = $this->getValueProcessForInterProcDep($valueToBeForceDeleted->property, $valueToBeForceDeleted->value);
            // Check if inter process dependency was established before and is still active (depending on other process properties)
            if ($interProcDep = $this->hasInactiveInterProcDep($propertyProcess, $valueProcess, $valueToBeForceDeleted)) {
                // Force delete the previously defined inter process dependency if it is no longer valid
                $interProcDep->forceDelete();
            }
        }
    }

    private function updatePreviousValue($property, $valueRecord, $newValue, $userId, $langId) {
        if ($property->requires_translation && $property->value_type !== 'enum') {
            ValueText::where([
                'value_id' => $valueRecord->id,
                'language_id' => $langId
            ])->whereNull('deleted_at')->first()->update([
                'text' => $newValue,
                'updated_by' => $userId
            ]);
        } else {
            $this->updateInterProcDep($valueRecord, $newValue, $userId);
            $valueRecord->update([
                'value' => $newValue,
                'updated_by' => $userId
            ]);
        }
    }

    private function updateInterProcDep($valueToUpdate, $newValue, $userId) {
        if ($valueToUpdate->property->value_type === 'prop_ref') {
            $propertyProcess = $valueToUpdate->entity->transaction->process_id;
            // Get the previous value's corresponding process
            $previousValueProcess = $this->getValueProcessForInterProcDep($valueToUpdate->property, $valueToUpdate->value);
            // Get the value - to be inserted - corresponding process
            $newValueProcess = $this->getValueProcessForInterProcDep($valueToUpdate->property, $newValue);
            // Check if inter process dependency was established before and is still active (depending on other process properties)
            if ($interProcDep = $this->hasInactiveInterProcDep($propertyProcess, $previousValueProcess, $valueToUpdate)) {
                // Update the previously defined inter process dependency, if it is no longer valid, to reflect the new dependency established
                $interProcDep->update([
                    'depended_on_proc' => $newValueProcess,
                    'updated_by' => $userId
                ]);
            } else {
                // If the dependency is still valid or if there was no dependency before, but it is now needed, create a new record on the corresponding table
                $this->insertInterProcDep($propertyProcess, $newValueProcess, $userId);
            }
        }
    }

    private function getValueProcessForInterProcDep($property, $value) {
        return $property->fk_property_id ? Value::find($value)->entity->transaction->process_id :
            Entity::find($value)->transaction->process_id;
    }

    private function hasInactiveInterProcDep($propertyProcess, $valueProcess, $valuesToBeDeleted = null) {
        // Check if inter process dependency was established before and is still active (depending on other process properties)
        // Get the inter process dependency depending on the passed processes
        $interProcDep = InterProcDep::where([
            'depending_proc' => $propertyProcess,
            'depended_on_proc' => $valueProcess
        ])->whereNull('deleted_at')->first();
        // If there is  no inter process dependency found, return 'false' to note that there is no dependency
        if (!$interProcDep) {
            return false;
        } else {
            // Get the value table records which have a fk_property's 'value' from the depended_on_process
            $dependedOnProcValues = Value::whereHas('entity.transaction', function ($query) use ($interProcDep) {
                $query->where('process_id', $interProcDep->depended_on_proc)
                    ->whereNull('deleted_at');
            })->when($valuesToBeDeleted, function($query) use ($valuesToBeDeleted) {
                $query->whereNotIn('id', $valuesToBeDeleted->pluck('id'));
            })
                ->whereNull('deleted_at')->get()->pluck('id');
            // If there are no values with the established dependency return false, otherwise return true.
            $activeInterProcDep = Value::whereHas('entity.transaction', function ($query) use ($interProcDep) {
                $query->where('process_id', $interProcDep->depending_proc)
                    ->whereNull('deleted_at');
            })->whereIn('value', $dependedOnProcValues)->whereNull('deleted_at')->get()->count();
            // If it has a valid inter process dependency return it, otherwise return false
            return $activeInterProcDep ? false : $interProcDep;
        }
    }

    private function saveMultipleValuesProperty($property, $multipleValues, $softDeletedValues, $entityId, $userInputLogId, $userId, $langId) {
        foreach ($multipleValues as $value) {
            // If there are values that have been 'soft deleted' on a property that has flag 'requires translation',
            // They are used to insert new value_text records that are connected to the old value records
            // Get the first soft deleted value [if it exists] and remove it from the collection for the next iteration
            $softDeletedValue = $softDeletedValues ? $softDeletedValues->shift() : null;
            $this->saveNewValueProperty($property, $value, $softDeletedValue, $entityId, $userInputLogId, $userId, $langId);
        }
    }

    private function saveNewValueProperty($property, $valueInput, $softDeletedValue, $entityId, $userInputLogId, $userId, $langId) {
        // So we don't store the value of properties that weren't filled
        if (isset($valueInput)) {
            // Check if the form submitted value is already in the DB from a previous form filling
            $propertyValueAlreadyStored = $this->propertyValueAlreadyStored($property, $entityId, $valueInput);
            // If the value submitted in the form was already in the DB (from a previous form filling), no need to create new record for that submitted value.
            if (!$propertyValueAlreadyStored) {
                if ($property->requires_translation && $property->value_type !== 'enum') {
                    // If a value_text was previously 'soft deleted', create a new value_text record for the same value record.
                    // If there are no remaining value_texts soft_deleted or there were none from the start, create a new value record.
                    $propertyValueInEntity = $softDeletedValue ?? Value::create([
                        'entity_id' => $entityId,
                        'property_id' => $property->id,
                        'value' => null,
                        'state' => 'active',
                        'updated_by' => $userId
                    ]);
                    $valueText = ValueText::create([
                        'value_id' => $propertyValueInEntity->id,
                        'language_id' => $langId,
                        'text' => $valueInput,
                        'updated_by' => $userId
                    ]);
                    $value = $propertyValueInEntity;
                } else {
                    $value = Value::create([
                        'entity_id' => $entityId,
                        'property_id' => $property->id,
                        'value' => $valueInput,
                        'state' => 'active',
                        'updated_by' => $userId
                    ]);
                }
                // When specifying user details directly in the Users Management area, we don't have a user input log. [as it doesn't come from an action execution]
                if ($userInputLogId) $this->defineUserInputLogHasValue($userInputLogId, $value->id,$userId);
                $this->defineInterProcDep($property, $value, $entityId, $userId);
                $this->updateFormsUsingThisObject('propertyValues', $property, $userId, $langId);
            }
        }
    }

    private function defineUserInputLogHasValue($userInputLogId, $valueId, $userId) {
        $inputLogHasValueAlreadyDefined = UserInputLogHasValue::where([
            'user_input_log_id' => $userInputLogId,
            'value_id' => $valueId
        ])->whereNull('deleted_at')->first();
        if (!$inputLogHasValueAlreadyDefined) {
            // Link the value record to the user_input_log record created earlier
            $userInputLogHasValue = UserInputLogHasValue::create([
                'user_input_log_id' => $userInputLogId,
                'value_id' => $valueId,
                'updated_by' => $userId
            ]);
        }
    }

    private function defineInterProcDep($property, $valueRecord, $entityId, $userId) {
        if (isset($valueRecord)) {
            // If assigning a value to a property of type prop_ref, if each of their entities belong to different processes, establish dependency
            if ($property->value_type === 'prop_ref') {
                // Get the property's corresponding process
                $propertyProcess = Entity::find($entityId)->transaction->process_id;
                // Get the value's corresponding process
                $valueProcess = $this->getValueProcessForInterProcDep($property, $valueRecord->value);
                // Insert the new inter process dependency
                $this->insertInterProcDep($propertyProcess, $valueProcess, $userId);
            }
        }
    }

    private function insertInterProcDep($propertyProcess, $valueProcess, $userId) {
        if ($propertyProcess !== $valueProcess) {
            $dependencyAlreadyDefined = InterProcDep::where([
                'depending_proc' => $propertyProcess,
                'depended_on_proc' => $valueProcess
            ])->whereNull('deleted_at')->first();
            if (!$dependencyAlreadyDefined) {
                $processDependency = InterProcDep::create([
                    'depending_proc' => $propertyProcess,
                    'depended_on_proc' => $valueProcess,
                    'updated_by' => $userId
                ]);
            }
        }
    }

    private function cleanupPreviousInterProcDep($property, $entityId, $userId){
        if ($property->fk_ent_type_id) {
            // Get the property's corresponding process
            $propertyProcess = Entity::find($entityId)->transaction->process_id;
            // Get the 'soft deleted' property values that correspond to this entity
            $deletedPropertyValues = Value::where([
                'entity_id' => $entityId,
                'property_id' => $property->id
            ])->onlyTrashed()->get();
            // Delete the inter process dependency if it is defined and is no longer necessary for each property value
            foreach ($deletedPropertyValues as $previousValue) {
                // Get the previous value's corresponding process
                $valueProcess = $this->getValueProcessForInterProcDep($previousValue->property, $previousValue->value);
                // Check if inter process dependency was established before and is still active (depending on other process properties)
                if ($interProcDep = $this->hasInactiveInterProcDep($propertyProcess, $valueProcess)) {
                    // Soft delete the previously defined inter process dependency, because it is no longer necessary
                    $interProcDep->update([
                        'deleted_by' => $userId
                    ]);
                    $interProcDep->delete();
                }
            }
        }
    }

    private function storeValidationCondLogAfterError ($errors, $formId, $transactionStateId, $userId) {
        DB::beginTransaction();
        try{
            foreach ($this->serverSideValidationLogging as $propId => $actionProp) {
                // If actionProp has rules, check if the error messages obtained refer to any of its rules (indicating there has been an error)
                if (isset($actionProp['rules'])) {
                    foreach($actionProp['rules'] as $valCondId => $rule) {
                        // In case it is a property with the flag 'multiple_values'
                        if (gettype($actionProp['value']) === 'array') {
                            foreach ($actionProp['value'] as $key => $value) {
                                // Rule Message has, for example: 'p4 has to ...' instead of 'p4.0 has to ...' - the ".0" extra is the index of the value being evaluated
                                // Transform it here because the error message will be 'p4.0 has to...'
                                $ruleMessage = str_replace('p'.$propId,'p'.$propId.'.'.$key, $rule['message']);
                                ValidationCondLog::create([
                                    'validation_cond_id' => $valCondId,
                                    'form_id' => $formId,
                                    'transaction_state_id' => $transactionStateId,
                                    'expression_evaluated' => $value,
                                    'expression_result' => $this->valConditionRuleResult('p'.$propId.'.'.$key, $errors, $ruleMessage),
                                    'updated_by' => $userId
                                ]);
                            }
                        } else {
                            ValidationCondLog::create([
                                'validation_cond_id' => $valCondId,
                                'form_id' => $formId,
                                'transaction_state_id' => $transactionStateId,
                                'expression_evaluated' => $actionProp['value'],
                                'expression_result' => $this->valConditionRuleResult('p'.$propId, $errors, $rule),
                                'updated_by' => $userId
                            ]);
                        }
                    }
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            Log::debug($e);
        }
    }

    private function valConditionRuleResult($propIdentifier, $errors, $ruleMessage) {
        return isset($errors[$propIdentifier]) && in_array($ruleMessage['message'], $errors[$propIdentifier]) ? 0 : 1;
    }

    private function storeValidationCondLogSuccess ($formId, $transactionStateId, $userId) {
        // Log all evaluated validation conditions in the respective log table as successful validations
        foreach ($this->serverSideValidationLogging as $propId => $actionProp) {
            if (isset($actionProp['rules'])) {
                foreach($actionProp['rules'] as $valCondId => $rule) {
                    // In case it is a property with the flag 'multiple_values' active
                    if (gettype($actionProp['value']) === 'array') {
                        foreach ($actionProp['value'] as $value) {
                            ValidationCondLog::create([
                                'validation_cond_id' => $valCondId,
                                'form_id' => $formId,
                                'transaction_state_id' => $transactionStateId,
                                'expression_evaluated' => $value,
                                'expression_result' => 1,
                                'updated_by' => $userId
                            ]);
                        }
                    } else {
                        ValidationCondLog::create([
                            'validation_cond_id' => $valCondId,
                            'form_id' => $formId,
                            'transaction_state_id' => $transactionStateId,
                            'expression_evaluated' => $actionProp['value'],
                            'expression_result' => 1,
                            'updated_by' => $userId
                        ]);
                    }
                }
            }
        }
    }

    private function getInfoForServerSideValidation ($formSubmittedData) {
        $validationArray = [];
        // Normal property Submission Example (Car Name): ["6","Opel Corsa 5P"]
        // DataGrid Submission Example (Car has Feature): ["entType16",[{"34":"AC","35":"Red"},{"34":null,"35":"Green"},{"34":"Airbag","35":"Blue"}]
        foreach ($formSubmittedData as $inputValue) {
            $formFieldKey = $inputValue[0];
            if ($formFieldKey != "submit") {
                // In case value submitted is part of an 'has many' entity type, represented in the forms through a dataGrid.
                if (str_contains($formFieldKey, 'entType')) {
                    $validationArray = $this->getDataGridPropertyValuesForServerSideValidation($inputValue[1], $validationArray);
                } else {
                    // In case value is part of a 'normal' property present in the form.
                    $propId = $formFieldKey;
                    // Save the value assigned to this property in the submitted form
                    $validationArray['p'.$propId] = $inputValue[1];
                    // Save the user inserted values for the insertion of validation_cond_log table records
                    $this->serverSideValidationLogging[$propId]['value'] = $inputValue[1];
                }
            }
        }
        return new Request($validationArray);
    }

    private function getDataGridPropertyValuesForServerSideValidation($entTypeInstances, $validationArray) {
        // DataGrid Submission Example (Car has Feature): ["entType16",[{"34":"AC","35":"Red"},{"34":null,"35":"Green"},{"34":"Airbag","35":"Blue"}]
        // For each row of the dataGrid (instance of the 'has many' ent type)
        foreach ($entTypeInstances as $entTypeValues) {
            // Get values for each property in this instance for server-side validation
            foreach($entTypeValues as $propId => $value) {
                // For the first instance, initialize array for the property's values and for the insertion of validation_cond_log table records
                // [as it is an entType represented through dataGrid, it can have several values submitted for the same properties]
                if (!isset($validationArray['p'.$propId])) {
                    $validationArray['p'.$propId] = [];
                    $this->serverSideValidationLogging[$propId]['value'] = [];
                }
                // In case property has the flag 'multiple insertion' active, merge values inserted in this instance with the other instance's values.
                if (is_array($value)) {
                    // Insert the property values in the arrays initialized above
                    $validationArray['p'.$propId] = array_merge($validationArray['p'.$propId], $value);
                    $this->serverSideValidationLogging[$propId]['value'] = array_merge($this->serverSideValidationLogging[$propId]['value'], $value);
                } else {
                    // Insert the property values in the arrays initialized above
                    $validationArray['p' . $propId][] = $value;
                    $this->serverSideValidationLogging[$propId]['value'][] = $value;
                }
            }
        }
        return $validationArray;
    }

    private function replacePropertyNamesValidationErrors ($validationErrors, $langId) {
        // Replace the indexes such as 'p10' in error messages (from server-side validation) with the property's name.
        foreach ($validationErrors as $property => $errorMessages) {
            // property will be something like p4.0 or p4, we want just the propertyId, which in this case is 4
            $propId = substr($property, 1, strpos($property, ".") || 1);
            $propName = $this->getMultilingualConceptName('property_name', 'name', 'property_id',
                $propId, $langId);
            foreach ($errorMessages as $key => $errorMessage) {
                $validationErrors[$property][$key] = str_replace($property,"'".$propName."'",$errorMessage);
            }
        }
        return $validationErrors;
    }

    private function getFormValidationRules($formId, $langId) {
        // Get the form's action_props and build each of theirs validation rules according to the validate method from Laravel
        $actionPropsForm = ActionPropForm::where([
            ['form_id',$formId],
            ['lang_id',$langId]
        ])
            ->whereHas('actionProp.prop', function($query) {
                $query->where('part_of', false);
            })
            ->whereNull('deleted_at')
            ->with('actionProp')
            ->get();
        // Log::debug($actionPropsForm);
        // The rules to be used in the validate method from Laravel must be passed through an array [ x => y, u => v]
        // where, in this case, x and u are the property identifiers and y and v are the respective rules
        $validationRules = [];
        foreach ($actionPropsForm as $actionPropForm) {
            $propId = $actionPropForm->actionProp->prop_id;
            if ($rule = $this->getActionPropValidationRule($actionPropForm->actionProp)) {
                if  ($actionPropForm->actionProp->prop->multiple_values) {
                    $validationRules['p'.$propId.'.*'] = $rule;
                } else {
                    $validationRules['p'.$propId] = $rule;
                }
            }
        }
        // Log::debug($validationRules);
        return $validationRules;
    }

    private function getActionPropValidationRule($actionProp) {
        $actionPropId = $actionProp->id;
        $propId = $actionProp->prop_id;
        $validationConds = ValidationCond::where('action_prop_id',$actionPropId)
            ->whereNull('deleted_at')->get();
        $rule = [];
        // The conditions in the same rule are saved in an array. Example: "numeric|gt:4"
        foreach($validationConds as $validationCond) {
            // Save the error message associated to the validation condition type, as the ->validate() method returns error messages,
            // not indicating which validation failed. We achieve that through the error messages.
            $this->serverSideValidationLogging[$propId]['rules'][$validationCond->id]['type'] = $validationCond->type;
            $this->serverSideValidationLogging[$propId]['rules'][$validationCond->id]['message'] = $this->getValidationMessage($validationCond);
            // Join the property's validation conditions all in one
            if ($laravelValidation = $this->getLaravelValidationCondition($validationCond)) {
                gettype($laravelValidation) == 'array' ? $rule = array_merge($rule, $laravelValidation) : array_push($rule, $laravelValidation);
            }
        }
        // Log::debug('Action Prop '.$actionPropId.' has rule: ');
        // Log::debug($rule);
        return $rule;
    }

    private function getLaravelValidationCondition($validCond) {
        // Transform the validation conditions into Laravel's validate method form depending on type
        // Available Validation Rules: https://laravel.com/docs/8.x/validation#available-validation-rules
        switch($validCond->type) {
            case 'required':
                return 'required';
            case 'isInteger':
                return $validCond->negative ? new Negation('integer') : 'integer';
            case 'equalTo':
                return $validCond->negative ? 'not_in:'.$validCond->param_1 : 'in:'.$validCond->param_1;
            case 'lessThan':
                return $validCond->negative ? ['numeric','gte:'.$validCond->param_1] : ['numeric','lt:'.$validCond->param_1];
            case 'lessEqual':
                return $validCond->negative ? ['numeric','gt:'.$validCond->param_1] : ['numeric','lte:'.$validCond->param_1];
            case 'higherThan':
                return $validCond->negative ? ['numeric','lte:'.$validCond->param_1] : ['numeric','gt:'.$validCond->param_1];
            case 'higherEqual':
                return $validCond->negative ? ['numeric','lt:'.$validCond->param_1] : ['numeric','gte:'.$validCond->param_1];
            case 'belongsRange':
                return $validCond->negative ? ['numeric', new NotBelongsRange($validCond->param_1,$validCond->param_2)] : ['numeric','between:'.$validCond->param_1.','.$validCond->param_2, 'not_in:'.$validCond->param_1.','.$validCond->param_2];
            case 'minWordLength':
                return $validCond->negative ? new minWordLength($validCond->param_1,true) : new minWordLength($validCond->param_1);
            case 'maxWordLength':
                return $validCond->negative ? new maxWordLength($validCond->param_1,true) : new maxWordLength($validCond->param_1);
            case 'minLength':
                return $validCond->negative ? null : 'min:'.$validCond->param_1;
            case 'maxLength':
                return $validCond->negative ? null : 'max:'.$validCond->param_1;
            case 'hasCharacter':
                return $validCond->negative ? new hasCharacter($validCond->param_1, $validCond->param_2, true) : new hasCharacter($validCond->param_1, $validCond->param_2);
            case 'hasWord':
                return $validCond->negative ? new hasWord($validCond->param_1, $validCond->param_2, true) : new hasWord($validCond->param_1, $validCond->param_2);
            case 'regExpression':
                // Remove the 'g' flag if present in the Regular Expression, as it isn't supported in Laravel regex (PHP's preg_match)
                $regex = preg_replace('/\/([a-z]*)g([a-z]*)$/', '/$1$2', $validCond->param_1);
                return $validCond->negative ? 'not_regex:'.$regex : 'regex:'.$regex;
            case 'isEmail':
                return $validCond->negative ? new Negation('email') : 'email:rfc,dns';
            case 'isURL':
                return $validCond->negative ? new Negation('url') : 'url';
            case 'customValidation':
                // TODO How to do this in server-side validation? Impossible as the validation is written in Form.io's terms?
                return null;
            default:
                return null;
        }
    }

    private function getValidationMessage($validCond) {
        // Used to check if a specific validation condition failed: If it failed, the ->validate() method will raise an exception with its error message
        // Get the error message associated with the validation condition, so we can check if the error exception contains it
        switch($validCond->type) {
            case 'required':
                $errorMessage = trans('validation.required');
                break;
            case 'isInteger':
                $errorMessage = $validCond->negative ? trans('validation.negation-integer') : trans('validation.integer');
                break;
            case 'equalTo':
                $errorMessage = $validCond->negative ? trans('validation.not_in', ['values' => $validCond->param_1]) :
                    trans('validation.in', ['values' => $validCond->param_1]);
                break;
            case 'lessThan':
                $errorMessage = $validCond->negative ? trans('validation.gte.numeric', ['value' => $validCond->param_1]) :
                    trans('validation.lt.numeric', ['value' => $validCond->param_1]);
                break;
            case 'lessEqual':
                $errorMessage = $validCond->negative ? trans('validation.gt.numeric', ['value' => $validCond->param_1]) :
                    trans('validation.lte.numeric', ['value' => $validCond->param_1]);
                break;
            case 'higherThan':
                $errorMessage = $validCond->negative ? trans('validation.lte.numeric', ['value' => $validCond->param_1]) :
                    trans('validation.gt.numeric', ['values' => $validCond->param_1]);
                break;
            case 'higherEqual':
                $errorMessage = $validCond->negative ? trans('validation.lt.numeric', ['value' => $validCond->param_1]) :
                    trans('validation.gte.numeric', ['value' => $validCond->param_1]);
                break;
            case 'belongsRange':
                $errorMessage = $validCond->negative ? trans('validation.belongs-range-negation', ['min' => $validCond->param_1, 'max' => $validCond->param_2]) :
                    trans('validation.between.numeric', ['min' => $validCond->param_1, 'max' => $validCond->param_2]);
                break;
            case 'minWordLength':
                $errorMessage = $validCond->negative ? trans('validation.min-word-length-negation', ['min' => $validCond->param_1]) :
                    trans('validation.min-word-length', ['min' => $validCond->param_1]);
                break;
            case 'maxWordLength':
                $errorMessage = $validCond->negative ? trans('validation.max-word-length-negation', ['max' => $validCond->param_1]) :
                    trans('validation.max-word-length', ['max' => $validCond->param_1]);
                break;
            case 'minLength':
                $errorMessage = $validCond->negative ? null :
                    trans('validation.min.string', ['min' => $validCond->param_1]);
                break;
            case 'maxLength':
                $errorMessage = $validCond->negative ? null :
                    trans('validation.max.string', ['max' => $validCond->param_1]);
                break;
            case 'hasCharacter':
                $errorMessage = $validCond->negative ? trans('validation.has-character-negation', ['char' => $validCond->param_1]) :
                    trans('validation.has-character', ['char' => $validCond->param_1]);
                break;
            case 'hasWord':
                $errorMessage = $validCond->negative ? trans('validation.has-word-negation', ['word' => $validCond->param_1]) :
                    trans('validation.has-word', ['word' => $validCond->param_1]);
                break;
            case 'regExpression':
                $errorMessage = $validCond->negative ? trans('validation.not_regex') :
                    trans('validation.regex');
                break;
            case 'isEmail':
                $errorMessage = $validCond->negative ? trans('validation.negation-email') : trans('validation.email');
                break;
            case 'isURL':
                $errorMessage = $validCond->negative ? trans('validation.negation-url') : trans('validation.url');
                break;
            case 'customValidation':
                // TODO How to do this in server-side validation? Impossible as the validation is written in Form.io's terms?
                return null;
            default:
                return null;
        }
        return str_replace(':attribute','p'.$validCond->actionProp->prop_id,$errorMessage);
    }

    private function changedUserDetailsEntityType($firstDetailingProperty, $detailingUserId) {
        $userDetailsEntityId = Users::find($detailingUserId)->entity_id;
        if ($userDetailsEntityId) {
            // Check if the user's ent type has changed [can happen in edit_entity_instance actions]
            return $firstDetailingProperty->ent_type_id !== Entity::find($userDetailsEntityId)->ent_type_id;
        } else {
            // Didn't have a previously assigned entity, so we need to create a new one for the selected ent_type
            return true;
        }
    }

    // Assign the entity [of the properties just inserted in the DB] to the detailingUser
    private function saveUserEntity($userId, $entityId, $updatingUserId) {
        // Get the user's information
        $user = Users::find($userId);
        // In case the user's entity has changed [could have a previously assigned entity or could have no entity]
        if ($user->entity_id !== $entityId) {
            // If the user has a previously assigned entity, delete the former entity that was associated to the user.
            if ($user->entity_id) {
                $this->deleteUserDetailsEntity($user->entity_id, $updatingUserId);
            }
            // Associate the new entity to the user record.
            $user->update([
                'entity_id' => $entityId,
                'updated_by' => $updatingUserId
            ]);
        }
    }

    private function deleteUserDetailsEntity($entityIdToDelete, $updatingUserId) {
        $entityToDelete = Entity::find($entityIdToDelete);
        // Get every 'user details' property value inserted belonging to the entity that is to be deleted
        $userDetailsToDelete = Value::where('entity_id', $entityToDelete->id)
            ->whereNull('deleted_at')->get();
        // Get every 'user details' property value_text [applies for properties that have the flag 'requires translation']
        // inserted belonging to the entity that is to be deleted
        $userDetailsTextToDelete = ValueText::whereIn('value_id', $userDetailsToDelete->pluck('id'))
            ->whereNull('deleted_at')->get();
        // Delete every value/value_text record existing that belong to the soon-to-be deleted entity
        foreach ($userDetailsTextToDelete as $userDetailTextToDelete) {
            $userDetailTextToDelete->update([
                'deleted_by' => $updatingUserId
            ]);
            $userDetailTextToDelete->delete();
        }
        foreach ($userDetailsToDelete as $userDetailToDelete) {
            $userDetailToDelete->update([
                'deleted_by' => $updatingUserId
            ]);
            $userDetailToDelete->delete();
        }
        // Delete the 'user details' entity that is no longer used
        $entityToDelete->update([
            'deleted_by' => $updatingUserId
        ]);
        $entityToDelete->delete();
    }
}
