<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Traits;

use App\ActionProp;
use App\ActionPropForm;
use App\EnableCondition;
use App\EnableConditionLog;
use App\Entity;
use App\FormCalculation;
use App\FormCalculationLog;
use App\FormContent;
use App\Http\Controllers\FormController;
use App\Language;
use App\Property;
use App\ValidationCond;
use App\Value;

trait FormUpdatingTrait
{
    // We don't do 'use GetMultilingualConceptName;' because that generates a collision error when this trait on Controllers
    // We do need to make sure though that we do both "use FormUpdatingTrait, GetMultilingualConceptName;" when using this trait
    use PropertyValuesFormTrait, BlocklyXMLManipulatingTrait;

    /**
     *
     * Update already created forms to adapt to the changes of the updated object.
     *
     * @param    string  $type  Must be one of  'propertyLabel', 'entityTypeLabel', 'propertyValues' or 'propertyInformation'.
     * @param    object  $updatedObject  The object that has been updated and thus needs forms to reflect its changes.
     * @param    int  $userId  The id of the user updating the object.
     * @param    int  $langId  The id of the user's language updating the object.
     *
     * @author Vitor Freitas <vitor.freitas@arditi.pt>
     *
     */
    private function updateFormsUsingThisObject($type, $updatedObject, $userId, $langId) {
        if ($type === 'propertyLabel') {
            $this->updateFormUsingThisPropertyLabel($updatedObject, $userId, $langId);
        } else if ($type === 'entityTypeLabel') {
            $this->updateFormUsingThisEntityTypeLabel($updatedObject, $userId, $langId);
        } else if ($type === 'propertyValues') {
            $this->updateFormUsingThisPropertyValues($updatedObject, $userId, $langId);
        } else if ($type === 'propertyInformation') {
            $this->updateFormUsingThisPropertyFieldType($updatedObject, $userId);
        }
    }

    private function updateFormUsingThisPropertyLabel($propertyWithNewName, $userId, $newLangId) {
        // Get the forms that have a field using this property
        $formsForUpdate = $this->getFormsThatNeedPropertyLabelUpdating($propertyWithNewName, $newLangId);
        // For each form retrieved, update the field's label
        foreach ($formsForUpdate as $formForUpdate) {
            // Parse the form's json (form information) so that we can get the property field
            $formContent = json_decode($formForUpdate->json);
            // For the field containing this property, get its form component and update its label
            $componentToUpdate = $this->getFormComponentByKey($formContent->components, $propertyWithNewName->id);
            $componentToUpdate->label = $this->getMultilingualConceptName('property_name', 'name',
                'property_id', $propertyWithNewName->id, $newLangId);
            // Save the updated form's json containing the field's updated labels
            $formForUpdate->update([
                'json' => json_encode($formContent),
                'updated_by' => $userId
            ]);
        }
    }

    private function getFormsThatNeedPropertyLabelUpdating($propertyWithNewName, $newLangId) {
        // Get the forms that have a field referring to this property
        $formsWithThisProperty = ActionPropForm::whereHas('actionProp.prop', function ($query) use ($propertyWithNewName) {
            $query->where('property.id', $propertyWithNewName->id);
        })->whereNull('deleted_at')->get()->pluck('form_id');
        // Return the form's content (json) so that we can later update it
        return FormContent::whereIn('form_id', $formsWithThisProperty)->where('language_id', $newLangId)->whereNull('deleted_at')->get();
    }

    private function updateFormUsingThisEntityTypeLabel($entityTypeWithNewName, $userId, $newLangId) {
        // Get the forms that have a dataGrid field using this entity type
        $formsForUpdate = $this->getFormsThatNeedEntityTypeLabelUpdating($entityTypeWithNewName, $newLangId);
        // For each form retrieved, update the dataGrid's box name
        foreach ($formsForUpdate as $formForUpdate) {
            // Parse the form's json (form information) so that we can get the dataGrid field
            $formContent = json_decode($formForUpdate->json);
            // For the dataGrid component representing this entity type, get its form component and update its label
            $componentToUpdate = $this->getFormComponentByKey($formContent->components, 'entType'.$entityTypeWithNewName->id);
            $componentToUpdate->label = $this->getMultilingualConceptName('ent_type_name', 'name',
                'ent_type_id', $entityTypeWithNewName->id, $newLangId);
            // Save the updated form's json containing the field's updated labels
            $formForUpdate->update([
                'json' => json_encode($formContent),
                'updated_by' => $userId
            ]);
        }
    }

    private function getFormsThatNeedEntityTypeLabelUpdating($entityTypeWithNewName, $newLangId) {
        // Get the forms that use this 'has many' entity type
        $formsWithThisEntityType = ActionPropForm::whereHas('actionProp.prop.entType', function ($query) use ($entityTypeWithNewName) {
            $query->where([
                'ent_type.has_many' => true,
                'ent_type.id' => $entityTypeWithNewName->id
            ]);
        })->whereNull('deleted_at')->get()->pluck('form_id');
        // Return the form's content (json) so that we can later update it
        return FormContent::whereIn('form_id', $formsWithThisEntityType)->where('language_id', $newLangId)->whereNull('deleted_at')->get();
    }

    private function updateFormUsingThisPropertyValues($propertyWithNewValue, $userId, $newLangId) {
        // Get the forms that have a select/radio field using this property
        $formsForUpdate = $this->getFormsThatNeedPropertyValuesUpdating($propertyWithNewValue, $newLangId);
        // For each form retrieved, update the field's possible values
        foreach ($formsForUpdate as $formForUpdate) {
            // Parse the form's json (form information) so that we can get the property field
            $formContent = json_decode($formForUpdate->json);
            // Get all prop_ref/enum properties inside the form that refer to this property
            $propertiesToUpdate = $this->getPropertiesInFormToUpdateValues($formForUpdate->form_id, $propertyWithNewValue);
            // For each field containing this property, get its form component and update possible values
            foreach ($propertiesToUpdate as $propertyIdToUpdate) {
                $componentToUpdate = $this->getFormComponentByKey($formContent->components, $propertyIdToUpdate);
                $this->updatePropertyValuesInForm($componentToUpdate, $propertyIdToUpdate, $newLangId);
            }
            // Save the updated form's json containing the field's updated values
            $formForUpdate->update([
                'json' => json_encode($formContent),
                'updated_by' => $userId
            ]);
        }
    }

    private function getFormsThatNeedPropertyValuesUpdating($property, $newLangId) {
        // Get the forms that have a select/radio field using this property (enum) or using a property that refers to this one (prop ref)
        $formsWithThisProperty = ActionPropForm::whereHas('actionProp.prop', function ($query) use ($property) {
            $this->queryToGetPropertiesToUpdate($query, $property);
        })->whereNull('deleted_at')->get()->pluck('form_id');
        // Return the form's content (json) so that we can later update it
        return FormContent::whereIn('form_id', $formsWithThisProperty)->where('language_id', $newLangId)->whereNull('deleted_at')->get();
    }

    private function getPropertiesInFormToUpdateValues ($formId, $property) {
        // Ge the properties in this form that are prop_ref/enum and referring to this property
        return ActionProp::whereHas('prop', function ($query) use ($property) {
            $this->queryToGetPropertiesToUpdate($query, $property);
        })->whereHas('actionPropForms', function($query) use ($formId) {
            $query->where('form_id', $formId)
                ->whereNull('deleted_at');
        })->whereNull('deleted_at')->get()->pluck('prop_id');
    }

    private function queryToGetPropertiesToUpdate($mainQuery, $property) {
        // Get properties that are either this property (enum) or properties that refer to this one (prop ref)
        return $mainQuery->where(function($query) use ($property) {
            $query->where(function ($query) use ($property) {
                $query->where('value_type', 'prop_ref')
                    ->where('fk_property_id', $property->id);
            })
                ->orWhere(function ($query) use ($property) {
                    $query->where('value_type', 'prop_ref')
                        ->whereNull('fk_property_id')
                        ->where('fk_entity_type_id', $property->ent_type_id);
                })
                ->orWhere(function ($query) use ($property) {
                    $query->where('value_type', 'enum')
                        ->where('id', $property->id);
                });
        })->whereNull('deleted_at');
    }

    private function getFormComponentByKey(&$formComponents, $key, $deleteComponent = false) {
        $foundKeyComponentInForm = null;
        foreach ($formComponents as $formComponentIndex => $formComponent) {
            // If the form field's key is the property_id, return it as this is the wanted component that uses the property
            if (isset($formComponent->key) && $formComponent->key === $key) {
                $foundKeyComponentInForm = $formComponent;
                // If deleteComponent flag is true, remove the component from the array
                if ($deleteComponent) {
                    unset($formComponents[$formComponentIndex]);
                    // Reindex the array to maintain correct array structure
                    $formComponents = array_values($formComponents);
                }
                return $foundKeyComponentInForm;
            } else {
                // If the field's key isn't the property id but the field has subcomponents
                // Search for the property's form field in its subcomponents depending on the current layout element's type
                if (isset($formComponent->components)) {
                    $foundKeyComponentInForm = $this->getFormComponentByKey($formComponent->components, $key, $deleteComponent);
                    // Reindex the components array in case deletion occurred
                    if ($deleteComponent && $foundKeyComponentInForm) {
                        $formComponent->components = array_values($formComponent->components);
                    }
                } else if ($formComponent->type === 'columns') {
                    $foundKeyComponentInForm = $this->getFormComponentByKey($formComponent->columns, $key, $deleteComponent);
                    // Reindex the columns array in case deletion occurred
                    if ($deleteComponent && $foundKeyComponentInForm) {
                        $formComponent->columns = array_values($formComponent->columns);
                    }
                } else if ($formComponent->type === 'table') {
                    $foundKeyComponentInForm = $this->getFormTableComponentByKey($formComponent, $key, $deleteComponent);
                }
                if ($foundKeyComponentInForm) {
                    return $foundKeyComponentInForm;
                }
            }
        }
        return null;
    }

    private function getFormTableComponentByKey($tableComponent, $key, $deleteComponent) {
        foreach ($tableComponent->rows as $formComponentLine) {
            foreach  ($formComponentLine as $formComponentColumn) {
                $keyComponentInForm = $this->getFormComponentByKey($formComponentColumn->components, $key, $deleteComponent);
                if ($keyComponentInForm) {
                    // Reindex only if a component was deleted
                    if ($deleteComponent) {
                        $formComponentColumn->components = array_values($formComponentColumn->components);
                    }
                    // Return after deletion and reindexing
                    return $keyComponentInForm;
                }
            }
        }
        return null;
    }

    private function deleteFormComponentByKey($formComponents, $key) {
        $deletedComponent = $this->getFormComponentByKey($formComponents, $key, true);
        return array_values($formComponents);
    }

    private function updatePropertyComponentOptionsByKey($formComponents, $key, $newActionPropId, $formId, $userId) {
       $keyComponentInForm = $this->getFormComponentByKey($formComponents, $key);
        // Update the actionPropId identifier inside the component
        $keyComponentInForm->attributes->idActionProp = $newActionPropId;
        // Update/Add/Remove the component's required flag, enableCondition and/or formCalculation
        $this->updateComponentRequiredValidationCondition($keyComponentInForm, $newActionPropId);
        $this->updateComponentEnableCondition($keyComponentInForm, $newActionPropId, $formId, $userId);
        $this->updateComponentFormCalculation($keyComponentInForm, $newActionPropId, $formId, $userId);
        return array_values($formComponents);
    }

    private function updateEntityComponentOptionsByKey($formComponents, $key, $newEntitySpecificationTerm) {
       $keyComponentInForm = $this->getFormComponentByKey($formComponents, $key);
        // Update the entitySpecificationTerm identifier inside the component
        $keyComponentInForm->attributes->entitySpecificationTerm = $newEntitySpecificationTerm;
        return array_values($formComponents);
    }

    private function updateComponentRequiredValidationCondition($formComponent, $actionPropId) {
        $hasRequiredValidationCondition = ValidationCond::where([
            'type' => 'required',
            'action_prop_id' => $actionPropId
        ])->whereNull('deleted_at')->exists();

        $formComponent->validate->required = $hasRequiredValidationCondition;
    }

    private function updateComponentEnableCondition($formComponent, $actionPropId, $formId, $userId) {
        $formController = new FormController();
        $propertyEnableCondition = $formController->getEnableConditionJsonLogic($actionPropId);

        $formComponent->conditional = (object)[];
        if ($propertyEnableCondition) {
            $formComponent->conditional->json = json_decode($propertyEnableCondition);
            $this->storeEnableConditionLog($actionPropId, $formId, $propertyEnableCondition, $userId);
        }
    }

    private function storeEnableConditionLog($actionPropId, $formId, $jsonLogic, $userId) {
        $enableCondition = EnableCondition::where('action_prop_id', $actionPropId)->whereNull('deleted_at')->first();
        EnableConditionLog::create([
            'enable_condition_id' => $enableCondition->id,
            'form_id' => $formId,
            'json_logic' => $jsonLogic,
            'updated_by' => $userId
        ]);
    }

    private function updateComponentFormCalculation($formComponent, $actionPropId, $formId, $userId) {
        $formController = new FormController();
        $propertyFormCalculation = $formController->getFormCalculationJsonLogic($actionPropId);

        if ($propertyFormCalculation) {
            $formComponent->disabled = true;
            $formComponent->calculateValue = json_decode($propertyFormCalculation);
            $this->storeFormCalculationLog($actionPropId, $formId, $propertyFormCalculation, $userId);
        } else {
            $formComponent->disabled = false;
            $formComponent->calculateValue = null;
        }
    }

    private function storeFormCalculationLog($actionPropId, $formId, $jsonLogic, $userId) {
        $formCalculation = FormCalculation::where('action_prop_id', $actionPropId)->whereNull('deleted_at')->first();
        FormCalculationLog::create([
            'form_calculation_id' => $formCalculation->id,
            'form_id' => $formId,
            'json_logic' => $jsonLogic,
            'updated_by' => $userId
        ]);
    }

    private function updatePropertyValuesInForm($componentToUpdate, $propertyId, $formLanguageId) {
        // Get the property's info, such as its value_type and the requires_translation flag
        $property = Property::find($propertyId);
        // Get the property's updated possible values
        if ($property->value_type === 'bool') {
            $propertyValues = [
                (object)['label' => trans('validation.bool-yes'), 'value' => true],
                (object)['label' => trans('validation.bool-no'), 'value' => false]
            ];
        } else {
            $propertyValues = $property->value_type === 'prop_ref' ?
                $this->getPropRefPropertyValues($property, $formLanguageId, true) :
                $this->getEnumPropertyValues($property, $formLanguageId, true);
        }
        // Update the form component according to its type
        if ($componentToUpdate->type === 'radio') {
            $componentToUpdate->values = $propertyValues;
        } else if ($componentToUpdate->type === 'select') {
            $componentToUpdate->data->values = $propertyValues;
        }
    }

    private function updateFormUsingThisPropertyFieldType($property, $userId) {
        $this->updateValidationConditions($property, $userId);
        // Get the forms that have a field using this property
        $formsForUpdate = $this->getFormsThatUseThisProperty($property);
        // For each form retrieved, update the field's type, flags and delete validation conditions if needed
        foreach ($formsForUpdate as $formForUpdate) {
            // Parse the form's json (form information) so that we can get the property field
            $formContent = json_decode($formForUpdate->json);
            // For the field containing this property, get its form component
            $componentToUpdate = $this->getFormComponentByKey($formContent->components, $property->id);
            // In case the 'multiple_values' flag was updated
            $componentToUpdate->multiple = !!$property->multiple_values;
            // When changing from a 'prop_ref' value type to 'enum' or vice-versa, keep the select/radio fieldType chosen before
            // But update the field's options to reflect the newly chosen value type
            if ($property->value_type === 'enum' && $property->oldPropertyValueType === 'prop_ref' ||
                $property->value_type === 'prop_ref' && $property->oldPropertyValueType === 'enum') {
                $this->updatePropertyValuesInForm($componentToUpdate, $property->id, $formForUpdate->language_id);
            } else if ($property->value_type !== $property->oldPropertyValueType) {
                // If the valueType change isn't from 'prop_ref' to 'enum' or vice-versa, we need a field type update
                // Also, as the newValueType may be incompatible with the oldValueType, delete validation conditions
                $this->updateFieldTypeInForm($componentToUpdate, $property, $userId, $formForUpdate);
            } else if ($property->fk_ent_type_id !== $property->oldReferencedEntType || $property->fk_property_id !== $property->oldReferencedProperty) {
                // In case the field type hasn't changed but the 'prop ref' fk_property/fk_ent_type has, update the field's options
                $this->updatePropertyValuesInForm($componentToUpdate, $property->id, $formForUpdate->language_id);
            }
            // Save the updated form's json containing the field's updated field type
            $formForUpdate->update([
                'json' => json_encode($formContent),
                'updated_by' => $userId
            ]);
        }
    }

    private function updateValidationConditions($property, $userId) {
        if (($property->value_type !== $property->oldPropertyValueType)) {
            // Delete all validation conditions (except isRequired) when valueType changes due to incompatibility with new valueType
            $this->deleteValidationConditionsOnChange($property, $userId);
            // Update the ActionRules that are using this property in a 'user input' action, so it reflects this deletion
            // of validationConditions. Delete these validationConditions from the blockly_xml of these Action Rules
            $this->removeActionRulesValidationConditions($property->id, $userId);
            // If the property's new type is 'integer', automatically insert an 'isInteger' validation condition in the DB for this actionProp
            if ($property->value_type === 'int') {
                $this->addIsIntegerValidationConditionToProperty($property, $userId);
            }
        }
    }

    private function getFormsThatUseThisProperty($property) {
        // Get the forms that have a field referring to this property
        $formsWithThisProperty = ActionPropForm::whereHas('actionProp.prop', function ($query) use ($property) {
            $query->where('property.id', $property->id);
        })->whereNull('deleted_at')->get()->pluck('form_id');
        // Return the form's content (json) so that we can later update it
        return FormContent::whereIn('form_id', $formsWithThisProperty)->whereNull('deleted_at')->get();
    }

    private function updateFieldTypeInForm($componentToUpdate, $property, $userId, $formForUpdate) {
        $oldComponentFieldType = $componentToUpdate->type;
        $newPropertyFieldType = $this->getDefaultFieldTypeForProperty($property->value_type);
        // Set the new default field type for the new valueType
        $componentToUpdate->type = $newPropertyFieldType;
        $this->updateActionPropForm($property->id, $newPropertyFieldType, $formForUpdate, $userId);
        // Reset validation conditions
        $this->updateValidationConditionEnforcedInForm($property, $componentToUpdate, $formForUpdate);
        $this->updateRadioSelectFieldSettings($componentToUpdate, $property, $formForUpdate, $oldComponentFieldType, $newPropertyFieldType);
    }

    private function getDefaultFieldTypeForProperty($newValueType) {
        switch ($newValueType) {
            case 'text':
                return 'textfield';
            case 'enum':
            case 'prop_ref':
                return 'select';
            case 'int':
            case 'double':
                return 'number';
            case 'date':
                return 'datetime';
            case 'time':
                return 'time';
            case 'file':
                return 'file';
            case 'bool':
                return 'radio';
            default:
                return null;
        }
    }

    private function updateActionPropForm($propertyId, $newPropertyFieldType, $formForUpdate, $userId) {
        $actionPropForm = ActionPropForm::whereHas('actionProp', function($query) use ($propertyId) {
            $query->where('prop_id', $propertyId);
        })->where('form_id', $formForUpdate->form_id)->whereNull('deleted_at')->first();
        $actionPropForm->update([
            ['form_field_type' => $newPropertyFieldType],
            ['updated_by' => $userId]
        ]);
    }

    private function deleteValidationConditionsOnChange($property, $userId) {
        // Validation Conditions of type 'required' can stay, because they are independent of the field type
        $validationConditions = ValidationCond::whereHas('actionProp', function ($query) use ($property) {
            $query->where('prop_id', $property->id)
                ->whereNull('deleted_at');
        })->where('type', '!=', 'required')->whereNull('deleted_at')->get();
        foreach ($validationConditions as $validationCondition) {
            $validationCondition->update([
                'updated_by' => $userId
            ]);
            $validationCondition->delete();
        }
    }

    private function addIsIntegerValidationConditionToProperty($property, $userId) {
        // Get actionProps (of this property) that are either on an active form (action may have been deleted)
        // or in an active action (may have no forms defined for it yet)
        $actionPropsInUse = ActionProp::where(function ($actionProp) {
            $actionProp->whereHas('actionPropForms.form', function($query) {
                $query->whereNull('deleted_at');
            })->orWhereHas('action', function ($query) {
                $query->whereNull('deleted_at');
            });
        })->where('prop_id', $property->id)->whereNull('deleted_at')->get();
        foreach ($actionPropsInUse as $actionProp) {
            ValidationCond::create([
                'type' => 'isInteger',
                'action_prop_id' => $actionProp->id,
                'negative' => 0,
                'updated_by' => $userId
            ]);
        }
    }

    private function updateValidationConditionEnforcedInForm($property, $componentToUpdate, $formForUpdate) {
        // Creates the start of the validations' string that stores validations and their error messages
        $customValidation = "let validations=[],messages=[];\nfunction myFunction(item){if(typeof item===\"string\"){messages.push(item)}}\n";
        $componentToUpdate->validate->minLength = $componentToUpdate->validate->maxLength =
        $componentToUpdate->validate->minWords = $componentToUpdate->validate->maxWords = null;
        if ($property->value_type === 'int') {
            $formLangAbbrv = Language::find($formForUpdate->language_id)->abbrv;
            $customValidation .= "valid = (Number.isInteger(Number(input))) ? true : '" . trans('validation.integer-form-field', [], $formLangAbbrv) . "';\n";
            $customValidation .= "validations.push(valid);";
        }
        $customValidation .= "validations.forEach(myFunction),0===messages.length?valid=!0:valid=messages[0];";
        $componentToUpdate->validate->custom = $customValidation;
    }

    private function updateRadioSelectFieldSettings($componentToUpdate, $property, $formForUpdate, $oldFieldType, $newFieldType) {
        // In case old fieldType was radio/select, remove the properties used for these fields' options.
        if ($oldFieldType === 'select') {
            unset($componentToUpdate->data);
        } else if ($oldFieldType === 'radio') {
            unset($componentToUpdate->values);
        }
        // If the new field type is radio/select it's because the property's new value_type is enum/prop_ref
        // In this case, update the field to have the newly set field's correct options
        if ($newFieldType === 'radio' || $newFieldType === 'select') {
            if ($newFieldType === 'radio') {
                $componentToUpdate->inputType = 'radio';
                $componentToUpdate->values = [];
            } else {
                $componentToUpdate->widget = 'choicesJS';
                $componentToUpdate->data = (object)[
                    'values' => []
                ];
            }
            $this->updatePropertyValuesInForm($componentToUpdate, $property->id, $formForUpdate->language_id);
        }
    }

    private function transformQueryResultsToFormValues($queryResult, $userLangId, $referencedFormFieldEntity, $referencedFormFieldProperty = null) : array
    {
        // These queryResults must come with the corresponding valueId so that we can store the selected option in the DB
        $formValues = [];

        // Transform the query results array into the format ['value' => ..., 'label' => ..., 'description' => ...]
        // to be used in the form field's select box
        foreach ($queryResult["resultRows"] as $entityId => $resultRow) {

            // To store every query's result property, as in the title we can only have on property
            $fieldDescription = '';
            // To store the select option's title and id
            $titleValue = null;
            $titleLabel = null;

            foreach($resultRow as $index => $resultValue) {
                // The header corresponding to the current query result value being analyzed, to be used in the description.
                $queryHeader = $queryResult["header"][$index];
                // Build the description text in the correct format of "header1 => value, header2 => value, ..."
                $fieldDescription .= $fieldDescription === '' ? '' : ', ';
                $fieldDescription .= isset($resultValue['value']) ? '<strong>' . $queryHeader . '</strong>: ' . $resultValue['value'] : $queryHeader . ': ---';

                if ($referencedFormFieldProperty && isset($resultValue['value'])) {
                    // If it referenced a specific property, check if it's the one being analyzed now
                    $valueProperty = Value::find($resultValue['id'])->property_id;
                    // If it is, then that will be the select option's title and value_id passed to the DB if the option is selected
                    if ($referencedFormFieldProperty === $valueProperty) {
                        $titleValue = $resultValue['id'];
                        $titleLabel = $resultValue['value'];
                    }
                }
            }

            // If it isn't referring a specific property, it is referring the whole entity
            if (!$referencedFormFieldProperty) {
                $fkEntityName = $this->getMultilingualConceptName('ent_type_name', 'name',
                    'ent_type_id', $referencedFormFieldEntity, $userLangId);
                $entityInternalId = Entity::find($entityId)->internal_id;
                // No specific property referenced, so we get the entity instances' internal_id instead of a specific property
                $titleValue = $entityId;
                $titleLabel = $fkEntityName . ' ' . $entityInternalId;
            }

            $formValues[] = array('value' => $titleValue, 'label' => $titleLabel, 'description' => $fieldDescription);
        }

        return $formValues;
    }

    private function transformEntityInstancesToFormValues($entityInstances) : array
    {
        $formValues = [];
        // Transform the entityInstances collection into the format ['value' => ..., 'label' => ..., 'description' => ...]
        // to be used in the form field's select box
        foreach ($entityInstances as $entityInstance) {
            $formValues[] = array(
                'value' => $entityInstance->id,
                'label' => $entityInstance->ent_type_name . ' ' . $entityInstance->internal_id,
                'description' => $entityInstance->details
            );
        }

        return $formValues;
    }
}
