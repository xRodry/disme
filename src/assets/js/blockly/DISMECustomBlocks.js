/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

function customBlocks(blocklyComponent) {

    const translate = blocklyComponent.translate;
    const workspace = blocklyComponent.workspace;
    workspace.hasWarnings = [];
    const transactionTypes = blocklyComponent.TransactionTypes;
    const transactionStates = blocklyComponent.TransactionStates;
    const entTypes = blocklyComponent.EntTypes;
    const templates = blocklyComponent.Templates;
    const userEvaluatedExpressions = blocklyComponent.UserEvaluatedExpressions;
    const queries = blocklyComponent.Queries;
    const constants = blocklyComponent.Constants;
    const contextVariables = blocklyComponent.ContextVariables;
    const properties = blocklyComponent.Properties;

// ------------------------------------------------------------------------------------------
// ------------------------------------ VALIDATORS ---------------------------------------
// ------------------------------------------------------------------------------------------

    function removeWhiteSpaces(newValue) {
        return newValue.trim();
    }

    function replaceNonAlphanumericCharacters(newValue) {
        return newValue.replace(/\W+/g, '-').toLowerCase();
    }

    function transformToCamelCase(string) {
        return string.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, string) => string.toUpperCase());
    }

    // Validator functions to be used in constant and value blocks
    function validateValueType(newValue) {
        // TODO Deal with 'enum', 'date' and 'time'
        const block = this.sourceBlock_;
        // If valueType has changed, set the block's value to the default string so that we always have a match between valueType and value
        // Remove the current 'value' field's validator so that we can then insert the default-string.
        if (newValue.toLowerCase() !== block.valueType) {
            block.valueType = newValue.toLowerCase();
            block.getField('value').setValidator(null);
            block.setFieldValue(translate.instant('BLOCKLY-BLOCKS.CONSTANT.DEFAULT-TEXT-VALUE'),'value');
        }
        // Update validator depending on dropdown choice
        switch(newValue) {
            case 'TEXT':
                updateShapeString(block);
                break;
            case 'INT':
                updateShapeInteger(block);
                break;
            case 'DOUBLE':
                updateShapeReal(block);
                break;
            case 'BOOL':
                updateShapeBoolean(block);
                break;
            default:
                // do nothing
                break;
        }
    }

    function updateShapeString(block) {
        block.getField('value').setValidator(validateString);
        // Remove whitespaces in the beginning and end of string
        function validateString(newValue) {
            return newValue.trim();
        }
    }

    function updateShapeInteger(block) {
        block.getField('value').setValidator(validateInteger);
        // Checks if input is an integer
        function validateInteger(newValue) {
            if (Number.isInteger(Number(newValue))) {
                return newValue;
            } else {
                return null;
            }
        }
    }

    function updateShapeReal(block) {
        block.getField('value').setValidator(validateReal);
        // Checks if input is Real
        function validateReal(newValue) {
            if (isNaN(newValue)){
                return null;
            } else {
                return newValue;
            }
        }
    }

    function updateShapeBoolean(block) {
        block.getField('value').setValidator(validateBoolean);
        // Checks if input is boolean
        function validateBoolean(newValue) {
            if (newValue === 'true' || newValue === 'false'){
                return newValue;
            } else {
                return null;
            }
        }
    }

    // -------------------------------------------------------------------------
    // ------------------------ REUSABLE  CODE ---------------------------------

    function appendStatementInputLabel(block, inputName, fieldLabelText) {
        block.appendDummyInput(inputName + '_label')
            .appendField(new Blockly.FieldLabel(translate.instant(fieldLabelText) + ' :'))
            .setAlign(Blockly.ALIGN_RIGHT);
    }

    function appendStatementInputCheckboxLabel(block, inputName, fieldLabelText, checkboxInitialValue, checkboxValidator) {
        block.appendDummyInput(inputName + '_label')
            .appendField(new Blockly.FieldLabel(translate.instant(fieldLabelText) + ' :'))
            .appendField(new Blockly.FieldCheckbox(checkboxInitialValue, checkboxValidator), 'checkbox_' + inputName)
            .setAlign(Blockly.ALIGN_RIGHT);
    }

    function removeStatementInputWithLabel(block, inputName) {
        block.removeInput(inputName + '_label', true);
        block.removeInput(inputName, true);
    }

    function moveStatementInputBefore(block, movingInput, nextInputName, beforeStatementInput = false) {
        if (beforeStatementInput) {
            block.moveInputBefore(movingInput + '_label', nextInputName + '_label');
            block.moveInputBefore(movingInput, nextInputName + '_label');
        } else {
            block.moveInputBefore(movingInput + '_label', nextInputName);
            block.moveInputBefore(movingInput, nextInputName);
        }
    }

    // Update nextConnection for 'condition' & 'comp/user evaluated expression', depending on the parent condition's type.
    // When it's a 'IS TRUE' parent condition type, only one block can be attached to it -> no nextConnection.
    // When it's inside an enable condition -> don't allow user evaluated expressions inside it.
    function changeNextConnection(block) {
        let noNextConnection = false;
        let parent = block.parentBlock_;
        let blockBeforeParent_ = block;
        let foundConditionParent_ = false;
        let insideEnableCondition = false;

        // Current block is 'condition' and it's the input of an 'if'/' - No next connection, these inputs can only have 1 condition
        if ((parent?.type === 'if_then' || parent?.type === 'while') && block.type === 'condition') {
            noNextConnection = true;
        }

        // Verifies if the block is inside a 'condition' block, even if it's not the first expression
        // Also verifies if the block is inside a 'condition' block that is itself inside another 'condition' block
        while (parent && !foundConditionParent_) {
            if (parent.type === 'condition') {
                // Can be inside a 'condition' block or connected next to one through nextConnection
                if (!(parent.nextConnection && blockBeforeParent_.previousConnection === parent.nextConnection.targetConnection)) {
                    // Means we're inside a 'condition' block, so we've encountered the block we wanna know the dropdown value of
                    foundConditionParent_ = parent;
                }
            } else if (parent.type === 'enable_condition' && blockBeforeParent_.type === 'condition') {
                // Means that the current block is the 'condition' block inside an 'enable_condition' block
                insideEnableCondition = parent;
            }
            blockBeforeParent_ = blockBeforeParent_.parentBlock_;
            parent = parent.parentBlock_;
        }

        // Verifies if the block is part of an 'enable_condition'.
        while (parent && !insideEnableCondition) {
            if (parent.type === 'enable_condition') {
                // Means we're inside an 'enable_condition' block, so we've encountered the block we want
                insideEnableCondition = parent;
            }
            parent = parent.parentBlock_;
        }

        // Update possible connections - if conditionDropdown is ISTRUE or  NOT, you can only have 1 term, thus no connections
        if(foundConditionParent_){
            let conditionDropdown = foundConditionParent_.inputList[0].fieldRow[2].value_;
            if (conditionDropdown === 'ISTRUE' || conditionDropdown === 'NOT') {
                noNextConnection = true;
            }
        }

        if (insideEnableCondition) {
            if (block.type === 'condition') {
                // If it's the condition directly connected to the 'enable condition' block, remove its nextConnection.
                noNextConnection = !foundConditionParent_;
                // Only accept sub-conditions and comp_evaluated_expressions inside the condition blocks in an enable condition.
                block.getInput('input_terms')
                    .setCheck([ 'condition', 'comp_evaluated_expression']);
            }
            // Only accept sub-conditions and comp_evaluated_expressions inside the enable_condition's condition.
            block.setNextStatement(true, ['condition', 'comp_evaluated_expression']);
        } else {
            if (block.type === 'condition') {
                block.getField('choice_condition').validator_(block.getFieldValue('choice_condition'));
            } else {
                block.setNextStatement(true, ['condition','user_evaluated_expression','comp_evaluated_expression']);
            }
        }

        if (noNextConnection) {
            unplugChildBlocks(block);
            block.setNextStatement(false);
            block.noNextConnection = true;
        } else {
            block.setNextStatement(true, ['condition','user_evaluated_expression','comp_evaluated_expression']);
            block.noNextConnection = false;
        }
    }

    // Check compatibility between a block's two inputs.
    function checkInputValueTypeCompatibility(block, firstInputName, secondInputName, additionalInputsNumber = 0, additionalInputsName = null) {
        let compatibilityCheckFailed = false;
        const dontCheckCompatibilityForBlocks = ['set_context_variable', 'get_context_variable', 'update_context_variable'];

        const firstInputValueType = block.getInput(firstInputName).connection.targetConnection?.getSourceBlock().valueType ?? null;
        const secondInputValueType = block.getInput(secondInputName).connection.targetConnection?.getSourceBlock().valueType ?? null;
        // console.log('1st Value Type: ' + firstInputValueType + '  2nd Value Type: ' + secondInputValueType);
        // Warning if valueTypes are different or incompatible (int with double is compatible / as is enum/ref and property_value)
        const firstInputBlockType = block.getInput(firstInputName).connection.targetConnection?.getSourceBlock().type ?? null;
        const secondInputBlockType = block.getInput(secondInputName).connection.targetConnection?.getSourceBlock().type ?? null;
        // console.log('1st Input Block Type: ' + firstInputBlockType + '  2nd Input Block Type: ' + secondInputBlockType);
        if (!dontCheckCompatibilityForBlocks.includes(firstInputBlockType) && !dontCheckCompatibilityForBlocks.includes(secondInputBlockType)) {
            compatibilityCheckFailed = areInputValueTypesIncompatible(firstInputValueType, secondInputValueType);
        }

        let lastInputValueTypeChecked = secondInputValueType;
        let lastInputBlockTypeChecked = secondInputBlockType;

        if (additionalInputsNumber) {
            for (let i = 0; i < additionalInputsNumber; i++) {
                const additionalInputValueType = block.getInput(additionalInputsName + i).connection
                    .targetConnection?.getSourceBlock().valueType ?? null;
                const additionalInputBlockType = block.getInput(additionalInputsName + i).connection
                    .targetConnection?.getSourceBlock().type ?? null;
                if (!dontCheckCompatibilityForBlocks.includes(lastInputBlockTypeChecked) && !dontCheckCompatibilityForBlocks.includes(additionalInputBlockType)) {
                    compatibilityCheckFailed = areInputValueTypesIncompatible(lastInputValueTypeChecked, additionalInputValueType);
                }
                if (compatibilityCheckFailed) {
                    break;
                }
                lastInputValueTypeChecked = additionalInputValueType;
                lastInputBlockTypeChecked = additionalInputBlockType;
            }
        }

        if (compatibilityCheckFailed && !block.warning) {
            // Add warning for value_type compatibility, in  case it isn't already present in the block
            block.setWarningText('Both inputs must be compatible.', 'valueType');
            if (!workspace.hasWarnings.includes(block.id)) {
                workspace.hasWarnings.push(block.id);
            }
        } else if (!compatibilityCheckFailed && block.warning) {
            // Remove warning for value_type compatibility, in  case it is present in the block
            block.setWarningText(null, 'valueType');
            if (workspace.hasWarnings.includes(block.id)) {
                workspace.hasWarnings = workspace.hasWarnings.filter((warningBlock) => {return warningBlock !== block.id});
            }
        }
    }

    function areInputValueTypesIncompatible(firstInputValueType, secondInputValueType) {
        return firstInputValueType !== secondInputValueType && !(
            (firstInputValueType === 'int' && secondInputValueType === 'double') ||
            (firstInputValueType === 'double' && secondInputValueType === 'int') ||
            (firstInputValueType === 'enum' && secondInputValueType === 'property_value') ||
            (firstInputValueType === 'ref' && secondInputValueType === 'property_value')
        );
    }

    // Used when changing min field
    // Function to be called when we want to compare min to max value and fix max if min is bigger
    function fixMaxIfMinBigger(minFieldValue, maxField){
        let minValue = Number(minFieldValue);
        let maxValue = Number(maxField.getValue());
        if (maxValue !== '*'){
            if (minValue > maxValue){
                maxField.setValue(minValue);
            }
        }
    }

    // Used when changing max field - commented code so it doesnt affect results - maybe will be deleted
    // Function to be called when we want to compare min to max value and fix max if min is bigger
    function fixMinIfMaxSmaller(minField, maxField){
        let minValue = Number(minField.getValue());
        let maxValue = Number(maxField.getValue());
        if (maxField !== '*'){
            if (minValue > maxValue){
                minField.setValue(maxValue);
            }
        }
    }

    function addValueTypeField(block, propertyId) {
        // If dropdown choice is none, we don't have to check anything
        if (propertyId === 'NONE' || !propertyId) {
            block.valueType = null;
            block.multipleValues = null;
            return ;
        }

        // Get the property's info.
        let property = properties.find((property) => property.id === Number(propertyId));

        if (property) {
            setValueTypeField(block, property);
        }
    }

    function setValueTypeField(block, property) {
        // If it's a 'prop ref' property, simply insert 'ref' on the block.
        const propertyValueType = property.value_type === 'prop_ref' ? 'ref' : property.value_type;
        const propertyMultipleValues = property.multiple_values;
        let valueTypeFieldString =  translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.VALUE-TYPE') + ': ' +
            translate.instant('BLOCKLY-BLOCKS.VALUE-TYPES.' + propertyValueType.toUpperCase());

        if (propertyMultipleValues){
            valueTypeFieldString += ', ' + translate.instant('BLOCKLY-BLOCKS.MULTIPLE-VALUES');
        }

        block.getInput('valueType')
            .appendField(new Blockly.FieldLabel(valueTypeFieldString, 'blockValueType'), 'valueTypeField');
        block.getInput('valueType').setVisible(true);
        block.valueType = propertyValueType;
        block.multipleValues = propertyMultipleValues;
    }

    function setEntityInstancesValueType(block) {
        // Remove the current valueType of the block, if present
        let valueTypeInput = block.getInput('valueType');
        valueTypeInput.removeField('valueTypeField', true);
        valueTypeInput.setVisible(false);
        // Add the 'entity instances' custom value type to the block
        let valueTypeFieldString =  translate.instant('BLOCKLY-BLOCKS.FORM-PROPERTY-OUTPUT.VALUE-TYPE') + ': ' +
            translate.instant('BLOCKLY-BLOCKS.FORM-PROPERTY-OUTPUT.ENTITY-INSTANCES-VALUE-TYPE');
        block.getInput('valueType')
            .appendField(new Blockly.FieldLabel(valueTypeFieldString, 'blockValueType'), 'valueTypeField');
        block.getInput('valueType').setVisible(true);
    }

    function removeMutatorsIfInvalidValueType(block) {
        // Close the mutator dialog bubble if it is opened when the property is changed
        // [so that we don't have the wrong options displayed in the mutator dialog bubble]
        block.mutator.setVisible(false);
        // Remove the form_calculation if the new property has an invalid valueType for this field.
        if (!formCalculationValueTypes.includes(block.valueType) || block.type === 'form_property_output') {
            // Remove the input and associated blocks, as this option is no longer available
            if (block.mutator.sourceBlock.hasFormCalculationBlocks_) {
                block.removePropertyBlockInput_('form_calculation');
                block.mutator.sourceBlock.hasFormCalculationBlocks_ = false;
            }
            block.mutator.sourceBlock.inputFormCalculation_ = false;
        }
        // Remove the enable_condition if we're in a 'form property output' block
        if (block.type === 'form_property_output') {
            // Remove the input and associated blocks, as this option is no longer available
            if (block.mutator.sourceBlock.hasEnableConditionBlocks_) {
                block.removePropertyBlockInput_('enable_condition');
                block.mutator.sourceBlock.hasEnableConditionBlocks_ = false;
            }
            block.mutator.sourceBlock.inputEnable_ = false;
        }
        // Remove the validation_condition if the new property has an invalid valueType for this field.
        if (block.isIncompatibleWithValidationCondition(block)) {
            // Remove the input and associated blocks, as this option is no longer available
            if (block.mutator.sourceBlock.hasValidationConditionBlocks_) {
                block.removePropertyBlockInput_('validation_condition');
                block.mutator.sourceBlock.hasValidationConditionBlocks_ = false;
            }
            block.mutator.sourceBlock.inputValidation_ = false;
        }
        // Remove the property_filter if the new property has an invalid valueType for this field.
        if (!propertyFilterValueTypes.includes(block.valueType) || block.type === 'form_property_output') {
            // Remove the input and associated blocks, as this option is no longer available
            if (block.mutator.sourceBlock.hasPropertyFilterBlocks_) {
                block.removePropertyBlockInput_('property_filter');
                block.mutator.sourceBlock.hasPropertyFilterBlocks_ = false;
            }
            block.mutator.sourceBlock.inputPropertyFilter_ = false;
        }
        // Remove the options_from_query if the new property has an invalid valueType for this field.
        if (!optionsFromQueryValueTypes.includes(block.valueType)) {
            // Remove the input and associated blocks, as this option is no longer available
            if (block.mutator.sourceBlock.hasOptionsFromQueryBlocks_) {
                block.removePropertyBlockInput_('options_from_query', 'query');
                block.mutator.sourceBlock.hasOptionsFromQueryBlocks_ = false;
            }
            block.mutator.sourceBlock.inputOptionsFromQuery_ = false;
        }
    }

    function createNewChildBlock_(blockType, unchangeable) {
        // Create a new block child block
        const newBlock = workspace.newBlock(blockType);
        if (unchangeable) {
            // So that the user can't open the menu option when right-clicking the mouse
            newBlock.contextMenu = false;
            // So that the user can't move the block on its own / Detach it from the parent
            newBlock.setMovable(false);
            // So that the user can't delete the block on its own
            newBlock.setDeletable(false);
        }
        newBlock.initSvg();
        newBlock.render();
        return newBlock;
    }

    function resetDropdownChoiceIfNoLongerAvailable(block, fieldName) {
        const newDropdownOptions = block.getField(fieldName).menuGenerator_;
        const hasSelectedOption = newDropdownOptions.some((dropdownOption) => dropdownOption.includes(block.getFieldValue(fieldName)));
        if (!hasSelectedOption) {
            // Select the dropdown's first option
            block.setFieldValue(newDropdownOptions[0][1], fieldName);
        }
    }

    function setEmptyDropdown(block, fieldName) {
        block.getField(fieldName).menuGenerator_ = getEmptyDropdown();
        setNoneOptionDropdown(block, fieldName);
    }

    function getEmptyDropdown() {
        return [[translate.instant('BLOCKLY-BLOCKS.PROPERTY.DROPDOWN-DEFAULT'), 'NONE']];
    }

    function setNoneOptionDropdown(block, fieldName) {
        block.setFieldValue('NONE', fieldName);
    }

// -------------------------------------------------------------------------
// ---- METHODS TO STORE DB RESULTS IN VARIABLES FOR DROPDOWN MENUS --------

    function getTransactionTypes() {
        let options = getEmptyDropdown();
        transactionTypes.forEach((transactionType) => {
            options.push([transactionType.t_name, transactionType.id.toString()]);
        })
        return options;
    }

    function getTStatesName() {
        let options = getEmptyDropdown();
        transactionStates.forEach((tState) => {
            options.push([tState.name, tState.id.toString()]);
        })
        return options;
    }

    function getUserEvaluatedExpressions() {
        let options = getEmptyDropdown();
        userEvaluatedExpressions.forEach((userEvaluatedExpression) => {
            options.push([userEvaluatedExpression.expression_name, userEvaluatedExpression.id.toString()]);
        });
        return options;
    }

    function getQueries(restrictValueTypes = null, baseEntTypeId = null) {
        let options = getEmptyDropdown();
        if (restrictValueTypes) {
            queries.forEach((query) => {
                const queryValueType = getQueryValueType(query);
                if (restrictValueTypes.includes(queryValueType)) {
                    options.push([query.name, query.id.toString()]);
                }
            });
        } else {
            if (baseEntTypeId) {
                queries.forEach((query) => {
                    if (query.base_ent_type_id === Number(baseEntTypeId)) {
                        options.push([query.name, query.id.toString()]);
                    }
                });
            } else {
                queries.forEach((query) => {
                    options.push([query.name, query.id.toString()]);
                });
            }

        }
        return options;
    }

    // For normalization purposes. In order for us to compare with, for example, 'constant' and 'value' blocks.
    function getQueryValueType(selectedQuery) {
        switch (selectedQuery.value_type) {
            case 'string':
                return 'text';
            case 'integer_number':
                return 'int';
            case 'real_number':
                return 'double';
            case 'boolean':
                return 'bool';
            default:
                return null;
        }
    }

    function getConstants(restrictValueTypes = null) {
        let options = getEmptyDropdown();
        if (restrictValueTypes) {
            constants.forEach((constant) => {
                if (restrictValueTypes.includes(constant.value_type)) {
                    options.push([constant.name, constant.id.toString()]);
                }
            });
        } else {
            constants.forEach((constant) => {
                options.push([constant.name, constant.id.toString()]);
            });
        }
        return options;
    }

    function getEntTypes() {
        let options = getEmptyDropdown();
        entTypes.forEach((entType) => {
            options.push([entType.name, entType.id.toString()]);
        });
        return options;
    }

    function getPropertyValues(block) {
        let options = getEmptyDropdown();
        const property = properties.find((property) => property.id === block.propertyID);
        if (property.property_values) {
            property.property_values.forEach( (propertyValue) => {
                options.push([propertyValue.value.toString(),propertyValue.id.toString()]);
            });
        }
        return options;
    }

    function setPropertyValues(block, fieldName) {
        block.getField(fieldName).menuGenerator_ = getPropertyValues(block);
    }

    function getReferencedPropertyEntityProperties(block) {
        // Get the properties that can be filtered, which are the internal properties of the referenced property's entity type
        let options = getEmptyDropdown();
        // Get the selected property's info
        const property = properties.find((property) => property.id === block.propertyID);
        // Get the referenced entity type's properties
        const entityTypeProperties = properties.filter((propertyFilter) => propertyFilter.ent_type_id === property.fk_entity_type_id);
        if (entityTypeProperties) {
            entityTypeProperties.forEach( (entityTypeProperty) => options.push([entityTypeProperty.name.toString(), entityTypeProperty.id.toString()]));
        }
        return options;
    }

    function setReferencedPropertyEntityProperties(block, fieldName) {
        block.getField(fieldName).menuGenerator_ = getReferencedPropertyEntityProperties(block);
    }

    function getUserOutputTemplates() {
        let options = getEmptyDropdown();
        templates.forEach((template) => {
            if (template.type === 'modal' || template.type === 'toast' || template.type === 'doc') {
                options.push([template.name, template.template_id.toString()]);
            }
        });
        return options;
    }

    function getTemplatesValidationWarning() {
        let options = getEmptyDropdown();
        templates.forEach((template) => {
            if (template.type === 'validation_warning') {
                options.push([template.name, template.template_id.toString()]);
            }
        });
        return options;
    }

    function getProperties(entTypeId) {
        let options = getEmptyDropdown();
        properties.forEach((property) => {
            if (property.ent_type_id === Number(entTypeId)) {
                options.push([property.name, property.id.toString()]);
            }
        })
        return options;
    }

    function setProperties(block, entTypeId, fieldName) {
        block.getField(fieldName).menuGenerator_ = getProperties(entTypeId);
    }

    function getEditableProperties(entTypeId) {
        let options = getEmptyDropdown();
        properties.forEach((property) => {
            if (property.ent_type_id === Number(entTypeId) && property.editable) {
                options.push([property.name, property.id.toString()]);
            }
        });
        return options;
    }

    function setEditableProperties(block, entTypeId, fieldName) {
        block.getField(fieldName).menuGenerator_ = getEditableProperties(entTypeId);
    }

    function getEntityDetails(entTypeId) {
        let options = [];
        properties.forEach((property) => {
            if (property.ent_type_id === Number(entTypeId)) {
                options.push([property.name, property.id.toString()]);
            }
        });
        return options;
    }

    function getNumericProperties(entTypeId) {
        let options = getEmptyDropdown();
        properties.forEach((property) => {
            if (property.ent_type_id === Number(entTypeId) && (property.value_type === 'int' || property.value_type === 'double')) {
                options.push([property.name, property.id.toString()]);
            }
        });
        return options;
    }

    function setNumericProperties(block, entTypeId, fieldName) {
        block.getField(fieldName).menuGenerator_ = getNumericProperties(entTypeId);
    }

    function getNumericTimeProperties(entTypeId) {
        let options = getEmptyDropdown();
        properties.forEach((property) => {
            if (property.ent_type_id === Number(entTypeId) &&
                (property.value_type === 'int' || property.value_type === 'double' || property.value_type === 'time' )) {
                options.push([property.name, property.id.toString()]);
            }
        });
        return options;
    }

    function setNumericTimeProperties(block, entTypeId, fieldName) {
        block.getField(fieldName).menuGenerator_ = getNumericTimeProperties(entTypeId);
    }

    function getNumericDateTimeProperties(entTypeId) {
        let options = getEmptyDropdown();
        properties.forEach((property) => {
            if (property.ent_type_id === Number(entTypeId) &&
                (property.value_type === 'int' || property.value_type === 'double' || property.value_type === 'date' || property.value_type === 'time' )) {
                options.push([property.name, property.id.toString()]);
            }
        });
        return options;
    }

    function setNumericDateTimeProperties(block, entTypeId, fieldName) {
        block.getField(fieldName).menuGenerator_ = getNumericDateTimeProperties(entTypeId);
    }

    function getReferenceProperties(entTypeId) {
        let options = getEmptyDropdown();
        properties.forEach((property) => {
            if (property.ent_type_id === Number(entTypeId) && property.value_type === 'prop_ref') {
                options.push([property.name, property.id.toString()]);
            }
        });
        return options;
    }

    function setReferenceProperties(block, entTypeId, fieldName) {
        block.getField(fieldName).menuGenerator_ = getReferenceProperties(entTypeId);
    }

    function getHasManyEntTypes() {
        let options = getEmptyDropdown();
        entTypes.forEach((entType) => {
            if (entType.has_many) {
                options.push([entType.name, entType.id.toString()]);
            }
        });
        return options;
    }

    function getEntTypesThatArentHasMany() {
        let options = getEmptyDropdown();
        entTypes.forEach((entType) => {
            if (!entType.has_many) {
                options.push([entType.name, entType.id.toString()]);
            }
        });
        return options;
    }

    function getRelatedEntTypes(mainEntTypeId) {
        if (mainEntTypeId === 'NONE') {
            return getEmptyDropdown();
        }
        let options = [];
        const mainEntType = entTypes.find(entType => entType.id === Number(mainEntTypeId));
        // If a 'has_many' entType is selected, it should be the only option in the 'ent_type_form' block.
        if (mainEntType.has_many) {
            options = [[mainEntType.name, mainEntType.id.toString()]];
        } else {
            options = getEmptyDropdown();
            // If it's a 'normal' entType, search for all 'has_many' entTypes that reference it.
            properties.forEach( (property) => {
                if (property.part_of && property.fk_entity_type_id === Number(mainEntTypeId)) {
                    const relatedEntType = entTypes.find(entType => entType.id === property.ent_type_id);
                    options.push([relatedEntType.name, relatedEntType.id.toString()]);
                }
            })
        }
        return options;
    }

    function getAllRoles() {
        // Get all used (initiator or executor) roles in the system
        let options = getEmptyDropdown();
        transactionTypes.forEach( (transactionType) => {
            // Add executor role if it hasn't been added already
            if (!options.some(role => role[1] === transactionType.executer_role_id.toString())) {
                options.push([transactionType.executer_role_name, transactionType.executer_role_id.toString()]);
            }
            // Add initiator roles if they haven't been added already
            for (const initiatorRole of transactionType.initiator_roles) {
                if (!options.some(role => role[1] === initiatorRole.role_id.toString())) {
                    options.push([initiatorRole.role_name, initiatorRole.role_id.toString()]);
                }
            }
        });
        return options;
    }

    function getDatePropertiesForValidationCondition() {
        // TODO filter the dates based on the property who includes this condition (doesn't make sense including all dates)
        let options = getEmptyDropdown();
        properties.forEach((property) => {
            if (property.value_type === 'date') {
                const propertyName = property.ent_type_name + ' ⮕ ' + property.name;
                options.push([propertyName, property.id.toString()]);
            }
        });
        // Insert the 'current date' option to be the first option after 'None'
        options.splice(1, 0, [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.EXTRA-FIELDS.CURRENT-DATE'), 'CURRENT_DATE']);
        return options;
    }

    function getTimePropertiesForValidationCondition() {
        // TODO filter the times based on the property who includes this condition (doesn't make sense including all dates)
        let options = getEmptyDropdown();
        properties.forEach((property) => {
            if (property.value_type === 'time') {
                const propertyName = property.ent_type_name + ' ⮕ ' + property.name;
                options.push([propertyName, property.id.toString()]);
            }
        });
        // Insert the 'current time' option to be the first option after 'None'
        options.splice(1, 0, [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.EXTRA-FIELDS.CURRENT-TIME'), 'CURRENT_TIME']);
        return options;
    }

    function getRolesForTask(transactionTypeId, actionRuleType, tStateId) {
        let  options = [];
        const initiatorStates = ['rq', 'ac', 'rj', 'qt', 'rv_rq_rq', 'rv_ac_rq', 'rv_pm_al', 'rv_pm_rf', 'rv_de_al', 'rv_de_rf'];

        // Get the transaction type and transaction state's information
        const transactionType = transactionTypes.find(item => item.id === transactionTypeId);
        const tState = transactionStates.find(item => item.id === tStateId);

        if (actionRuleType === 'ACT' && tState) {
            // When it's an 'act' action rule, initiator states are responsibility of the initiator roles
            // and executor states are responsibility of the executor role
            if (initiatorStates.includes(tState.abbrv)) {
                options = getInitiatorRoles(transactionType);
            } else {
                options = getExecutorRole(transactionType);
            }
        } else if (actionRuleType === 'FACT' && tState) {
            // When it's a 'fact' action rule, initiator states are responsibility of the executor role
            // and executor states are responsibility of the initiator roles
            if (initiatorStates.includes(tState.abbrv)) {
                options = getExecutorRole(transactionType);
            } else {
                options = getInitiatorRoles(transactionType);
            }
        } else {
            // When the block is part of action rule that hasn't specified the actionRuleType or tState, display all roles used in the transactionType
            options = getInitiatorRoles(transactionType);
            options = getExecutorRole(transactionType, options);
        }
        return options;
    }

    function getInitiatorRoles(transactionType, options = getEmptyDropdown()) {
        for (const initiatorRole of transactionType.initiator_roles) {
            if (!options.some(role => role[1] === initiatorRole.role_id.toString())) {
                options.push([initiatorRole.role_name, initiatorRole.role_id.toString()]);
            }
        }
        return options;
    }

    function getExecutorRole(transactionType, options = getEmptyDropdown()) {
        if (!options.some(role => role[1] === transactionType.executer_role_id.toString())) {
            options.push([transactionType.executer_role_name, transactionType.executer_role_id.toString()]);
        }
        return options;
    }

    function getContextVariables() {
        let options = getEmptyDropdown();

        contextVariables.forEach((contextVariable) => {
            options.push([contextVariable.text, contextVariable.id.toString()]);
        });
        return options;
    }

// ---------------------------------------------------------------------------
// -- FUNCTIONS USED BOTH IN 'COMPUTE EXPRESSION' AND 'FORM COMPUTE' BLOCKS --

    // Update shape depending on operator dropdown choice
    function updateShapeVariableInputQuantity_(block, newOperator) {
        block.updatedOperator_ = newOperator;

        // Save any connections inside block before removing inputs
        block.saveConnections_(block);

        // Remove all inputs before adding them in updating shape
        removeInputsVariableInputQuantity_(newOperator);

        // Update shape depending on dropdown choice
        if (newOperator === 'ADD' || newOperator === 'MULTIPLY' || newOperator === 'AVERAGE') {
            updateShapeMultipleOperators_();
        } else {
            block.setFieldValue(2, 'quantity_inputs');
            block.additionalInputs_ = 0;
        }

        // Remove additional inputs if they exist
        function removeInputsVariableInputQuantity_(input) {

            adjustVisibilityOnQuantityInputFields(false);

            // If user changes to MINUS, DIVIDE, etc., eliminates additional inputs as these can only have the first 2
            if (input !== 'ADD' && input !== 'MULTIPLY' && input !== 'AVERAGE') {
                for (let i = 0; i < block.additionalInputs_; i++) {
                    block.removeInput('additionalInput' + i);
                }
                block.additionalInputs_ = 0;
            }

        }

        // Update shape if we want to have more than 2 inputs
        function updateShapeMultipleOperators_() {
            block.changeOperator_ = true;
            adjustVisibilityOnQuantityInputFields(true);
            updateVariableInputQuantity_(block, block.getFieldValue('quantity_inputs'));
        }

        function adjustVisibilityOnQuantityInputFields(isVisible) {
            // Set input that changes number of input terms as invisible
            if (block.type === 'compute_expression') {
                block.getInput('number_terms').setVisible(isVisible);
            } else if (block.type === 'form_calculation') {
                block.getField('terms').setVisible(isVisible);
                block.getField('quantity_inputs').setVisible(isVisible);
                block.getField('whiteSpaceAfterTerms').setVisible(isVisible);
            }
        }
    }

    // Update the number of inputs
    function updateVariableInputQuantity_(block, nrInputs) {
        const currentBlockType = block.type;
        // Get operator chosen to know what to put between inputs
        let operatorChoice_ = block.updatedOperator_;
        let operatorSymbol = null;
        if (operatorChoice_ === 'ADD') {
            operatorSymbol = '+';
        } else if (operatorChoice_ === 'MULTIPLY') {
            operatorSymbol = '×';
        } else if (operatorChoice_ === 'AVERAGE') {
            operatorSymbol = translate.instant('BLOCKLY-BLOCKS.AVERAGE-OPERATOR')
        }


        // Save previous connections on additional inputs
        for (let i = 0; i < block.additionalInputs_; i++) {
            let input = block.getInput('additionalInput' + i);
            if (input) {
                block.connectionAdditionalInputs_[i] = input && input.connection.targetConnection;
            }
        }

        // There are always 2 operator inputs, we just want to add the rest if there are more than 2
        nrInputs = Number(nrInputs) - 2;

        // If the user changes number of inputs or operator, we add the additional operators
        if (nrInputs !== block.additionalInputs_ || block.changeOperator_) {

            // Remove previous additional operators so we can add them again according to new number of inputs
            removeAdditionalInputs_();

            // Add the specified number of additional inputs
            for (let i = 0; i < nrInputs; i++) {
                block.appendValueInput('additionalInput' + i)
                    .appendField(operatorSymbol)
                    .setCheck(['constant', 'value', 'query', 'property_single', currentBlockType])
                    .setAlign(Blockly.ALIGN_RIGHT);
            }
            // Save the number of additional inputs. Will also be used to remove them when necessary
            block.additionalInputs_ = nrInputs;
        }
        block.changeOperator_ = false;

        // Remove additional inputs if necessary
        function removeAdditionalInputs_() {
            for (let i = 0; i < block.additionalInputs_; i++) {
                block.removeInput('additionalInput' + i);
            }
        }
    }

    function makePropertySimplifiedBlockUnchangeable(block, propertyId) {
        block.unchangeable = true;
        const property = properties.find(property => property.id === propertyId);
        // So that the user can't open the menu option when right-clicking the mouse
        block.contextMenu = false;
        // So that the user can't move the block on its own / Detach it from the parent
        block.setMovable(false);
        // So that the user can't delete the block on its own
        block.setDeletable(false);
        // So that the user can't change the 'properties' dropdown option pre-set by us
        block.getField('user_input_property').setEnabled(false);
        // The property with flag 'part_of' is automatically filled by the system (doesn't show up in the form)
        if (property.part_of) {
            block.setColour(195)
            block.setEditable(false);
            block.setTooltip(translate.instant('BLOCKLY-BLOCKS.ENT-TYPE-FORM.PROPERTY-PART-OF-TOOLTIP'));
            block.setFieldValue(true, 'mandatory_checkbox');
            // Check if block has value type input, if so remove it. Then add the new property's value type field
            let valueTypeInput = block.getInput('valueType');
            valueTypeInput.removeField('valueTypeField', true);
            valueTypeInput.setVisible(false);
        }
    }

    function unplugChildBlocks(block) {
        // Unplugs the blocks next to the 1st one so that we only have 1 element
        for (const childBlock of block.childBlocks_) {
            // So that only the blocks connected through the nextConnection are disconnected and not its statementInput/valueInput blocks
            // [as the ones present in subConditions - in case of condition block]
            if (childBlock.previousConnection && childBlock.previousConnection === block.nextConnection?.targetConnection) {
                childBlock.unplug(false);
                break;
            }
        }
    }

// ------------------------------------------------------------------------------------------
// ------------------------------------ BLOCKS ----------------------------------------------
// ------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------
// --------------------------- CATEGORY: GENERAL ---------------------------

// ---------------------------
// Block: "when_is_do"
// ---------------------------

    Blockly.Blocks['when_is_do'] = {
        hasLocalEndpointResponseBlocks: false,

        init: function () {

            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.WHEN-IS-DO.WHEN'),'blockTitle'))
                .appendField(new Blockly.FieldDropdown(getTransactionTypes), 'when_is_do_transaction_type');
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                    [translate.instant('BLOCKLY-BLOCKS.WHEN-IS-DO.ACT'), 'ACT'],
                    [translate.instant('BLOCKLY-BLOCKS.WHEN-IS-DO.FACT'), 'FACT']
                ]), 'action_rule_type')
                .appendField(new Blockly.FieldDropdown(getTStatesName), 'when_is_do_t_state');
            this.appendDummyInput('execution_type')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.TITLE')))
                .appendField(new Blockly.FieldDropdown([
                    [translate.instant('BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.NATIVE-EXECUTION'), 'NATIVE_EXECUTION'],
                    [translate.instant('BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.LOCAL-ENDPOINT-CALL.TITLE'), 'LOCAL_ENDPOINT_CALL'],
                ]), 'action_rule_execution_type');
            appendStatementInputLabel(this, 'actions', 'BLOCKLY-BLOCKS.WHEN-IS-DO.ACTIONS');
            this.appendStatementInput('actions')
                .setCheck(['action','if_then','while', 'for_each_set_do']);
            this.getField('action_rule_execution_type').setValidator(this.updateShape);
            this.setColour(315);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setOnChange(this.handleChange_);
        },

        updateShape: function(newValue) {
            const block = this.sourceBlock_;
            block.removeInputs();
            if (newValue === 'LOCAL_ENDPOINT_CALL') {
                block.getInput('execution_type')
                    .appendField(new Blockly.FieldDropdown([
                        [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.EXTERNAL-ENDPOINT.TYPE.POST'), 'POST'],
                        [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.EXTERNAL-ENDPOINT.TYPE.GET'), 'GET'],
                        [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.EXTERNAL-ENDPOINT.TYPE.PUT'), 'PUT'],
                        [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.EXTERNAL-ENDPOINT.TYPE.DELETE'), 'DELETE']
                    ], block.removeRequestBodyIfNeeded), 'local_endpoint_call_type');
                block.appendDummyInput('local_endpoint')
                    .appendField(translate.instant('BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.LOCAL-ENDPOINT-CALL.ENDPOINT') + ' :')
                    .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.LOCAL-ENDPOINT-CALL.ENDPOINT-PLACEHOLDER')), 'endpoint_name');
                block.appendDummyInput('resulting_endpoint')
                    .appendField(translate.instant('BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.LOCAL-ENDPOINT-CALL.FINAL-ENDPOINT') + ' :')
                    .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.LOCAL-ENDPOINT-CALL.FINAL-ENDPOINT-PLACEHOLDER'), 'blockTitle'), 'resulting_endpoint');
                appendStatementInputCheckboxLabel(block, 'endpoint_parameters', 'BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.LOCAL-ENDPOINT-CALL.ENDPOINT-PARAMETER',
                    true, block.validateCheckboxEndpointParameters);
                block.appendStatementInput('endpoint_parameters')
                    .setCheck(['parameter_local_endpoint_call']);
                appendStatementInputCheckboxLabel(block, 'request_body', 'BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.LOCAL-ENDPOINT-CALL.REQUEST-BODY',
                    true, block.validateCheckboxRequestBody);
                block.appendStatementInput('request_body')
                    .setCheck(['parameter_set_local_endpoint_call','parameter_local_endpoint_call']);
                appendStatementInputLabel(block, 'response', 'BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.LOCAL-ENDPOINT-CALL.RESPONSE');
                block.appendStatementInput('response')
                    .setCheck(['response_success_local_endpoint']);
                block.moveInputBefore('actions', 'response_label');
                block.moveInputBefore('actions_label', 'actions');
                block.moveInputBefore('response', null);
                block.getField('endpoint_name').setValidator(replaceNonAlphanumericCharacters);
                if (!block.hasLocalEndpointResponseBlocks) {
                    const responseSuccessBlock = createNewChildBlock_('response_success_local_endpoint', true);
                    const responseErrorBlock = createNewChildBlock_('response_error_local_endpoint', true);
                    responseSuccessBlock.nextConnection.connect(responseErrorBlock.previousConnection);
                    block.getInput('response').connection.connect(responseSuccessBlock.previousConnection);
                    block.hasLocalEndpointResponseBlocks = true;
                }
            }
        },

        removeRequestBodyIfNeeded: function(newLocalEndpointCallType) {
            let block = this.sourceBlock_;
            if (newLocalEndpointCallType === 'GET' || newLocalEndpointCallType === 'DELETE') {
                removeStatementInputWithLabel(block, 'request_body');
            } else {
                if (!block.getInput('request_body')) {
                    appendStatementInputCheckboxLabel(block, 'request_body', 'BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.LOCAL-ENDPOINT-CALL.REQUEST-BODY',
                        true, block.validateCheckboxRequestBody);
                    block.appendStatementInput('request_body')
                        .setCheck(['parameter_set_local_endpoint_call','parameter_local_endpoint_call']);
                    moveStatementInputBefore(block, 'request_body', 'actions', true);
                }
            }
        },

        removeInputs: function() {
            let LECInputExists = this.getInput('local_endpoint');

            if (LECInputExists) {
                this.getInput('execution_type').removeField('local_endpoint_call_type');
                this.removeInput('local_endpoint');
                this.removeInput('resulting_endpoint');
                removeStatementInputWithLabel(this, 'endpoint_parameters');
                removeStatementInputWithLabel(this, 'request_body');
                this.childBlocks_.find(block => block.type === 'response_success_local_endpoint').dispose(false);
                removeStatementInputWithLabel(this, 'response');
                this.hasLocalEndpointResponseBlocks = false;
            }
        },

        validateCheckboxEndpointParameters: function(newValue) {
            let block = this.sourceBlock_;
            // Remove input present, so we can then add the new one
            removeStatementInputWithLabel(block, 'endpoint_parameters');
            const i18nFieldLabel = 'BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.LOCAL-ENDPOINT-CALL.ENDPOINT-PARAMETER';
            const nextInput = block.getInput('request_body') ? 'request_body_label' : 'actions_label';
            const checkboxValue = newValue === 'TRUE';
            appendStatementInputCheckboxLabel(block, 'endpoint_parameters', i18nFieldLabel, checkboxValue, block.validateCheckboxEndpointParameters);
            block.moveInputBefore('endpoint_parameters_label', nextInput);
            if (newValue === 'TRUE') {
                block.appendStatementInput('endpoint_parameters')
                    .setCheck(['parameter_local_endpoint_call']);
                block.moveInputBefore('endpoint_parameters', nextInput);
            }
        },

        validateCheckboxRequestBody: function(newValue) {
            let block = this.sourceBlock_;
            // Remove input present, so we can then add the new one
            removeStatementInputWithLabel(block, 'request_body');
            const i18nFieldLabel = 'BLOCKLY-BLOCKS.WHEN-IS-DO.EXECUTION-TYPE.LOCAL-ENDPOINT-CALL.REQUEST-BODY';
            const nextInput = 'actions_label';
            const checkboxValue = newValue === 'TRUE';
            appendStatementInputCheckboxLabel(block, 'request_body', i18nFieldLabel, checkboxValue, block.validateCheckboxRequestBody);
            block.moveInputBefore('request_body_label', nextInput);
            if (newValue === 'TRUE') {
                block.appendStatementInput('request_body')
                    .setCheck(['parameter_set_local_endpoint_call','parameter_local_endpoint_call']);
                block.moveInputBefore('request_body', nextInput);
            }
        },

        handleChange_: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            // When the 'when_is_do' block has the 'local endpoint call' execution type:
            // Update when a new 'parameter' block is attached to the 'endpoint parameter' input and changes its name
            const executionType = this.getFieldValue('action_rule_execution_type');
            if ( executionType === 'LOCAL_ENDPOINT_CALL') {
                // When a 'parameter' block is moved into/out of the 'when_is_do' block
                if ((changeEvent.type === 'move' && blockType === 'parameter_local_endpoint_call') ||
                    // When a 'parameter' block is deleted
                    (changeEvent.type === 'delete' && changeEvent.oldJson.type === 'parameter_local_endpoint_call') ||
                    // When a 'parameter' block has its name input changed
                    (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'parameter_local_endpoint_call_name') ||
                    // When the 'local endpoint' field has its text input changed
                    (changeEvent.type === 'change' && changeEvent.blockId === this.id && changeEvent.element === 'field' && changeEvent.name === 'endpoint_name') ||
                    // When the block is duplicated or loaded from XML
                    (changeEvent.type === 'create' && changeEvent.blockId === this.id)
                ) {
                    // Get the first block connected to the 'endpoint parameters' input
                    let currentParameterBlock =  this.getInput('endpoint_parameters').connection?.targetConnection?.getSourceBlock();
                    let endpointParameters = [];
                    // Save all parameter names of the 'parameter' blocks inside the 'endpoint parameters' input
                    while (currentParameterBlock && currentParameterBlock.type === 'parameter_local_endpoint_call') {
                        endpointParameters.push(currentParameterBlock.getFieldValue('parameter_local_endpoint_call_name'));
                        currentParameterBlock = currentParameterBlock.getChildren(true)[0];
                    }
                    // Join the endpoint name and the parameters name to construct the resulting endpoint
                    let endpointAPI = '/' + this.getFieldValue('endpoint_name');
                    for (const endpointParam of endpointParameters) {
                        // transform the parameter name into camelCase for the endpoint. Ex: 'car id' => '/{carId}'
                        endpointAPI += '/{' +  transformToCamelCase(endpointParam) + '}';
                    }
                    // Write the resulting endpoint into the corresponding block field
                    this.setFieldValue(endpointAPI, 'resulting_endpoint');
                }
            }
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('has_local_endpoint_response_blocks', this.hasLocalEndpointResponseBlocks);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.hasLocalEndpointResponseBlocks = xmlElement.getAttribute('has_local_endpoint_response_blocks') === 'true';
        }
    };

// ---------------------------
// Block: "action"
// ---------------------------

    Blockly.Blocks['action'] = {
        checkingMax: false,
        noNextConnection: false,
        hasEntityDetailsBlock: false,
        hasEntityFiltersBlock: false,
        onlyAllowEntTypeFormBlocks: false,
        endpointEntTypes: [],
        executionType: null,
        crudOperation: null,
        hasUpdateDeleteIdBlock: false,

        init: function () {
            this.appendDummyInput('actionDropdownInput')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.ACTION.TITLE'),'blockTitle'))
                .appendField(new Blockly.FieldDropdown(this.getPossibleActionTypes), 'action_dropdown');
            this.getField('action_dropdown').setValidator(this.actionDropdownValidator);
            this.setOnChange(this.handleChange_);
            this.setInputsInline(true);
            this.setPreviousStatement(true, 'action');
            this.setNextStatement(true, ['action','if_then','while', 'for_each_set_do']);
            this.setColour(120);
            this.jsonInit({'mutator': 'action_mutator'});
        },

        getPossibleActionTypes: function() {
            const actionTypes = getEmptyDropdown();
            // If there's no parent block with a selected action execution type, show action types from 'native execution'
            if (this.executionType === 'NATIVE_EXECUTION' || !this.executionType) {
                actionTypes.push(
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.ASSIGN-EXPRESSION.TITLE'), 'ASSIGN_EXPRESSION'],
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TITLE'), 'USER_OUTPUT'],
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.CAUSAL-LINK.TITLE'), 'CAUSAL_LINK'],
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.TITLE-MULTIPLE-ENT-TYPES'), 'USER_INPUT_MULT_ENT_TYPES'],
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.TITLE-SINGLE-ENT-TYPE'), 'USER_INPUT_SINGLE_ENT_TYPE'],
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EDIT-ENTITY-INSTANCE.TITLE'), 'EDIT_ENTITY_INSTANCE'],
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.READ-VALUE.TITLE'), 'READ_VALUE'],
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.PRODUCE-DOCUMENT.TITLE'), 'PRODUCE_DOC'],
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.TITLE'), 'EXTERNAL_CALL'],
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.CREATE-SCHEDULE-SLOTS.TITLE'), 'CREATE_SCHEDULE_SLOTS']
                );
            } else if (this.executionType === 'LOCAL_ENDPOINT_CALL') {
                switch (this.crudOperation) {
                    case 'POST':
                        actionTypes.push(
                            [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.ASSIGN-EXPRESSION.TITLE'), 'ASSIGN_EXPRESSION'],
                            [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.LOCAL_ENDPOINT_CALL.USER-INPUT.TITLE'), 'INSERT_RECORD'],
                        )
                        break;
                    case 'GET':
                        actionTypes.push(
                            [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.LOCAL_ENDPOINT_CALL.QUERY-RECORDS.TITLE'), 'QUERY_RECORDS'],
                        )
                        break;
                    case 'PUT':
                        actionTypes.push(
                            [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.LOCAL_ENDPOINT_CALL.UPDATE-RECORD.TITLE'), 'UPDATE_RECORD']
                        )
                        break;
                    case 'DELETE':
                        actionTypes.push(
                            [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.LOCAL_ENDPOINT_CALL.DELETE-RECORD.TITLE'), 'DELETE_RECORD']
                        )
                        break;
                    default:
                        break;
                }
            }
            return actionTypes;
        },

        setPossibleActionTypes: function() {
            this.getField('action_dropdown').menuGenerator_ = this.getPossibleActionTypes();
        },

        actionDropdownValidator: function(actionType) {
            // Default - inputs in line
            this.sourceBlock_.setInputsInline(true);
            // Remove all inputs before updating them
            this.sourceBlock_.removeInputs(actionType);
            // Update block depending on input
            switch (actionType) {
                case 'ASSIGN_EXPRESSION':
                    this.sourceBlock_.updateShapeAE_();
                    break;
                case 'USER_INPUT_MULT_ENT_TYPES':
                    this.sourceBlock_.updateShapeUI_();
                    break;
                case 'USER_INPUT_SINGLE_ENT_TYPE':
                    this.sourceBlock_.updateShapeUISingleEntType_();
                    break;
                case 'CAUSAL_LINK':
                    this.sourceBlock_.updateShapeCL_();
                    break;
                case 'USER_OUTPUT':
                    this.sourceBlock_.updateShapeUO_();
                    break;
                case 'EDIT_ENTITY_INSTANCE':
                    this.sourceBlock_.updateShapeEEI_();
                    break;
                case 'EXTERNAL_CALL':
                    this.sourceBlock_.updateShapeEC_();
                    break;
                case 'INSERT_RECORD':
                    this.sourceBlock_.updateShapeCRUDEntity_();
                    break;
                case 'QUERY_RECORDS':
                    this.sourceBlock_.updateShapeQR_( );
                    break;
                case 'DELETE_RECORD':
                    this.sourceBlock_.updateShapeCRUDEntity_(true);
                    break;
                case 'UPDATE_RECORD':
                    this.sourceBlock_.updateShapeCRUDEntity_(true);
                    break;
                case 'CREATE_SCHEDULE_SLOTS':
                    this.sourceBlock_.updateShapeCreateScheduleSlots();
                    break;
                default:
                    break;
            }
        },

        handleChange_: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            const actionType = this.getFieldValue('action_dropdown');
            // Activated when the block 'action' (listen for causal link changes) or block 'when_is_do' (listen for transType changes) are changed
            // Remove nextConnection if causalLink action changes the state of the current AR's transType
            if (actionType === 'CAUSAL_LINK' && (
                (changeEvent.type === 'change' && changeEvent.blockId === this.id && changeEvent.element === 'field' && changeEvent.name === 'causal_link_transaction_type') ||
                (changeEvent.type === 'change' && blockType === 'when_is_do' && changeEvent.element === 'field' && changeEvent.name === 'when_is_do_transaction_type')
            )) {
                this.restrictConnectionsCausalLink();
            }
            // Update the 'properties' input connections when the 'action' block's input is changed
            if ((actionType === 'USER_INPUT_SINGLE_ENT_TYPE' || actionType === 'EDIT_ENTITY_INSTANCE') && (
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.blockId === this.id &&
                    (changeEvent.name === 'user_input_single_ent_type' || changeEvent.name === 'edit_entity_instance_ent_type'))
            )) {
                this.restrictConnectionsUserInput(changeEvent.newValue);
            }
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'action_rule_execution_type') ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'local_endpoint_call_type')
            ) {
                this.updatePossibleActionTypes();
            }
            if (this.getInput('crud_entity_properties') && (
                (changeEvent.type === 'delete' && changeEvent.oldJson.type === 'parameter_local_endpoint_call') ||
                (changeEvent.type === 'change' && changeEvent.blockId === this.id &&  changeEvent.element === 'field' && changeEvent.name === 'action_dropdown') ||
                (changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'parameter_local_endpoint_ent_type') ||
                (changeEvent.type === 'move' && (blockType === 'parameter_local_endpoint_call' || blockType === 'parameter_set_local_endpoint_call'))
            )) {
                this.setLocalEndpointParameterEntTypes();
            }
            const assignExpressionInputBlocks = ['constant', 'value', 'property_single', 'property_value','compute_expression',
                'query', 'current_user', 'get_context_variable', 'set_context_variable', 'update_context_variable'];
            // Check for valueType compatibility when action is of type 'assign expression' and:
            // When blocks are attached to assign_expression inputs or when they are detached/deleted,
            // or when the attached block's fields change (ex: chosen property changes / value's value type changes)
            // Also, When block is duplicated, keep the warning in case it had one
            if ((changeEvent.type === 'change' && changeEvent.blockId === this.id &&  changeEvent.element === 'field' && changeEvent.name === 'action_dropdown') ||
                (changeEvent.type === 'move' && assignExpressionInputBlocks.includes(blockType)) ||
                (changeEvent.type === 'delete' && assignExpressionInputBlocks.includes(changeEvent.oldJson.type)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && assignExpressionInputBlocks.includes(blockType)) ||
                (changeEvent.type === 'create' && changeEvent.blockId === this.id)
            ) {
                this.checkValueTypeCompatibilityActionBlock();
            }
        },

        checkValueTypeCompatibilityActionBlock: function() {
            if (this.getFieldValue('action_dropdown') === 'ASSIGN_EXPRESSION') {
                checkInputValueTypeCompatibility(this, 'assign_expression_first_input', 'assign_expression_second_input');
            } else if (this.warning) {
                // Remove warning for value_type compatibility, in case it's in the block, and it is no longer an 'assign expression' action
                this.setWarningText(null, 'valueType');
                if (workspace.hasWarnings.includes(this.id)) {
                    workspace.hasWarnings = workspace.hasWarnings.filter((warningBlock) => {return warningBlock !== this.id});
                }
            }
        },

        setLocalEndpointParameterEntTypes: function() {
            let parent = this.parentBlock_;
            let foundParent_ = false;

            this.endpointEntTypes = [];

            // Verifies if the block is inside a 'when_is_do' block
            // and searches for its 'parameter' blocks to get its ent types for the 'crud_entity_ent_type' dropdown
            while (parent && !foundParent_) {
                if (parent.type === 'when_is_do' && parent.getField('local_endpoint_call_type')) {
                    this.endpointEntTypes =  this.getLocalEndpointParameterEntTypes(parent);
                    this.setEntTypesDropdown();
                    foundParent_ = true;
                } else {
                    parent = parent.parentBlock_;
                }
            }

            // If the block is pulled from the parent block, the menu will be reset as there's no parent ent type selected.
            if (!foundParent_) {
                this.getField('crud_entity_ent_type').menuGenerator_ = getEmptyDropdown();
            }

            // If the new dropdown doesn't have the selectedOption, reset it so that we don't have a selectedEndpointEntType that isn't on the dropdown
            resetDropdownChoiceIfNoLongerAvailable(this, 'crud_entity_ent_type');
        },

        updatePossibleActionTypes: function() {
            let parent = this.parentBlock_;
            let foundParent_ = false;

            this.executionType = null;

            // Verifies if the block is inside a 'when_is_do' block and searches for its 'execution type' to search for the possible action types.
            while (parent && !foundParent_) {
                if (parent.type === 'when_is_do') {
                    this.executionType =  parent.getFieldValue('action_rule_execution_type');
                    this.crudOperation = parent.getFieldValue('local_endpoint_call_type');
                    foundParent_ = true;
                } else {
                    parent = parent.parentBlock_;
                }
            }

            this.setPossibleActionTypes();

            // If the new dropdown doesn't have the selectedOption, reset it so that we don't have a selectedActionType that isn't on the dropdown
            resetDropdownChoiceIfNoLongerAvailable(this, 'action_dropdown');
        },

        getLocalEndpointParameterEntTypes: function(whenIsDoParent, endpointEntTypes = []) {
            // Get the parent block's childBlocks and analyze if they're parameter_local_endpoint_call blocks
            for (const childBlock of whenIsDoParent.getChildren(true)) {
                let currentChildBlock = childBlock;
                // If they're parameter_local_endpoint_call, get the parameter's ent type
                if (currentChildBlock && currentChildBlock.type === 'parameter_local_endpoint_call') {
                    const childBlockEntType =  currentChildBlock.getFieldValue('parameter_local_endpoint_ent_type');
                    if (childBlockEntType !== 'NONE' && !endpointEntTypes.includes(childBlockEntType)) {
                        endpointEntTypes.push(childBlockEntType);
                    }
                }
                // Analyze the block's children blocks for further 'parameter_local_endpoint_call' blocks
                endpointEntTypes = this.getLocalEndpointParameterEntTypes(currentChildBlock, endpointEntTypes);
            }
            return endpointEntTypes;
        },

        setEntTypesDropdown() {
            const dropdownOptions = getEmptyDropdown();
            for (const endpointEntType of this.endpointEntTypes) {
                const endpointEntTypeInfo = entTypes.find(entType => entType.id === Number(endpointEntType));
                dropdownOptions.push([endpointEntTypeInfo.name, endpointEntTypeInfo.id.toString()]);
                // Search for all 'has_many' entTypes that reference this entType.
                properties.forEach( (property) => {
                    if (property.part_of && property.fk_entity_type_id === Number(endpointEntType)) {
                        const relatedEntType = entTypes.find(entType => entType.id === property.ent_type_id);
                        dropdownOptions.push([relatedEntType.name, relatedEntType.id.toString()]);
                    }
                })
            }
            this.getField('crud_entity_ent_type').menuGenerator_ = dropdownOptions;
        },

        restrictConnectionsCausalLink: function() {
            let restrictConnections = false;

            const actionType = this.getFieldValue('action_dropdown');

            // If it's a CAUSAL_LINK action and the causal link's caused AR's transaction_type
            // is the same as the current AR's transaction type, don't let actions be after this causal link action.
            if (actionType === 'CAUSAL_LINK') {
                // Gets the parent 'when_is_do' block, which is always the top block on the workspace
                let parent = this.parentBlock_;
                while (parent && parent.parentBlock_) {
                    parent = parent.parentBlock_;
                }

                // When/If the parent 'when_is_do' block is found, check if the AR's trans_type is the same as the one in the Causal Link block
                if (parent) {
                    if (parent.getFieldValue('when_is_do_transaction_type') === this.getFieldValue('causal_link_transaction_type')) {
                        restrictConnections = true;
                    }
                }
            }

            if (restrictConnections) {
                this.childBlocks_.forEach((childBlock) => {
                    childBlock.unplug(false);
                });
                this.setNextStatement(false);
                this.noNextConnection = true;
            } else {
                this.setNextStatement(true, ['action','if_then','while', 'for_each_set_do']);
                this.noNextConnection = false;
            }
        },

        restrictConnectionsUserInput: function(entTypeId) {
            // Get the select ent type's information
            const entTypeSelected = entTypes.find(entType => entType.id === Number(entTypeId));
            // In case it is a 'has_many' entType, only allow the insertion of 'ent type form' blocks in the properties input
            if (entTypeSelected && entTypeSelected.has_many) {
                this.getInput('properties')?.setCheck(['ent_type_form']);
                this.onlyAllowEntTypeFormBlocks = true;
            } else {
                this.getInput('properties')?.setCheck(['property_simplified', 'ent_type_form']);
                this.onlyAllowEntTypeFormBlocks = false;
            }
        },

        // Remove the additional inputs that are on the block
        removeInputs: function () {

            let actionNameInputExists = this.getInput('action_name');
            if (actionNameInputExists) {
                this.removeInput('action_name');
            }

            let AEInputExists = this.getInput('assign_expression_first_input');
            if (AEInputExists) {
                this.removeInput('assign_expression_end_first_row');
                this.removeInput('assign_expression_first_input');
                this.removeInput('assign_expression_second_input');
            }

            let EEIInputExists = this.getInput('entityDetails');
            if (EEIInputExists) {
                // Delete the attached 'entity details' block
                EEIInputExists.connection.targetConnection?.sourceBlock_.dispose(true);
                this.hasEntityDetailsBlock = false;
                // Remove the action block's 'entityDetails' input
                removeStatementInputWithLabel(this, 'entityDetails');
                // Delete the attached 'entity filters' block
                this.getInput('entityFilters').connection.targetConnection?.sourceBlock_.dispose(true);
                this.hasEntityFiltersBlock = false;
                // Remove the action block's 'entityFilters' input
                removeStatementInputWithLabel(this, 'entityFilters');
                this.removeInput('scopeEntType');
                removeStatementInputWithLabel(this, 'properties');
                removeStatementInputWithLabel(this, 'term_properties');
                this.onlyAllowEntTypeFormBlocks = false;
            }

            let UIInputExists = this.getInput('properties');
            if (UIInputExists) {
                removeStatementInputWithLabel(this, 'properties');
                removeStatementInputWithLabel(this, 'term_properties');
                this.removeInput('allow_duplicates', true);
            }

            let UISingleEntTypeInputExists = this.getInput('scopeEntType');
            if (UISingleEntTypeInputExists) {
                this.removeInput('scopeEntType');
            }

            let CLInputExists = this.getInput('cl_checkboxes');
            if (CLInputExists) {
                let actionInput = this.getInput('actionDropdownInput');
                actionInput.removeField('causal_link_transaction_type');
                actionInput.removeField('c_fact');
                actionInput.removeField('min');
                actionInput.removeField('max');
                actionInput.removeField('must_be_label');
                actionInput.removeField('min_label');
                actionInput.removeField('max_label');
                this.removeInput('cl_checkboxes');
            }

            let UOInputExists = this.getField('uo_template_choice');
            let UONewTempInputExists = this.getInput('new_template');
            let UOExistingTempInputExists = this.getInput('existing_template');

            if (UOInputExists) {
                this.getInput('actionDropdownInput').removeField('uo_template_choice');
            }
            if (UONewTempInputExists) {
                this.removeInput('new_template');
                this.removeInput('template_name');
                delete this.template_editor_text_;
                delete this.has_opened_template_editor;
            } else if(UOExistingTempInputExists) {
                this.removeInput('existing_template');
            }
            this.removeNewTemplateAdditionalInputs_();

            let ECInputExists = this.getInput('external_endpoint');
            if (ECInputExists) {
                this.removeInput('external_endpoint');
                removeStatementInputWithLabel(this, 'external_call_actions');
                removeStatementInputWithLabel(this, 'external_call_parameters');
            }

            let crudEntityInputExists = this.getInput('crud_entity_properties');
            if (crudEntityInputExists) {
                this.endpointEntTypes = [];
                this.getInput('actionDropdownInput').removeField('blockchain_execution_checkbox');
                this.getInput('actionDropdownInput').removeField('blockchain_execution_checkbox_label');
                this.removeInput('crud_entity_ent_type');
                this.getInput('crud_entity_properties').connection.targetConnection?.sourceBlock_.dispose(true);
                this.removeInput('crud_entity_properties');
                this.hasUpdateDeleteIdBlock = false;
            }

            let QRInputExists = this.getInput('query_records_query');
            if (QRInputExists) {
                this.getInput('actionDropdownInput').removeField('blockchain_execution_checkbox');
                this.getInput('actionDropdownInput').removeField('blockchain_execution_checkbox_label');
                this.removeInput('checkbox_soft_deleted_objects');
                this.removeInput('query_records_query');
            }

            let CSSInputExists = this.getInput('schedule_slots_scheduling_entity');
            if (CSSInputExists) {
                removeStatementInputWithLabel(this, 'schedule_slots_scheduling_entity');
                removeStatementInputWithLabel(this, 'schedule_slots_slot_records');
            }
        },

        updateShapeEC_: function () {
            this.setInputsInline(false);
            this.appendDummyInput('external_endpoint')
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.EXTERNAL-ENDPOINT.TITLE') + ' :')
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.EXTERNAL-ENDPOINT.PLACEHOLDER')), 'endpoint_name')
                .appendField(new Blockly.FieldDropdown([
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.EXTERNAL-ENDPOINT.TYPE.POST'), 'POST'],
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.EXTERNAL-ENDPOINT.TYPE.GET'), 'GET'],
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.EXTERNAL-ENDPOINT.TYPE.PUT'), 'PUT'],
                    [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.EXTERNAL-ENDPOINT.TYPE.DELETE'), 'DELETE']
                ], this.validateApiEndpointCallType), 'api_endpoint_type')
            appendStatementInputCheckboxLabel(this, 'external_call_parameters', 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.PARAMETER',
                true, this.validateCheckboxEndpointParameters);
            this.appendStatementInput('external_call_parameters')
                .setCheck(['parameter_external_call']);
        },

        validateCheckboxEndpointParameters: function(newValue) {
            let block = this.sourceBlock_;
            removeStatementInputWithLabel(block, 'external_call_parameters');
            const i18nFieldLabel = 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.PARAMETER';
            const nextInput = block.getInput('external_call_actions') ? 'external_call_actions_label' : null;
            const checkboxValue = newValue === 'TRUE';
            appendStatementInputCheckboxLabel(block, 'external_call_parameters', i18nFieldLabel, checkboxValue, block.validateCheckboxEndpointParameters);
            block.moveInputBefore('external_call_parameters_label', nextInput);
            if (newValue === 'TRUE') {
                block.appendStatementInput('external_call_parameters')
                    .setCheck(['parameter_external_call']);
                block.moveInputBefore('external_call_parameters', nextInput);
            }
        },

        validateApiEndpointCallType: function(newValue) {
            const block = this.sourceBlock_;
            removeStatementInputWithLabel(block, 'external_call_actions');
            if (newValue === 'GET') {
                appendStatementInputLabel(block, 'external_call_actions', 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.EXTERNAL-API-CALL.ACTION');
                block.appendStatementInput('external_call_actions')
                    .setCheck(['create_entity_external_call']);
                moveStatementInputBefore(block, 'external_call_actions', null);
            }
        },

        // Update block shape when dropdown input is 'ASSIGN EXPRESSION'
        updateShapeAE_: function () {
            this.appendEndRowInput('assign_expression_end_first_row');
            this.appendValueInput('assign_expression_first_input')
                .setCheck(['property_single', 'set_context_variable', 'update_context_variable']);
            this.appendValueInput('assign_expression_second_input')
                .appendField('=')
                .setCheck(['constant', 'value', 'property_single', 'property_value','compute_expression',
                    'query', 'current_user', 'current_user_role', 'get_context_variable', 'form_property_output']);
        },

        // Update block shape when dropdown input is 'USER INPUT - MULTIPLE ENT TYPES'
        updateShapeUI_: function () {
            this.setInputsInline(false);
            this.appendDummyInput('action_name')
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.ACTION-NAME') + ' :')
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.ACTION-NAME-DEFAULT-TEXT')), 'action_name');
            this.appendDummyInput('allow_duplicates')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY.ALLOW-DUPLICATES') + ':'))
                .appendField(new Blockly.FieldCheckbox(false), 'allow_duplicates')
                .setVisible(false);
            appendStatementInputLabel(this, 'properties', 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.PROPERTIES');
            this.appendStatementInput('properties')
                .setCheck(['property', 'ent_type_form']);
            appendStatementInputCheckboxLabel(this, 'term_properties', 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.TERM-PROPERTIES',
                true, this.validateCheckboxUserInputTermProperties);
            this.appendStatementInput('term_properties')
                .setCheck(['term_property']);
        },

        // Update block shape when dropdown input is 'USER INPUT - SINGLE ENT TYPE'
        updateShapeUISingleEntType_: function () {
            this.setInputsInline(false);
            this.appendDummyInput('action_name')
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.ACTION-NAME') + ' :')
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.ACTION-NAME-DEFAULT-TEXT')), 'action_name');
            this.appendDummyInput('scopeEntType')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.ENT-TYPE') + ':'))
                .appendField(new Blockly.FieldDropdown(getEntTypes), 'user_input_single_ent_type');
            this.appendDummyInput('allow_duplicates')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY.ALLOW-DUPLICATES') + ':'))
                .appendField(new Blockly.FieldCheckbox(false), 'allow_duplicates')
                .setVisible(false);
            appendStatementInputLabel(this, 'properties', 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.PROPERTIES');
            this.appendStatementInput('properties')
                .setCheck(['property_simplified', 'ent_type_form']);
            appendStatementInputCheckboxLabel(this, 'term_properties', 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.TERM-PROPERTIES',
                true, this.validateCheckboxUserInputTermProperties);
            this.appendStatementInput('term_properties')
                .setCheck(['term_property']);

            if (this.onlyAllowEntTypeFormBlocks) {
                this.getInput('properties').setCheck(['ent_type_form']);
            }
        },

        updateShapeEEI_: function() {

            this.setInputsInline(false);
            this.appendDummyInput('action_name')
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EDIT-ENTITY-INSTANCE.ACTION-NAME') + ' :')
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.EDIT-ENTITY-INSTANCE.ACTION-NAME-DEFAULT-TEXT')), 'action_name');
            this.appendDummyInput('scopeEntType')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.ENT-TYPE') + ':'))
                .appendField(new Blockly.FieldDropdown(getEntTypes), 'edit_entity_instance_ent_type')
                .appendField(' ');
            appendStatementInputCheckboxLabel(this, 'entityDetails', 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.EDIT-ENTITY-INSTANCE.ENTITY-DETAILS', false, this.validateCheckboxEEIEntityDetails);
            appendStatementInputCheckboxLabel(this, 'entityFilters', 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.EDIT-ENTITY-INSTANCE.ENTITY-FILTERS', true, this.validateCheckboxEEIEntityFilters);
            this.appendStatementInput('entityFilters')
                .setCheck('entity_filters');
            this.addEntityFiltersBlockIfNotPresent();
            appendStatementInputCheckboxLabel(this, 'properties', 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.EDIT-ENTITY-INSTANCE.PROPERTIES',
                true, this.validateCheckboxUserInputProperties);
            this.appendStatementInput('properties')
                .setCheck(['property_simplified', 'ent_type_form']);
            appendStatementInputCheckboxLabel(this, 'term_properties', 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.TERM-PROPERTIES',
                true, this.validateCheckboxUserInputTermProperties);
            this.appendStatementInput('term_properties')
                .setCheck(['term_property']);
        },

        addEntityDetailsBlockIfNotPresent() {
            if (!this.hasEntityDetailsBlock) {
                const entityDetailsBlock = createNewChildBlock_('entity_details', false);
                this.getInput('entityDetails').connection.connect(entityDetailsBlock.previousConnection);
                this.hasEntityDetailsBlock = true;
            }
        },

        addEntityFiltersBlockIfNotPresent() {
            if (!this.hasEntityFiltersBlock) {
                const entityFiltersBlock = createNewChildBlock_('entity_filters', false);
                this.getInput('entityFilters').connection.connect(entityFiltersBlock.previousConnection);
                this.hasEntityFiltersBlock = true;
            }
        },

        validateCheckboxUserInputTermProperties: function(newValue) {
            let block = this.sourceBlock_;
            removeStatementInputWithLabel(block, 'term_properties');
            const i18nFieldLabel = 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.TERM-PROPERTIES';
            const checkboxValue = newValue === 'TRUE';
            appendStatementInputCheckboxLabel(block, 'term_properties', i18nFieldLabel, checkboxValue, block.validateCheckboxUserInputTermProperties);
            if (newValue === 'TRUE') {
                block.appendStatementInput('term_properties')
                    .setCheck(['term_property']);
            }
            if (newValue === 'FALSE' && block.getFieldValue('checkbox_properties') === 'FALSE') {
                block.setFieldValue(true, 'checkbox_properties');
            }
        },

        validateCheckboxUserInputProperties: function(newValue) {
            let block = this.sourceBlock_;
            removeStatementInputWithLabel(block, 'properties');
            const i18nFieldLabel = 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-INPUT.PROPERTIES';
            const checkboxValue = newValue === 'TRUE';
            appendStatementInputCheckboxLabel(block, 'properties', i18nFieldLabel, checkboxValue, block.validateCheckboxUserInputProperties);
            block.moveInputBefore('properties_label', 'term_properties_label');
            if (newValue === 'TRUE') {
                block.appendStatementInput('properties')
                    .setCheck(['property_simplified', 'ent_type_form']);
                moveStatementInputBefore(block, 'properties', 'term_properties', true);
            }
            if (newValue === 'FALSE' && block.getFieldValue('checkbox_term_properties') === 'FALSE') {
                block.setFieldValue(true, 'checkbox_term_properties');
            }
        },

        validateCheckboxEEIEntityDetails: function(newValue) {
            let block = this.sourceBlock_;
            block.getInput('entityDetails')?.connection.targetConnection?.sourceBlock_.dispose(true);
            removeStatementInputWithLabel(block, 'entityDetails');
            const i18nFieldLabel = 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.EDIT-ENTITY-INSTANCE.ENTITY-DETAILS';
            const checkboxValue = newValue === 'TRUE';
            appendStatementInputCheckboxLabel(block, 'entityDetails', i18nFieldLabel, checkboxValue, block.validateCheckboxEEIEntityDetails);
            block.moveInputBefore('entityDetails_label', 'entityFilters_label');
            if (newValue === 'TRUE') {
                block.appendStatementInput('entityDetails')
                    .setCheck(['entity_details']);
                moveStatementInputBefore(block, 'entityDetails', 'entityFilters', true);
                block.addEntityDetailsBlockIfNotPresent();
                // There can only be one checkbox selected (between the details or filters)
                if (newValue === 'TRUE' && block.getFieldValue('checkbox_entityFilters') === 'TRUE') {
                    block.setFieldValue(false, 'checkbox_entityFilters');
                }
            } else {
                block.hasEntityDetailsBlock = false;
                // There must be one checkbox selected (between the details or filters)
                if (block.getFieldValue('checkbox_entityFilters') === 'FALSE') {
                    block.setFieldValue(true, 'checkbox_entityFilters');
                }
            }
        },

        validateCheckboxEEIEntityFilters: function(newValue) {
            let block = this.sourceBlock_;
            block.getInput('entityFilters')?.connection.targetConnection?.sourceBlock_.dispose(true);
            removeStatementInputWithLabel(block, 'entityFilters');
            const i18nFieldLabel = 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.EDIT-ENTITY-INSTANCE.ENTITY-FILTERS';
            const checkboxValue = newValue === 'TRUE';
            appendStatementInputCheckboxLabel(block, 'entityFilters', i18nFieldLabel, checkboxValue, block.validateCheckboxEEIEntityFilters);
            block.moveInputBefore('entityFilters_label', 'properties_label');
            if (newValue === 'TRUE') {
                block.appendStatementInput('entityFilters')
                    .setCheck(['entity_filters']);
                block.moveInputBefore('entityFilters', 'properties_label');
                block.addEntityFiltersBlockIfNotPresent();
                // There can only be one checkbox selected (between the details or filters)
                if (newValue === 'TRUE' && block.getFieldValue('checkbox_entityDetails') === 'TRUE') {
                    block.setFieldValue(false, 'checkbox_entityDetails');
                }
            } else {
                block.hasEntityFiltersBlock = false;
                // There must be one checkbox selected (between the details or filters)
                if (block.getFieldValue('checkbox_entityDetails') === 'FALSE') {
                    block.setFieldValue(true, 'checkbox_entityDetails');
                }
            }
        },

        // Update block shape when dropdown input is 'USER OUTPUT'
        updateShapeUO_: function () {

            // Dropdown for the user to choose from either using an existing template or crete a new one
            let dropdownChoices = new Blockly.FieldDropdown([
                [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.DROPDOWN.NEW'),'NEW'],
                [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.DROPDOWN.EXISTING'),'EXISTING']
            ]);
            this.getInput('actionDropdownInput')
                .appendField(dropdownChoices,'uo_template_choice');

            this.getField('uo_template_choice').setValidator(function (input) {
                let block = this.sourceBlock_;
                // Remove current inputs to then add them according to choice
                block.removeUOFields_();
                // Update shape depending on template dropdown choice
                switch (input) {
                    case 'NEW':
                        // In case user wants to create new template
                        block.updateShapeUONew_();
                        break;
                    case 'EXISTING':
                        // In case user wants to use existing template
                        block.updateShapeUOExisting_();
                        break;
                    default:
                    //code block
                }
            });
            // Initial value to appear when 'USER OUTPUT' is selected on the 'action' block
            this.setFieldValue('NEW','uo_template_choice');
            this.getField('uo_template_choice').validator_('NEW');
        },

        // Remove fields/inputs when changing the dropdown of NEW/EXISTING
        removeUOFields_: function() {
            // Remove current inputs to then add them according to choice
            let newTemplateFieldExists = this.getInput('new_template');
            let existingTemplateFieldExists = this.getInput('existing_template');
            let templateNameFieldExists = this.getField('template_name');
            if (templateNameFieldExists) {
                this.removeInput('template_name');
            }
            if (newTemplateFieldExists) {
                this.removeInput('new_template');
                this.removeNewTemplateAdditionalInputs_();
            } else if (existingTemplateFieldExists) {
                this.removeInput('existing_template');
            }
        },

        // If user chooses to create new template, present type options and notification text input
        updateShapeUONew_: function() {

            this.setInputsInline(false);
            let dropdownTypes = new Blockly.FieldDropdown([
                [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.MODAL.TITLE'), 'MODAL'],
                [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.TITLE'), 'TOAST'],
                [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.DOC.TITLE'), 'DOC']
            ]);

            this.appendDummyInput('template_name')
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TEMPLATE-NAME') + ' :')
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.DEFAULT-TEMPLATE-NAME-TEXT')), 'template_name');
            this.appendDummyInput('new_template')
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TITLE') + ' :')
                .appendField(dropdownTypes, 'template_type')
                .appendField( ' "')
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.DEFAULT-TEXT')), 'template_text')
                .appendField( '" ')
            this.getField('template_name').setValidator(removeWhiteSpaces);
            this.getField('template_text').setValidator(removeWhiteSpaces);
            this.getField('template_type').setValidator(function (input) {

                let block = this.sourceBlock_;
                block.removeNewTemplateAdditionalInputs_();

                // Update shape depending on template dropdown choice
                switch (input) {
                    case 'MODAL':
                        // In case user wants to create new modal (window)
                        block.updateShapeUONewModal_();
                        break;
                    case 'TOAST':
                        // In case user wants to create new toast (popup notification)
                        block.updateShapeUONewToast_();
                        break;
                    default:
                    // never reaches this part
                }
                block.appendTemplateEditorInput_();
            });
            if (this.has_opened_template_editor) {
                this.getField('template_text')?.setEnabled(false);
            }
            // Default value to appear when user wants to create a new template
            this.setFieldValue('MODAL','template_type');
            this.getField('template_type').validator_('MODAL');
        },

        // Update shape when user wants to create new Modal type template
        updateShapeUONewModal_: function() {
            this.appendDummyInput('new_modal')
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.MODAL.HEADER') + ': ')
                .appendField(new Blockly.FieldTextInput(
                    translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.MODAL.DEFAULT-HEADER')
                ), 'template_header')
                .appendField(' ' + translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.MODAL.BUTTON') + ': ')
                .appendField(new Blockly.FieldTextInput(
                    translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.MODAL.DEFAULT-BUTTON')
                ), 'template_button');
            this.getField('template_header').setValidator(removeWhiteSpaces);
            this.getField('template_button').setValidator(removeWhiteSpaces);
        },

        // Update shape when user wants to create new Toast type template
        updateShapeUONewToast_: function() {
            // Dropdown with the class choices for the toast notification
            let toastClassDropdown = new Blockly.FieldDropdown([
                [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CLASS-DROPDOWN.SUCCESS'), 'SUCCESS'],
                [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CLASS-DROPDOWN.INFORMATION'), 'INFORMATION'],
                [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CLASS-DROPDOWN.WARNING'), 'WARNING'],
                [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CLASS-DROPDOWN.ERROR'), 'ERROR'],
                [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CLASS-DROPDOWN.CUSTOM'), 'CUSTOM']
            ]);
            this.appendDummyInput('new_toast')
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CLASS') + ': ')
                .appendField(toastClassDropdown, 'template_class');

            this.getField('template_class').setValidator(this.updateShapeUONewToastCustom_);
        },

        // Update shape when user wants to create new Toast type template - with custom colour and title
        updateShapeUONewToastCustom_: function(input) {

            let block = this.sourceBlock_;
            block.removeNewTemplateToastCustomFields_();

            // If dropdown value is Custom Toast, present additional inputs for colour selection and title
            if (input === 'CUSTOM') {
                // Colour Input ant its colour options to be presented and how many columns to present them
                let colourField = new Blockly.FieldColour('#ff4040');
                colourField.setColours(
                    ['#ff4040', '#ff66b3', '#ff8080',
                        '#6600cc', '#8080ff', '#fd9d47',
                        '#000099', '#420420', '#696969'],
                    [
                        translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CUSTOM-COLOURS.DARK-PINK'),
                        translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CUSTOM-COLOURS.PINK'),
                        translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CUSTOM-COLOURS.LIGHT-PINK'),
                        translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CUSTOM-COLOURS.PURPLE'),
                        translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CUSTOM-COLOURS.LIGHT-PURPLE'),
                        translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CUSTOM-COLOURS.LIGHT-ORANGE'),
                        translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CUSTOM-COLOURS.DARK-BLUE'),
                        translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CUSTOM-COLOURS.DARK-RED'),
                        translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CUSTOM-COLOURS.GREY'),
                    ]);
                colourField.setColumns(3);
                // Add the inputs to the block
                block.getInput('new_toast')
                    .appendField(' ' + translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.COLOUR') + ': ', 'template_colour_text')
                    .appendField(colourField, 'template_colour')
                    .appendField(' ' + translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.CUSTOM-TITLE') + ': ', 'template_title_text')
                    .appendField(new Blockly.FieldTextInput(
                        translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TYPE.TOAST.DEFAULT-CUSTOM-TITLE')
                    ),'template_title');
                block.getField('template_title').setValidator(removeWhiteSpaces);

                // If we want that the block changes to the selected colour of the colour field
                // block.getField('template_colour').setValidator(function(newValue) {
                //   block.setColour(newValue);
                //   return newValue;
                // });
            }
        },

        appendTemplateEditorInput_: function() {
            const button = new Blockly.FieldImage(
                "https://www.svgrepo.com/show/71603/edit.svg",
                20, 20,"*");
            // Show the edit button on the block that opens the editor
            this.appendDummyInput('template_editor_button')
                .appendField(new Blockly.FieldLabel(
                    translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TEMPLATE-EDITOR-TEXT') + ':'
                    ,'templateEditorButton'))
                .appendField(button,'TE_BUTTON')
                .setAlign(Blockly.ALIGN_LEFT);
            // Set the function to be executed when the button image is clicked
            button.setOnClickHandler(this.openTemplateEditor)
            // Set the cursor style for the imageField, so that it indicates it's a clickable field
            if (button.fieldGroup_) {
                button.fieldGroup_.style.cursor = 'pointer';
            }
        },

        openTemplateEditor() {
            // Open the template editor where the user can edit the template fields more easily.
            const block = this.sourceBlock_;
            const blockTemplate = block.getTemplateInfo();
            blocklyComponent.openTemplateEditorModal({
                from: 'blockly', blockTemplate
            }, block);
        },

        // Get the template info currently present in the block's fields
        getTemplateInfo() {
            const blockTemplate = {};
            blockTemplate.type = this.getFieldValue('template_type').toLowerCase();
            // Check if field 'Name' has been edited, if not, don't pass the default text to the editor
            const hasEditedName =
                this.getFieldValue('template_name') !== translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.DEFAULT-TEMPLATE-NAME-TEXT');
            if (hasEditedName) {
                blockTemplate.name = this.getFieldValue('template_name');
            }

            // Check if field 'text' has been edited by the user, and check if it is html from a previous editor interaction or text inserted by the user
            const hasHTMLText = this.template_editor_text_;
            const hasEditedText =
                this.getFieldValue('template_text') !== translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.DEFAULT-TEXT');
            if (hasHTMLText) {
                blockTemplate.text = this.template_editor_text_;
            } else if (hasEditedText) {
                blockTemplate.text = this.getFieldValue('template_text');
            }

            if (blockTemplate.type === 'modal') {
                blockTemplate.header = this.getFieldValue('template_header');
                blockTemplate.button = this.getFieldValue('template_button');
            } else if (blockTemplate.type === 'toast') {
                blockTemplate.class = this.getFieldValue('template_class').toLowerCase();
                if (blockTemplate.class === 'custom') {
                    blockTemplate.colour = this.getFieldValue('template_colour');
                    blockTemplate.title = this.getFieldValue('template_title');
                }
            }
            return blockTemplate;
        },

        // Remove inputs when updating the shape of the block
        removeNewTemplateAdditionalInputs_: function() {
            let newTemplateModalExists = this.getInput('new_modal');
            let newTemplateToastExists = this.getInput('new_toast');
            let templateEditorButtonExists = this.getInput('template_editor_button');

            if (newTemplateModalExists)
            {
                this.removeInput('new_modal');
            }
            if (newTemplateToastExists) {
                this.removeInput('new_toast');
            }
            if (templateEditorButtonExists) {
                this.removeInput('template_editor_button');
            }
        },

        // Remove fields used in the custom toast selection when updating the shape of the block
        removeNewTemplateToastCustomFields_: function() {
            let newTemplateToastCustomExists = this.getField('template_colour');
            if (newTemplateToastCustomExists) {
                let newToastCustomInput = this.getInput('new_toast');
                newToastCustomInput.removeField('template_colour_text', true);
                newToastCustomInput.removeField('template_colour', true);
                newToastCustomInput.removeField('template_title_text', true);
                newToastCustomInput.removeField('template_title', true);
            }
        },

        // Update shape of block when user selects that he wants to use an existing template
        updateShapeUOExisting_: function() {
            this.setInputsInline(true);
            this.removeNewTemplateToastCustomFields_();
            this.appendDummyInput('existing_template')
                .appendField(' ')
                .appendField(new Blockly.FieldDropdown(getUserOutputTemplates), 'template_text');
        },

        // Update block shape when dropdown input is 'CAUSAL LINK'
        updateShapeCL_: function () {

            this.setInputsInline(false);

            // Dropdown Fields to select Transaction Type & State
            this.getInput('actionDropdownInput')
                .appendField(new Blockly.FieldDropdown(getTransactionTypes), 'causal_link_transaction_type')
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.CAUSAL-LINK.MUST-BE'), 'must_be_label')
                .appendField(new Blockly.FieldDropdown(getTStatesName), 'c_fact')
                // Present number input for min
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.CAUSAL-LINK.MIN') + ': ', 'min_label')
                .appendField(new Blockly.FieldNumber(1,1,null,null, this.validatorMin), 'min')
                // Present number input for max
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.CAUSAL-LINK.MAX') + ': ', 'max_label')
                .appendField(new Blockly.FieldTextInput('1', this.validatorMax), 'max');

            this.getField('min').setEnabled(false);
            this.getField('max').setEnabled(false);

            this.appendDummyInput('cl_checkboxes')
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.CAUSAL-LINK.CANCEL-PROCESS') + ': ')
                .appendField(new Blockly.FieldCheckbox(false),'cancel_process')
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.CAUSAL-LINK.CONTINUE-SAME-USER') + ': ')
                .appendField(new Blockly.FieldCheckbox(false),'continue_same_user')
                .setAlign(Blockly.ALIGN_RIGHT);
        },

        // Update block shape when dropdown input is 'CREATE ENTITY'
        updateShapeCRUDEntity_: function(hasIdUnchangeableBlock = false) {
            this.setInputsInline(false);
            this.getInput('actionDropdownInput')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.ACTION.CHECKBOX-BLOCKCHAIN-EXECUTION') + ':'),
                    'blockchain_execution_checkbox_label')
                .appendField(new Blockly.FieldCheckbox(false), 'blockchain_execution_checkbox');
            this.appendDummyInput('crud_entity_ent_type')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.CREATE-ENTITY.ENTITY-TYPE'))
                    , 'crud_entity_ent_type_label')
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'crud_entity_ent_type');
            if (this.crudOperation === 'POST') {
                this.getInput('crud_entity_ent_type')
                    .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY.ALLOW-DUPLICATES') + ':'))
                    .appendField(new Blockly.FieldCheckbox(false), 'allow_duplicates');
            }
            this.appendStatementInput('crud_entity_properties')
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.CREATE-ENTITY.PROPERTY') + ' :')
                .setCheck('matching_property_crud_entity_action');
            // When the block is duplicated/loaded from XML
            if (this.endpointEntTypes) {
                this.setEntTypesDropdown();
            }
            if (hasIdUnchangeableBlock && !this.hasUpdateDeleteIdBlock) {
                const matchingIdBlock = createNewChildBlock_('matching_property_crud_entity_action', true);
                matchingIdBlock.updateDeleteIdBlock = true;
                matchingIdBlock.unchangeable = true;
                // Insert the 'matching id property' block into the new block input
                this.getInput('crud_entity_properties').connection.connect(matchingIdBlock.previousConnection);
                this.hasUpdateDeleteIdBlock = true;
            }
        },

        updateShapeQR_: function() {
            this.setInputsInline(false);
            this.getInput('actionDropdownInput')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.ACTION.CHECKBOX-BLOCKCHAIN-EXECUTION') + ':'),
                    'blockchain_execution_checkbox_label')
                .appendField(new Blockly.FieldCheckbox(false), 'blockchain_execution_checkbox');
            this.appendDummyInput('checkbox_soft_deleted_objects')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.LOCAL_ENDPOINT_CALL.RECORD.SOFT-DELETED-OBJECTS') + ':'))
                .appendField(new Blockly.FieldCheckbox(false),'checkbox_blockchain_soft_deleted_objects')
            this.appendValueInput('query_records_query')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.LOCAL_ENDPOINT_CALL.QUERY-RECORDS.VARIABLE-NAME-LABEL') + ':')
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.LOCAL_ENDPOINT_CALL.QUERY-RECORDS.VARIABLE-NAME')),
                    'query_records_variable_name')
                .appendField(' = ')
                .setCheck('query');
        },

        updateShapeCreateScheduleSlots: function() {
            this.setInputsInline(false);
            appendStatementInputLabel(this, 'schedule_slots_scheduling_entity', 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.CREATE-SCHEDULE-SLOTS.SCHEDULING-RECORD');
            this.appendStatementInput('schedule_slots_scheduling_entity')
                .setCheck('schedule_block');
            appendStatementInputLabel(this, 'schedule_slots_slot_records', 'BLOCKLY-BLOCKS.ACTION.DROPDOWN.CREATE-SCHEDULE-SLOTS.SLOT-RECORDS');
            this.appendStatementInput('schedule_slots_slot_records')
                .setCheck('scheduling_slot');
        },

        // So that max is never less than min
        validatorMin: function(newValue) {
            const block = this.sourceBlock_;
            fixMaxIfMinBigger(newValue, block.getField('max'));
            return newValue;
            // if (newValue !== '1' && !block.checkingMax) {
            //     let minField = this;
            //     let maxField = block.getField('max');
            //     block.checkingMax = true;
            //     fixMaxIfMinBigger(minField, maxField);
            //     block.checkingMax = false;
            //     return newValue;
            // }
        },

        // Verifies if max is smaller than min and lets us either insert a number or a *
        validatorMax: function(newValue) {
            // const block = this.sourceBlock_;
            // if (newValue !== '1' && !block.checkingMax) {
            //     let minField = block.getField('min');
            //     let maxField = this;
            //     block.checkingMax = true;
            //     fixMinIfMaxSmaller(minField, maxField);
            //     block.checkingMax = false;
            // }
            if ((isNaN(newValue) && newValue !== '*') || newValue<1) {
                return null;
            }
            return newValue;
        }
    };

// ---------------------------
// Block: "action comment" - mutator for inserting a comment for the action blocks
// ---------------------------

    Blockly.Blocks['action_mutator_block'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel('comment:'))
                .appendField(new Blockly.FieldTextInput(''),'comment')
            this.setColour(270);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };

    const ACTION_MUTATOR_MIXIN = {
        commentText: '',

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('comment_text', (this.commentText));
            container.setAttribute('no_next_connection', this.noNextConnection);
            container.setAttribute('has_entity_details_block', this.hasEntityDetailsBlock);
            container.setAttribute('has_entity_filters_block', this.hasEntityFiltersBlock);
            container.setAttribute('only_allow_ent_type_form_blocks', this.onlyAllowEntTypeFormBlocks);
            container.setAttribute('endpoint_ent_types', this.endpointEntTypes);
            container.setAttribute('execution_type', this.executionType);
            container.setAttribute('crud_operation', this.crudOperation);
            container.setAttribute('has_update_delete_id_block', this.hasUpdateDeleteIdBlock);
            // Only save the template edited text when saving a Blockly draft/duplicating a block, so that when
            // the draft is reopened or the block is duplicated, the user can continue editing the template text in the editor
            // When it's a full AR save, the 'new' user output block gets replaced with an 'existing' instance
            if (this.has_opened_template_editor && !blocklyComponent.savingActionRule) {
                container.setAttribute('template_editor_text', this.template_editor_text_);
            }
            return container;
        },

        domToMutation: function (xmlElement) {
            this.commentText = xmlElement.getAttribute('comment_text');
            this.setTooltip(this.commentText);
            this.noNextConnection = xmlElement.getAttribute('no_next_connection') === 'true';
            this.hasEntityDetailsBlock = xmlElement.getAttribute('has_entity_details_block') === 'true';
            this.hasEntityFiltersBlock = xmlElement.getAttribute('has_entity_filters_block') === 'true';
            this.onlyAllowEntTypeFormBlocks = xmlElement.getAttribute('only_allow_ent_type_form_blocks') === 'true';
            this.endpointEntTypes = xmlElement.getAttribute('endpoint_ent_types').split(',')
                .filter((entType) => entType !== '');
            if (this.noNextConnection) {
                this.setNextStatement(false);
            }
            const executionType = xmlElement.getAttribute('execution_type');
            this.executionType = executionType === 'null' ? null : executionType;
            const crudOperation = xmlElement.getAttribute('crud_operation');
            this.crudOperation = crudOperation === 'null' ? null : crudOperation;
            this.setPossibleActionTypes();
            this.hasUpdateDeleteIdBlock = xmlElement.getAttribute('has_update_delete_id_block') === 'true';
            if (xmlElement.getAttribute('template_editor_text')) {
                this.has_opened_template_editor = true;
                this.template_editor_text_ =  xmlElement.getAttribute('template_editor_text');
            }
        },
        /**
         * Populate the mutator's dialog with this block's components.
         * @param {!Blockly.Workspace} workspace Mutator's workspace.
         * @return {!Blockly.Block} Root block in mutator.
         * @this Blockly.Block
         */
        decompose: function(workspace) {
            let containerBlock = workspace.newBlock('action_mutator_block');
            containerBlock.setFieldValue(this.commentText, 'comment');
            containerBlock.initSvg();
            return containerBlock;
        },
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        compose: function(containerBlock) {
            this.commentText = containerBlock.getFieldValue('comment');
            this.setTooltip(this.commentText);
        },
    };
    if (!Blockly.Extensions.isRegistered('action_mutator')) {
        Blockly.Extensions.registerMutator('action_mutator', ACTION_MUTATOR_MIXIN, null, null);
    }


// ---------------------------
// Block: "if_then"
// ---------------------------

    Blockly.Blocks['if_then'] = {
        init: function() {
            this.appendStatementInput('if_input')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.IF_THEN.IF'),'blockTitle'))
                .setCheck('condition');
            this.appendStatementInput('then_input')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.IF_THEN.THEN'),'blockTitle'))
                .setCheck(['action','if_then', 'rollback_transaction']);
            // Function that adds the checkbox input wanted in the initialization of the block
            this.updateShapeAddCheckboxInput();
            this.setPreviousStatement(true, 'if_then');
            this.setNextStatement(true, ['action','if_then','while', 'for_each_set_do']);
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
        },

        // Validator function for the checkbox field, which refers to the presence of the statementInput
        // As the else input is optional (per EBNF rules), user adds/removes statementInput with the checkbox
        validateCheckboxElse: function(newValue) {
            let block = this.sourceBlock_;
            // Remove input present, so we can then add the new one
            block.removeInputs();
            if (newValue === 'TRUE') {
                block.updateShapeAddStatementInput();
            } else {
                block.updateShapeAddCheckboxInput();
            }
        },

        // Remove the current additional inputs in the block
        removeInputs: function() {
            let hasStatementInput = this.getInput('else_input');
            let hasCheckboxInput = this.getInput('checkbox_else');
            if (hasStatementInput) {
                this.removeInput('else_input');
            }
            if (hasCheckboxInput) {
                this.removeInput('checkbox_else');
            }
        },

        // Update shape when we want the checkbox input without the statementInput
        updateShapeAddCheckboxInput: function() {
            this.appendDummyInput('checkbox_else')
                .appendField(new Blockly.FieldCheckbox(false),'checkbox_else')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.IF_THEN.ELSE'),'blockTitle'));
            this.getField('checkbox_else').setValidator(this.validateCheckboxElse);
        },

        // Update shape when we want the checkbox input WITH the statementInput
        // The checkbox is initialized as true so that it reflects the previous checkbox present that was clicked
        updateShapeAddStatementInput: function() {
            this.appendStatementInput('else_input')
                .setCheck(['action','if_then', 'rollback_transaction'])
                .appendField(new Blockly.FieldCheckbox(true),'checkbox_else')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.IF_THEN.ELSE'),'blockTitle'));
            this.getField('checkbox_else').setValidator(this.validateCheckboxElse);
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('checkbox_else', this.getFieldValue('checkbox_else'));
            return container;
        },

        domToMutation: function (xmlElement) {
            const checkboxElse = xmlElement.getAttribute('checkbox_else');
            if (checkboxElse === 'TRUE') {
                this.removeInputs();
                this.updateShapeAddStatementInput();
            }
            // If checkbox is false, the function called inside the init function guarantees we have the normal checkbox without statementInput
        }
    };

// ---------------------------
// Block: "while"
// ---------------------------

    Blockly.Blocks['while'] = {
        init: function() {
            this.appendStatementInput('while_condition')
                .setCheck(['condition','comp_evaluated_expression'])
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.WHILE.WHILE'),'blockTitle'));
            this.appendStatementInput('while_action')
                .setCheck(['action', 'if_then'])
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.WHILE.DO'),'blockTitle'));
            this.setPreviousStatement(true, 'while');
            this.setNextStatement(true, ['action','if_then','while', 'for_each_set_do']);
            this.setColour(230);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };

// ---------------------------
// Block: "for each set"
// ---------------------------

    Blockly.Blocks['for_each_set_do'] = {
        endpointSetNames: [],

        init: function() {
            this.appendDummyInput('for_each_set')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.FOR-EACH.TITLE'),'blockTitle'))
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.FOR-EACH.ITEM')))
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'for_each_set');
            this.appendStatementInput('for_each_do')
                .setCheck(['action', 'if_then'])
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.FOR-EACH.DO'),'blockTitle'));
            this.setOnChange(this.getSetsFromParent);
            this.setPreviousStatement(true, 'for_each_set_do');
            this.setNextStatement(true, ['action','if_then','while', 'for_each_set_do']);
            this.setColour(250);
            this.setTooltip('');
            this.setHelpUrl('');
        },

        // Get the 'parameter sets' in the parent 'when is do' [local endpoint call]  block
        getSetsFromParent: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            // Update dropdown when this block has a newParent or stops having one
            // OR get the set names in the parent 'when_is_do' block's parameter_sets to insert in the dropdown
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'parameter_set_local_endpoint_call_name') ||
                (changeEvent.type === 'move' && blockType === 'parameter_set_local_endpoint_call') ||
                (changeEvent.type === 'delete' && changeEvent.oldJson.type === 'parameter_set_local_endpoint_call')) {

                let parent = this.parentBlock_;
                let foundParent_ = false;
                this.endpointSetNames = [];

                // Verifies if the block is inside a 'when_is_do' block, if it's 'local endpoint call'
                // and searches for its 'parameter_set' blocks names
                while (parent && !foundParent_) {
                    if (parent.type === 'when_is_do') {
                        // Get the parameter_set names when the 'when_is_do' block has an execution type of 'local endpoint call'
                        if (parent.getField('local_endpoint_call_type')) {
                            this.endpointSetNames = this.getParameterSetNames(parent);
                        }
                        this.setForEachSetDropdown();
                        foundParent_ = true;
                    } else {
                        parent = parent.parentBlock_;
                    }
                }

                // If the block is pulled from the parent block, the menus will be reset
                if (!foundParent_) {
                    this.entType = null;
                    setEmptyDropdown(this, 'for_each_set');
                }
                // Reset dropdown selection to the first option if the selected one is no longer available
                resetDropdownChoiceIfNoLongerAvailable(this, 'for_each_set');
            }
        },

        getParameterSetNames: function (parentBlock, parameterSetNames = []) {
            // Collect every 'parameter set' blocks' names to populate the for_each_set dropdown
            for (const childBlock of parentBlock.getChildren(true)) {
                // If the childBlock is a 'parameter set' block, get the respective name
                if (childBlock && childBlock.type === 'parameter_set_local_endpoint_call') {
                    parameterSetNames.push(childBlock.getFieldValue('parameter_set_local_endpoint_call_name'));
                }
                parameterSetNames = this.getParameterSetNames(childBlock, parameterSetNames);
            }
            return parameterSetNames;
        },

        setForEachSetDropdown() {
            const dropdownOptions = getEmptyDropdown();
            for (const parameterSetName of this.endpointSetNames) {
                dropdownOptions.push([parameterSetName, parameterSetName]);
            }
            this.getField('for_each_set').menuGenerator_ = dropdownOptions;
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('endpoint_set_names', this.endpointSetNames);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.endpointSetNames = xmlElement.getAttribute('endpoint_set_names').split(',')
                .filter((setName) => setName !== '');
            this.setForEachSetDropdown();
        }
    };

// -------------------------------------------------------------------------
// --------------------------- CATEGORY: EVALUATE ---------------------------

// ---------------------------------------------------
// Block: "condition"
// ---------------------------------------------------

    Blockly.Blocks['condition'] = {

        noNextConnection: false,

        init: function () {

            let dropdownChoices_ = new Blockly.FieldDropdown([
                [translate.instant('BLOCKLY-BLOCKS.CONDITION.DROPDOWN.IS-TRUE'), 'ISTRUE'],
                [translate.instant('BLOCKLY-BLOCKS.CONDITION.DROPDOWN.NOT'), 'NOT'],
                [translate.instant('BLOCKLY-BLOCKS.CONDITION.DROPDOWN.AND'), 'AND'],
                [translate.instant('BLOCKLY-BLOCKS.CONDITION.DROPDOWN.OR'),'OR']
            ]);

            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.CONDITION.TITLE'), 'blockTitle'))
                .appendField('  ')
                .appendField(dropdownChoices_, 'choice_condition');
            appendStatementInputLabel(this, 'input_terms', 'BLOCKLY-BLOCKS.CONDITION.TERMS');
            this.appendStatementInput('input_terms')
                .setAlign(Blockly.ALIGN_RIGHT);
            this.getField('choice_condition').setValidator(this.updateShape_);
            this.setPreviousStatement(true,'condition');
            this.setNextStatement(true,['condition','user_evaluated_expression','comp_evaluated_expression']);
            this.setColour(160);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setOnChange(this.handleChange_);

        },

        handleChange_: function(changeEvent) {
            // Restrict the block's 'next connection' when the block is inside a condition block or is removed from one. Also when a condition type is changed, ex: from 'is true' to 'and'
            // Also restrict the accepted block types when inside a 'enable condition' - should only accept comp_evaluated_expressions
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'choice_condition')) {
                changeNextConnection(this);
            }
        },

        // Update shape depending on dropdown choice
        updateShape_: function (input) {
            let block = this.sourceBlock_;

            // Update connections possible depending on dropdown choice - blocks to be accepted on ISTRUE are different
            if(input === 'ISTRUE'){
                block.getInput('input_terms')
                    .setCheck(['user_evaluated_expression','comp_evaluated_expression']);
            } else{
                block.getInput('input_terms')
                    .setCheck(['condition','user_evaluated_expression','comp_evaluated_expression']);
            }

        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            let dropdown_choice = this.getField('choice_condition').value_;
            container.setAttribute('choiceCondition', dropdown_choice);
            container.setAttribute('noNextConnection', this.noNextConnection);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.noNextConnection = xmlElement.getAttribute('nonextconnection') === 'true';
            if (this.noNextConnection) {
                this.setNextStatement(false);
            }
            const conditionType = xmlElement.getAttribute('choicecondition');
            if (conditionType === 'NOT' || conditionType === 'AND' || conditionType === 'OR' ) {
                this.getInput('input_terms')
                    .setCheck(['condition','user_evaluated_expression','comp_evaluated_expression']);
            } else {
                this.getInput('input_terms')
                    .setCheck(['user_evaluated_expression','comp_evaluated_expression']);
            }
        }

    };

// -----------------------------------
// Block: "comp_evaluated_expression"
// -----------------------------------

    Blockly.Blocks['comp_evaluated_expression'] = {

        noNextConnection: false,

        init: function() {

            let operatorDropdown = new Blockly.FieldDropdown([
                ["==", "=="],
                ["!=", "!="],
                ["<", "<"],
                [">", ">"]
            ]);

            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.COMP-EVALUATED-EXPRESSION.TITLE'), 'blockTitle'));
            this.appendEndRowInput('comp_evaluated_expression_end_first_row');
            this.appendValueInput('comp_evaluated_expression_first_input')
                .setCheck(['constant','value','property_single','query','compute_expression', 'current_user_role',
                    'get_context_variable']);
            this.appendDummyInput()
                .appendField(operatorDropdown, 'operator');
            this.appendValueInput('comp_evaluated_expression_second_input')
                .setCheck(['constant','value','property_single','property_value','query','compute_expression',
                    'user_role', 'get_context_variable']);
            this.setInputsInline(true);
            this.setPreviousStatement(true, 'comp_evaluated_expression');
            this.setNextStatement(true, ['condition','user_evaluated_expression','comp_evaluated_expression']);
            this.setColour(350);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setOnChange(this.handleChange_);

        },

        // changeNextConnection(block) is inside this function because otherwise we couldn't pass the block argument
        handleChange_: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            // Restrict the block's 'next connection' when the block is inside a condition block or is removed from one. Also when a condition type is changed, ex: from 'is true' to 'and'
            // Also restrict the accepted block types when inside a 'enable condition' - should only accept comp_evaluated_expressions
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'choice_condition')) {
                changeNextConnection(this);
            }
            const compEvaluatedExpressionInputBlocks = ['constant', 'value', 'property_single', 'property_value',
                'compute_expression', 'query', 'current_user', 'get_context_variable'];
            // Check for valueType compatibility when action is of type 'assign expression' and:
            // When blocks are attached to assign_expression inputs or when they are detached/deleted,
            // or when the attached block's fields change (ex: chosen property changes / value's value type changes)
            // Also, When block is duplicated, keep the warning in case it had one
            if ((changeEvent.type === 'move' && compEvaluatedExpressionInputBlocks.includes(blockType)) ||
                (changeEvent.type === 'delete' && compEvaluatedExpressionInputBlocks.includes(changeEvent.oldJson.type)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && compEvaluatedExpressionInputBlocks.includes(blockType)) ||
                (changeEvent.type === 'create' && changeEvent.blockId === this.id)
            ) {
                checkInputValueTypeCompatibility(this, 'comp_evaluated_expression_first_input',
                    'comp_evaluated_expression_second_input');
            }
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('noNextConnection', this.noNextConnection);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.noNextConnection = xmlElement.getAttribute('nonextconnection') === 'true';
            if (this.noNextConnection) {
                this.setNextStatement(false);
            }
        }
    };

// ---------------------------------------------------
// Block: "user_evaluated_expression"
// ---------------------------------------------------

    Blockly.Blocks['user_evaluated_expression'] = {

        noNextConnection: false,
        expression_editor_text : null,
        has_opened_expression_editor: false,

        init: function () {
            let dropdownChoices = new Blockly.FieldDropdown([
                [translate.instant('BLOCKLY-BLOCKS.USER-EVALUATED-EXPRESSION.DROPDOWN.NEW'), 'NEW'],
                [translate.instant('BLOCKLY-BLOCKS.USER-EVALUATED-EXPRESSION.DROPDOWN.EXISTING'), 'EXISTING']
            ]);

            this.appendDummyInput('block_fields')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.USER-EVALUATED-EXPRESSION.TITLE'), 'blockTitle'))
                .appendField(dropdownChoices, 'choice_expression');
            this.getField('choice_expression').setValidator(this.updateShapeUExp_);
            this.setInputsInline(false);
            this.setPreviousStatement(true,'user_evaluated_expression');
            this.setNextStatement(true,['condition','user_evaluated_expression','comp_evaluated_expression']);
            this.setColour(100);
            this.setOnChange(this.handleChange_);
        },

        handleChange_: function(changeEvent) {
            // Restrict the block's 'next connection' when the block is inside a condition block or is removed from one. Also when a condition type is changed, ex: from 'is true' to 'and'
            // Also restrict the accepted block types when inside a 'enable condition' - should only accept comp_evaluated_expressions
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'choice_condition')) {
                changeNextConnection(this);
            }
        },

        // Update shape depending on dropdown choice
        updateShapeUExp_: function (input) {
            let block = this.sourceBlock_;
            // Remove inputs to then add them according to the user's choice
            block.updateShape(input);
        },

        updateShape(expressionChoice) {
            this.removeAdditionalInputs_();
            switch (expressionChoice) {
                case 'NEW':
                    this.updateShapeNew_();
                    break;
                case 'EXISTING':
                    this.updateShapeExisting_();
                    break;
                default:
                    break;
            }
            if (this.has_opened_expression_editor) {
                this.getField('expression_text')?.setEnabled(false);
            }
        },

        removeAdditionalInputs_: function() {
            this.setInputsInline(false);
            let newUserEvalExpressionInputExists = this.getInput('expression_name');
            let existingUserEvalExpressionInputExists = this.getInput('existing_expression');
            if (newUserEvalExpressionInputExists) {
                this.removeInput('expression_name');
                this.removeInput('expression_text');
                this.removeInput('expression_editor_button');
                this.has_opened_expression_editor = false;
                this.expression_editor_text = null;
            } else if (existingUserEvalExpressionInputExists) {
                this.removeInput('existing_expression', true);
            }
        },

        // Update block shape if user wants to create new user_evaluated_expression
        updateShapeNew_: function() {
            this.appendDummyInput('expression_name')
                .appendField(translate.instant('BLOCKLY-BLOCKS.USER-EVALUATED-EXPRESSION.EXPRESSION-NAME') + ' :')
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.USER-EVALUATED-EXPRESSION.DEFAULT-NAME')), 'expression_name');
            this.appendDummyInput('expression_text')
                .appendField(translate.instant('BLOCKLY-BLOCKS.USER-EVALUATED-EXPRESSION.EXPRESSION-TEXT') + ' :')
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.USER-EVALUATED-EXPRESSION.DEFAULT-TEXT')), 'expression_text');
            this.getField('expression_text').setValidator(removeWhiteSpaces);
            this.appendUserEvaluatedExpressionEditorInput_();
        },

        appendUserEvaluatedExpressionEditorInput_: function() {
            const button = new Blockly.FieldImage(
                "https://www.svgrepo.com/show/71603/edit.svg",
                20, 20,"*");
            // Show the edit button on the block that opens the editor
            this.appendDummyInput('expression_editor_button')
                .appendField(new Blockly.FieldLabel(
                    translate.instant('BLOCKLY-BLOCKS.USER-EVALUATED-EXPRESSION.OPEN-EXPRESSION-EDITOR') + ':')
                )
                .appendField(button,'expression_editor_button');
            // Set the function to be executed when the button image is clicked
            button.setOnClickHandler(this.openExpressionEditor);
            // Set the cursor style for the imageField, so that it indicates it's a clickable field
            if (button.fieldGroup_) {
                button.fieldGroup_.style.cursor = 'pointer';
            }
        },

        openExpressionEditor() {
            // Open the expression editor where the user can edit the expression fields more easily.
            const block = this.sourceBlock_;
            const blockTemplate = block.getExpressionInfo();
            blocklyComponent.openUserEvaluatedExpressionEditorModal({
                from: 'blockly', blockTemplate
            }, block);
        },

        // Get the expression info currently present in the block's fields
        getExpressionInfo() {
            const blockExpression = {};
            const defaultName = translate.instant('BLOCKLY-BLOCKS.USER-EVALUATED-EXPRESSION.DEFAULT-NAME');
            // Check if field 'Name' has been edited, if not, don't pass the default text to the editor
            blockExpression.expression_name = this.getFieldValue('expression_name') !== defaultName ?
                this.getFieldValue('expression_name') : null;
            const defaultText = translate.instant('BLOCKLY-BLOCKS.USER-EVALUATED-EXPRESSION.DEFAULT-TEXT');
            // Check if field 'text' has been edited by the user, and check if it has html from a previous editor interaction or text inserted by the user
            blockExpression.expression_text = this.expression_editor_text ? this.expression_editor_text : this.getFieldValue('expression_text') !== defaultText ?
                this.getFieldValue('expression_text') : null;
            return blockExpression;
        },

        // Update block shape if user wants to use existing user_evaluated_expression
        updateShapeExisting_: function() {
            this.setInputsInline(true);
            this.appendDummyInput('existing_expression')
                .appendField('  ')
                .appendField(new Blockly.FieldDropdown(getUserEvaluatedExpressions),'existing_expression');
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('no_next_connection', this.noNextConnection);
            // Only save the expression edited text when saving a Blockly draft/duplicating a block, so that when
            // the draft is reopened or the block is duplicated, the user can continue editing the expression text in the editor
            // When it's a full AR save, the 'new' user evaluated expression block gets replaced with an 'existing' instance
            if (this.has_opened_expression_editor && !blocklyComponent.savingActionRule) {
                container.setAttribute('expression_editor_text', this.expression_editor_text);
            }
            return container;
        },

        domToMutation: function (xmlElement) {
            this.noNextConnection = xmlElement.getAttribute('no_next_connection') === 'true';
            if (this.noNextConnection) {
                this.setNextStatement(false);
            }
            if (xmlElement.getAttribute('expression_editor_text')) {
                this.has_opened_expression_editor = true;
                this.expression_editor_text =  xmlElement.getAttribute('expression_editor_text');
            }
        }
    };



// -------------------------------------------------------------------------
// --------------------------- CATEGORY: COMPUTE ---------------------------

// --------------------------------------------------------
// Block: "compute_expression"
// --------------------------------------------------------

    Blockly.Blocks['compute_expression'] = {
        connectionTerms_: new Array(2).fill(null),
        connectionAdditionalInputs_: new Array(64).fill(null),
        additionalInputs_: 0,
        changeOperator_: false,
        updatedOperator_: null,
        valueType: 'double',
        hasDateTerm: false,
        hasTimeTerm: false,

        init: function() {

            let operators = new Blockly.FieldDropdown([
                ['+', 'ADD'],
                ['−', 'MINUS'],
                ['×', 'MULTIPLY'],
                ['÷', 'DIVIDE'],
                ['^', 'POWER'],
                [translate.instant('BLOCKLY-BLOCKS.COMPUTE-EXPRESSION.AVERAGE-OPERATOR'), 'AVERAGE'],
            ]);

            this.appendValueInput('input_term1')
                .setCheck(['constant','value','property_single','query','compute_expression'])
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.COMPUTE-EXPRESSION.TITLE'), 'blockTitle'))
            this.appendDummyInput('number_terms')
                .appendField(translate.instant('BLOCKLY-BLOCKS.COMPUTE-EXPRESSION.TERMS') + ':', 'terms')
                .appendField(new Blockly.FieldNumber(2,2,64), 'quantity_inputs')
                .setAlign(Blockly.ALIGN_RIGHT);
            this.appendDummyInput('compute_expression_operator')
                .appendField(new Blockly.FieldLabel('operator: '))
                .appendField(operators, 'choice_operator')
                .setAlign(Blockly.ALIGN_RIGHT);
            this.appendValueInput('input_term2')
                .setCheck(['constant','value','property_single','query','compute_expression'])
                .setAlign(Blockly.ALIGN_RIGHT);
            this.getField('choice_operator').setValidator(this.operatorValidator);
            this.getField('quantity_inputs').setValidator(this.inputQuantityValidator);
            this.setOutput(true,'compute_expression');
            this.setOnChange(this.checkTimeDateInputs);
            this.setColour(210);
            this.setInputsInline(false);
            this.setTooltip('');
            this.setHelpUrl('');
        },

        operatorValidator: function(newOperator) {
            updateShapeVariableInputQuantity_(this.sourceBlock_, newOperator);
        },

        inputQuantityValidator: function(newValue) {
            updateVariableInputQuantity_(this.sourceBlock_, newValue);
        },

        checkTimeDateInputs: function(changeEvent) {
            const termsChangingValueTypeFields = ['property_output', 'constant_choice_dropdown', 'value_type', 'query_choice']
            if (
                (changeEvent.type === 'move' && (changeEvent.newParentId === this.id || changeEvent.oldParentId === this.id)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && termsChangingValueTypeFields.includes(changeEvent.name)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'choice_operator') ||
                (changeEvent.type === 'delete' && changeEvent.oldJson.type === 'property_single')
            ) {
                // Check if there are any 'time'/'date' inputs (properties, constants, values, ...)
                this.checkForDateTimeInputs();
                // Reset the 'result_in' label and dropdown
                this.resetSecondInput();
                // Add the 'result_in' label and dropdown if the operator is 'minus' and there's 'time'/'date' inputs
                this.addTimeResultInUnitDropdown();
                // Check compatibility between inputs (as they can be double/int/date/time)
                checkInputValueTypeCompatibility(this, 'input_term1', 'input_term2', this.additionalInputs_, 'additionalInput');
            }
        },

        checkForDateTimeInputs: function() {
            let inputsValueTypes = [];
            // Check the valueType of the firstInput's connected block, if there is one
            inputsValueTypes.push(this.getInputTargetBlock('input_term1')?.valueType);
            // Check the valueType of the secondInput's connected block, if there is one
            inputsValueTypes.push(this.getInputTargetBlock('input_term2')?.valueType);
            // If one of these is already a time/date property, no need to check in the remaining inputs
            this.hasTimeTerm = inputsValueTypes.includes('time');
            this.hasDateTerm = inputsValueTypes.includes('date');
            if (!this.hasTimeTerm && !this.hasDateTerm) {
                for (let i = 0; i < this.additionalInputs_; i++) {
                    const additionalInputValueType = this.getInputTargetBlock('additionalInput' + i)?.valueType;
                    this.hasTimeTerm = additionalInputValueType === 'time';
                    this.hasDateTerm = additionalInputValueType === 'date';
                    if (this.hasTimeTerm || this.hasDateTerm) {
                        break;
                    }
                }
            }
        },

        resetSecondInput() {
            this.getInput('input_term2').removeField('timeDateResultDropdownLabel', true);
            this.getInput('input_term2').removeField('timeDateResultDropdown', true);
            this.valueType = 'double';
        },

        addTimeResultInUnitDropdown() {
            if (this.getFieldValue('choice_operator') === 'MINUS' && (this.hasDateTerm || this.hasTimeTerm) ) {
                this.getInput('input_term2')
                    .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.COMPUTE-EXPRESSION.RESULT-IN.TITLE')), 'timeDateResultDropdownLabel')
                    .appendField(new Blockly.FieldDropdown(this.getPossibleDateTimeResultOptions()), 'timeDateResultDropdown');
                this.valueType = 'time';
            }
        },

        getPossibleDateTimeResultOptions: function() {
            // Possible options for the 'result in ...' dropdown when we have 'time' properties
            let options = [
                [translate.instant('BLOCKLY-BLOCKS.COMPUTE-EXPRESSION.RESULT-IN.SECONDS'), 'SECONDS'],
                [translate.instant('BLOCKLY-BLOCKS.COMPUTE-EXPRESSION.RESULT-IN.MINUTES'), 'MINUTES'],
                [translate.instant('BLOCKLY-BLOCKS.COMPUTE-EXPRESSION.RESULT-IN.HOURS'), 'HOURS']
            ];
            // Additional options for the 'result in ...' dropdown when we have 'date' properties
            if (this.hasDateTerm) {
                options.push(
                    [translate.instant('BLOCKLY-BLOCKS.COMPUTE-EXPRESSION.RESULT-IN.DAYS'), 'DAYS'],
                    [translate.instant('BLOCKLY-BLOCKS.COMPUTE-EXPRESSION.RESULT-IN.WEEKS'), 'WEEKS'],
                    [translate.instant('BLOCKLY-BLOCKS.COMPUTE-EXPRESSION.RESULT-IN.MONTHS'), 'MONTHS'],
                    [translate.instant('BLOCKLY-BLOCKS.COMPUTE-EXPRESSION.RESULT-IN.YEARS'), 'YEARS']
                );
            }
            return options;
        },

        // Save connections inside the block
        saveConnections_: function(containerBlock) {
            for (let i = 1; i <= 2 ; i++) {
                let input = this.getInput('input_term' + i);
                if (input) {
                    this.connectionTerms_[i] = input && input.connection.targetConnection;
                }
            }
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('operator', this.getFieldValue('choice_operator'));
            container.setAttribute('has_date_term', this.hasDateTerm);
            container.setAttribute('has_time_term', this.hasTimeTerm);
            return container;
        },

        domToMutation: function (xmlElement) {
            const chosenOperator = xmlElement.getAttribute('operator');
            this.getField('choice_operator').setValue(chosenOperator);
            this.hasDateTerm = xmlElement.getAttribute('has_date_term') === 'true';
            this.hasTimeTerm = xmlElement.getAttribute('has_time_term') === 'true';
            this.addTimeResultInUnitDropdown();
        }
    };

// Redefine after the dynamic search/queries behaviour is well defined
// ---------------------------------------------------
// Block: "query"
// ---------------------------------------------------

    Blockly.Blocks['query'] = {
        queryId: null,
        valueType: null,
        baseEntTypeId: null,
        numericQueriesOnly: false,
        numericTimeQueriesOnly: false,
        numericDateTimeQueriesOnly: false,
        queryFilterParameters: [],

        init: function() {
            this.appendDummyInput('queryTitle')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.QUERY.TITLE'), 'blockTitle'))
                .appendField('  ')
                .appendField(new Blockly.FieldDropdown(getQueries), 'query_choice');
            this.setOnChange(this.restrictQueries);
            this.setOutput(true,'query');
            this.setInputsInline(false);
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
            this.getField('query_choice').setValidator(this.updateInputs);
        },

        restrictQueries(changeEvent) {
            // Alter only when the block is inserted/removed from a parent block -
            // No need for these changes when the block is only being moved or the blocks fields are being changed
            const fieldsThatRequireUpdateOnChange = ['user_input_property', 'edit_entity_instance_ent_type',
                'user_input_ent_type', 'form_property_output_specification_fact'];
            if ((changeEvent.type === 'create' && changeEvent.blockId === this.id) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && fieldsThatRequireUpdateOnChange.includes(changeEvent.name)) ||
                (changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'choice_operator' && this.parentBlock_?.id === changeEvent.blockId)
            ) {
                // Reset variables in case block has been removed from an input
                let parent = this.parentBlock_;
                let stopParentSearch = false;
                this.baseEntTypeId = null;
                this.numericQueriesOnly = false;
                this.numericTimeQueriesOnly = false;
                this.numericDateTimeQueriesOnly = false;
                // Verifies if the block is part of a 'compute expression'/'form_calculation' block.
                // Searches while we have superiorBlocks left and haven't found the wanted parent block.
                // Also checks if we're in a [1] 'options from query' input or a [2] 'get instances from query' entity filters
                // In these cases, get only queries whose baseEntType are [1] the property's entType and [2] the action's entType
                while (parent && !stopParentSearch && (!this.numericQueriesOnly || !this.numericTimeQueriesOnly || !this.numericDateTimeQueriesOnly)) {
                    if (parent.type === 'compute_expression') {
                        // Means we're inside a 'compute_expression' block, so we've encountered the block we want
                        if (parent.getFieldValue('choice_operator') === 'MINUS') {
                            // When we have the 'minus' operator, we can have operations involving date/times also
                            this.numericDateTimeQueriesOnly = true;
                        } else if (parent.getFieldValue('choice_operator') === 'DIVIDE') {
                            // When we have the 'divide' operator, we can have operations involving times also
                            this.numericTimeQueriesOnly = true;
                        } else {
                            this.numericQueriesOnly = true;
                        }
                    } else if (parent.type === 'form_calculation') {
                        // Means we're inside a 'form_calculation' block, so we've encountered the block we want
                        this.numericQueriesOnly = true;
                    } else if (parent.type === 'property_simplified' || parent.type === 'property') {
                        const parentProperty = parent.getFieldValue('user_input_property');
                        // When the parent is a 'property_simplified' block, means we're in an 'options from query' input
                        this.baseEntTypeId = properties.find(property => property.id === Number(parentProperty))?.fk_entity_type_id;
                        stopParentSearch = true;
                    } else if (parent.type === 'entity_filters') {
                        // The parent of the 'entity_filters' block will always be the 'action' block, where we have the entType
                        this.baseEntTypeId = parent.parentBlock_.getFieldValue('edit_entity_instance_ent_type');
                        stopParentSearch = true;
                    } else if (parent.type === 'form_property_output') {
                        // When the parent is a 'form_property_output' block, means we're in an 'options from query' input
                        if (parent.getFieldValue('form_property_output_specification_fact') === 'SPECIFY_ENTITY') {
                            // If we have a 'specify entity' selected option, get the entType directly from the block's entType field
                            this.baseEntTypeId = Number(parent.getFieldValue('user_input_ent_type'));
                            stopParentSearch = true;
                        } else {
                            // If we have a 'specify property' selected option, get the entType through the propRef property's fkEntityType
                            const parentProperty = parent.getFieldValue('user_input_property');
                            this.baseEntTypeId = properties.find(property => property.id === Number(parentProperty))?.fk_entity_type_id;
                            stopParentSearch = true;
                        }
                    }
                    parent = parent.parentBlock_;
                }
                this.updateQueryChoiceDropdown();
            }
        },

        updateQueryChoiceDropdown: function() {
            let queryValueTypes = null;
            if (this.numericQueriesOnly) {
                queryValueTypes = ['int', 'double'];
            } else if (this.numericTimeQueriesOnly) {
                queryValueTypes = ['int', 'double', 'time'];
            } else if (this.numericDateTimeQueriesOnly) {
                queryValueTypes = ['int', 'double', 'time', 'date'];
            }
            // If it has a baseEntTypeId defined, only get queries whose baseEntType are equal to it
            this.getField('query_choice').menuGenerator_ = getQueries(queryValueTypes, this.baseEntTypeId);
            resetDropdownChoiceIfNoLongerAvailable(this, 'query_choice');
        },

        updateInputs: function(newValue) {
            const block = this.sourceBlock_;
            block.queryId = Number(newValue);
            const selectedQuery = queries.find(query => query.id === Number(newValue));
            block.valueType = selectedQuery?.value_type;
            // Remove the previous value inputs, so we can add the new ones after
            block.removeInputs();
            // When 'NONE' is selected, no need to go to this function as there are no additional inputs
            if (block.queryId) {
                block.addInputs();
            }
        },

        addInputs: function() {
            // Get the selected query parameters and add the correct number of inputs
            // The form in which the inputs will appear is, for example, the following:
            // [dropdown with selected query] "property1.ent_type_name '-' property1.property_name" [input1] ....
            const queryFilterParameters = queries.find(query => query.id === this.queryId)?.propertyParameters;
            if (queryFilterParameters) {
                this.queryFilterParameters = queryFilterParameters.map(filterParameter => filterParameter.id);
                this.appendDummyInput('query_parameters_label')
                    .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.QUERY.PARAMETERS-LABEL'), 'blockTitle'))
                    .setAlign(Blockly.ALIGN_RIGHT);
                // Add the specified number of inputs
                for (const queryFilterParameter of queryFilterParameters) {
                    this.appendValueInput('termInput' + queryFilterParameter.id)
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(queryFilterParameter.ent_type_name + ' ⮕ ' + queryFilterParameter.property_name + ':')
                        .setCheck(['constant','value','query','property_single','compute_expression', 'current_user',
                            'get_context_variable']);
                }
            }
        },

        removeInputs: function() {
            const hasParametersInputs = this.getInput('query_parameters_label');
            if (hasParametersInputs) {
                this.queryFilterParameters = [];
                this.removeInput('query_parameters_label');
                const termInputs = this.inputList.filter(input => input.name.includes('termInput'));
                for (const termInput of termInputs) {
                    this.removeInput(termInput.name);
                }
            }
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('query_id', this.queryId);
            container.setAttribute('value_type', this.valueType);
            container.setAttribute('base_ent_type_id', this.baseEntTypeId);
            container.setAttribute('numeric_queries_only', this.numericQueriesOnly);
            container.setAttribute('numeric_time_queries_only', this.numericTimeQueriesOnly);
            container.setAttribute('numeric_date_time_queries_only', this.numericDateTimeQueriesOnly);
            container.setAttribute('query_filter_parameters', this.queryFilterParameters);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.valueType = xmlElement.getAttribute('value_type');
            this.baseEntTypeId = xmlElement.getAttribute('base_ent_type_id') !== 'null' ? xmlElement.getAttribute('base_ent_type_id') : null;
            this.queryId = xmlElement.getAttribute('query_id');
            this.numericQueriesOnly = xmlElement.getAttribute('numeric_queries_only') === 'true';
            this.numericTimeQueriesOnly = xmlElement.getAttribute('numeric_time_queries_only') === 'true';
            this.numericDateTimeQueriesOnly = xmlElement.getAttribute('numeric_date_time_queries_only') === 'true';
            this.queryFilterParameters = xmlElement.getAttribute('query_filter_parameters')?.split(',')
                .filter((queryParam) => queryParam !== '');
            this.updateQueryChoiceDropdown();
        }

    };

// ---------------------------------------------------
// Block: "constant"
// ---------------------------------------------------

    Blockly.Blocks['constant'] = {
        valueType: null,
        newConstant: true,
        numericConstantsOnly: false,
        numericTimeConstantsOnly: false,
        numericDateTimeConstantsOnly: false,

        init: function() {
            let dropdownChoices = new Blockly.FieldDropdown([
                [translate.instant('BLOCKLY-BLOCKS.CONSTANT.DROPDOWN.NEW'),'NEW'],
                [translate.instant('BLOCKLY-BLOCKS.CONSTANT.DROPDOWN.EXISTING'),'EXISTING']
            ]);
            this.appendDummyInput('constant_choice')
                .appendField(new Blockly.FieldLabel(
                    translate.instant('BLOCKLY-BLOCKS.CONSTANT.TITLE')
                    , 'blockTitle'))
                .appendField(' ')
                .appendField(dropdownChoices,'choice_constant')
            this.getField('choice_constant').setValidator(this.choiceValidator);
            this.setOnChange(this.restrictDropdowns);
            this.setOutput(true,'constant');
            this.setInputsInline(true);
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
        },

        restrictDropdowns(changeEvent) {
            // Alter only when the block is inserted/removed from a parent block -
            // No need for these changes when the block is only being moved or the blocks fields are being changed
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'choice_operator' && this.parentBlock_?.id === changeEvent.blockId)
            ) {
                // Reset variables in case block has been removed from an input
                let parent = this.parentBlock_;
                this.numericConstantsOnly = false;
                this.numericTimeConstantsOnly = false;
                this.numericDateTimeConstantsOnly = false;
                // Verifies if the block is part of a 'compute expression'/'form_calculation' block.
                // Searches while we have superiorBlocks left and haven't found the wanted parent block.
                while (parent && (!this.numericConstantsOnly || !this.numericDateTimeConstantsOnly || !this.numericTimeConstantsOnly)) {
                    if (parent.type === 'compute_expression') {
                        // Means we're inside a 'compute_expression' block, so we've encountered the block we want
                        if (parent.getFieldValue('choice_operator') === 'MINUS') {
                            // When we have the 'minus' operator, we can have operations involving date/times also
                            this.numericDateTimeConstantsOnly = true;
                            // When we have the 'divide' operator, we can have operations involving times also
                        } else if (parent.getFieldValue('choice_operator') === 'DIVIDE') {
                            this.numericTimeConstantsOnly = true;
                        } else {
                            this.numericConstantsOnly = true;
                        }
                    } else if (parent.type === 'form_calculation') {
                        // Means we're inside a 'form_calculation' block, so we've encountered the block we want
                        this.numericConstantsOnly = true;
                    }
                    parent = parent.parentBlock_;
                }
                this.updateValueTypeOrConstantChoiceDropdown();
            }
        },

        updateValueTypeOrConstantChoiceDropdown: function() {
            if (this.newConstant) {
                this.getField('value_type').menuGenerator_ = this.getValueTypeDropdownOptions();
                resetDropdownChoiceIfNoLongerAvailable(this, 'value_type');
            } else {
                this.getField('constant_choice_dropdown').menuGenerator_ = this.getPossibleConstants();
                resetDropdownChoiceIfNoLongerAvailable(this, 'constant_choice_dropdown');
            }
        },

        getPossibleConstants: function() {
            let valueTypeOptions = null;
            if (this.numericConstantsOnly) {
                valueTypeOptions = ['int', 'double'];
            } else if (this.numericTimeConstantsOnly) {
                valueTypeOptions = ['int', 'double', 'time'];
            } else if (this.numericDateTimeConstantsOnly) {
                valueTypeOptions = ['int', 'double', 'date', 'time'];
            }
            return getConstants(valueTypeOptions);
        },

        getValueTypeDropdownOptions: function() {
            const valueTypeOptions = [];
            const noRestrictions = !this.numericConstantsOnly && !this.numericTimeConstantsOnly &&
                !this.numericDateTimeConstantsOnly;
            valueTypeOptions.push(
                [translate.instant('BLOCKLY-BLOCKS.CONSTANT.VALUE-TYPE-DROPDOWN.INTEGER-NUMBER'), 'INT'],
                [translate.instant('BLOCKLY-BLOCKS.CONSTANT.VALUE-TYPE-DROPDOWN.REAL-NUMBER'), 'DOUBLE']
            );
            if (this.numericTimeConstantsOnly  || this.numericDateTimeConstantsOnly || noRestrictions) {
                valueTypeOptions.push(
                    [translate.instant('BLOCKLY-BLOCKS.CONSTANT.VALUE-TYPE-DROPDOWN.TIME'),'TIME']
                );
            }
            if (this.numericDateTimeConstantsOnly  || noRestrictions) {
                valueTypeOptions.push(
                    [translate.instant('BLOCKLY-BLOCKS.CONSTANT.VALUE-TYPE-DROPDOWN.DATE'), 'DATE']
                );
            }
            if (noRestrictions) {
                valueTypeOptions.push(
                    [translate.instant('BLOCKLY-BLOCKS.CONSTANT.VALUE-TYPE-DROPDOWN.STRING'), 'TEXT'],
                    [translate.instant('BLOCKLY-BLOCKS.CONSTANT.VALUE-TYPE-DROPDOWN.BOOLEAN'),'BOOL']
                );
            }
            // Returns the options sorted alphabetically
            return valueTypeOptions.sort((a, b) => a[1].localeCompare(b[1]));
        },

        choiceValidator: function (newValue) {
            // Remove inputs to then add them according to choice
            let block = this.sourceBlock_;
            block.removeInputs();
            // Update shape depending on constant dropdown choice
            switch (newValue) {
                case 'NEW':
                    // In case user wants to create new constant
                    block.newConstant = true;
                    block.updateShapeNewConstant_();
                    break;
                case 'EXISTING':
                    // In case user wants to use existing constants
                    block.newConstant = false;
                    block.updateShapeExistingConstants_();
                    break;
                default:
                //code block
            }
        },

        removeInputs: function() {
            let newConstantFieldExists = this.getInput('new_constant');
            let existingConstantFieldExists = this.getInput('existing_constant');
            if (newConstantFieldExists) {
                this.removeInput('new_constant');
            } else if (existingConstantFieldExists) {
                this.removeInput('existing_constant');
            }
        },

        updateShapeNewConstant_: function() {
            const dropdownValueTypes = this.getValueTypeDropdownOptions();
            this.appendDummyInput('new_constant')
                .appendField(' ' +
                    translate.instant('BLOCKLY-BLOCKS.CONSTANT.NAME')
                    + ':')
                .appendField('"')
                .appendField(new Blockly.FieldTextInput(
                    translate.instant('BLOCKLY-BLOCKS.CONSTANT.DEFAULT-TEXT-NAME'), removeWhiteSpaces
                ), 'constant_name')
                .appendField('"')
                .appendField(translate.instant('BLOCKLY-BLOCKS.CONSTANT.VALUE-TYPE-DROPDOWN.TITLE') + ':')
                .appendField(new Blockly.FieldDropdown(dropdownValueTypes, validateValueType), 'value_type')
                .appendField(' ' +
                    translate.instant('BLOCKLY-BLOCKS.CONSTANT.VALUE')
                    + ':')
                .appendField(new Blockly.FieldTextInput(
                    translate.instant('BLOCKLY-BLOCKS.CONSTANT.DEFAULT-TEXT-VALUE')
                ), 'value');
            this.setFieldValue(dropdownValueTypes[0][1], 'value_type');
        },

        updateShapeExistingConstants_: function() {
            let existingConstants = this.getPossibleConstants();
            this.appendDummyInput('existing_constant')
                .appendField(' ')
                .appendField(new Blockly.FieldDropdown(existingConstants),'constant_choice_dropdown');
            // Save the constant's valueType when selecting an existing constant
            this.getField('constant_choice_dropdown').setValidator((newValue) => {
                const selectedConstant = constants.find(constant => constant.id === Number(newValue));
                this.valueType = selectedConstant?.value_type;
            })
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('constant_new', this.newConstant);
            container.setAttribute('numeric_constants_only', this.numericConstantsOnly);
            container.setAttribute('numeric_time_constants_only', this.numericTimeConstantsOnly);
            container.setAttribute('numeric_date_time_constants_only', this.numericDateTimeConstantsOnly);
            container.setAttribute('value_type', this.valueType);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.valueType = xmlElement.getAttribute('value_type');
            this.newConstant = xmlElement.getAttribute('constant_new') === 'true';
            this.numericConstantsOnly = xmlElement.getAttribute('numeric_constants_only') === 'true';
            this.numericTimeConstantsOnly = xmlElement.getAttribute('numeric_time_constants_only') === 'true';
            this.numericDateTimeConstantsOnly = xmlElement.getAttribute('numeric_date_time_constants_only') === 'true';
            if (this.newConstant) {
                this.updateShapeNewConstant_();
            } else {
                this.updateShapeExistingConstants_();
            }
            this.updateValueTypeOrConstantChoiceDropdown();
        }
    };

// ---------------------------------------------------
// Block: "value"
// ---------------------------------------------------

    Blockly.Blocks['value'] = {
        valueType: null,
        numericValueTypesOnly: false,
        numericTimeValueTypesOnly: false,
        numericDateTimeValueTypesOnly: false,

        init: function() {
            // TODO Add types 'enum'
            this.appendDummyInput('value_type')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.VALUE.TITLE'), 'blockTitle'))
                .appendField(translate.instant('BLOCKLY-BLOCKS.VALUE.VALUE-TYPE-DROPDOWN.TITLE') + ':')
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown, validateValueType),'value_type');
            this.appendDummyInput('value')
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.VALUE.DEFAULT-VALUE')), 'value');
            this.setInputsInline(true);
            this.setOutput(true, 'value');
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setOnChange(this.restrictValueTypes);
        },

        restrictValueTypes(changeEvent) {
            // Alter only when the block is inserted/removed from a parent block -
            // No need for these changes when the block is only being moved or the blocks fields are being changed
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'choice_operator' && this.parentBlock_?.id === changeEvent.blockId)
            ) {
                // Reset variables in case block has been removed from an input
                let parent = this.parentBlock_;
                this.numericValueTypesOnly = false;
                this.numericTimeValueTypesOnly = false;
                this.numericDateTimeValueTypesOnly = false;
                // Verifies if the block is part of a 'compute expression'/'form_calculation' block.
                // Searches while we have superiorBlocks left and haven't found the wanted parent block.
                while (parent && (!this.numericValueTypesOnly || !this.numericTimeValueTypesOnly || !this.numericDateTimeValueTypesOnly)) {
                    if (parent.type === 'compute_expression') {
                        // Means we're inside a 'compute_expression' block, so we've encountered the block we want
                        if (parent.getFieldValue('choice_operator') === 'MINUS') {
                            // When we have the 'minus' operator, we can have operations involving date/times also
                            this.numericDateTimeValueTypesOnly = true;
                        } else if (parent.getFieldValue('choice_operator') === 'DIVIDE') {
                            // When we have the 'minus' operator, we can have operations involving times also
                            this.numericTimeValueTypesOnly = true;
                        } else {
                            this.numericValueTypesOnly = true;
                        }
                    } else if (parent.type === 'form_calculation') {
                        // Means we're inside a 'form_calculation' block, so we've encountered the block we want
                        this.numericValueTypesOnly = true;
                    }
                    parent = parent.parentBlock_;
                }
                this.setValueTypesDropdown();
            }
        },

        setValueTypesDropdown: function() {
            this.getField('value_type').menuGenerator_ = this.getValueTypeDropdownOptions();
            resetDropdownChoiceIfNoLongerAvailable(this, 'value_type');
        },

        getValueTypeDropdownOptions: function() {
            const valueTypeDropdownsOptions = [];
            const noRestrictions = !this.numericValueTypesOnly && !this.numericDateTimeValueTypesOnly &&
                !this.numericTimeValueTypesOnly;
            valueTypeDropdownsOptions.push(
                [translate.instant('BLOCKLY-BLOCKS.VALUE.VALUE-TYPE-DROPDOWN.INTEGER-NUMBER'), 'INT'],
                [translate.instant('BLOCKLY-BLOCKS.VALUE.VALUE-TYPE-DROPDOWN.REAL-NUMBER'), 'DOUBLE']
            );
            if (this.numericTimeValueTypesOnly || this.numericDateTimeValueTypesOnly || noRestrictions) {
                valueTypeDropdownsOptions.push(
                    [translate.instant('BLOCKLY-BLOCKS.VALUE.VALUE-TYPE-DROPDOWN.TIME'),'TIME']
                );
            }
            if (this.numericDateTimeValueTypesOnly || noRestrictions) {
                valueTypeDropdownsOptions.push(
                    [translate.instant('BLOCKLY-BLOCKS.VALUE.VALUE-TYPE-DROPDOWN.DATE'), 'DATE']
                );
            }
            if (noRestrictions) {
               valueTypeDropdownsOptions.push(
                    [translate.instant('BLOCKLY-BLOCKS.VALUE.VALUE-TYPE-DROPDOWN.STRING'), 'TEXT'],
                    [translate.instant('BLOCKLY-BLOCKS.VALUE.VALUE-TYPE-DROPDOWN.BOOLEAN'),'BOOL'],
                );
            }
            // Returns the options sorted alphabetically
            return valueTypeDropdownsOptions.sort((a, b) => a[1].localeCompare(b[1]));
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('value_type', this.valueType);
            container.setAttribute('numeric_value_types_only', this.numericValueTypesOnly);
            container.setAttribute('numeric_time_value_types_only', this.numericTimeValueTypesOnly);
            container.setAttribute('numeric_date_time_value_types_only', this.numericDateTimeValueTypesOnly);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.valueType = xmlElement.getAttribute('value_type');
            this.numericValueTypesOnly = xmlElement.getAttribute('numeric_value_types_only') === 'true';
            this.numericTimeValueTypesOnly = xmlElement.getAttribute('numeric_time_value_types_only') === 'true';
            this.numericDateTimeValueTypesOnly = xmlElement.getAttribute('numeric_date_time_value_types_only') === 'true';
            this.setValueTypesDropdown();
        }
    };

// ---------------------------------------------------
// Block: "current_user"
// ---------------------------------------------------

    Blockly.Blocks['current_user'] = {

        init: function() {
            this.appendDummyInput('current_user')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.CURRENT-USER.TITLE'), 'blockTitle'));
            this.setInputsInline(true);
            this.setOutput(true, 'current_user');
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
        },
    };

// ---------------------------------------------------
// Block: "current_user_role"
// ---------------------------------------------------

    Blockly.Blocks['current_user_role'] = {

        init: function() {
            this.appendDummyInput('current_user_role')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.CURRENT-USER-ROLE.TITLE'), 'blockTitle'));
            this.setInputsInline(true);
            this.setOutput(true, 'current_user_role');
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
        },
    };


// ---------------------------------------------------
// Block: "user_role"
// ---------------------------------------------------

    Blockly.Blocks['user_role'] = {
        transactionTypeId: null,
        tStateId: null,
        actionRuleType: null,

        init: function() {
            this.appendDummyInput('blockTitle')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.USER-ROLE.TITLE'), 'blockTitle'))
                .appendField('  ')
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'user_role_choice');
            this.setOutput(true,'user_role');
            this.setInputsInline(false);
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
            this.getField('user_role_choice').setValidator(this.updateUserRoles);
            this.setOnChange(this.restrictUserRoles);
        },

        restrictUserRoles: function(changeEvent) {
            // Alter only when the block is inserted/removed from a parent block
            // No need for these changes when the block is only being moved or the selected user role is being changed
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            if (
                (changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && blockType === 'when_is_do' && changeEvent.element === 'field')
            ) {
                let foundWhenIsBlock = false;
                let parent = this.parentBlock_;
                this.transactionTypeId = null;
                this.tStateId = null;
                this.actionRuleType = null;
                // Verifies if the block is part of an 'when_is_do' block.
                // Searches while we have superiorBlocks left and haven't found an 'when_is_do' block
                while (parent && !foundWhenIsBlock) {
                    if (parent.type === 'when_is_do') {
                        // Means we're inside an 'when_is_do' block, so we've encountered the block we want
                        foundWhenIsBlock = true;
                        this.transactionTypeId = Number(parent.getFieldValue('when_is_do_transaction_type'));
                        this.actionRuleType = parent.getFieldValue('action_rule_type');
                        this.tStateId = Number(parent.getFieldValue('when_is_do_t_state'));
                    }
                    parent = parent.parentBlock_;
                }
                this.restrictUserRolesAuxiliary();
            }
        },

        restrictUserRolesAuxiliary: function() {
            this.getField('user_role_choice').menuGenerator_ = this.transactionTypeId ?
                getRolesForTask(this.transactionTypeId, this.actionRuleType, this.tStateId) : getAllRoles();
            resetDropdownChoiceIfNoLongerAvailable(this, 'user_role_choice');
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('transaction_type_id', this.transactionTypeId);
            container.setAttribute('action_rule_type', this.actionRuleType);
            container.setAttribute('t_state_id', this.tStateId);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.transactionTypeId = Number(xmlElement.getAttribute('transaction_type_id'));
            this.actionRuleType = xmlElement.getAttribute('action_rule_type');
            this.tStateId = Number(xmlElement.getAttribute('t_state_id'));
            this.restrictUserRolesAuxiliary();
        }
    };


// -------------------------------------------------------------------------
// --------------------------- CATEGORY: USER INPUT ----------------------


// ---------------------------------------------------
// Block: "property simplified" with mutator for optional fields
// ---------------------------------------------------
    Blockly.Blocks['property_simplified'] = {
        valueType: null,
        entType: null,
        editablePropsOnly: false,
        unchangeable: false,
        noNextConnection: false,

        init: function () {

            this.appendDummyInput('blockFields')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY.TITLE'), 'blockTitle'))
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'user_input_property')
                .appendField(new Blockly.FieldLabel(
                        ' ' + translate.instant('BLOCKLY-BLOCKS.PROPERTY.MANDATORY') + ':')
                    , 'mandatory_text')
                .appendField(new Blockly.FieldCheckbox(false), 'mandatory_checkbox');
            this.appendDummyInput('valueType').setVisible(false);
            this.getField('user_input_property').setValidator(function (input) {
                // Get the current block
                let block = this.sourceBlock_;
                // Check if block has value type input, if so remove it. Then add the new property's value type field
                let valueTypeInput = block.getInput('valueType');
                valueTypeInput.removeField('valueTypeField', true);
                valueTypeInput.setVisible(false);
                // When block is duplicated/loaded from xml, only add valueType field if isn't inside a 'ent_type_form' block and also hasn't the flag part_of active
                const property = properties.find(property => property.id === Number(input));
                if (!(block.unchangeable && property.part_of)) {
                    addValueTypeField(block, input);
                }
            });
            this.setInputsInline(false);
            this.setOnChange(this.getPropertiesFromParentBlock);
            this.setColour(270);
            this.setPreviousStatement(true, 'property_simplified');
            this.setNextStatement(true, ['property_simplified', 'ent_type_form']);
            this.jsonInit({'mutator': 'property_mutator'});
        },

        // Get the entType in the 'action' block [user input single entType]/[edit entity instance] in order to load the respective properties in this block's dropdown
        getPropertiesFromParentBlock: function(changeEvent) {

            // Update dropdown when this block has a newParent(action block) or stops having one OR when the entType in the action block [user input single entType]/[edit entity instance] changes
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'user_input_single_ent_type') ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'edit_entity_instance_ent_type')) {

                let parent = this.parentBlock_;
                let foundActionParent_ = false;

                // Verifies if the block is inside an 'action' or an 'ent type form' block, and searches for its ent type to get its properties.
                // The second verification in the 'ent type form' is so that it doesn't count if the current property block is NEXT [not IN] to an ent type form block.
                while (parent && !foundActionParent_) {
                    if (parent.type === 'action' ||
                        (parent.type === 'ent_type_form' && !(parent.nextConnection && this.previousConnection === parent.nextConnection.targetConnection)))
                    {
                        const actionType = parent.getFieldValue('action_dropdown');
                        if (actionType === 'EDIT_ENTITY_INSTANCE') {
                            this.entType = parent.getFieldValue('edit_entity_instance_ent_type');
                            this.editablePropsOnly = true;
                            setEditableProperties(this, this.entType, 'user_input_property');
                        } else {
                            this.entType = parent.type === 'action' ? parent.getFieldValue('user_input_single_ent_type') :
                                parent.getFieldValue('ent_type_form_ent_type');
                            this.editablePropsOnly = false;
                            setProperties(this, this.entType, 'user_input_property');
                        }
                        foundActionParent_ = true;
                    } else {
                        parent = parent.parentBlock_;
                    }
                }

                // If the block is pulled from the parent 'action' block, the menu will be reset as there's no parent ent type selected.
                if (!foundActionParent_) {
                    this.editablePropsOnly = false;
                    this.entType = null;
                    this.getField('user_input_property').menuGenerator_ = getEmptyDropdown();
                }
                // If the new dropdown doesn't have the selectedOption, reset it so that we don't have a selectedProperty that isn't on the dropdown
                resetDropdownChoiceIfNoLongerAvailable(this, 'user_input_property');
            }

            // Update dropdown when the selected property changes
            if ((changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'user_input_property')) {
                removeMutatorsIfInvalidValueType(this);
            }
        }
    };

// ---------------------------------------------------
// Block: "property" with mutator for optional fields
// ---------------------------------------------------

    Blockly.Blocks['property'] = {
        valueType: null,
        entType: null,
        editablePropsOnly: false,

        init: function () {

            this.appendDummyInput('blockTitle')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY.TITLE'), 'blockTitle'));
            this.appendDummyInput('ddEntTypes')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY.ENT-TYPE') + ':'))
                .appendField(new Blockly.FieldDropdown(getEntTypesThatArentHasMany), 'user_input_ent_type')
                .appendField(' ');
            this.appendDummyInput('ddProperties')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY.PROPERTY') + ':'))
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'user_input_property');
            this.appendDummyInput('mandatory')
                .appendField(new Blockly.FieldLabel(
                    translate.instant('BLOCKLY-BLOCKS.PROPERTY.MANDATORY') + ':')
                )
                .appendField(new Blockly.FieldCheckbox(false),'mandatory_checkbox');
            this.appendDummyInput('valueType').setVisible(false);
            this.getField('user_input_ent_type').setValidator(function (newValue) {
                const block = this.sourceBlock_;
                setProperties(block, newValue, 'user_input_property');
                block.entType = newValue;
                setNoneOptionDropdown(block, 'user_input_property');
            });
            this.getField('user_input_property').setValidator(function (input) {
                // Get the current block
                let block = this.sourceBlock_;
                // Check if block has value type input, if so remove it. Then add the new property's value type field
                let valueTypeInput = block.getInput('valueType');
                valueTypeInput.removeField('valueTypeField', true);
                valueTypeInput.setVisible(false);
                addValueTypeField(block, input);
            });
            this.setInputsInline(false);
            this.setColour(270);
            this.setPreviousStatement(true, 'property'); //property is the name of the appendField in USER_INPUT block
            this.setNextStatement(true, ['property', 'ent_type_form']);
            this.jsonInit({'mutator': 'property_mutator'});
            this.setOnChange(this.updateMutatorOnChange);
        },

        updateMutatorOnChange: function(changeEvent) {
            if ((changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'user_input_property')) {
                removeMutatorsIfInvalidValueType(this);
            }
        }
    };

// -----------------------------------
// Block: "form_property_output"
// -----------------------------------

    Blockly.Blocks['form_property_output'] = {
        valueType: null,
        entType: null,
        editablePropsOnly: false,
        hasEntityDetailsBlock: false,


        init: function () {

            this.appendDummyInput('blockTitle')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.FORM-PROPERTY-OUTPUT.TITLE'), 'blockTitle'));
            this.appendDummyInput('ddEntTypes')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY.ENT-TYPE') + ':'))
                .appendField(new Blockly.FieldDropdown(getEntTypesThatArentHasMany), 'user_input_ent_type')
                .appendField(' ');
            this.appendDummyInput('ddSpecificProperty')
                .appendField(new Blockly.FieldDropdown([
                    [translate.instant('BLOCKLY-BLOCKS.FORM-PROPERTY-OUTPUT.ENTITY-SCOPE.SPECIFY-PROPERTY'), 'SPECIFY_PROPERTY'],
                    [translate.instant('BLOCKLY-BLOCKS.FORM-PROPERTY-OUTPUT.ENTITY-SCOPE.SPECIFY-ENTITY'), 'SPECIFY_ENTITY'],
                ], this.specificationFactValidator), 'form_property_output_specification_fact')
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'user_input_property');
            this.appendDummyInput('mandatory')
                .appendField(new Blockly.FieldLabel(
                    translate.instant('BLOCKLY-BLOCKS.PROPERTY.MANDATORY') + ':')
                )
                .appendField(new Blockly.FieldCheckbox(true),'mandatory_checkbox');
            this.appendDummyInput('valueType').setVisible(false);
            this.getField('user_input_ent_type').setValidator(function (newValue) {
                const block = this.sourceBlock_;
                setProperties(block, newValue, 'user_input_property');
                block.entType = newValue;
                setNoneOptionDropdown(block, 'user_input_property');
            });
            this.getField('user_input_property').setValidator(function (input) {
                // Get the current block
                let block = this.sourceBlock_;
                if (block.getField('user_input_property').isVisible()) {
                    // Check if block has value type input, if so remove it. Then add the new property's value type field
                    let valueTypeInput = block.getInput('valueType');
                    valueTypeInput.removeField('valueTypeField', true);
                    valueTypeInput.setVisible(false);
                    addValueTypeField(block, input);
                }
            });
            this.getField('mandatory_checkbox').setEnabled(false);
            this.setInputsInline(false);
            this.setColour(270);
            this.setOutput(true, 'form_property_output');
            this.jsonInit({'mutator': 'property_mutator'});
            this.setOnChange(this.updateMutatorOnChange);
        },

        specificationFactValidator (newValue) {
            // Remove inputs to then add them according to choice
            let block = this.sourceBlock_;
            block.removeEntityDetailsInputs();
            block.resetValueType();
            // Update shape depending on 'specification fact' dropdown choice
            switch (newValue) {
                case 'SPECIFY_PROPERTY':
                    // Make the property input visible again to specify a specific property of the selected ent type
                    block.getField('user_input_property').setVisible(true);
                    break;
                case 'SPECIFY_ENTITY':
                    // In case user wants to just specify an entity instance of the selected ent type
                    // Hide the property field and then update the block's shape to reflect the selected option
                    block.getField('user_input_property').setVisible(false);
                    block.updateShapeSpecifyEntity_();
                    break;
                default:
                //code block
            }
        },

        resetValueType() {
            this.valueType = null;
            this.property = null;
            // Remove the 'value type' input when the entity scope option is changed, so we can update it depending on choice
            let valueTypeInput = this.getInput('valueType');
            valueTypeInput.removeField('valueTypeField', true);
            valueTypeInput.setVisible(false);
            // Reset the 'property' dropdown choice, as it may not be present if we're specifying an entity
            setNoneOptionDropdown(this, 'user_input_property');
        },

        removeEntityDetailsInputs() {
            // Remove the 'entity details' input and its attached block, if it's present in the block
            let entityDetailsInputExists = this.getInput('entityDetails');
            if (entityDetailsInputExists) {
                // Delete the attached 'entity details' block
                entityDetailsInputExists.connection.targetConnection?.sourceBlock_.dispose(true);
                this.removeInput('entityDetails');
                this.hasEntityDetailsBlock = false;
            }
        },

        addEntityDetailsInput() {
            // Add the 'entity details' input to the block
            this.appendStatementInput('entityDetails')
                .setCheck('entity_details');
            // Add the 'entity details' block if it's not present in the block yet and attach it to the input
            if (!this.hasEntityDetailsBlock) {
                const entityDetailsBlock = createNewChildBlock_('entity_details', false);
                this.getInput('entityDetails').connection.connect(entityDetailsBlock.previousConnection);
                this.hasEntityDetailsBlock = true;
            }
        },

        updateShapeSpecifyEntity_() {
            // Add the 'value type: entity instances' field
            this.valueType = 'entity_instances';
            setEntityInstancesValueType(this);
            // If 'options from query' is selected, don't add the entityDetails input (only one of them can be present)
            if (!this.inputOptionsFromQuery_) {
                this.addEntityDetailsInput();
            }
        },

        updateMutatorOnChange: function(changeEvent) {
            if (changeEvent.type === 'change' && changeEvent.element === 'field' &&
                (changeEvent.name === 'user_input_property' || changeEvent.name === 'form_property_output_specification_fact')) {
                removeMutatorsIfInvalidValueType(this);
            }
        }
    };


    // Names to appear inside mutator dialog block and inside 'property' block when added
    const PROPERTY_FIELDS = [
        translate.instant('BLOCKLY-BLOCKS.PROPERTY.FORM-COMPUTE'),
        translate.instant('BLOCKLY-BLOCKS.PROPERTY.ENABLE-CONDITION'),
        translate.instant('BLOCKLY-BLOCKS.PROPERTY.VALIDATION-CONDITION'),
        translate.instant('BLOCKLY-BLOCKS.PROPERTY.PROPERTY-REF-FILTER'),
        translate.instant('BLOCKLY-BLOCKS.PROPERTY.PROPERTY-REF-QUERY')
    ];

    // Block types to be checked
    const PROPERTY_TYPES = ['form_calculation', 'enable_condition', 'validation_condition',
        'property_filter', 'options_from_query'];

    const formCalculationValueTypes = ['int', 'double'];
    const validationConditionInvalidValueType = [null, 'ref', 'enum', 'bool', 'entity_instances'];
    const propertyFilterValueTypes = ['ref'];
    const optionsFromQueryValueTypes = ['ref', 'entity_instances'];

    Blockly.Blocks['property_mutator_block'] = {
        init: function() {
            for (let i = 0; i < PROPERTY_FIELDS.length; i++) {
                this.appendDummyInput(PROPERTY_TYPES[i])
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(PROPERTY_FIELDS[i])
                    .appendField(new Blockly.FieldCheckbox(false), PROPERTY_TYPES[i]);
            }
            this.setColour(270);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };

    const PROPERTY_MUTATOR_MIXIN = {
        inputFormCalculation_: false,
        hasFormCalculationBlocks_: false,
        inputEnable_: false,
        hasEnableConditionBlocks_: false,
        inputValidation_: false,
        hasValidationConditionBlocks_: false,
        inputPropertyFilter_: false,
        hasPropertyFilterBlocks_: false,
        inputOptionsFromQuery_: false,
        hasOptionsFromQueryBlocks_: false,
        connections_: Array(PROPERTY_FIELDS.length).fill(null),
        /**
         * Create XML to represent the number inputs.
         * @return {Element} XML storage element.
         * @this Blockly.Block
         */
        mutationToDom: function() {
            let container = document.createElement('mutation');
            container.setAttribute('form_calculation', this.inputFormCalculation_);
            container.setAttribute('has_form_calculation_blocks', this.hasFormCalculationBlocks_);
            container.setAttribute('enable_condition', this.inputEnable_);
            container.setAttribute('has_enable_condition_blocks', this.hasEnableConditionBlocks_);
            container.setAttribute('validation_condition', this.inputValidation_);
            container.setAttribute('has_validation_condition_blocks', this.hasValidationConditionBlocks_);
            container.setAttribute('property_filter', this.inputPropertyFilter_);
            container.setAttribute('has_property_filter_blocks', this.hasPropertyFilterBlocks_);
            container.setAttribute('options_from_query', this.inputOptionsFromQuery_);
            container.setAttribute('has_options_from_query_blocks', this.hasOptionsFromQueryBlocks_);
            // Save the ent_type_id depending on the block's type so the menu and option selected is loaded correctly from its XML
            if (this.type === 'property') {
                container.setAttribute('ent_type_id', this.getFieldValue('user_input_ent_type'));
            } else if (this.type === 'property_simplified' && this.parentBlock_) {
                container.setAttribute('ent_type_id', this.entType);
            } else if (this.type === 'form_property_output') {
                container.setAttribute('ent_type_id', this.getFieldValue('user_input_ent_type'));
                container.setAttribute('has_entity_details_block', this.hasEntityDetailsBlock);
            } else {
                container.setAttribute('ent_type_id', null);
            }
            container.setAttribute('property_id', this.getFieldValue('user_input_property'));
            container.setAttribute('value_type', this.valueType);
            container.setAttribute('editable_props_only', this.editablePropsOnly);
            container.setAttribute('unchangeable', this.unchangeable);
            container.setAttribute('no_next_connection', this.noNextConnection);
            return container;
        },
        /**
         * Parse XML to restore the inputs.
         * @param {!Element} xmlElement XML storage element.
         * @this Blockly.Block
         */
        domToMutation: function(xmlElement) {
            this.inputFormCalculation_ = xmlElement.getAttribute('form_calculation') === 'true';
            this.hasFormCalculationBlocks_ = xmlElement.getAttribute('has_form_calculation_blocks') === 'true';
            this.inputEnable_ = xmlElement.getAttribute('enable_condition') === 'true';
            this.hasEnableConditionBlocks_ = xmlElement.getAttribute('has_enable_condition_blocks') === 'true';
            this.inputValidation_= xmlElement.getAttribute('validation_condition') === 'true';
            this.hasValidationConditionBlocks_ = xmlElement.getAttribute('has_validation_condition_blocks') === 'true';
            this.inputPropertyFilter_= xmlElement.getAttribute('property_filter') === 'true';
            this.hasPropertyFilterBlocks_ = xmlElement.getAttribute('has_property_filter_blocks') === 'true';
            this.inputOptionsFromQuery_= xmlElement.getAttribute('options_from_query') === 'true';
            this.hasOptionsFromQueryBlocks_ = xmlElement.getAttribute('has_options_from_query_blocks') === 'true';
            this.valueType = xmlElement.getAttribute('value_type');
            this.entType = Number(xmlElement.getAttribute('ent_type_id'));
            this.editablePropsOnly = xmlElement.getAttribute('editable_props_only') === 'true';
            this.unchangeable = xmlElement.getAttribute('unchangeable') === 'true';
            this.noNextConnection = xmlElement.getAttribute('no_next_connection') === 'true';
            if (xmlElement.getAttribute('has_entity_details_block')) {
                this.hasEntityDetailsBlock = xmlElement.getAttribute('has_entity_details_block') === 'true';
            }
            // Populate the block's properties dropdown depending on the editablePropsOnly flag
            this.editablePropsOnly ? setEditableProperties(this, this.entType, 'user_input_property') :
                setProperties(this, this.entType, 'user_input_property');
            const propertyId = Number(xmlElement.getAttribute('property_id'));
            this.updateShape_();
            if (this.valueType === 'entity_instances') {
                setEntityInstancesValueType(this);
            } else {
                addValueTypeField(this, propertyId);
            }
            // For properties inside an 'ent type form' block
            if (this.unchangeable) {
                // So that user can't insert other 'property_simplified' blocks inside the 'ent type form' block - 'properties' input.
                // Only the blocks created & inserted automatically are accepted in the 'properties' input.
                // The only blocks to be accepted in the bottom connection of this 'property simplified' block are the blocks automatically created in the 'ent type form' block
                this.setPreviousStatement(true, 'ent_type_form_automatic_property_block');
                this.setNextStatement(true, 'ent_type_form_automatic_property_block');
                // Make this 'property_simplified' block unchangeable so that the user can't alter certain things without altering the ent type form block
                makePropertySimplifiedBlockUnchangeable(this, propertyId);
                // For the last property inside the 'ent type form' block
                if(this.noNextConnection) {
                    this.setNextStatement(false);
                }
            } else {
                // Restrict connections based on the block's type
                if (this.type === 'property') {
                    this.setNextStatement(true, ['property', 'ent_type_form']);
                } else if (this.type === 'property_simplified') {
                    this.setNextStatement(true, ['property_simplified', 'ent_type_form']);
                }
            }
        },
        /**
         * Populate the mutator's dialog with this block's components.
         * @param {!Blockly.Workspace} workspace Mutator's workspace.
         * @return {!Blockly.Block} Root block in mutator.
         * @this Blockly.Block
         */
        decompose: function(workspace) {
            // Set the block's checkbox values (checked or unchecked) depending on the block's variables
            let containerBlock = workspace.newBlock('property_mutator_block');
            // Remove 'form calculation' from the mutator's dialog box if the valueType is incompatible
            if (!formCalculationValueTypes.includes(this.valueType) || this.type === 'form_property_output') {
                containerBlock.removeInput('form_calculation', true);
                this.inputFormCalculation_ = false;
            } else {
                // If it's compatible, set the checkbox value according to the previous selection
                containerBlock.setFieldValue(this.inputFormCalculation_,'form_calculation');
            }
            // Remove 'enable condition' from the mutator's dialog box if we're in a 'form property output' block
            if (this.type === 'form_property_output') {
                containerBlock.removeInput('enable_condition', true);
                this.inputEnable_ = false;
            } else {
                // If it's compatible, set the checkbox value according to the previous selection
                containerBlock.setFieldValue(this.inputEnable_,'enable_condition');
            }
            // Remove 'validation condition' from the mutator's dialog box if the valueType is incompatible
            if (this.isIncompatibleWithValidationCondition(this)) {
                containerBlock.removeInput('validation_condition', true);
                this.inputValidation_ = false;
            } else {
                // If it's compatible, set the checkbox value according to the previous selection
                containerBlock.setFieldValue(this.inputValidation_,'validation_condition');
            }
            // Remove 'property_filter' from the mutator's dialog box if the valueType is incompatible
            if (!propertyFilterValueTypes.includes(this.valueType) || this.type === 'form_property_output') {
                containerBlock.removeInput('property_filter', true);
                this.inputPropertyFilter_ = false;
            } else {
                // If it's compatible, set the checkbox value according to the previous selection
                containerBlock.setFieldValue(this.inputPropertyFilter_,'property_filter');
            }
            // Remove 'options_from_query' from the mutator's dialog box if the valueType is incompatible
            if (!optionsFromQueryValueTypes.includes(this.valueType)) {
                containerBlock.removeInput('options_from_query', true);
                this.inputOptionsFromQuery_ = false;
            } else {
                // If it's compatible, set the checkbox value according to the previous selection
                containerBlock.setFieldValue(this.inputOptionsFromQuery_,'options_from_query');
            }
            containerBlock.initSvg();
            return containerBlock;
        },
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        compose: function(containerBlock) {
            // Update block's shape when the mutator is open, and we check/uncheck a checkbox
            this.inputFormCalculation_ = containerBlock.getFieldValue('form_calculation') === 'TRUE';
            this.inputEnable_ = containerBlock.getFieldValue('enable_condition') === 'TRUE';
            this.inputValidation_ = containerBlock.getFieldValue('validation_condition') === 'TRUE';
            this.inputPropertyFilter_ = containerBlock.getFieldValue('property_filter') === 'TRUE';
            this.inputOptionsFromQuery_ = containerBlock.getFieldValue('options_from_query') === 'TRUE';
            this.updateShape_();
        },
        /**
         * Store pointers to any connected child blocks.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        saveConnections: function(containerBlock) {
            for (let i = 0; i < this.connections_.length; i++) {
                let input = this.getInput(PROPERTY_TYPES[i]);
                if (input) {
                    this.connections_[i] = input && input.connection.targetConnection;
                }
            }
        },
        /**
         * Returns the incompatibility with validation condition
         * @this Blockly.Block
         * @private
         */
        isIncompatibleWithValidationCondition: function(block) {
            return validationConditionInvalidValueType.includes(block.valueType) || (!block.multipleValues && block.valueType === 'ref');
        },
        /**
         * Modify this block to have the correct number of inputs.
         * @this Blockly.Block
         * @private
         */
        updateShape_: function() {
            this.handleFormCalculationInput_();
            this.handleEnableConditionInput_();
            this.handleValidationConditionInput_();
            this.handlePropertyFilterInput_();
            this.handleOptionsFromQueryInput_();
        },

        handleFormCalculationInput_: function() {
            // Remove the input and associated blocks if the checkbox is no longer checked
            if (this.hasFormCalculationBlocks_ && !this.inputFormCalculation_) {
                this.removePropertyBlockInput_('form_calculation');
                this.hasFormCalculationBlocks_ = false;
            }
            // Add the 'form calculation' input in the 'property' block if it isn't present but should be.
            // Ex: when duplicating the block or loading from XML
            if (this.inputFormCalculation_ && !this.getInput('form_calculation')) {
                this.appendValueInput('form_calculation')
                    .setCheck(['form_calculation'])
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(translate.instant('BLOCKLY-BLOCKS.PROPERTY.FORM-COMPUTE') + ':');
            }
            // Add the 'form calculation' blocks to the property block's input if they aren't there yet but should be
            // Ex: When opening the mutator box with this checked, it would add another set of blocks if not for this verification
            if (!this.hasFormCalculationBlocks_ && this.inputFormCalculation_) {
                // Create the 'form calculation' block to insert into the new input automatically
                const formCalculationBlock = createNewChildBlock_('form_calculation', true);
                // Insert the 'form calculation' block into the new block input
                this.getInput('form_calculation').connection.connect(formCalculationBlock.outputConnection);
                this.hasFormCalculationBlocks_ = true;
            }
        },

        handleEnableConditionInput_: function() {
            // Remove the input and associated blocks if the checkbox is no longer checked
            if (this.hasEnableConditionBlocks_ && !this.inputEnable_) {
                this.removePropertyBlockInput_('enable_condition');
                this.hasEnableConditionBlocks_ = false;
            }
            // Add the 'enable condition' input in the 'property' block if it isn't present but should be.
            // Ex: when duplicating the block or loading from XML
            if (this.inputEnable_ && !this.getInput('enable_condition')) {
                this.appendValueInput('enable_condition')
                    .setCheck('enable_condition')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(translate.instant('BLOCKLY-BLOCKS.PROPERTY.ENABLE-CONDITION') + ':');
            }
            // Add the 'enable condition' blocks to the property block's input if they aren't there yet but should be
            // Ex: When opening the mutator box with this checked, it would add another set of blocks if not for this verification
            if (!this.hasEnableConditionBlocks_ && this.inputEnable_) {
                // Create the 'enable condition', 'condition' & 'comp evaluated expression' blocks to insert into the new input automatically
                const enableConditionBlock = createNewChildBlock_('enable_condition', true);
                const conditionBlock = createNewChildBlock_('condition', true);
                const compEvaluatedExpressionBlock = createNewChildBlock_('comp_evaluated_expression', true);
                // Insert the 'comp evaluated expression' block into the 'condition' block's input
                conditionBlock.getInput('input_terms').connection.connect(compEvaluatedExpressionBlock.previousConnection);
                // Insert the 'condition' block in the 'enable_condition' block
                enableConditionBlock.getInput('condition').connection.connect(conditionBlock.previousConnection);
                // Insert the 'enable condition' block into the new block input
                this.getInput('enable_condition').connection.connect(enableConditionBlock.outputConnection);
                this.hasEnableConditionBlocks_ = true;
            }
        },

        handleValidationConditionInput_: function() {
            // Remove the input and associated blocks if the checkbox is no longer checked
            if (this.hasValidationConditionBlocks_ && !this.inputValidation_) {
                this.removePropertyBlockInput_('validation_condition');
                this.hasValidationConditionBlocks_ = false;
            }
            // Add the 'validation condition' input in the 'property' block if it isn't present but should be.
            // Ex: when duplicating the block or loading from XML
            if (this.inputValidation_ && !this.getInput('validation_condition')) {
                this.appendValueInput('validation_condition')
                    .setCheck('validation_condition')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(translate.instant('BLOCKLY-BLOCKS.PROPERTY.VALIDATION-CONDITION') + ':');
            }
            // Add the 'validation condition' blocks to the property block's input if they aren't there yet but should be
            // Ex: When opening the mutator box with this checked, it would add another set of blocks if not for this verification
            if (!this.hasValidationConditionBlocks_ && this.inputValidation_) {
                // Create the 'validation condition' & 'condition validation condition' blocks to insert into the new input automatically
                const validationConditionBlock = createNewChildBlock_('validation_condition', true);
                const conditionValidationConditionBlock = createNewChildBlock_('condition_validation_condition', true);
                // Insert the 'condition validation condition' block into the 'validation condition' block
                validationConditionBlock.getInput('conditions').connection.connect(conditionValidationConditionBlock.previousConnection);
                // Insert the 'validation condition' block into the new block input
                this.getInput('validation_condition').connection.connect(validationConditionBlock.outputConnection);
                this.hasValidationConditionBlocks_ = true;
            }
        },

        handlePropertyFilterInput_: function() {
            // Remove the input and associated blocks if the checkbox is no longer checked
            if (this.hasPropertyFilterBlocks_ && !this.inputPropertyFilter_) {
                this.removePropertyBlockInput_('property_filter');
                this.hasPropertyFilterBlocks_ = false;
            }
            // Add the 'property filter' input in the 'property' block if it isn't present but should be.
            // Ex: when duplicating the block or loading from XML
            if (this.inputPropertyFilter_ && !this.getInput('property_filter')) {
                this.appendValueInput('property_filter')
                    .setCheck('property_filter')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(translate.instant('BLOCKLY-BLOCKS.PROPERTY.PROPERTY-REF-FILTER') + ':');
            }
            // Add the 'property filter' blocks to the property block's input if they aren't there yet but should be
            // Ex: When opening the mutator box with this checked, it would add another set of blocks if not for this verification
            if (!this.hasPropertyFilterBlocks_ && this.inputPropertyFilter_) {
                // Create the 'property_filter', 'filter property ref filter' & 'filter referenced property select' blocks to insert into the new input automatically
                const propertyRefFilterBlock = createNewChildBlock_('property_filter', true);
                const filterPropertyRefFilterBlock = createNewChildBlock_('filter_property_filter', true);
                const filterReferencedPropertySelectBlock = createNewChildBlock_('filter_referenced_property_select', true);
                // Insert the 'filter referenced property select' block into the 'filter property ref filter' block's input
                filterPropertyRefFilterBlock.getInput('filtered_property').connection.connect(filterReferencedPropertySelectBlock.outputConnection);
                // Insert the 'filter property ref filter' block in the 'property_filter' block
                propertyRefFilterBlock.getInput('filters').connection.connect(filterPropertyRefFilterBlock.previousConnection);
                // Insert the 'enable condition' block into the new block input
                this.getInput('property_filter').connection.connect(propertyRefFilterBlock.outputConnection);
                this.hasPropertyFilterBlocks_ = true;
            }
        },

        handleOptionsFromQueryInput_: function() {
            // Remove the input and associated blocks if the checkbox is no longer checked
            if (this.hasOptionsFromQueryBlocks_ && !this.inputOptionsFromQuery_) {
                this.removePropertyBlockInput_('options_from_query', 'query');
                this.hasOptionsFromQueryBlocks_ = false;
                // If we're in a 'form property output' block with 'specify entity' option selected, and unselect the
                // 'options from query' checkbox, add the entityDetails input (one of them must be present)
                if (this.valueType === 'entity_instances') {
                    this.addEntityDetailsInput();
                }
            }
            // Add the 'query' input in the 'property' block if it isn't present but should be.
            // Ex: when duplicating the block or loading from XML
            if (this.inputOptionsFromQuery_ && !this.getInput('options_from_query')) {
                this.appendValueInput('options_from_query')
                    .setCheck('query')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(translate.instant('BLOCKLY-BLOCKS.PROPERTY.PROPERTY-REF-QUERY') + ':');
                // If we're in a 'form property output' block with 'specify entity' option selected, and select the
                // 'options from query' checkbox, remove the entityDetails input (only one of them must be present)
                if (this.valueType === 'entity_instances') {
                    this.removeEntityDetailsInputs();
                }
            }
            // Add the 'query' block to the property block's input if they aren't there yet but should be
            // Ex: When opening the mutator box with this checked, it would add another set of blocks if not for this verification
            if (!this.hasOptionsFromQueryBlocks_ && this.inputOptionsFromQuery_) {
                // Create the 'query' block to insert into the new input automatically
                const propertyQueryBlock = createNewChildBlock_('query', true);
                // Insert the 'query' block into the new block input
                this.getInput('options_from_query').connection.connect(propertyQueryBlock.outputConnection);
                this.hasOptionsFromQueryBlocks_ = true;
            }
        },

        removePropertyBlockInput_: function(inputName, childBlockName = null) {
            const inputBlockName = childBlockName ? childBlockName : inputName;
            this.childBlocks_.find(block => block.type === inputBlockName)?.dispose(false);
            this.removeInput(inputName);
        },
    };


    if (!Blockly.Extensions.isRegistered('property_mutator')) {
        Blockly.Extensions.registerMutator('property_mutator', PROPERTY_MUTATOR_MIXIN, null, null);
    }

// ---------------------------------------------------
// Block: "property_simplified_output"
// ---------------------------------------------------

    Blockly.Blocks['property_simplified_output'] = {
        entType: null,
        valueType: null,

        // TODO When it's a 'create instance of multiple entity types' action, display properties of all entTypes selected
        //  in the 'property' blocks of the 'properties' input.
        init: function () {
            this.appendDummyInput('term_property')
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'property_simplified_output');
            this.appendDummyInput('valueType').setVisible(false);
            this.getField('property_simplified_output').setValidator(function (input) {
                // Get the current block
                let block = this.sourceBlock_;
                // Check if block has value type input, if so remove it. Then add the new property's value type field
                let valueTypeInput = block.getInput('valueType');
                valueTypeInput.removeField('valueTypeField', true);
                valueTypeInput.setVisible(false);
                // When block is duplicated/loaded from xml, only add valueType field if isn't inside a 'ent_type_form' block and also hasn't the flag part_of active
                const property = properties.find(property => property.id === Number(input));
                if (!(block.unchangeable && property.part_of)) {
                    addValueTypeField(block, input);
                }
            });
            this.setInputsInline(false);
            this.setOutput(true, 'property_simplified_output');
            this.setColour(270);
            // So that the user can't open the menu option when right-clicking the mouse
            this.contextMenu = false;
            // So that the user can't move the block on its own / Detach it from the parent
            this.setMovable(false);
            // So that the user can't delete the block on its own
            this.setDeletable(false);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setOnChange(this.restrictProperties);
        },

        restrictProperties: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            const automaticallyAttachedToBlocks = ['term_property', 'scheduling_additional_property', ];
            const parentBlockTypes = ['action', 'schedule_block', 'scheduling_slot'];
            const parentEntityTypeFieldNames = ['user_input_single_ent_type', 'schedule_block_entity_type', 'scheduling_slot_entity_type', 'edit_entity_instance_ent_type'];
            // Adjust the properties to be present in the dropdown depending on the parent type
            // When this block is moved (into another block or detached from it), when a
            if ((changeEvent.type === 'move' && (changeEvent.blockId === this.id || automaticallyAttachedToBlocks.includes(blockType)) && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && parentEntityTypeFieldNames.includes(changeEvent.name))
            ) {
                let parent = this.parentBlock_;
                let foundScheduleParent = false
                // Verifies if the block is part of an expected parent block, depending on its type
                while (parent && !foundScheduleParent) {
                    if (parentBlockTypes.includes(parent.type)) {
                        // If it is, get the parent's corresponding fieldName and get the selected entType
                        this.entType = parent.getFieldValue(this.getFieldNameFromParentType(parent));
                        foundScheduleParent = true;
                    }
                    parent = parent.parentBlock_;
                }
                // TODO on scheduling blocks:
                //  start date only appear date properties, start time only appear time properties...
                // Get the properties to be presented in the dropdown depending on the current block's context
                setProperties(this, this.entType, 'property_simplified_output');
                resetDropdownChoiceIfNoLongerAvailable(this, 'property_simplified_output');
            }
        },

        getFieldNameFromParentType(parent) {
            switch (parent.type) {
                case 'action':
                    const actionType = parent.getFieldValue('action_dropdown');
                    return  actionType === 'USER_INPUT_SINGLE_ENT_TYPE' ? 'user_input_single_ent_type' :
                        (actionType === 'EDIT_ENTITY_INSTANCE' ? 'edit_entity_instance_ent_type' : null);
                case 'schedule_block':
                    return 'schedule_block_entity_type';
                case 'scheduling_slot':
                    return 'scheduling_slot_entity_type';
                default:
                    return null;
            }
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('ent_type_id', this.entType);
            container.setAttribute('property_id', this.getFieldValue('property_simplified_output'));
            container.setAttribute('value_type', this.entType);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.entType = Number(xmlElement.getAttribute('ent_type_id'));
            setProperties(this, this.entType, 'property_simplified_output');
            // TODO isto acho que não é preciso, ele insere mesmo sem isto
            this.propertyId = xmlElement.getAttribute('property_id');
            this.valueType = xmlElement.getAttribute('value_type');
            addValueTypeField(this, this.propertyId);
        }
    };

// -----------------------------------
// Block: "term_property"
// -----------------------------------

    Blockly.Blocks['term_property'] = {

        init: function() {
            this.appendDummyInput('term_property_title')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.TERM-PROPERTY.TITLE'), 'blockTitle'));
            this.appendEndRowInput('term_property_end_first_row');
            this.appendValueInput('term_property_property_input')
                .setCheck(['property_simplified_output']);
            this.appendValueInput('term_property_term_input')
                .appendField('=', 'term_property_operator')
                .setAlign(Blockly.ALIGN_RIGHT)
                .setCheck(['constant', 'value', 'property_single', 'property_value', 'compute_expression',
                    'query', 'current_user', 'current_user_role', 'get_context_variable']);
            this.setInputsInline(true);
            this.setPreviousStatement(true, 'term_property');
            this.setNextStatement(true, ['term_property']);
            this.setColour(290)
            this.setOnChange(this.handleChange_);
        },

        handleChange_: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            const termPropertyExpressionInputBlocks = ['constant', 'value', 'property_single', 'property_value',
                'compute_expression', 'query', 'current_user', 'get_context_variable', 'property_simplified_output'];
            // Check for valueType compatibility when action is of type 'assign expression' and:
            // When blocks are attached to assign_expression inputs or when they are detached/deleted,
            // or when the attached block's fields change (ex: chosen property changes / value's value type changes)
            // Also, When block is duplicated, keep the warning in case it had one
            if ((changeEvent.type === 'move' && termPropertyExpressionInputBlocks.includes(blockType)) ||
                (changeEvent.type === 'delete' && termPropertyExpressionInputBlocks.includes(changeEvent.oldJson.type)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && termPropertyExpressionInputBlocks.includes(blockType)) ||
                (changeEvent.type === 'create' && changeEvent.blockId === this.id)
            ) {
                checkInputValueTypeCompatibility(this, 'term_property_property_input',
                    'term_property_term_input');
            }
        },
    };


// ---------------------------------------------------------
// Block: 'form_calculation'
// --------------------------------------------------------

    Blockly.Blocks['form_calculation'] = {
        connectionTerms_: new Array(2).fill(null),
        connectionAdditionalInputs_: new Array(64).fill(null),
        additionalInputs_: 0,
        changeOperator_: false,
        updatedOperator_: null,

        init: function() {

            let operators = new Blockly.FieldDropdown([
                ['+', 'ADD'],
                ['−', 'MINUS'],
                ['×', 'MULTIPLY'],
                ['÷', 'DIVIDE'],
                [translate.instant('BLOCKLY-BLOCKS.AVERAGE-OPERATOR'), 'AVERAGE']
            ]);

            this.appendDummyInput('titleBlock')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.FORM-COMPUTE.TITLE'), 'blockTitle'))
                .appendField(translate.instant('BLOCKLY-BLOCKS.FORM-COMPUTE.TERMS') + ':', 'terms')
                .appendField(new Blockly.FieldNumber(2,2,64), 'quantity_inputs')
                .appendField('  ', 'whiteSpaceAfterTerms');
            this.appendValueInput('input_term1')
                .setCheck(['constant', 'value', 'query', 'property_single','form_calculation']);
            this.appendDummyInput('operatorsDropdown')
                .appendField('  ')
                .appendField(operators, 'choice_operator')
                .appendField('  ');
            this.appendValueInput('input_term2')
                .setCheck(['constant', 'value', 'query', 'property_single','form_calculation']);
            this.getField('choice_operator').setValidator(this.operatorValidator);
            this.getField('quantity_inputs').setValidator(this.inputQuantityValidator);
            this.setOutput(true,'form_calculation');
            this.setColour(180);
            this.setInputsInline(true);
            this.setTooltip('');
            this.setHelpUrl('');
        },

        operatorValidator: function(newOperator) {
            updateShapeVariableInputQuantity_(this.sourceBlock_, newOperator);
        },

        inputQuantityValidator: function(newValue) {
            updateVariableInputQuantity_(this.sourceBlock_, newValue);
        },

        // Save connections inside the block
        saveConnections_: function(containerBlock) {
            for (let i = 1; i <= 2 ; i++) {
                let input = this.getInput('input_term' + i);
                if (input) {
                    this.connectionTerms_[i] = input && input.connection.targetConnection;
                }
            }
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            let operator = this.getFieldValue('choice_operator');
            container.setAttribute('operator', operator);
            return container;
        },

        domToMutation: function (xmlElement) {
            let operator = xmlElement.getAttribute('operator');
            // in case the operator is MULTIPLY, ADD or none (when creating a block), we update the shape
            if (!operator) {
                this.getField('choice_operator').setValue('ADD');
                this.getField('choice_operator').validator_('ADD');
            } else {
                this.getField('choice_operator').setValue(operator);
                this.getField('choice_operator').validator_(operator);
            }
        }

    };

// -----------------------------------
// Block: "validation_condition"
// -----------------------------------

    Blockly.Blocks['validation_condition'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.VALIDATION-CONDITION.TITLE'), 'blockTitle'));
            this.appendStatementInput('conditions')
                .setCheck('condition_validation_condition');
            this.setOutput(true,'validation_condition');
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };

// -----------------------------------
// Block: "enable_condition"
// -----------------------------------

    Blockly.Blocks['enable_condition'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.ENABLE-CONDITION.TITLE'), 'blockTitle'));
            this.appendStatementInput("condition")
                .setCheck('condition');
            this.setOutput(true,'enable_condition');
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };


// -----------------------------------
// Block: "condition_validation_condition"
// -----------------------------------

    Blockly.Blocks['condition_validation_condition'] = {
        checkingMax: false,
        valueType: null,
        multipleValues: null,

        init: function() {

            this.appendDummyInput('first_part_block')
                .appendField(new Blockly.FieldLabel(
                    translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.TITLE'),
                    'blockTitle'))
                .appendField(
                    ' ' + translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.EXTRA-FIELDS.NOT') + ':',
                    'negation_text_field')
                .appendField(new Blockly.FieldCheckbox(false), 'negation')
                .appendField(' ')
                .appendField(new Blockly.FieldDropdown(this.validationsHelper(null, null)),'dropdown_choice')
                .appendField(' ')
            this.getField('dropdown_choice').setValidator(this.updateShapeValidator);
            let dropdownChoices = new Blockly.FieldDropdown([
                [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.DROPDOWN.NEW'),'NEW'],
                [translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.DROPDOWN.EXISTING'),'EXISTING']
            ]);
            this.appendDummyInput('template_choice')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.TITLE')))
                .appendField(' ')
                .appendField(dropdownChoices,'choice_template')
            this.getField('choice_template').setValidator(this.updateShapeUOValidator);
            this.getInput('template_choice').setVisible(false);
            this.setOnChange(this.updateValidationsIfNeeded);
            this.setPreviousStatement(true, 'condition_validation_condition');
            this.setNextStatement(true,'condition_validation_condition');
            this.setInputsInline(false);
            this.setColour(230);
            this.setTooltip('');
            this.setHelpUrl('');
        },

        updateValidationsIfNeeded: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            const parentBlockTypes = ['property', 'property_simplified', 'form_property_output', 'parameter_local_endpoint_call'];
            // If block is attached to a 'property' block, get the property's valueType so that we can restrict its validations
            if ((changeEvent.type === 'move' && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'user_input_property') ||
                (changeEvent.type === 'change'&& changeEvent.element === 'field' && changeEvent.name === 'parameter_local_endpoint_property')) {
                let foundConditionParent_ = false;
                let parentBlock = this.parentBlock_;
                // Verifies if the block is inside a 'property' block, even if it's not the first block of this type inside it
                while (parentBlock && !foundConditionParent_) {
                    if (parentBlockTypes.includes(parentBlock.type)) {
                        // Means we're inside a 'property' block, so we've encountered the block we want to know the dropdown value of
                        foundConditionParent_ = true;
                    } else {
                        parentBlock = parentBlock.parentBlock_;
                    }
                }
                const valueType = parentBlock?.valueType ?? null;
                const multipleValues = parentBlock?.multipleValues ?? null;
                this.getPossibleValidations_(valueType, multipleValues, this.getFieldValue('dropdown_choice'));
            }
        },

        // Get the options to present in the validations' dropdown depending on the respective property's valueType
        getPossibleValidations_: function(valueType, multipleValues, dropdownChoice, dTm = false) {
            // Check if the valueType has changes. If it has, update the dropdowns available options.
            if (valueType !== this.valueType || dTm) {
                this.valueType = valueType;
                this.multipleValues = multipleValues;
                this.getField('dropdown_choice').menuGenerator_ = this.validationsHelper(valueType, multipleValues);
                resetDropdownChoiceIfNoLongerAvailable(this, 'dropdown_choice');
            }
        },

        validationsHelper: function(valueType, multipleValues) {
            let possibleValidations = [];
            if ((valueType && valueType !== 'bool') || valueType === null) {
                possibleValidations.push(
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.REGULAR-EXPRESSION'), 'REG_EXPRESSION'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.CUSTOM-VALIDATION'), 'CUSTOM_VALIDATION']
                );
            }
            if (valueType === 'int' || valueType === 'double' || valueType === null) {
                possibleValidations.push(
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.EQUAL-TO'), 'EQUAL_TO'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.LESS-EQUAL'), 'LESS_EQUAL'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.HIGHER-EQUAL'), 'HIGHER_EQUAL'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.HIGHER-THAN'), 'HIGHER_THAN'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.LESS-THAN'), 'LESS_THAN']
                );
            }
            if (valueType === 'text' || valueType === null) {
                possibleValidations.push(
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.IS-EMAIL'), 'IS_EMAIL'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.IS-URL'), 'IS_URL'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.MIN-LENGTH'), 'MIN_LENGTH'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.MAX-LENGTH'), 'MAX_LENGTH'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.MIN-WORD-LENGTH'), 'MIN_WORD_LENGTH'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.MAX-WORD-LENGTH'), 'MAX_WORD_LENGTH'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.HAS-CHARACTER'), 'HAS_CHARACTER'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.HAS-WORD'), 'HAS_WORD'],
                );
            }
            if (valueType === 'double' || valueType === 'int' || valueType === null) {
                possibleValidations.push(
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.BELONGS-RANGE'), 'BELONGS_RANGE'],
                );
            }
            if (valueType === 'date' || valueType === null) {
                possibleValidations.push(
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.BEFORE-DATE'), 'BEFORE_DATE'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.AFTER-DATE'), 'AFTER_DATE']
                );
            }
            if (valueType === 'time' || valueType === null) {
                possibleValidations.push(
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.BEFORE-TIME'), 'BEFORE_TIME'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.AFTER-TIME'), 'AFTER_TIME']
                );
            }
            if (multipleValues || valueType === null ) {
                possibleValidations.push(
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.MIN-CHOICE'), 'MIN_CHOICE'],
                    [translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.DROPDOWN.MAX-CHOICE'), 'MAX_CHOICE']
                );
            }
            // Returns the options sorted alphabetically
            possibleValidations.sort((a, b) => a[1].localeCompare(b[1]));
            // Push option 'NONE' to the start of the array
            possibleValidations.unshift([translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.NONE'),'NONE']);
            return possibleValidations;
        },

        updateShapeUOValidator: function(newValue) {
            const block = this.sourceBlock_;
            block.updateShapeUO(block, newValue);
        },

        updateShapeUO: function(block, newValue) {
            // Remove inputs to then add them according to choice
            let templateFieldExists = block.getField('template_field');
            let hasExtraField3 = block.getField('extraField3');
            let hasExtraField4 = block.getField('extraField4');

            if (templateFieldExists) {
                block.getInput('template_choice').removeField('template_field');
            }
            if (hasExtraField3) {
                block.getInput('template_choice').removeField('extraField3');
            }
            if (hasExtraField4) {
                block.getInput('template_choice').removeField('extraField4');
            }

            // Update shape depending on template dropdown choice
            switch (newValue) {
                case 'NEW':
                    // In case user wants to create new template
                    block.updateShapeCONew_();
                    break;
                case 'EXISTING':
                    // In case user wants to use existing template
                    block.updateShapeCOExisting_();
                    break;
                default:
                //code block
            }
        },

        updateShapeCONew_: function() {
            this.getInput('template_choice')
                .appendField('"', 'extraField3')
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.ACTION.DROPDOWN.USER-OUTPUT.DEFAULT-TEXT')), 'template_field')
                .appendField('"', 'extraField4')
            this.getField('template_field').setValidator(validateTemplateTextValidations)
            // Checks if template text has ' and replaces it for normal ", so we don't have problems in the Forms' validations
            function validateTemplateTextValidations(newValue) {
                if (newValue.includes("'")) {
                    return newValue.replaceAll("'",'"');
                } else {
                    return newValue;
                }
            }
        },

        updateShapeCOExisting_: function() {
            this.getInput('template_choice')
                .appendField(new Blockly.FieldDropdown(getTemplatesValidationWarning), 'template_field');
        },

        updateShapeValidator: function(newValue) {
            let block = this.sourceBlock_;
            block.updateShape_(block, newValue);
        },

        // Update shape depending on dropdown choice
        updateShape_: function (block, newValue) {

            // Set these fields visible as they can be invisible due to previous choice
            block.getField('negation_text_field').setVisible(true);
            block.getField('negation').setVisible(true);

            // Remove all inputs before adding them in updating shape
            block.removeExtraFieldsFirstPartBlock_();

            // Only show the 'user_output' part of the block if it's a 'Custom_validation' or a 'Reg_expression' validation
            if (newValue === 'CUSTOM_VALIDATION' || newValue === 'REG_EXPRESSION') {
                block.getInput('template_choice').setVisible(true);
                block.getField('choice_template').validator_('NEW');
            } else {
                block.getInput('template_choice').setVisible(false);
            }

            // Updating block depending on newValue
            if (newValue === 'IS_NUMBER' || newValue === 'IS_INTEGER' || newValue === 'IS_EMAIL' || newValue === 'IS_URL') {

                // Do Nothing

            } else if (newValue === 'EQUAL_TO' || newValue === 'LESS_EQUAL' || newValue === 'HIGHER_EQUAL' || newValue === 'HIGHER_THAN' || newValue === 'LESS_THAN' ) {

                // Append one number input
                block.updateShapeOneNumberInput_();

            } else if (newValue === 'MIN_LENGTH' || newValue === 'MAX_LENGTH' || newValue === 'MIN_WORD_LENGTH' || newValue === 'MAX_WORD_LENGTH' || newValue === 'MIN_CHOICE' || newValue === 'MAX_CHOICE') {

                // Append one number input with validator for integers only
                block.updateShapeOneNumberInputValidator_();

            } else if (newValue === 'BELONGS_RANGE') {

                // Append 2 number inputs, first value can't be bigger than second
                block.updateShapeBR_();

            } else if (newValue === 'HAS_CHARACTER') {

                // Append text input with validation for 1 character only
                block.updateShapeHC_();

            } else if (newValue === 'HAS_WORD') {

                // Append text input with validation for 1 word only
                block.updateShapeHW_();

            } else if (newValue === 'REG_EXPRESSION') {

                // Append text input - if possible verify if reg expression is well formed
                block.updateShapeRE_();

            } else if (newValue === 'CUSTOM_VALIDATION') {

                // Append text input
                block.updateShapeCV_();

            } else if (newValue === 'BEFORE_DATE' || newValue === 'AFTER_DATE') {

                // Append input to select the date which is supposed to be the min/max limit
                block.updateShapeBeforeAfterDate_();

            } else if (newValue === 'BEFORE_TIME' || newValue === 'AFTER_TIME') {

                // Append input to select the date which is supposed to be the min/max limit
                block.updateShapeBeforeAfterTime_();

            }
        },

        updateShapeOneNumberInput_: function() {

            this.getInput('first_part_block')
                .appendField(new Blockly.FieldNumber(1), 'term1')

        },

        updateShapeOneNumberInputValidator_: function() {

            // Set fields as invisible as they don't apply here
            this.getField('negation_text_field').setVisible(false);
            this.getField('negation').setVisible(false);
            this.setFieldValue(false,'negation');

            this.getInput('first_part_block')
                // FieldNumber(opt_value, opt_min, opt_max, opt_precision, opt_validator)
                // Precision on 1 means only integers, but it rounds up, we use validator that highlights when value is prohibited
                .appendField(new Blockly.FieldNumber(1,1,null,null, integerValidator_), 'term1');

            // Validate FieldNumber changes for integers only, otherwise reverts to old value
            function integerValidator_(newValue) {
                newValue = Number(newValue);
                if (Number.isInteger(newValue)) {
                    return newValue;
                } else {
                    return null;
                }
            }

        },

        updateShapeBR_: function() {

            this.getInput('first_part_block')
                .appendField(new Blockly.FieldNumber(1,null,null,null,firstInputValidator), 'term1')
                .appendField(translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.EXTRA-FIELDS.BELONGS-RANGE-TO'), 'extraField1')
                .appendField(new Blockly.FieldNumber(2), 'term2');

            // Verifies if min is greater than max, if is fixes the max
            function firstInputValidator(newValue) {
                let block = this.sourceBlock_;
                fixMaxIfMinBigger(newValue, block.getField('term2'));
                return newValue;
            }
        },

        updateShapeHC_: function() {

            this.getInput('first_part_block')
                .appendField('"', 'extraField1')
                .appendField(new Blockly.FieldTextInput(
                    translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.VALIDATOR-WARNING.HAS-CHARACTER')
                ), 'term1')
                .appendField('"  ' + translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.EXTRA-FIELDS.MATCH-CASE') + ':', 'extraField2')
                .appendField(new Blockly.FieldCheckbox(false), 'term2')

            this.getField('term1').setValidator(validateHasOneCharacter);

            // Checks if text input has only 1 character, if not returns to old value
            function validateHasOneCharacter(newValue) {
                if (newValue.length > 1) {
                    return null;
                } else {
                    return newValue;
                }
            }


        },

        updateShapeHW_: function() {

            this.getInput('first_part_block')
                .appendField('"', 'extraField1')
                .appendField(new Blockly.FieldTextInput(
                    translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.VALIDATOR-WARNING.HAS-WORD')
                ), 'term1')
                .appendField('"  ' + translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.EXTRA-FIELDS.MATCH-CASE') + ':', 'extraField2')
                .appendField(new Blockly.FieldCheckbox(false), 'term2')

            this.getField('term1').setValidator(validateHasOneWord);

            // Checks if text input has only 1 word, if not returns to old value
            function validateHasOneWord(newValue) {
                let nrOfWords = newValue.split(' ').length;
                if (nrOfWords > 1) {
                    return null;
                } else {
                    return newValue;
                }
            }

        },

        updateShapeRE_: function() {

            this.getInput('first_part_block')
                .appendField('"', 'extraField1')
                .appendField(new Blockly.FieldTextInput(
                    translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.VALIDATOR-WARNING.REGULAR-EXPRESSION')
                ), 'term1')
                .appendField('"', 'extraField2');

            this.getField('term1').setValidator(validateRegularExpression);

            // Check if inserted regular expression is valid, if not returns to old value
            function validateRegularExpression(newValue) {
                let isValid;
                // Check if inserted regular expression is valid
                try {
                    const regExpressionFormat = newValue.match(/^([/~@;%#'])(.*?)\1([gimsuy]*)$/);
                    isValid = regExpressionFormat ? !!new RegExp(regExpressionFormat[2], regExpressionFormat[3]) : false;
                } catch (e) {
                    isValid = false
                }
                return isValid ? newValue : null;
            }

        },

        updateShapeCV_: function() {

            // Set fields as invisible as they don't apply here
            this.getField('negation_text_field').setVisible(false);
            this.getField('negation').setVisible(false);
            this.setFieldValue(false,'negation');

            this.getInput('first_part_block')
                .appendField('"', 'extraField1')
                .appendField(new Blockly.FieldTextInput(
                    translate.instant('BLOCKLY-BLOCKS.CONDITION-VALIDATION-CONDITION.VALIDATOR-WARNING.CUSTOM-VALIDATION')
                ), 'term1')
                .appendField('"', 'extraField2');

        },

        updateShapeBeforeAfterDate_: function() {

            // Set fields as invisible as they don't apply here
            this.getField('negation_text_field').setVisible(false);
            this.getField('negation').setVisible(false);
            this.setFieldValue(false,'negation');

            this.getInput('first_part_block')
                .appendField(new Blockly.FieldDropdown(getDatePropertiesForValidationCondition), 'term1');

        },

        updateShapeBeforeAfterTime_: function() {

            // Set fields as invisible as they don't apply here
            this.getField('negation_text_field').setVisible(false);
            this.getField('negation').setVisible(false);
            this.setFieldValue(false,'negation');

            this.getInput('first_part_block')
                .appendField(new Blockly.FieldDropdown(getTimePropertiesForValidationCondition), 'term1');

        },


        removeExtraFieldsFirstPartBlock_: function () {

            // If there are optional inputs, it removes them before updating shape
            let has1stTerm = this.getField('term1');
            let has2ndTerm = this.getField('term2');
            let hasExtraField1 = this.getField('extraField1');
            let hasExtraField2 = this.getField('extraField2');

            if (has1stTerm) {
                this.getInput('first_part_block').removeField('term1');
            }
            if (has2ndTerm) {
                this.getInput('first_part_block').removeField('term2');
            }
            if (hasExtraField1) {
                this.getInput('first_part_block').removeField('extraField1');
            }
            if (hasExtraField2) {
                this.getInput('first_part_block').removeField('extraField2');
            }
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            let dropdown_choice = this.getField('dropdown_choice').value_;
            let coExisting = (this.getFieldValue('choice_template') === 'EXISTING');
            container.setAttribute('dropdownChoice', dropdown_choice);
            container.setAttribute('valueType',this.valueType);
            container.setAttribute('multiple_values',this.multipleValues);
            container.setAttribute('co_existing', coExisting);
            return container;
        },

        domToMutation: function (xmlElement) {
            const choice = xmlElement.getAttribute('dropdownchoice') ?? null;
            let valueType = xmlElement.getAttribute('valuetype') === 'null' ? null : xmlElement.getAttribute('valuetype');
            let multipleValues = xmlElement.getAttribute('multiple_values') === 'true';
            this.updateShape_(this, choice);
            this.getPossibleValidations_(valueType, multipleValues, choice, true);
            if (xmlElement.getAttribute('co_existing') === 'true') {
                this.updateShapeUO(this, 'EXISTING');
            }
        }
    };

// -----------------------------------
// Block: "property_filter"
// -----------------------------------

    Blockly.Blocks['property_filter'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY-REF-FILTER.TITLE'), 'blockTitle'));
            this.appendStatementInput('filters')
                .setCheck('filter_property_filter');
            this.setOutput(true,'property_filter');
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };

// -----------------------------------
// Block: "filter_property_filter"
// -----------------------------------

    Blockly.Blocks['filter_property_filter'] = {

        init: function() {

            let operatorDropdown = new Blockly.FieldDropdown([
                ["==", "=="],
                ["!=", "!="],
                ["<", "<"],
                [">", ">"]
            ]);

            this.appendDummyInput('filter_property_filter_title')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.FILTER-PROPERTY-REF-FILTER.TITLE'), 'blockTitle'));
            this.appendEndRowInput('filter_property_filter_end_first_row');
            this.appendValueInput('filtered_property')
                .setCheck(['filter_referenced_property_select']);
            this.appendDummyInput('filter_property_filter_operator')
                .appendField(operatorDropdown, 'filter_operator');
            this.appendValueInput('property_filter_second_input')
                .setCheck(['constant','value','property_single','property_value','query','compute_expression', 'user_role']);
            this.setInputsInline(true);
            this.setPreviousStatement(true, 'filter_property_filter');
            this.setNextStatement(true, ['filter_property_filter']);
            this.setColour(40);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setOnChange(this.handleChange_);
        },

        handleChange_: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            const filterPropertyInputBlocks = ['filter_referenced_property_select','constant','value','property_single',
                'property_value','query','compute_expression', 'user_role'];
            // Check for valueType compatibility when blocks are attached to this filter inputs or when they are detached/deleted,
            // or when the attached block's fields change (ex: chosen property changes / value's value type changes)
            // Also, when block is duplicated, keep the warning in case it had one
            if ((changeEvent.type === 'move' && filterPropertyInputBlocks.includes(blockType)) ||
                (changeEvent.type === 'delete' && filterPropertyInputBlocks.includes(changeEvent.oldJson.type)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && filterPropertyInputBlocks.includes(blockType)) ||
                (changeEvent.type === 'create' && changeEvent.blockId === this.id)
            ) {
                checkInputValueTypeCompatibility(this, 'filtered_property',
                    'property_filter_second_input');
            }
        },
    };

    // ---------------------------
    // Block: "filter_referenced_property_select"
    // ---------------------------

    Blockly.Blocks['filter_referenced_property_select'] = {
        propertyID: null,
        valueType: null,

        init: function() {
            this.appendDummyInput('property')
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'filter_referenced_property');
            this.getField('filter_referenced_property').setValidator(this.valueTypeValidator);
            this.setOnChange(this.getPropertiesFromReferencedPropertyEntity);
            this.setInputsInline(false);
            this.setOutput(true, 'filter_referenced_property_select');
            this.setColour(40);
            this.setTooltip('');
            this.setHelpUrl('');
            // So that the user can't open the menu option when right-clicking the mouse
            this.contextMenu = false;
            // So that the user can't move the block on its own / Detach it from the parent
            this.setMovable(false);
            // So that the user can't delete the block on its own
            this.setDeletable(false);
        },

        valueTypeValidator: function (propertyId) {
            const block = this.sourceBlock_;
            block.valueType = properties.find((property) => property.id === Number(propertyId))?.value_type;
        },

        getPropertiesFromReferencedPropertyEntity: function (changeEvent) {
            const automaticallyAttachedToBlocks = ['filter_property_filter'];
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            if((changeEvent.type === 'move' && (changeEvent.blockId === this.id || automaticallyAttachedToBlocks.includes(blockType)) && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'user_input_property')||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'parameter_local_endpoint_property')) {
                let parentBlock = this.parentBlock_;
                let foundPropertyBlock = false;
                let propertyId = null;
                const expectedParentTypes = ['property', 'property_simplified', 'form_property_output', 'parameter_local_endpoint_call'];
                while (parentBlock && !foundPropertyBlock) {
                    // Check if block is inside the expected parent block and get its corresponding property
                    if (expectedParentTypes.includes(parentBlock.type)) {
                        propertyId = parentBlock.type === 'parameter_local_endpoint_call' ? Number(parentBlock.getFieldValue('parameter_local_endpoint_property')) :
                            Number(parentBlock.getFieldValue('user_input_property'));
                        if (propertyId !== this.propertyID) {
                            if (Number(propertyId)) {
                                this.propertyID = Number(propertyId);
                                setReferencedPropertyEntityProperties(this, 'filter_referenced_property');
                            } else {
                                this.propertyID = null;
                            }
                        }
                        foundPropertyBlock = true;
                    } else {
                        parentBlock = parentBlock.parentBlock_;
                    }
                }
                if (!foundPropertyBlock) {
                    // Reset dropdown
                    this.propertyID = null;
                    this.valueType = null;
                    setEmptyDropdown(this, 'filter_referenced_property');
                }
                resetDropdownChoiceIfNoLongerAvailable(this, 'filter_referenced_property');
            }
        },

        mutationToDom: function() {
            let container = document.createElement('mutation');
            container.setAttribute('property_id',this.propertyID);
            container.setAttribute('value_type',this.valueType);
            return container;
        },

        domToMutation: function(xmlElement) {
            this.propertyID = Number(xmlElement.getAttribute('property_id'));
            this.valueType = xmlElement.getAttribute('value_type');
            if (Number(this.propertyID)) {
                setReferencedPropertyEntityProperties(this, 'filter_referenced_property');
            }
        }
    };

// ---------------------------------------------------
// Block: "ent type form"
// ---------------------------------------------------
    Blockly.Blocks['ent_type_form'] = {
        hasProps: false,
        editablePropsOnly: false,
        // Connection Types, can attach 0: no next connection,  1: 'property' & 'ent type form' blocks, 2: 'property_simplified' & 'ent type form' blocks.
        nextConnectionType: 0,
        entType: 'NONE',
        relatedToEntType: 'NONE',

        init: function () {

            this.appendDummyInput('blockFields')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.ENT-TYPE-FORM.TITLE'), 'blockTitle'))
                .appendField(new Blockly.FieldDropdown(getHasManyEntTypes()), 'ent_type_form_ent_type')
            this.getField('ent_type_form_ent_type').setValidator(this.validateEntType)
            this.setInputsInline(false);
            this.setOnChange(this.handleChange);
            this.setColour(270);
            this.setPreviousStatement(true, 'ent_type_form');
            this.setNextStatement(false);
        },

        validateEntType: function(entType) {
            this.sourceBlock_.entType = entType;
        },

        handleChange: function (changeEvent) {

            // Update dropdown when this block has a newParent(action block) or stops having one
            // OR when the entType in the action block [user input single entType] changes
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'user_input_single_ent_type')||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'edit_entity_instance_ent_type') ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'ent_type_form_ent_type')) {

                let parent = this.parentBlock_;
                let foundActionParent_ = false;

                let changeEventBlock = workspace.getBlockById(changeEvent.blockId);

                // Verifies if the block is inside an 'action' block, and searches for its ent type to get its properties
                while (parent && !foundActionParent_) {
                    if (parent.type === 'action') {
                        this.updateEntTypeFormBlockDropdown(changeEventBlock, parent);
                        foundActionParent_ = true;
                    } else {
                        parent = parent.parentBlock_;
                    }
                }
                // If 'ent_type_form' block isn't attached to any input - reset flags.
                if (!parent || !foundActionParent_) {
                    this.editablePropsOnly = false;
                    this.nextConnectionType = 0;
                    this.relatedToEntType = 'NONE';
                }
                // If 'ent_type_form' block is removed from an action block 'properties' input - reset the 'ent_type_form' block
                if (changeEvent.oldParentId && !changeEvent.newParentId && !foundActionParent_) {
                    this.entType = 'NONE';
                    this.relatedToEntType = 'NONE';
                    this.getField('ent_type_form_ent_type').menuGenerator_ = getHasManyEntTypes();
                    setNoneOptionDropdown(this, 'ent_type_form_ent_type');
                }
                // Update block according to its flags and entType.
                this.getPropertiesFromEntType();
                // Update nextConnection [flag noNextConnection]
                this.updateNextConnection();
            }
        },

        updateNextConnection: function() {
            // Connection Types: Can attach 0: no next connection, 1: 'property_simplified' & 'ent type form' blocks,
            // 2: 'property' & 'ent type form' blocks.
            if (!this.nextConnectionType) {
                unplugChildBlocks(this);
                this.setNextStatement(false);
            } else if (this.nextConnectionType === 1) {
                this.setNextStatement(true, ['property_simplified', 'ent_type_form']);
            } else if (this.nextConnectionType === 2) {
                this.setNextStatement(true, ['property', 'ent_type_form']);
            }
        },

        updateEntTypeFormBlockDropdown: function(changeEventBlock, parent) {
            const actionType = parent.getFieldValue('action_dropdown');

            if (actionType === 'EDIT_ENTITY_INSTANCE' || actionType === 'USER_INPUT_SINGLE_ENT_TYPE') {
                const parentEntType = actionType === 'EDIT_ENTITY_INSTANCE' ? parent.getFieldValue('edit_entity_instance_ent_type') :
                    parent.getFieldValue('user_input_single_ent_type');
                // If the block has an entType selected when moved, reset it.
                // If the block doesn't have an entType selected when moved, but the parent action block does,
                // get the possible ent types that this block may contain
                this.getField('ent_type_form_ent_type').menuGenerator_ = getRelatedEntTypes(parentEntType);
                if (parentEntType !== 'NONE' && entTypes.find(entType => entType.id === Number(parentEntType)).has_many) {
                    this.setFieldValue(parentEntType, 'ent_type_form_ent_type');
                    // Don't allow blocks to connect to the bottom part of this block, as all props for the selected entType are already inside it.
                    this.nextConnectionType = 0;
                } else {
                    // Reset the selected entType if it's no longer in the dropdown, so that an entType doesn't stay selected if it is no longer part of the dropdown options
                    resetDropdownChoiceIfNoLongerAvailable(this, 'ent_type_form_ent_type');
                    this.nextConnectionType = 1;
                }
                this.relatedToEntType = parentEntType;
            } else if (actionType === 'USER_INPUT_MULT_ENT_TYPES') {
                this.nextConnectionType = 2;
            }
            // If it's an 'edit entity instance' action, show only editable properties
            this.editablePropsOnly = actionType === 'EDIT_ENTITY_INSTANCE';
        },

        getPropertiesFromEntType: function() {
            this.resetPropertiesInput();

            if (this.entType !== 'NONE') {
                // Append statementInput so that all entType properties are inserted in it
                this.appendStatementInput('properties')
                    .appendField(translate.instant('BLOCKLY-BLOCKS.ENT-TYPE-FORM.PROPERTIES') + ' :')
                    .setCheck('ent_type_form_automatic_property_block');
            }

            if (this.entType !== 'NONE' && !this.hasProps) {

                let entTypeProperties = this.editablePropsOnly ?
                    properties.filter((property) => property.ent_type_id === Number(this.entType) && (property.editable || property.part_of)) :
                    properties.filter((property) => property.ent_type_id === Number(this.entType));
                // So we insert 'part_of' property first and then order the properties by id
                entTypeProperties.sort(function (a, b) {
                    return (a.part_of > b.part_of) ? -1 : a.id < b.id  ? 1 : 0;
                });
                // Last property block -> will have no nextConnection
                const lastPropertyId = entTypeProperties[entTypeProperties.length - 1].id;
                // Connection to connect the next 'property simplified' block
                let connection = this.getInput('properties').connection;
                for (const property of entTypeProperties) {
                    // Create new 'property simplified' block for each entType's property
                    const propertySimplifiedBlock = createNewChildBlock_('property_simplified', false);
                    // So that user can't insert other 'property_simplified' blocks inside the 'ent type form' block - 'properties' input.
                    // Only the blocks created & inserted automatically are accepted in the 'properties' input.
                    // The only blocks to be accepted in the bottom connection of this 'property simplified' block are the blocks automatically created in the 'ent type form' block
                    propertySimplifiedBlock.setPreviousStatement(true, 'ent_type_form_automatic_property_block');
                    propertySimplifiedBlock.setNextStatement(true, 'ent_type_form_automatic_property_block');
                    // Get the 'property simplified' options for the 'properties' dropdown
                    propertySimplifiedBlock.entType = this.entType;
                    setProperties(propertySimplifiedBlock, this.entType, 'user_input_property');
                    // Set the field's value as the current entType property
                    propertySimplifiedBlock.setFieldValue(property.id.toString(),'user_input_property')
                    // Connect the new block the properties input / previous property
                    connection.connect(propertySimplifiedBlock.previousConnection);
                    // So that the next entType's property connects to the current one
                    connection = propertySimplifiedBlock.nextConnection;
                    // Make this 'property_simplified' block unchangeable so that the user can't alter certain things without altering the ent type form block
                    makePropertySimplifiedBlockUnchangeable(propertySimplifiedBlock, property.id);
                    propertySimplifiedBlock.unchangeable = true;
                    propertySimplifiedBlock.editablePropsOnly = this.editablePropsOnly;
                    // Remove nextConnection from the last property block inside 'ent type form' block, as there will be no more properties
                    if (property.id === lastPropertyId) {
                        propertySimplifiedBlock.setNextStatement(false);
                        propertySimplifiedBlock.noNextConnection = true;
                    }
                }
                this.hasProps = true;
            }
        },

        resetPropertiesInput: function() {
            if  (this.getInput('properties')) {
                // Delete the attached 'property simplified' blocks
                this.getInput('properties').connection.targetConnection?.sourceBlock_.dispose(false);
                this.hasProps = false;
                this.removeInput('properties');
            }
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('ent_type', this.entType);
            container.setAttribute('has_props', this.hasProps);
            container.setAttribute('next_connection_type', this.nextConnectionType);
            container.setAttribute('editable_props_only', this.editablePropsOnly);
            container.setAttribute('related_to_ent_type', this.relatedToEntType);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.entType = xmlElement.getAttribute('ent_type');
            this.relatedToEntType = xmlElement.getAttribute('related_to_ent_type');
            this.hasProps = xmlElement.getAttribute('has_props') === 'true';
            this.nextConnectionType = Number(xmlElement.getAttribute('next_connection_type'));
            this.editablePropsOnly = xmlElement.getAttribute('editable_props_only') === 'true';
            // Update nextConnection depending on the next connection type saved.
            this.updateNextConnection();
            // Update options dropdown to only contain entTypes that make sense depending on the parent action's entType.
            if (this.relatedToEntType !== 'NONE') {
                this.getField('ent_type_form_ent_type').menuGenerator_  = getRelatedEntTypes(this.relatedToEntType);
            }
            // Update block to show properties input and the respective property_simplified blocks inside of that input.
            if (this.hasProps) {
                this.getPropertiesFromEntType();
            }
        }

    };


// -------------------------------------------------------------------------
// --------------------------- CATEGORY: PROPERTY --------------------------

// ---------------------------
// Block: "property_single"
// ---------------------------

    Blockly.Blocks['property_single'] = {
        entType: null,
        valueType: null,
        multipleValues: null,
        onlyPropertiesInsideCurrentForm: false,
        numericPropertiesOnly: false,
        numericTimePropertiesOnly: false,
        numericDateTimePropertiesOnly: false,
        referencePropertiesOnly: false,
        superiorParentBlock: null,
        propertiesInsideCurrentForm: [],

        init: function () {

            this.appendDummyInput('title')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.TITLE'), 'blockTitle'));
            this.appendDummyInput('ddEntTypes')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.ENT-TYPE') + ':'))
                .appendField(new Blockly.FieldDropdown(getEntTypesThatArentHasMany), 'property_output_ent_type')
                .appendField(' ');
            this.appendDummyInput('ddProperties')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.PROPERTY') + ':'))
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'property_output');
            this.appendDummyInput('ddEntityScope')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.ENTITY-SCOPE.LABEL') + ':'))
                .appendField(new Blockly.FieldDropdown([
                    [translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.ENTITY-SCOPE.CURRENT-PROCESS'), 'CURRENT_PROCESS'],
                    [translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.ENTITY-SCOPE.SPECIFIC-ENTITY'), 'SPECIFIC_ENTITY'],
                ],  this.entityScopeValidator), 'property_single_entity_scope')
            this.appendDummyInput('valueType').setVisible(false);
            this.getField('property_output').setValidator(function (input) {
                // Get the current block
                let block = this.sourceBlock_;
                // Check if block has value type input, if so remove it. Then add the new property's value type field
                let valueTypeInput = block.getInput('valueType');
                valueTypeInput.removeField('valueTypeField', true);
                valueTypeInput.setVisible(false);
                addValueTypeField(block, input);
            });
            this.setInputsInline(false);
            this.setOutput(true, 'property_single');
            this.setColour(50);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setOnChange(this.restrictProperties);
        },

        entityScopeValidator(newValue) {
            // Remove inputs to then add them according to choice
            let block = this.sourceBlock_;
            block.removeInput('ddEntityScope');
            // Update shape depending on entity scope dropdown choice
            switch (newValue) {
                case 'CURRENT_PROCESS':
                    // In case user wants to get the property value from the current process
                    block.updateShapeValueFromCurrentProcess_();
                    break;
                case 'SPECIFIC_ENTITY':
                    // In case user wants to use a specific instance to search for property value
                    block.updateShapeValueFromSpecificEntity_();
                    break;
                default:
                //code block
            }
        },

        updateShapeValueFromCurrentProcess_() {
            // Remove the valueInput and insert a dummyInput with the same options and same name
            // There's no way of transforming inputTypes, so we must remove it and add new one
            this.appendDummyInput('ddEntityScope')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.ENTITY-SCOPE.LABEL') + ':'))
                .appendField(new Blockly.FieldDropdown([
                    [translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.ENTITY-SCOPE.CURRENT-PROCESS'), 'CURRENT_PROCESS'],
                    [translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.ENTITY-SCOPE.SPECIFIC-ENTITY'), 'SPECIFIC_ENTITY'],
                ],  this.entityScopeValidator), 'property_single_entity_scope')
            this.moveInputBefore('ddEntityScope', 'valueType');
        },

        updateShapeValueFromSpecificEntity_() {
            // Remove the dummyInput and insert a valueInput with the same options and same name
            // There's no way of transforming inputTypes, so we must remove it and add new one to specify entity
            this.appendValueInput('ddEntityScope')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.ENTITY-SCOPE.LABEL') + ':'))
                .appendField(new Blockly.FieldDropdown([
                    [translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.ENTITY-SCOPE.SPECIFIC-ENTITY'), 'SPECIFIC_ENTITY'],
                    [translate.instant('BLOCKLY-BLOCKS.PROPERTY-SINGLE.ENTITY-SCOPE.CURRENT-PROCESS'), 'CURRENT_PROCESS'],
                ],  this.entityScopeValidator), 'property_single_entity_scope')
                .setCheck(['get_context_variable']);
            this.moveInputBefore('ddEntityScope', 'valueType');
        },

        restrictProperties: function(changeEvent) {
            // Adjust the properties to be present in the dropdown depending on the parent type
            // When this block is moved (into another block or detached from it), when a
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'user_input_property') ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'choice_operator' && this.parentBlock_?.id === changeEvent.blockId) ||
                (changeEvent.blockId === this.id && changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'property_output_ent_type') ||
                ((changeEvent.type === 'delete' && (changeEvent.oldJson.type === 'property' || changeEvent.oldJson.type === 'property_simplified')))
            ) {
                let parent = this.parentBlock_;
                this.onlyPropertiesInsideCurrentForm = false;
                this.numericPropertiesOnly = false;
                this.numericTimePropertiesOnly = false;
                this.numericDateTimePropertiesOnly = false;
                this.referencePropertiesOnly = false;
                this.propertiesInsideCurrentForm = [];
                this.entType = this.getFieldValue('property_output_ent_type');
                // Verifies if the block is part of an 'enable_condition' or/and a 'form calculation'/'compute_expression' block.
                // Searches while we have superiorBlocks left and haven't found an 'enable condition' and 'form calculation'/'compute_expression' block
                // [as it can be a 'compute expression' inside an 'enable condition' - in which case the both dictate the restrictions]
                while (parent && !(this.onlyPropertiesInsideCurrentForm && this.numericPropertiesOnly)) {
                    if (parent.type === 'enable_condition') {
                        this.superiorParentBlock = parent.id;
                        this.onlyPropertiesInsideCurrentForm = true;
                    } else if (parent.type === 'compute_expression') {
                        if (parent.getFieldValue('choice_operator') === 'MINUS') {
                            // When we have the 'minus' operator, we can have operations involving date/times also
                            this.numericDateTimePropertiesOnly = true;
                        } else if (parent.getFieldValue('choice_operator') === 'DIVIDE') {
                            // When we have the 'divide' operator, we can have operations involving times also
                            this.numericTimePropertiesOnly = true;
                        } else {
                            this.numericPropertiesOnly = true;
                        }
                    } else if (parent.type === 'form_calculation') {
                        this.superiorParentBlock = parent.id;
                        this.onlyPropertiesInsideCurrentForm = true;
                        this.numericPropertiesOnly = true;
                    } else if (parent.type === 'entity_filters') {
                        this.referencePropertiesOnly = true;
                    }
                    parent = parent.parentBlock_;
                }
                // Get the properties to be presented in the dropdown depending on the current block's context
                this.getPropertiesToDisplayOnDropdown();
                resetDropdownChoiceIfNoLongerAvailable(this, 'property_output');
            }
        },

        getPropertiesToDisplayOnDropdown: function() {
            if (this.onlyPropertiesInsideCurrentForm) {
                this.restrictPropertiesInsideCurrentForm();
            } else if (this.numericPropertiesOnly) {
                setNumericProperties(this, this.entType, 'property_output');
            } else if (this.numericTimePropertiesOnly) {
                setNumericTimeProperties(this, this.entType, 'property_output');
            } else if (this.numericDateTimePropertiesOnly) {
                setNumericDateTimeProperties(this, this.entType, 'property_output');
            } else if (this.referencePropertiesOnly) {
                setReferenceProperties(this, this.entType, 'property_output');
            } else {
                setProperties(this, this.entType, 'property_output');
            }
        },

        restrictPropertiesInsideCurrentFormFromDomToMutation: function() {
            // When coming from dTm, we don't have the parent(superior blocks) when this block is being loaded, so the validProperties are loaded from the saved data
            // The validProperties refer to the restriction when onlyPropertiesInsideCurrentForm - properties specified in the current form/'user input' action
            const validProperties = this.propertiesInsideCurrentForm;
            // Get all the properties in the dropdown format so that we then filter them depending on the block's context
            setProperties(this, this.entType, 'property_output');
            const propertyDropdownOptions = this.getField('property_output').getOptions();
            if (this.numericPropertiesOnly) {
                // Only display the numeric properties (int/double value type) in the property dropdown that are inside the 'user input action'.
                this.getField('property_output').menuGenerator_ = propertyDropdownOptions.filter((propDropdown) => {
                    const propertyValueType = properties.find((prop) => prop.id === Number(propDropdown[1]))?.value_type;
                    return ((propertyValueType === 'int' || propertyValueType === 'double') &&
                        validProperties.includes(propDropdown[1])) || propDropdown[1] === 'NONE';
                });
            } else {
                // Only display the properties in the property dropdown that are inside the 'user input action'.
                this.getField('property_output').menuGenerator_ = propertyDropdownOptions.filter((property) => {
                    return validProperties.includes(property[1]) || property[1] === 'NONE';
                });
            }
        },

        // Semantic Validation - Enable Conditions/Form Calculation can only be dependent on properties that are specified inside the same 'user input action'/form
        restrictPropertiesInsideCurrentForm: function() {
            const superiorParentBlock = workspace.getBlockById(this.superiorParentBlock);
            let parent = superiorParentBlock.parentBlock_;
            let userInputActionBlock = null;
            let currentUserInputProperty = null;

            // Update the property block dropdown options, so that if we recently added a property to the form, it is added to the filtered list available in this block.
            // Otherwise, the filtered list would only have the current form's properties. When added another, the .filter function wouldn't add it to the options as it wouldn't be in the propertyDropdownOptions.
            setProperties(this, this.entType, 'property_output');

            // If it's inside an enable condition/form_calculation, get the superior 'user input action' block
            if (superiorParentBlock && parent) {
                if (superiorParentBlock.type === 'enable_condition') {
                    // Get the property belonging to the form where this 'enable condition' is inserted
                    currentUserInputProperty = parent.getFieldValue('user_input_property');
                } else if (superiorParentBlock.type === 'form_calculation') {
                    // Get the property belonging to the form where this 'form calculation' is inserted - remember form_calculation blocks can be nested
                    while (parent && !currentUserInputProperty) {
                        if (parent.type === 'property' || parent.type === 'property_simplified') {
                            currentUserInputProperty = parent.getFieldValue('user_input_property');
                        } else {
                            parent = parent.parentBlock_;
                        }
                    }
                }
                // Get the 'user input action' block, even if the enable_condition isn't inside the first property of this user_input
                while (parent && !userInputActionBlock) {
                    if (parent.type === 'action') {
                        // Means we found the 'user input' action parent block
                        userInputActionBlock = parent;
                    }
                    parent = parent.parentBlock_;
                }
            }

            // As it is inside an enable condition/form calculation and we've found the superior 'user input' action block
            // Get the property that contains it and the rest of the properties inserted into the 'user input' action block
            if (userInputActionBlock) {
                let firstFormProperty = userInputActionBlock.getFieldValue('action_dropdown') === 'EDIT_ENTITY_INSTANCE' ?
                    userInputActionBlock.childBlocks_[1] : userInputActionBlock.childBlocks_[0];
                const firstFormPropertyValue = firstFormProperty.getFieldValue('user_input_property');
                // We will save every property inserted into the 'user input' action block, except the property that contains the enable condition/form calculation
                // Because a certain field can't depend (enable condition/form calculation) on itself
                if (firstFormPropertyValue !== currentUserInputProperty) {
                    this.propertiesInsideCurrentForm.push(firstFormPropertyValue);
                }
                // Get the second property inside the 'user input' action block
                let nextFormPropertyBlock = firstFormProperty.nextConnection?.targetConnection?.sourceBlock_;
                while (nextFormPropertyBlock) {
                    const nextFormPropertyValue = nextFormPropertyBlock.getFieldValue('user_input_property');
                    if (nextFormPropertyValue !== currentUserInputProperty) {
                        this.propertiesInsideCurrentForm.push(nextFormPropertyValue);
                    }
                    // Get the next property inside the 'user input' action block
                    nextFormPropertyBlock = nextFormPropertyBlock.nextConnection.targetConnection?.sourceBlock_;
                }
                const propertyDropdownOptions = this.getField('property_output').getOptions();
                if (this.numericPropertiesOnly) {
                    // Only display the numeric properties (int/double value type) in the property dropdown that are inside the 'user input action'.
                    this.getField('property_output').menuGenerator_ = propertyDropdownOptions.filter((propDropdown) => {
                        const propertyValueType = properties.find((prop) => prop.id === Number(propDropdown[1]))?.value_type;
                        return ((propertyValueType === 'int' || propertyValueType === 'double') &&
                            this.propertiesInsideCurrentForm.includes(propDropdown[1])) || propDropdown[1] === 'NONE';
                    })
                } else {
                    // Only display the properties in the property dropdown that are inside the 'user input action'.
                    this.getField('property_output').menuGenerator_ = propertyDropdownOptions.filter((property) => {
                        return this.propertiesInsideCurrentForm.includes(property[1]) || property[1] === 'NONE';
                    });
                }
            }
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('ent_type_id', this.entType);
            container.setAttribute('property_id', this.getFieldValue('property_output'));
            container.setAttribute('inside_enable_condition', this.onlyPropertiesInsideCurrentForm);
            container.setAttribute('numeric_properties_only', this.numericPropertiesOnly);
            container.setAttribute('numeric_time_properties_only', this.numericTimePropertiesOnly);
            container.setAttribute('numeric_date_time_properties_only', this.numericDateTimePropertiesOnly);
            container.setAttribute('reference_properties_only', this.referencePropertiesOnly);
            container.setAttribute('dropdown_properties_enable_condition', this.propertiesInsideCurrentForm);
            return container;
        },

        domToMutation: function (xmlElement) {
            addValueTypeField(this, Number(xmlElement.getAttribute('property_id')));
            this.entType = Number(xmlElement.getAttribute('ent_type_id'));
            this.propertiesInsideCurrentForm = xmlElement.getAttribute('dropdown_properties_enable_condition')?.split(',')
                .filter((property) => property !== '') ;
            this.onlyPropertiesInsideCurrentForm = xmlElement.getAttribute('inside_enable_condition') === 'true';
            this.numericPropertiesOnly = xmlElement.getAttribute('numeric_properties_only') === 'true';
            this.numericTimePropertiesOnly = xmlElement.getAttribute('numeric_time_properties_only') === 'true';
            this.numericDateTimePropertiesOnly = xmlElement.getAttribute('numeric_date_time_properties_only') === 'true';
            this.referencePropertiesOnly = xmlElement.getAttribute('reference_properties_only') === 'true';
            if (this.onlyPropertiesInsideCurrentForm) {
                this.restrictPropertiesInsideCurrentFormFromDomToMutation();
            } else {
                this.getPropertiesToDisplayOnDropdown();
            }
        }
    };

// ---------------------------
// Block: "property_value"
// ---------------------------

    Blockly.Blocks['property_value'] = {
        propertyID: null,
        valueType: 'property_value',

        init: function() {
            this.appendDummyInput('dummyPropertyValue')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY-VALUE.WARNING')));
            this.appendDummyInput('property_values')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.PROPERTY-VALUE.TITLE'),'blockTitle'))
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'property_values');
            this.setOnChange(this.getPropertyValuesFromLeftBlock);
            this.setInputsInline(false);
            this.setOutput(true, 'property_value');
            this.setColour(50);
            this.setTooltip('');
            this.setHelpUrl('');
        },

        getPropertyValuesFromLeftBlock: function (changeEvent) {
            const propertyValueParentBlockTypes = ['comp_evaluated_expression', 'action' , 'filter_property_filter', 'term_property', 'scheduling_additional_property'];
            const childPropertyBlockTypes = ['property_single', 'property_simplified_output', 'filter_referenced_property_select', 'get_context_variable', 'update_context_variable'];
            const childPropertyBlockFieldNames = ['property_output', 'property_simplified_output', 'filter_referenced_property', 'get_context_variable_dropdown', 'update_context_variable_dropdown', 'user_input_property'];
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            if( (changeEvent.type === 'move' && (blockType === 'property_single' || blockType === 'property_simplified_output' || blockType === 'form_property_output' || changeEvent.blockId === this.id) && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && childPropertyBlockFieldNames.includes(changeEvent.name))) {
                const parBlock = this.parentBlock_;
                let propertyId = null;
                // Check if left 'property_single' block has been removed from the common parent block
                const leftPropertyBlockMovedAway = changeEvent.oldParentId === parBlock?.id;
                if (parBlock && !leftPropertyBlockMovedAway) {
                    // Check if block is inside the expected parent block and get its corresponding left block's property
                    if (propertyValueParentBlockTypes.includes(parBlock.type)) {
                        for (const childBlock of parBlock.childBlocks_) {
                            if (childPropertyBlockTypes.includes(childBlock.type)) {
                                propertyId = this.getChildBlockPropertyId(childBlock);
                                if (propertyId !== this.propertyID) {
                                    this.propertyID = Number(propertyId) ? propertyId : null;
                                    if (this.propertyID) {
                                        setPropertyValues(this, 'property_values');
                                    } else {
                                        setEmptyDropdown(this, 'property_values')
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // Reset property_values dropdown
                    this.propertyID = null;
                    setEmptyDropdown(this, 'property_values')
                }
                resetDropdownChoiceIfNoLongerAvailable(this, 'property_values');
            }
        },

        getChildBlockPropertyId(block) {
            let fieldName = null;
            switch (block.type) {
                case 'property_single':
                    fieldName ='property_output';
                    break;
                case 'filter_referenced_property_select':
                    fieldName = 'filter_referenced_property';
                    break;
                case 'property_simplified_output':
                    fieldName = 'property_simplified_output';
                    break;
                case 'get_context_variable':
                    fieldName = 'get_context_variable_dropdown';
                    break;
                case 'update_context_variable':
                    fieldName = 'update_context_variable_dropdown';
                    break;
                default:
                    break;
            }
            // If the child block is related to context variables, we need to check if it's being assigned a property
            if (fieldName === 'get_context_variable_dropdown' || fieldName === 'update_context_variable_dropdown') {
                return this.getContextVariablePropertyValues(block, fieldName);
            }
            // Otherwise, if there's a propertyId, it will be directly in the child block
            return fieldName ? Number(block.getFieldValue(fieldName)) : null;
        },

        getContextVariablePropertyValues(block, fieldName) {
            let propertyId = null;
            // Get the context variable selected in the left-side block
            const contextVariableId = block.getFieldValue(fieldName);
            // Get the nearest 'assign expression' action block that contains a set/update context variable block with the selected context variable
            // We do double 'parentBlock' in case we're assigning a propertyValue to an 'assign expression: update context variable': in this case,
            // we want to check if there's a previous 'assign expression: set/update' that assigns a formPropertyOutput
            let parent = block.parentBlock_?.parentBlock_;
            let foundContextVariableParent_ = false;
            // Try to find the appropriate 'assign expression' action block containing this context variable
            while (parent && !foundContextVariableParent_) {
                if (parent.type === 'action' && parent.getFieldValue('action_dropdown') === 'ASSIGN_EXPRESSION') {
                    // When an 'assign expression' action block is found, check if it has the respective 'set'/'update' context variable block
                    if (parent.childBlocks_) {
                        // If it's a 'new' set context variable, check that child block's id [ as it can be the selected context variable]
                        // Otherwise, check the selected context variable in its dropdown
                        const hasSetUpdateContextVariableBlock = parent.childBlocks_.some( childBlock =>
                            childBlock.id === contextVariableId ||
                            childBlock.type === 'set_context_variable' &&  childBlock.getFieldValue('set_context_variable_dropdown') === contextVariableId ||
                            childBlock.type === 'update_context_variable' && childBlock.getFieldValue('update_context_variable_dropdown') === contextVariableId
                        );
                        // If we have found the appropriate 'set'/'update' context variable block, check if it has a 'form property output' assigned to it
                        if (hasSetUpdateContextVariableBlock) {
                            const hasFormPropertyOutputChild = parent.childBlocks_.find(childBlock => childBlock.type === 'form_property_output' );
                            // If it does, get the selected property on that block to then check if it has propertyValues
                            if (hasFormPropertyOutputChild && hasFormPropertyOutputChild.parentBlock_) {
                                propertyId = Number(hasFormPropertyOutputChild.getFieldValue('user_input_property'));
                            }
                            // As we have found it, even if it doesn't have a property assigned to it, no need to check for more
                            foundContextVariableParent_ = true;
                        }
                    }
                }
                // If we haven't found the desired blocks, keep looking through the action rule
                parent = parent.parentBlock_;
            }
            return propertyId;
        },

        mutationToDom: function() {
            let container = document.createElement('mutation');
            container.setAttribute('property_value_id', this.getFieldValue('property_values'));
            container.setAttribute('property_id',this.propertyID);
            return container;
        },

        domToMutation: function(xmlElement) {
            this.propertyID = Number(xmlElement.getAttribute('property_id'));
            if (Number(this.propertyID)) {
                setPropertyValues(this, 'property_values');
            }
        }
    };


// -------------------------------------------------------------------------
// --------- 'EDIT ENTITY INSTANCE ACTION' AUX BLOCKS ----------------------

// ---------------------------------------------------
// Block: "entity details" with mutator for selecting properties
// ---------------------------------------------------

    Blockly.Blocks['entity_details'] = {
        entTypeId: null,
        // Properties belonging to the current selected entType
        entityProperties: [],
        // entityProperties' checkbox values from the mutator dialog block
        propertyCheckboxValues: [],
        // properties' ids that have been selected in the mutator dialog block
        selectedPropDetails: [],

        init: function () {
            this.appendDummyInput('blockTitle')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.ENTITY-DETAILS.TITLE'), 'blockTitle'));
            this.setPreviousStatement(true, 'entity_details');
            this.setNextStatement(false);
            this.setOnChange(this.getParentCurrentEntType);
            this.contextMenu = false;
            this.setMovable(false);
            this.setDeletable(false);
            this.setTooltip(translate.instant('BLOCKLY-BLOCKS.ENTITY-DETAILS.TOOLTIP'))
            this.setInputsInline(false);
            this.setColour(340);
            this.jsonInit( {'mutator': 'entity_details_mutator'})
        },

        getParentCurrentEntType: function(changeEvent) {
            // Update dropdown when the entType in the action block [edit entity instance entType] changes
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'user_input_ent_type' && changeEvent.blockId === this.parentBlock_?.id) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'edit_entity_instance_ent_type' && changeEvent.blockId === this.parentBlock_?.id)) {
                // In 'edit entity instance' actions, we get the entTypeId from the parentActionBlock through its entTypes field.
                if (this.parentBlock_?.type === 'action') {
                    this.entTypeId = this.parentBlock_.getFieldValue('edit_entity_instance_ent_type');
                } else if (this.parentBlock_?.type === 'form_property_output') {
                    this.entTypeId = this.parentBlock_.getFieldValue('user_input_ent_type');
                } else {
                    this.entTypeId = null;
                }
                // Close the mutator dialog bubble if it is opened when the entType is changed
                // [so that we don't have the wrong properties displayed in the mutator dialog bubble]
                this.mutator.setVisible(false);
                // Update the block's property details
                this.updateShapeReset();
            }
        }
    };

    Blockly.Blocks['entity_details_mutator_block'] = {
        init: function() {
            this.setColour(340);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };

    const ENTITY_DETAILS_MUTATOR_MIXIN = {
        /**
         * Create XML to represent the number inputs.
         * @return {Element} XML storage element.
         * @this Blockly.Block
         */
        mutationToDom: function() {
            let container = document.createElement('mutation');
            container.setAttribute('ent_type_id', this.entTypeId);
            container.setAttribute('selected_properties', this.selectedPropDetails);
            return container;
        },
        /**
         * Parse XML to restore the inputs.
         * @param {!Element} xmlElement XML storage element.
         * @this Blockly.Block
         */
        domToMutation: function(xmlElement) {
            this.entTypeId = Number(xmlElement.getAttribute('ent_type_id'));
            this.selectedPropDetails = xmlElement.getAttribute('selected_properties')?.split(',')
                .filter((propDetail) => propDetail !== '') ;
            this.updateShapeReset();
        },
        /**
         * Populate the mutator's dialog with this block's components.
         * @param {!Blockly.Workspace} workspace Mutator's workspace.
         * @return {!Blockly.Block} Root block in mutator.
         * @this Blockly.Block
         */
        decompose: function(workspace) {
            // Build a block for the mutator dialog
            let containerBlock = workspace.newBlock('entity_details_mutator_block');
            // Get the selected entType's properties and for each one, add a checkbox input in the mutator dialog's block
            for (const property of this.entityProperties) {
                containerBlock.appendDummyInput()
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(property[0])
                    .appendField(new Blockly.FieldCheckbox(false), property[1]);
            }
            if (!this.entityProperties.length) {
                containerBlock.appendDummyInput('no_properties')
                    .appendField(translate.instant('BLOCKLY-BLOCKS.ENTITY-DETAILS-MUTATOR.NO-PROPERTIES'));
                containerBlock.setTooltip(translate.instant('BLOCKLY-BLOCKS.ENTITY-DETAILS-MUTATOR.NO-PROPERTIES-TOOLTIP'))
            }
            // Set the checkbox values for the entType's properties from the propertyCheckboxValues array [set in the compose function]
            for (const propertyCheckbox of this.propertyCheckboxValues) {
                containerBlock.setFieldValue(propertyCheckbox[0],propertyCheckbox[1]);
            }
            containerBlock.initSvg();
            return containerBlock;
        },
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        compose: function(containerBlock) {
            // Get the selected entType's properties from the 'entity_details_mutator_block' block.
            this.propertyCheckboxValues = [];
            // For each entType property, check if its checkbox is selected and save that value
            for (const property of this.entityProperties) {
                const checkboxValue = containerBlock.getFieldValue(property[1]) === 'TRUE';
                // propertyCheckboxValues is constructed in the form [checkboxValue, propertyId, propertyName]
                this.propertyCheckboxValues.push([checkboxValue, property[1], property[0]]);
            }
            // Update the property names shown in the 'entity details' main block
            this.updateShape_();
        },
        /**
         * Modify this block to have the correct number of inputs. Each input: name of a selected property.
         * @this Blockly.Block
         * @private
         */
        updateShape_: function() {
            // Delete the current property names in the block, so that they don't repeat themselves when updating
            this.selectedPropDetails.forEach((element) => {
                this.removeInput(element, true);
            })
            // Get the properties that are selected in the mutator: item[0] (checkbox value) === true
            this.selectedPropDetails = [];
            const selectedProps = this.propertyCheckboxValues.filter(item => item[0]);
            // For each selected property in the mutator, add an input to the block with its name
            for(const property of selectedProps) {
                this.appendDummyInput(property[1])
                    .appendField(property[2]);
                // Save the inserted props, so that we know which inputs we have to delete on the next time updateShape is called
                this.selectedPropDetails.push(property[1]);
            }
        },

        updateShapeReset: function() {
            // Update shape when called from dTm: moving block/restoring from XML
            this.propertyCheckboxValues = [];
            // Get the properties associated with the parent's selected entType
            this.entityProperties = getEntityDetails(this.entTypeId);
            // For each entType's property, check if it was selected previously
            for(const property of this.entityProperties) {
                // Save the checkbox values for each property (property selected -> checkbox = true)
                if (this.selectedPropDetails.includes(property[1])) {
                    this.propertyCheckboxValues.push([true, property[1], property[0]]);
                } else {
                    this.propertyCheckboxValues.push([false, property[1], property[0]]);
                }
            }
            // Update the property names shown in the 'entity details' main block
            this.updateShape_();
        },
    };

    if (!Blockly.Extensions.isRegistered('entity_details_mutator')) {
        Blockly.Extensions.registerMutator('entity_details_mutator', ENTITY_DETAILS_MUTATOR_MIXIN, null, null);
    }

// ---------------------------------------------------
// Block: "entity filters" with mutator
// ---------------------------------------------------

    Blockly.Blocks['entity_filters'] = {
        init: function () {
            this.appendDummyInput('blockTitle')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.ENTITY-FILTERS.TITLE'), 'blockTitle'));
            this.setPreviousStatement(true, 'entity_filters');
            this.setNextStatement(false);
            this.contextMenu = false;
            this.setMovable(false);
            this.setDeletable(false);
            this.setTooltip(translate.instant('BLOCKLY-BLOCKS.ENTITY-FILTERS.TOOLTIP'))
            this.setInputsInline(false);
            this.setColour(340);
            this.jsonInit( {'mutator': 'entity_filters_mutator'})
        }
    };

    Blockly.Blocks['entity_filters_mutator_block'] = {
        init: function() {
            this.appendDummyInput('instances_from_query')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(translate.instant('BLOCKLY-BLOCKS.ENTITY-FILTERS-MUTATOR.INSTANCES-FROM-QUERY'))
                .appendField(new Blockly.FieldCheckbox(false), 'instances_from_query');
            this.appendDummyInput('entity_filters_specific_instance')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(translate.instant('BLOCKLY-BLOCKS.ENTITY-FILTERS-MUTATOR.SPECIFIC-INSTANCE'))
                .appendField(new Blockly.FieldCheckbox(false), 'entity_filters_specific_instance');
            this.setColour(270);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };

    const ENTITY_FILTERS_MUTATOR_MIXIN = {
        inputInstancesFromQueryResult_: false,
        hasQueryBlock_: false,
        inputGetSpecificInstance_: false,
        hasSpecificInstanceBlock_: false,
        connections_: Array(PROPERTY_FIELDS.length).fill(null),
        /**
         * Create XML to represent the number inputs.
         * @return {Element} XML storage element.
         * @this Blockly.Block
         */
        mutationToDom: function() {
            let container = document.createElement('mutation');
            container.setAttribute('instances_from_query', this.inputInstancesFromQueryResult_);
            container.setAttribute('has_query_block', this.hasQueryBlock_);
            container.setAttribute('entity_filters_specific_instance', this.inputGetSpecificInstance_);
            container.setAttribute('has_property_block', this.hasSpecificInstanceBlock_);
            return container;
        },
        /**
         * Parse XML to restore the inputs.
         * @param {!Element} xmlElement XML storage element.
         * @this Blockly.Block
         */
        domToMutation: function(xmlElement) {
            this.inputInstancesFromQueryResult_ = xmlElement.getAttribute('instances_from_query') === 'true';
            this.hasQueryBlock_ = xmlElement.getAttribute('has_query_block') === 'true';
            this.inputGetSpecificInstance_ = xmlElement.getAttribute('entity_filters_specific_instance') === 'true';
            this.hasSpecificInstanceBlock_ = xmlElement.getAttribute('has_property_block') === 'true';
            this.updateShape_();
        },
        /**
         * Populate the mutator's dialog with this block's components.
         * @param {!Blockly.Workspace} workspace Mutator's workspace.
         * @return {!Blockly.Block} Root block in mutator.
         * @this Blockly.Block
         */
        decompose: function(workspace) {
            // Set the block's checkbox values (checked or unchecked) depending on the block's variables
            let containerBlock = workspace.newBlock('entity_filters_mutator_block');
            containerBlock.setFieldValue(this.inputInstancesFromQueryResult_,'instances_from_query');
            containerBlock.setFieldValue(this.inputGetSpecificInstance_,'entity_filters_specific_instance');
            containerBlock.initSvg();
            return containerBlock;
        },
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        compose: function(containerBlock) {
            // Check which checkbox was just checked/unchecked, so we can enforce just one of them to be selected.
            const queryCheckboxSelected = !this.inputInstancesFromQueryResult_ && containerBlock.getFieldValue('instances_from_query') === 'TRUE';
            const specificInstanceCheckboxSelected = !this.inputGetSpecificInstance_ && containerBlock.getFieldValue('entity_filters_specific_instance') === 'TRUE';
            // Max of one checkbox selected: In case a checkbox is already checked, and another checkbox is then selected
            // Automatically uncheck the older selected checkbox.
            if (queryCheckboxSelected) {
                this.inputInstancesFromQueryResult_ = true;
                this.inputGetSpecificInstance_ = false;
                containerBlock.setFieldValue(false,'entity_filters_specific_instance');
            } else if (specificInstanceCheckboxSelected) {
                this.inputGetSpecificInstance_ = true;
                this.inputInstancesFromQueryResult_ = false;
                containerBlock.setFieldValue(false,'instances_from_query');
            } else {
                this.inputInstancesFromQueryResult_ = containerBlock.getFieldValue('instances_from_query') === 'TRUE';
                this.inputGetSpecificInstance_ = containerBlock.getFieldValue('entity_filters_specific_instance') === 'TRUE';
            }
            this.updateShape_();
        },
        /**
         * Store pointers to any connected child blocks.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        saveConnections: function(containerBlock) {
            for (let i = 0; i < this.connections_.length; i++) {
                let input = this.getInput(PROPERTY_TYPES[i]);
                if (input) {
                    this.connections_[i] = input && input.connection.targetConnection;
                }
            }
        },
        /**
         * Modify this block to have the correct number of inputs.
         * @this Blockly.Block
         * @private
         */
        updateShape_: function() {
            this.handleInstancesFromQueryResultInput_();
            this.handleGetSpecificInstanceInput_();
        },

        handleInstancesFromQueryResultInput_: function() {
            // Remove the input and associated blocks if the checkbox is no longer checked
            if (this.hasQueryBlock_ && !this.inputInstancesFromQueryResult_) {
                this.removeEntityRestrictionBlockQueryInput_('instances_from_query');
                this.hasQueryBlock_ = false;
            }
            // Add the 'query' input in the 'entity filters' block if it isn't present but should be.
            // Ex: when duplicating the block or loading from XML
            if (this.inputInstancesFromQueryResult_ && !this.getInput('instances_from_query')) {
                this.appendValueInput('instances_from_query')
                    .setCheck('query')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(translate.instant('BLOCKLY-BLOCKS.ENTITY-FILTERS-MUTATOR.INSTANCES-FROM-QUERY') + ':');
            }
            // Add the 'query' block to the 'entity filters' block's input if they aren't there yet but should be
            // Ex: When opening the mutator box with this checked, it would add another set of blocks if not for this verification
            if (!this.hasQueryBlock_ && this.inputInstancesFromQueryResult_) {
                // Create the 'query' block to insert into the new input automatically
                const queryBlock = createNewChildBlock_('query', true);
                // Insert the 'query' block into the new block input
                this.getInput('instances_from_query').connection.connect(queryBlock.outputConnection);
                this.hasQueryBlock_ = true;
            }
        },

        handleGetSpecificInstanceInput_: function() {
            // Remove the input and associated blocks if the checkbox is no longer checked
            if (this.hasSpecificInstanceBlock_ && !this.inputGetSpecificInstance_) {
                this.removeEntityRestrictionBlockSpecificInstanceInput_('entity_filters_specific_instance');
                this.hasSpecificInstanceBlock_ = false;
            }
            // Add the 'specific instance' input in the 'entity filters' block if it isn't present but should be.
            // Ex: when duplicating the block or loading from XML
            if (this.inputGetSpecificInstance_ && !this.getInput('entity_filters_specific_instance')) {
                this.appendValueInput('entity_filters_specific_instance')
                    .setCheck(['property_single', 'get_context_variable'])
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(translate.instant('BLOCKLY-BLOCKS.ENTITY-FILTERS-MUTATOR.SPECIFIC-INSTANCE') + ':');
            }
            // Add the 'property' [default] block to the 'instance filters' block's input if they aren't there yet but should be
            // Ex: When opening the mutator box with this checked, it would add another set of blocks if not for this verification
            if (!this.hasSpecificInstanceBlock_ && this.inputGetSpecificInstance_) {
                // Create the 'property single' block to insert into the new input automatically
                const propertySingleBlock = createNewChildBlock_('property_single', false);
                // Insert the 'property single' block into the new block input
                this.getInput('entity_filters_specific_instance').connection.connect(propertySingleBlock.outputConnection);
                this.hasSpecificInstanceBlock_ = true;
            }
        },

        removeEntityRestrictionBlockQueryInput_: function(inputName) {
            this.childBlocks_.find(block => block.type === 'query')?.dispose(false);
            this.removeInput(inputName);
        },

        removeEntityRestrictionBlockSpecificInstanceInput_: function(inputName) {
            this.childBlocks_.find(block => block.type === 'property_single')?.dispose(false);
            this.childBlocks_.find(block => block.type === 'get_context_variable')?.dispose(false);
            this.removeInput(inputName);
        },
    };

    if (!Blockly.Extensions.isRegistered('entity_filters_mutator')) {
        Blockly.Extensions.registerMutator('entity_filters_mutator', ENTITY_FILTERS_MUTATOR_MIXIN, null, null);
    }

// -------------------------------------------------------------------------
// ------------------ CATEGORY: EXTERNAL API CALLS -------------------------

// ---------------------------------------------------
// Block: "create_entity_external_call"
// ---------------------------------------------------

    Blockly.Blocks['create_entity_external_call'] = {
        entType: 'NONE',

        init: function () {

            this.appendDummyInput('blockFields')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.EXTERNAL-CALL-CREATE-ENTITY.TITLE'), 'blockTitle'))
            this.appendDummyInput('external_call_create_entity_ent_type')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.EXTERNAL-CALL-CREATE-ENTITY.ENTITY-TYPE')))
                .appendField(new Blockly.FieldDropdown(getEntTypes), 'external_call_create_entity_ent_type')
            this.appendStatementInput('external_call_create_entity_properties')
                .appendField(translate.instant('BLOCKLY-BLOCKS.EXTERNAL-CALL-CREATE-ENTITY.PROPERTIES') + ' :')
                .setCheck('matching_property_crud_entity_action');
            this.getField('external_call_create_entity_ent_type').setValidator(this.validateEntType)
            this.setInputsInline(false);
            this.setColour(200);
            this.setPreviousStatement(true, 'create_entity_external_call');
            this.setNextStatement(false);
        },

        validateEntType: function(entType) {
            this.sourceBlock_.entType = entType;
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('ent_type', this.entType);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.entType = xmlElement.getAttribute('ent_type');
        }
    }

// ---------------------------------------------------
// Block: "parameter_external_call"
// ---------------------------------------------------

    Blockly.Blocks['parameter_external_call'] = {

        init: function() {

            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.EXTERNAL-CALL-PARAMETER.TITLE'), 'blockTitle'))
                .appendField(new Blockly.FieldDropdown(this.getEndpointParameters), 'endpoint_property');
            this.appendValueInput('parameter_value')
                .appendField(new Blockly.FieldLabel('='))
                .setCheck(['constant', 'parameter_value', 'property_single']);
            this.setInputsInline(true);
            this.setPreviousStatement(true, 'parameter_external_call');
            this.setNextStatement(true, ['parameter_external_call']);
            this.setColour(350);
            this.setTooltip('');
            this.setHelpUrl('');
        },

        // Get the endpoint parameters deducted from the API's endpoint
        getEndpointParameters: function () {
            // These are just for testing purposes until the mechanism to get the endpoint's parameters isn't developed
            return [
                [translate.instant('BLOCKLY-BLOCKS.PROPERTY.DROPDOWN-DEFAULT'), 'NONE'],
                ['car type', '1'],
                ['car model', '2'],
                ['number of doors', '3'],
                ['AC', '4'],
                ['engine capacity', '5']
            ]
        },
    };

// ---------------------------------------------------
// Block: "parameter_value"
// ---------------------------------------------------

    Blockly.Blocks['parameter_value'] = {
        valueType: null,

        init: function() {
            this.appendDummyInput('value')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.EXTERNAL-CALL-PARAMETER-VALUE.TITLE'), 'blockTitle'))
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.EXTERNAL-CALL-PARAMETER-VALUE.PLACEHOLDER')), 'value');
            this.setInputsInline(true);
            this.setOutput(true, 'parameter_value');
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };

// -------------------------------------------------------------------------
// ------------------ CATEGORY: LOCAL ENDPOINT API CALLS -------------------

// ---------------------------------------------------
// Block: "parameter_local_endpoint_call"
// ---------------------------------------------------

    Blockly.Blocks['parameter_local_endpoint_call'] = {
        valueType: null,
        entType: null,
        restrictConnections: false,

        init: function () {

            this.appendDummyInput('blockTitle')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER.TITLE'), 'blockTitle'))
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER.NAME-PLACEHOLDER')), 'parameter_local_endpoint_call_name');
            this.appendDummyInput('description')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER.DESCRIPTION') + ':'))
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER.DESCRIPTION-PLACEHOLDER')), 'description');
            this.appendDummyInput('ddEntTypes')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER.ENT-TYPE') + ':'))
                .appendField(new Blockly.FieldDropdown(getEntTypesThatArentHasMany), 'parameter_local_endpoint_ent_type')
                .appendField(' ');
            this.appendDummyInput('ddProperties')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER.PROPERTY') + ':'))
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'parameter_local_endpoint_property');
            this.appendDummyInput('example')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER.EXAMPLE') + ':'))
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER.EXAMPLE-PLACEHOLDER')), 'example');
            this.appendDummyInput('mandatory')
                .appendField(new Blockly.FieldLabel(
                    translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER.MANDATORY') + ':')
                )
                .appendField(new Blockly.FieldCheckbox(false), 'mandatory_checkbox');
            this.getField('parameter_local_endpoint_ent_type').setValidator(function (newValue) {
                const block = this.sourceBlock_;
                setProperties(block, newValue, 'parameter_local_endpoint_property');
                block.entType = newValue;
                setNoneOptionDropdown(block, 'parameter_local_endpoint_property');
            });
            this.appendDummyInput('valueType').setVisible(false);
            this.getField('parameter_local_endpoint_property').setValidator(function (input) {
                // Get the current block
                let block = this.sourceBlock_;
                // Check if block has value type input, if so remove it. Then add the new property's value type field
                let valueTypeInput = block.getInput('valueType');
                valueTypeInput.removeField('valueTypeField', true);
                valueTypeInput.setVisible(false);
                addValueTypeField(block, input);
            });
            this.getField('parameter_local_endpoint_call_name').setValidator(replaceNonAlphanumericCharacters);
            this.jsonInit({'mutator': 'parameter_api_call_mutator'});
            this.setOnChange(this.handleChange_);
            this.setInputsInline(false);
            this.setColour(240);
            this.setPreviousStatement(true, 'parameter_local_endpoint_call');
            this.setNextStatement(true, ['parameter_local_endpoint_call', 'parameter_set_local_endpoint_call']);
        },

        handleChange_: function(changeEvent) {
            if (changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) {
                this.checkConnectionRestrictions(changeEvent);
            } else if ((changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'parameter_local_endpoint_property')) {
                removeMutatorsIfInvalidValueType(this);
            }
        },

        checkConnectionRestrictions: function(changeEvent) {
            let parent = this.parentBlock_;
            let foundParent_ = false;

            this.restrictConnections = false;

            // Verifies if the block is inside a 'when_is_do' block, and checks if it's inside a 'endpoint parameters' input
            while (parent && !foundParent_) {
                if (parent.type === 'when_is_do') {
                    this.restrictConnections = changeEvent.newInputName === 'endpoint_parameters';
                    foundParent_ = true;
                } else if (parent.type === 'parameter_local_endpoint_call') {
                    this.restrictConnections = parent.restrictConnections;
                    foundParent_ = true;
                } else {
                    parent = parent.parentBlock_;
                }
            }

            if (!foundParent_) {
                this.restrictConnections = false;
            }

            this.setNextConnection(this);
            // ChangeEvent only alerts for the top block in the stack being moved, so check its childBlocks
            // so that every block has the right connections
            this.setChildBocksConnections();
        },

        setChildBocksConnections: function() {
            // Get the blocks currently attached to this one
            let currentChildBlock = this.getChildren(true)[0];
            // While it has 'parameter' blocks attached, set their restrictions to the ones of the top block
            while (currentChildBlock && currentChildBlock.type === 'parameter_local_endpoint_call') {
                currentChildBlock.restrictConnections = this.restrictConnections;
                this.setNextConnection(currentChildBlock);
                currentChildBlock = currentChildBlock.getChildren(true)[0];
            }
        },

        setNextConnection: function(block) {
            const compatibleBlocks = block.restrictConnections ? ['parameter_local_endpoint_call']
                : ['parameter_local_endpoint_call', 'parameter_set_local_endpoint_call']
            block.setNextStatement(true, compatibleBlocks);
        }
    }

// ---------------------------------------------------
// Mutator for block "parameter_local_endpoint_call"
// ---------------------------------------------------

    // Names to appear inside mutator dialog block and inside 'parameter' block when added
    const PARAMETER_API_CALL_MUTATOR_FIELDS = [
        translate.instant('BLOCKLY-BLOCKS.PROPERTY.VALIDATION-CONDITION'),
        translate.instant('BLOCKLY-BLOCKS.PROPERTY.PROPERTY-REF-FILTER')
    ];
    // Block types to be checked
    const PARAMETER_API_CALL_MUTATOR_TYPES = ['validation_condition', 'property_filter'];

    Blockly.Blocks['parameter_api_call_mutator_block'] = {
        init: function() {
            for (let i = 0; i < PARAMETER_API_CALL_MUTATOR_FIELDS.length; i++) {
                this.appendDummyInput(PARAMETER_API_CALL_MUTATOR_TYPES[i])
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(PARAMETER_API_CALL_MUTATOR_FIELDS[i])
                    .appendField(new Blockly.FieldCheckbox(false), PARAMETER_API_CALL_MUTATOR_TYPES[i]);
            }
            this.setColour(270);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };

    const PARAMETER_API_CALL_MUTATOR = {
        inputValidation_: false,
        hasValidationConditionBlocks_: false,
        inputPropertyFilter_: false,
        hasPropertyFilterBlocks_: false,
        connections_: Array(PROPERTY_FIELDS.length).fill(null),
        /**
         * Create XML to represent the number inputs.
         * @return {Element} XML storage element.
         * @this Blockly.Block
         */
        mutationToDom: function() {
            let container = document.createElement('mutation');
            container.setAttribute('validation_condition', this.inputValidation_);
            container.setAttribute('has_validation_condition_blocks', this.hasValidationConditionBlocks_);
            container.setAttribute('property_filter', this.inputPropertyFilter_);
            container.setAttribute('has_property_filter_blocks', this.hasPropertyFilterBlocks_);
            container.setAttribute('ent_type_id', this.getFieldValue('parameter_local_endpoint_ent_type'));
            container.setAttribute('property_id', this.getFieldValue('parameter_local_endpoint_property'));
            container.setAttribute('value_type', this.valueType);
            container.setAttribute('restrict_connections', this.restrictConnections);
            return container;
        },
        /**
         * Parse XML to restore the inputs.
         * @param {!Element} xmlElement XML storage element.
         * @this Blockly.Block
         */
        domToMutation: function(xmlElement) {
            this.inputValidation_= xmlElement.getAttribute('validation_condition') === 'true';
            this.hasValidationConditionBlocks_ = xmlElement.getAttribute('has_validation_condition_blocks') === 'true';
            this.inputPropertyFilter_= xmlElement.getAttribute('property_filter') === 'true';
            this.hasPropertyFilterBlocks_ = xmlElement.getAttribute('has_property_filter_blocks') === 'true';
            this.valueType = xmlElement.getAttribute('value_type');
            this.entType = Number(xmlElement.getAttribute('ent_type_id'));
            setProperties(this,this.entType, 'parameter_local_endpoint_property');
            this.restrictConnections = xmlElement.getAttribute('restrict_connections') === 'true';
            this.setNextConnection(this);
            this.updateShape_();
            addValueTypeField(this, Number(xmlElement.getAttribute('property_id')));
        },
        /**
         * Populate the mutator's dialog with this block's components.
         * @param {!Blockly.Workspace} workspace Mutator's workspace.
         * @return {!Blockly.Block} Root block in mutator.
         * @this Blockly.Block
         */
        decompose: function(workspace) {
            // Set the block's checkbox values (checked or unchecked) depending on the block's variables
            let containerBlock = workspace.newBlock('parameter_api_call_mutator_block');
            // Remove 'validation condition' from the mutator's dialog box if the valueType is incompatible
            if (this.isIncompatibleWithValidationCondition(this)) {
                containerBlock.removeInput('validation_condition', true);
                this.inputValidation_ = false;
            } else {
                // If it's compatible, set the checkbox value according to the previous selection
                containerBlock.setFieldValue(this.inputValidation_,'validation_condition');
            }
            // Remove 'property_filter' from the mutator's dialog box if the valueType is incompatible
            if (!propertyFilterValueTypes.includes(this.valueType)) {
                containerBlock.removeInput('property_filter', true);
                this.inputPropertyFilter_ = false;
            } else {
                // If it's compatible, set the checkbox value according to the previous selection
                containerBlock.setFieldValue(this.inputPropertyFilter_,'property_filter');
            }
            containerBlock.initSvg();
            return containerBlock;
        },
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        compose: function(containerBlock) {
            // Update block's shape when the mutator is open, and we check/uncheck a checkbox
            this.inputValidation_ = containerBlock.getFieldValue('validation_condition') === 'TRUE';
            this.inputPropertyFilter_ = containerBlock.getFieldValue('property_filter') === 'TRUE';
            this.updateShape_();
        },
        /**
         * Store pointers to any connected child blocks.
         * @param {!Blockly.Block} containerBlock Root block in mutator.
         * @this Blockly.Block
         */
        saveConnections: function(containerBlock) {
            for (let i = 0; i < this.connections_.length; i++) {
                let input = this.getInput(PROPERTY_TYPES[i]);
                if (input) {
                    this.connections_[i] = input && input.connection.targetConnection;
                }
            }
        },
        /**
         * Modify this block to have the correct number of inputs.
         * @this Blockly.Block
         * @private
         */
        updateShape_: function() {
            this.handleValidationConditionInput_();
            this.handlePropertyFilterInput_();
        },

        handleValidationConditionInput_: function() {
            // Remove the input and associated blocks if the checkbox is no longer checked
            if (this.hasValidationConditionBlocks_ && !this.inputValidation_) {
                this.removePropertyBlockInput_('validation_condition');
                this.hasValidationConditionBlocks_ = false;
            }
            // Add the 'validation condition' input in the 'parameter' block if it isn't present but should be.
            // Ex: when duplicating the block or loading from XML
            if (this.inputValidation_ && !this.getInput('validation_condition')) {
                this.appendValueInput('validation_condition')
                    .setCheck('validation_condition')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(translate.instant('BLOCKLY-BLOCKS.PROPERTY.VALIDATION-CONDITION') + ':');
            }
            // Add the 'validation condition' blocks to the parameter block's input if they aren't there yet but should be
            // Ex: When opening the mutator box with this checked, it would add another set of blocks if not for this verification
            if (!this.hasValidationConditionBlocks_ && this.inputValidation_) {
                // Create the 'validation condition' & 'condition validation condition' blocks to insert into the new input automatically
                const validationConditionBlock = createNewChildBlock_('validation_condition', true);
                const conditionValidationConditionBlock = createNewChildBlock_('condition_validation_condition', true);
                // Insert the 'condition validation condition' block into the 'validation condition' block
                validationConditionBlock.getInput('conditions').connection.connect(conditionValidationConditionBlock.previousConnection);
                // Insert the 'validation condition' block into the new block input
                this.getInput('validation_condition').connection.connect(validationConditionBlock.outputConnection);
                this.hasValidationConditionBlocks_ = true;
            }
        },

        handlePropertyFilterInput_: function() {
            // Remove the input and associated blocks if the checkbox is no longer checked
            if (this.hasPropertyFilterBlocks_ && !this.inputPropertyFilter_) {
                this.removePropertyBlockInput_('property_filter');
                this.hasPropertyFilterBlocks_ = false;
            }
            // Add the 'property filter' input in the 'parameter' block if it isn't present but should be.
            // Ex: when duplicating the block or loading from XML
            if (this.inputPropertyFilter_ && !this.getInput('property_filter')) {
                this.appendValueInput('property_filter')
                    .setCheck('property_filter')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(translate.instant('BLOCKLY-BLOCKS.PROPERTY.PROPERTY-REF-FILTER') + ':');
            }
            // Add the 'property filter' blocks to the parameter block's input if they aren't there yet but should be
            // Ex: When opening the mutator box with this checked, it would add another set of blocks if not for this verification
            if (!this.hasPropertyFilterBlocks_ && this.inputPropertyFilter_) {
                // Create the 'property_filter', 'filter property ref filter' & 'filter referenced property select' blocks to insert into the new input automatically
                const propertyRefFilterBlock = createNewChildBlock_('property_filter', true);
                const filterPropertyRefFilterBlock = createNewChildBlock_('filter_property_filter', true);
                const filterReferencedPropertySelectBlock = createNewChildBlock_('filter_referenced_property_select', true);
                // Insert the 'filter referenced property select' block into the 'filter property ref filter' block's input
                filterPropertyRefFilterBlock.getInput('filtered_property').connection.connect(filterReferencedPropertySelectBlock.outputConnection);
                // Insert the 'filter property ref filter' block in the 'property_filter' block
                propertyRefFilterBlock.getInput('filters').connection.connect(filterPropertyRefFilterBlock.previousConnection);
                // Insert the 'property filter' block into the new block input
                this.getInput('property_filter').connection.connect(propertyRefFilterBlock.outputConnection);
                this.hasPropertyFilterBlocks_ = true;
            }
        },

        removePropertyBlockInput_: function(inputName) {
            this.childBlocks_.find(block => block.type === inputName).dispose(false);
            this.removeInput(inputName);
        }
    };
    if (!Blockly.Extensions.isRegistered('parameter_api_call_mutator')) {
        Blockly.Extensions.registerMutator('parameter_api_call_mutator', PARAMETER_API_CALL_MUTATOR, null, null);
    }

// ---------------------------------------------------
// Block: "parameter_set_local_endpoint_call"
// ---------------------------------------------------

    Blockly.Blocks['parameter_set_local_endpoint_call'] = {

        init: function() {
            this.appendDummyInput('parameter_set')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER-SET.TITLE'), 'blockTitle'))
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER-SET.NAME-PLACEHOLDER')), 'parameter_set_local_endpoint_call_name');
            this.appendDummyInput('description')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER-SET.DESCRIPTION') + ':'))
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER-SET.DESCRIPTION-PLACEHOLDER')), 'description');
            appendStatementInputLabel(this, 'parameters', 'BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER-SET.PARAMETERS');
            this.appendStatementInput('parameters')
                .setCheck('parameter_local_endpoint_call');
            this.getField('parameter_set_local_endpoint_call_name').setValidator(replaceNonAlphanumericCharacters)
            this.setInputsInline(false);
            this.setInputsInline(false);
            this.setPreviousStatement(true, 'parameter_set_local_endpoint_call');
            this.setNextStatement(true, ['parameter_set_local_endpoint_call', 'parameter_local_endpoint_call']);
            this.setColour(270);
            this.setTooltip('');
            this.setHelpUrl('');
        },
    };

    // ---------------------------------------------------
    // Block: "matching_property_crud_entity_action"
    // ---------------------------------------------------

    Blockly.Blocks['matching_property_crud_entity_action'] = {
        entType: null,
        parentType: null,
        endpointProperties: [],
        updateDeleteIdBlock: false,
        noNextConnection: false,
        unchangeable: false,

        init: function() {

            this.appendDummyInput('blockFields')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.EXTERNAL-CALL-MATCHING-PROPERTY.TITLE'),
                    'blockTitle'));
            this.appendDummyInput('matching_properties')
                .appendField(translate.instant('BLOCKLY-BLOCKS.EXTERNAL-CALL-MATCHING-PROPERTY.ENT-TYPE-PROPERTY') + ':')
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'matching_property')
                .appendField(translate.instant('BLOCKLY-BLOCKS.EXTERNAL-CALL-MATCHING-PROPERTY.ENDPOINT-PROPERTY') + ':')
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'endpoint_properties');
            this.setInputsInline(true);
            this.setPreviousStatement(true, 'matching_property_crud_entity_action');
            this.setNextStatement(true, ['matching_property_crud_entity_action']);
            this.setColour(350);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setOnChange(this.handleChange);
        },

        handleChange: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            // Update dropdown when this block has a newParent or stops having one OR when the entType in the parent block changes
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'crud_entity_ent_type') ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'external_call_create_entity_ent_type')
            ) {
                this.getPropertiesFromParentBlock();
            } else if (
                (changeEvent.type === 'move' && (blockType === 'parameter_local_endpoint_call' || blockType === 'parameter_set_local_endpoint_call')) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && (changeEvent.name === 'parameter_local_endpoint_call_name' || changeEvent.name === 'parameter_set_local_endpoint_call_name')) ||
                (changeEvent.type === 'delete' && (changeEvent.oldJson.type === 'parameter_local_endpoint_call' || changeEvent.oldJson.type === 'parameter_set_local_endpoint_call'))
            ) {
                this.getEndpointParameters();
            }
        },

        getPropertiesFromParentBlock: function() {
            let parent = this.parentBlock_;
            let foundParent_ = false;

            this.entType = null;
            this.parentType = null;
            this.endpointProperties = [];

            // Verifies if the block is inside a 'create_entity_external_call' [external call] block or an 'action' block [local endpoint],
            // and searches for its ent type to get its properties and to get the action's endpoint parameters
            while (parent && !foundParent_) {
                if (parent.type === 'create_entity_external_call' || parent.type === 'action') {
                    this.entType = parent.type === 'action' ? parent.getFieldValue('crud_entity_ent_type') :
                        parent.getFieldValue('external_call_create_entity_ent_type');
                    setProperties(this, this.entType, 'matching_property');
                    this.parentType = parent.type;
                    this.getEndpointParameters();
                    this.setBlockAsUnchangeableIdWhenUpdateDeleteAction(parent);
                    foundParent_ = true;
                } else {
                    parent = parent.parentBlock_;
                }
            }

            // If the block is pulled from the parent block, the menu will be reset as there's no parent ent type selected.
            if (!foundParent_) {
                this.getField('matching_property').menuGenerator_ = getEmptyDropdown();
                this.getField('endpoint_properties').menuGenerator_ = getEmptyDropdown();
            }
            // If the new dropdown doesn't have the selectedOption, reset it so that we don't have a selectedProperty that isn't on the dropdown
            resetDropdownChoiceIfNoLongerAvailable(this, 'matching_property');
            // If the new dropdown doesn't have the selectedOption, reset it so that we don't have a selectedEndpointProperty that isn't on the dropdown
            resetDropdownChoiceIfNoLongerAvailable(this, 'endpoint_properties');
        },

        setBlockAsUnchangeableIdWhenUpdateDeleteAction: function(parentActionBlock) {
            // When it's an 'id matching property' block, inside update/delete actions
            const actionType = parentActionBlock.getFieldValue('action_dropdown');
            if (this.updateDeleteIdBlock && (actionType === 'DELETE_RECORD' || actionType === 'UPDATE_RECORD')) {
                // Get the selected entType's id property
                const idPropertyDropdownOption = this.getField('matching_property').menuGenerator_?.find(
                    (dropdownProperty) => dropdownProperty[0].toLowerCase() === 'id'
                );
                // If there's an id property, set it as an unchangeable field in the 'matching_property' field.
                if (idPropertyDropdownOption) {
                    this.setFieldValue(idPropertyDropdownOption[1],'matching_property');
                }
                // In case it's a query/delete record action, no need for further properties in the input.
                this.noNextConnection = (actionType === 'DELETE_RECORD');
                this.restrictConnections();
            }
        },

        restrictConnections: function() {
            if (this.noNextConnection) {
                this.setNextStatement(false);
            } else {
                this.setNextStatement(true, ['matching_property_crud_entity_action']);
            }
            if (this.unchangeable) {
                this.contextMenu = false;
                this.setMovable(false);
                this.setDeletable(false);
                this.getField('matching_property').setEnabled(false);
            }
        },

        // Get the endpoint parameters deducted from the APIs endpoint (external call)
        // or from the current action (local endpoint)
        getEndpointParameters: function () {
            this.endpointProperties = [];
            if (this.parentType === 'create_entity_external_call') {
                this.getExternalCallEndpointParameters();
            } else if (this.parentType === 'action') {
                this.getLocalEndpointParameters();
            }
        },

        getExternalCallEndpointParameters: function(parentActionBlock) {
            // TODO These are just for testing purposes until the mechanism to get the endpoint's parameters isn't developed
            this.endpointProperties = ['is_collective', 'name', 'email_address', 'phone_number', 'NIF'];
            this.setLocalEndpointParameterNames();
        },

        getLocalEndpointParameters: function() {
            let parent = this.parentBlock_;
            let foundParent_ = false;
            // Verifies if the block is inside a 'when_is_do' block
            // and searches for its 'parameter' blocks to get its names for the 'endpoint property' dropdown
            while (parent && !foundParent_) {
                // We only have this field on the 'when_is_do' block when it's a 'local endpoint call'
                if (parent.type === 'when_is_do' && parent.getField('local_endpoint_call_type')) {
                    this.endpointProperties =  this.getLocalEndpointParameterNames(parent);
                    this.setLocalEndpointParameterNames();
                    foundParent_ = true;
                } else {
                    parent = parent.parentBlock_;
                }
            }

            // If the block is pulled from the parent block, the menu will be reset as there's no parent ent type selected.
            if (!foundParent_) {
                this.parentType = null;
                this.getField('endpoint_properties').menuGenerator_ = getEmptyDropdown();
            }
            // If the new dropdown doesn't have the selectedOption, reset it so that we don't have a selectedEndpointProperty that isn't on the dropdown
            resetDropdownChoiceIfNoLongerAvailable(this,'endpoint_properties');
        },

        getLocalEndpointParameterNames: function(parentBlock, endpointProperties = [], parentSetName = null) {
            // Get the parent block's childBlocks and analyze if they're parameter_local_endpoint_call blocks
            for (const childBlock of parentBlock.getChildren(true)) {
                // If we're inside a parameter_set, NOT next to it, save it's set_name, so we display like 'setName.param'
                if (parentBlock.type === 'parameter_set_local_endpoint_call' &&
                    !(parentBlock.nextConnection && childBlock.previousConnection === parentBlock.nextConnection.targetConnection)) {
                    parentSetName = parentBlock.getFieldValue('parameter_set_local_endpoint_call_name');
                }
                let currentChildBlock = childBlock;
                // If they're parameter_local_endpoint_call, get the parameter's name
                if (currentChildBlock && currentChildBlock.type === 'parameter_local_endpoint_call') {
                    const endpointPropertyName = currentChildBlock.getFieldValue('parameter_local_endpoint_call_name');
                    const endpointPropertyNameForDropdown = parentSetName ? parentSetName + '.' + endpointPropertyName :
                        endpointPropertyName;
                    endpointProperties.push(endpointPropertyNameForDropdown);
                }
                // Analyze the block's children blocks for further 'parameter_local_endpoint_call' blocks
                endpointProperties = this.getLocalEndpointParameterNames(currentChildBlock, endpointProperties, parentSetName);
                // Reset the parentSetName in case it had been saved. When present, blocks inside parameter_sets always follow the
                // [0].index block. For [1].index, the next childBlock won't be inside, it will be NEXT to the current block.
                parentSetName = null;
            }
            return endpointProperties;
        },

        setLocalEndpointParameterNames() {
            const dropdownOptions = getEmptyDropdown();
            // Set the dropdown to the names of the parameter blocks
            for (const parameterName of this.endpointProperties) {
                dropdownOptions.push([parameterName, parameterName]);
            }
            this.getField('endpoint_properties').menuGenerator_ = dropdownOptions;
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('ent_type', this.entType);
            container.setAttribute('parent_type', this.parentType);
            container.setAttribute('endpoint_properties', this.endpointProperties);
            container.setAttribute('update_delete_id_block', this.updateDeleteIdBlock);
            container.setAttribute('no_next_connection', this.noNextConnection);
            container.setAttribute('unchangeable', this.unchangeable);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.entType = xmlElement.getAttribute('ent_type');
            this.parentType = xmlElement.getAttribute('parent_type');
            this.endpointProperties = xmlElement.getAttribute('endpoint_properties').split(',')
                .filter((property) => property !== '') ;
            setProperties(this,this.entType, 'matching_property');
            this.setLocalEndpointParameterNames();
            this.updateDeleteIdBlock = xmlElement.getAttribute('update_delete_id_block') === 'true';
            this.noNextConnection = xmlElement.getAttribute('no_next_connection') === 'true';
            this.unchangeable = xmlElement.getAttribute('unchangeable') === 'true';
            this.restrictConnections();
        }
    };

// ---------------------------------------------------
// Block: "response_property_local_endpoint_call"
// ---------------------------------------------------

    Blockly.Blocks['response_property_local_endpoint_call'] = {
        entType: null,
        restrictConnections: false,
        endpointEntTypes: [],

        init: function() {
            this.appendDummyInput('response_property')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-PROPERTY.TITLE'), 'blockTitle'))
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-PROPERTY.NAME-PLACEHOLDER')),
                    'response_property_local_endpoint_call_name')
            this.appendDummyInput('internal_ent_type')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER.ENT-TYPE') + ':'))
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'response_ent_type_local_endpoint');
            this.appendDummyInput('internal_property')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER.PROPERTY') + ':'))
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown),'response_property_local_endpoint');
            this.getField('response_property_local_endpoint_call_name').setValidator(replaceNonAlphanumericCharacters);
            this.getField('response_ent_type_local_endpoint').setValidator(this.entTypesValidator);
            this.setOnChange(this.getValuesFromParentBlock);
            this.setInputsInline(false);
            this.setPreviousStatement(true, 'response_property_local_endpoint_call');
            this.setNextStatement(true, ['response_set_local_endpoint_call', 'response_property_local_endpoint_call']);
            this.setColour(220);
            this.setTooltip('');
            this.setHelpUrl('');
        },

        // Get the entType in the parent 'response_set_local_endpoint_call' block in order to load the respective properties in this block's dropdown
        // OR get the entTypes in the parent 'when_is_do' block's 'action->create action' block to insert in the entType dropdown
        getValuesFromParentBlock: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;

            // Update dropdown when this block has a newParent or stops having one; when the entType in the parent block changes
            // OR get the entTypes in the parent 'when_is_do' block's 'crud record' blocks to insert in the entType dropdown
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && (changeEvent.name === 'crud_entity_ent_type' || changeEvent.name === 'response_set_internal_ent_type')) ||
                (changeEvent.type === 'move' && blockType === 'action') ||
                (changeEvent.type === 'delete' && changeEvent.oldJson.type === 'action')
            ) {
                let parent = this.parentBlock_;
                let foundParent_ = false;

                this.restrictConnections = false;
                this.endpointEntTypes = [];

                // Verifies if the block is inside a 'response_set_local_endpoint_call' block, and searches for its ent type to get its properties
                // OR if it's inside a 'when_is_do' block, and searches for its 'action->create entity' blocks entTypes
                while (parent && !foundParent_) {
                    if (parent.type === 'response_set_local_endpoint_call') {
                        // Get the selected entity type from the parent response_set block and remove entity type field
                        this.entType = parent.getFieldValue('response_set_internal_ent_type');
                        setProperties(this, this.entType, 'response_property_local_endpoint');
                        // So we don't let response_sets be introduced below this block (no recursive response_set blocks)
                        this.restrictConnections = true;
                        foundParent_ = true;
                    } else if (parent.type === 'when_is_do') {
                        // We only have this field on the 'when_is_do' block when it's a 'local endpoint call'
                        if (parent.getField('local_endpoint_call_type')) {
                            // Get the entity types from the 'when_is_do' 'action->create entity' child blocks and insert them in entity type dropdown
                            this.endpointEntTypes = this.getCreateEntityActionEntTypes(parent);
                            this.setEntTypesDropdown();
                        }
                        foundParent_ = true;
                    } else {
                        parent = parent.parentBlock_;
                    }
                }

                this.updateShapeIfInsideResponseSet();

                // If the block is pulled from the parent block, the menus will be reset
                if (!foundParent_) {
                    this.entType = null;
                    setEmptyDropdown(this, 'response_ent_type_local_endpoint');
                    setEmptyDropdown(this, 'response_property_local_endpoint');
                }

                // If the new dropdown doesn't have the selectedOption, reset it so that we don't have a selectedOption that isn't on the dropdown
                if (this.getInput('internal_ent_type')) {
                    resetDropdownChoiceIfNoLongerAvailable(this, 'response_ent_type_local_endpoint');
                }
                resetDropdownChoiceIfNoLongerAvailable(this, 'response_property_local_endpoint');
            }
        },

        updateShapeIfInsideResponseSet: function() {
            if (this.restrictConnections) {
                this.removeInput('internal_ent_type', true);
                this.setNextStatement(true, ['response_property_local_endpoint_call']);
            } else {
                if (!this.getInput('internal_ent_type')) {
                    this.appendDummyInput('internal_ent_type')
                        .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-PARAMETER.ENT-TYPE') + ':'))
                        .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'response_ent_type_local_endpoint');
                }
                this.getField('response_ent_type_local_endpoint').setValidator(this.entTypesValidator);
                this.setNextStatement(true, ['response_set_local_endpoint_call', 'response_property_local_endpoint_call']);
            }
        },

        entTypesValidator: function(selectedEntType) {
            const block = this.sourceBlock_;
            block.entType = selectedEntType;
            setProperties(block, selectedEntType, 'response_property_local_endpoint');
        },

        getCreateEntityActionEntTypes: function (parentBlock, childCreateEntityActionEntType = []) {
            // Collect every 'action->create entity' blocks' entity types to populate the ent types dropdown
            for (const childBlock of parentBlock.getChildren(true)) {
                // If the childBlock is a 'create entity' action block, get the respective entType
                // If it's an 'if_then' block, get the inspect the actions inside it
                const actionType = childBlock.getFieldValue('action_dropdown');
                if (childBlock && childBlock.type === 'action' && (actionType === 'INSERT_RECORD' || actionType === 'UPDATE_RECORD')) {
                    const actionBlockEntType = childBlock.getFieldValue('crud_entity_ent_type');
                    if (actionBlockEntType !== 'NONE' && !childCreateEntityActionEntType.includes(actionBlockEntType)) {
                        childCreateEntityActionEntType.push(actionBlockEntType);
                    }
                }
                childCreateEntityActionEntType = this.getCreateEntityActionEntTypes(childBlock,
                    childCreateEntityActionEntType);
            }
            return childCreateEntityActionEntType;
        },

        setEntTypesDropdown() {
            const dropdownOptions = getEmptyDropdown();
            for (const endpointEntType of this.endpointEntTypes) {
                const endpointEntTypeInfo = entTypes.find(entType => entType.id === Number(endpointEntType));
                dropdownOptions.push([endpointEntTypeInfo.name, endpointEntTypeInfo.id.toString()]);
            }
            this.getField('response_ent_type_local_endpoint').menuGenerator_ = dropdownOptions;
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('ent_type', this.entType);
            container.setAttribute('restrict_connections', this.restrictConnections);
            container.setAttribute('endpoint_ent_types', this.endpointEntTypes);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.entType = xmlElement.getAttribute('ent_type');
            this.restrictConnections = xmlElement.getAttribute('restrict_connections') === 'true';
            setProperties(this, this.entType, 'response_property_local_endpoint');
            this.endpointEntTypes = xmlElement.getAttribute('endpoint_ent_types').split(',')
                .filter((entType) => entType !== '');
            this.updateShapeIfInsideResponseSet();
            if (!this.restrictConnections) {
                this.setEntTypesDropdown();
            }
        }
    };

// ---------------------------------------------------
// Block: "response_queried_object"
// ---------------------------------------------------

    Blockly.Blocks['response_queried_object'] = {
        queryVariables: [],

        init: function() {
            this.appendDummyInput('response_queried_object')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-QUERIED-OBJECT.TITLE'), 'blockTitle'));
            this.appendDummyInput('queried_variable_name')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-QUERIED-OBJECT.OBJECT') + ':'))
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'response_queried_object_variable_dropdown');
            this.setOnChange(this.getValuesFromParentBlock);
            this.setInputsInline(false);
            this.setPreviousStatement(true, 'response_queried_object');
            this.setNextStatement(true, ['response_queried_object']);
            this.setColour(220);
            this.setTooltip('');
            this.setHelpUrl('');
        },

        // Get the 'variable' names in the parent 'when_is_do' block's 'action->query records' block to insert in the dropdown
        getValuesFromParentBlock: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;

            // Update dropdown when this block has a newParent or stops having one; when the 'variable' field in the parent block changes
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && (changeEvent.name === 'query_records_variable_name' || changeEvent.name === 'action_dropdown')) ||
                (changeEvent.type === 'move' && blockType === 'action') ||
                (changeEvent.type === 'delete' && changeEvent.oldJson.type === 'action')
            ) {
                let parent = this.parentBlock_;
                let foundParent_ = false;

                this.queryVariables = [];

                // Verifies if it's inside a 'when_is_do' block, and searches for its 'action->query records' blocks variable_names
                while (parent && !foundParent_) {
                    if (parent.type === 'when_is_do') {
                        // We only have this field on the 'when_is_do' block when it's a 'local endpoint call'
                        if (parent.getField('local_endpoint_call_type')) {
                            // Get the variable names from the 'when_is_do' 'action->query records' child blocks and insert them in the dropdown
                            this.queryVariables = this.getQueryRecordsActionVariables(parent);
                            this.setVariablesDropdown();
                        }
                        foundParent_ = true;
                    } else {
                        parent = parent.parentBlock_;
                    }
                }

                // If the block is pulled from the parent block, the menus will be reset
                if (!foundParent_) {
                    setEmptyDropdown(this, 'response_queried_object_variable_dropdown');
                }

                // If the new dropdown doesn't have the selectedOption, reset it so that we don't have a selectedOption that isn't on the dropdown
                resetDropdownChoiceIfNoLongerAvailable(this, 'response_queried_object_variable_dropdown');
            }
        },

        getQueryRecordsActionVariables: function (parentBlock, childQueryRecordsActionVariables = []) {
            // Collect every 'action->query records' blocks' variables to populate the dropdown
            for (const childBlock of parentBlock.getChildren(true)) {
                // If the childBlock is a 'query records' action block, get the respective 'variable' field
                const actionType = childBlock.getFieldValue('action_dropdown');
                if (childBlock && childBlock.type === 'action' &&  actionType === 'QUERY_RECORDS') {
                    const actionBlockVariable = childBlock.getFieldValue('query_records_variable_name');
                    childQueryRecordsActionVariables.push(actionBlockVariable);
                }
                childQueryRecordsActionVariables = this.getQueryRecordsActionVariables(childBlock,
                    childQueryRecordsActionVariables);
            }
            return childQueryRecordsActionVariables;
        },

        setVariablesDropdown() {
            const dropdownOptions = getEmptyDropdown();
            for (const queriedObjectVariable of this.queryVariables) {
                dropdownOptions.push([queriedObjectVariable, queriedObjectVariable]);
            }
            this.getField('response_queried_object_variable_dropdown').menuGenerator_ = dropdownOptions;
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('query_variables', this.queryVariables);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.queryVariables = xmlElement.getAttribute('query_variables').split(',')
                .filter((queryVariable) => queryVariable !== '') ;
            this.setVariablesDropdown();
        }
    };

// ---------------------------------------------------
// Block: "response_property_output"
// ---------------------------------------------------

    Blockly.Blocks['response_property_output'] = {
        init: function() {
            this.appendDummyInput('response_property')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-PROPERTY-OUTPUT.TITLE'), 'blockTitle'))
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-PROPERTY-OUTPUT.NAME-PLACEHOLDER')),
                    'response_property_output_name')
            this.setInputsInline(true);
            this.setOutput(true)
            this.setColour(50);
            this.setTooltip('');
            this.setHelpUrl('');
        },
    };

// ---------------------------------------------------
// Block: "response_set_local_endpoint_call"
// ---------------------------------------------------

    Blockly.Blocks['response_set_local_endpoint_call'] = {
        entType: 'NONE',
        endpointEntTypes: [],

        init: function() {
            this.appendDummyInput('response_set')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SET.TITLE'), 'blockTitle'))
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SET.NAME-PLACEHOLDER')),
                    'response_set_local_endpoint_call_name');
            this.appendDummyInput('internal_ent_type')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SET.ENT-TYPE') + ':'))
                .appendField(new Blockly.FieldDropdown(getEntTypes), 'response_set_internal_ent_type')
            appendStatementInputLabel(this, 'internal_property', 'BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SET.PROPERTIES');
            this.appendStatementInput('internal_property')
                .setCheck('response_property_local_endpoint_call');
            this.getField('response_set_local_endpoint_call_name').setValidator(replaceNonAlphanumericCharacters);
            this.getField('response_set_internal_ent_type').setValidator(this.validateEntType)
            this.setOnChange(this.getValuesFromParentBlock);
            this.setInputsInline(false);
            this.setPreviousStatement(true, 'response_set_local_endpoint_call');
            this.setNextStatement(true, ['response_set_local_endpoint_call', 'response_property_local_endpoint_call']);
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
        },

        validateEntType: function(entType) {
            this.sourceBlock_.entType = entType;
        },

        // Get the entTypes in the parent 'when_is_do' block's 'action->create action' block to insert in the entType dropdown
        getValuesFromParentBlock: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;

            // Update dropdown when this block has a newParent or stops having one; when the entType in the parent block changes
            // OR get the entTypes in the parent 'when_is_do' block's parameters to insert in the entType dropdown
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && (changeEvent.name === 'crud_entity_ent_type')) ||
                (changeEvent.type === 'move' && blockType === 'action') ||
                (changeEvent.type === 'delete' && changeEvent.oldJson.type === 'action')
            ) {
                let parent = this.parentBlock_;
                let foundParent_ = false;

                this.restrictConnections = false;
                this.endpointEntTypes = [];

                // Verifies if it's inside a 'when_is_do' block, and searches for its 'action->create entity' blocks entTypes
                while (parent && !foundParent_) {
                    if (parent.type === 'when_is_do') {
                        // We only have this field on the 'when_is_do' block when it's a 'local endpoint call'
                        if (parent.getField('local_endpoint_call_type')) {
                            // Get the entity types from the 'when_is_do' 'action->create entity' child blocks and insert them in entity type dropdown
                            this.endpointEntTypes = this.getCreateEntityActionEntTypes(parent);
                            this.setEntTypesDropdown();
                        }
                        foundParent_ = true;
                    } else {
                        parent = parent.parentBlock_;
                    }
                }

                // If the block is pulled from the parent block, the menus will be reset
                if (!foundParent_) {
                    this.entType = null;
                    setEmptyDropdown(this, 'response_set_internal_ent_type');
                }

                // If the new dropdown doesn't have the selectedOption, reset it so that we don't have a selectedOption that isn't on the dropdown
                if (this.getInput('internal_ent_type')) {
                    resetDropdownChoiceIfNoLongerAvailable(this, 'response_set_internal_ent_type');
                }
            }
        },

        getCreateEntityActionEntTypes: function (parentBlock, childCreateEntityActionEntType = []) {
            // Collect every 'action->create entity' blocks' entity types to populate the ent types dropdown
            for (const childBlock of parentBlock.getChildren(true)) {
                // If the childBlock is a 'create entity' action block, get the respective entType
                // If it's an 'if_then' block, get the inspect the actions inside it
                const actionType = childBlock.getFieldValue('action_dropdown');
                if (childBlock && childBlock.type === 'action' && (actionType === 'INSERT_RECORD' || actionType === 'UPDATE_RECORD')) {
                    const actionBlockEntType = childBlock.getFieldValue('crud_entity_ent_type');
                    if (actionBlockEntType !== 'NONE' && !childCreateEntityActionEntType.includes(actionBlockEntType)) {
                        childCreateEntityActionEntType.push(actionBlockEntType);
                    }
                }
                childCreateEntityActionEntType = this.getCreateEntityActionEntTypes(childBlock,
                    childCreateEntityActionEntType);
            }
            return childCreateEntityActionEntType;
        },

        setEntTypesDropdown() {
            const dropdownOptions = getEmptyDropdown();
            for (const endpointEntType of this.endpointEntTypes) {
                const endpointEntTypeInfo = entTypes.find(entType => entType.id === Number(endpointEntType));
                dropdownOptions.push([endpointEntTypeInfo.name, endpointEntTypeInfo.id.toString()]);
            }
            this.getField('response_set_internal_ent_type').menuGenerator_ = dropdownOptions;
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('ent_type', this.entType);
            container.setAttribute('endpoint_ent_types', this.endpointEntTypes);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.entType = xmlElement.getAttribute('ent_type');
            this.endpointEntTypes = xmlElement.getAttribute('endpoint_ent_types').split(',')
                .filter((entType) => entType !== '');
            this.setEntTypesDropdown();
        }


    };

// ---------------------------------------------------
// Block: "response_success_local_endpoint"
// ---------------------------------------------------

    Blockly.Blocks['response_success_local_endpoint'] = {
        localEndpointCallType: null,

        init: function() {
            this.appendDummyInput('success_response')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SUCCESS.TITLE'), 'blockTitle'))
                .appendField(new Blockly.FieldDropdown(getEmptyDropdown), 'response_success_type')
            this.getField('response_success_type').setValidator(this.handleResponseType)
            this.setOnChange(this.handleChange_);
            this.setInputsInline(false);
            this.setPreviousStatement(true, 'response_success_local_endpoint');
            this.setNextStatement(true, ['response_error_local_endpoint']);
            this.setColour(100);
            this.setTooltip('');
            this.setHelpUrl('');
        },

        handleChange_: function(changeEvent) {
            // Update dropdown when this block has a newParent('when is do' block) or stops having one
            // OR when the local endpoint call type in the 'when is do' block changes
            if ((changeEvent.type === 'move' && changeEvent.blockId === this.id && (changeEvent.newParentId || changeEvent.oldParentId)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'local_endpoint_call_type')) {
                this.localEndpointCallType = this.parentBlock_.getFieldValue('local_endpoint_call_type');
                this.setReturnSuccessOptions();
            }
        },

        setReturnSuccessOptions: function() {
            const responseTypes = [];
            switch (this.localEndpointCallType) {
                case 'POST':
                    responseTypes.push(
                        [translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SUCCESS.DROPDOWN.SUCCESS'), 'SUCCESS-MESSAGE'],
                        [translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SUCCESS.DROPDOWN.CREATED-OBJECT'), 'CREATED-OBJECT']
                    );
                    break;
                case 'GET':
                    responseTypes.push(
                        [translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SUCCESS.DROPDOWN.QUERIED-OBJECT'), 'QUERIED-OBJECT']
                    );
                    break;
                case 'PUT':
                    responseTypes.push(
                        [translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SUCCESS.DROPDOWN.SUCCESS'), 'SUCCESS-MESSAGE'],
                        [translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SUCCESS.DROPDOWN.UPDATED-OBJECT'), 'UPDATED-OBJECT']
                    );
                    break;
                case 'DELETE':
                    responseTypes.push(
                        [translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SUCCESS.DROPDOWN.SUCCESS'), 'SUCCESS-MESSAGE'],
                        [translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SUCCESS.DROPDOWN.DELETED-OBJECT-ID'), 'DELETED-OBJECT-ID']
                    );
                    break;
                default:
                    break;
            }
            this.getField('response_success_type').menuGenerator_ = responseTypes;
            resetDropdownChoiceIfNoLongerAvailable(this, 'response_success_type');
        },

        handleResponseType: function(selectedValue) {
            const block = this.sourceBlock_;
            block.removeInputs();
            switch (selectedValue) {
                case 'SUCCESS-MESSAGE':
                    block.appendDummyInput('response_success_message_text')
                        .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-SUCCESS.DROPDOWN.SUCCESS-MESSAGE')),
                            'response_success_message_text');
                    break;
                case 'CREATED-OBJECT':
                case 'UPDATED-OBJECT':
                    block.appendStatementInput('response_success_objects')
                        .setCheck(['response_property_local_endpoint_call', 'response_set_local_endpoint_call']);
                    break;
                case 'QUERIED-OBJECT':
                    block.appendStatementInput('response_success_objects')
                        .setCheck(['response_queried_object']);
                    break;
                case 'DELETED-OBJECT-ID':
                default:
                    break;

            }
        },

        removeInputs() {
            this.removeInput('response_success_message_text', true);
            this.removeInput('response_success_objects', true);
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('local_endpoint_call_type', this.localEndpointCallType);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.localEndpointCallType = xmlElement.getAttribute('local_endpoint_call_type');
            this.setReturnSuccessOptions();
        }
    };

// ---------------------------------------------------
// Block: "response_error_local_endpoint"
// ---------------------------------------------------

    Blockly.Blocks['response_error_local_endpoint'] = {

        init: function() {
            this.appendDummyInput('success_error')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-ERROR.TITLE'), 'blockTitle'))
                .appendField(new Blockly.FieldDropdown([
                    [translate.instant('BLOCKLY-BLOCKS.LOCAL-ENDPOINT-CALL-RESPONSE-ERROR.DROPDOWN.ERROR'), 'ERROR-MESSAGE'],
                ]), 'response_error_type')
            this.setInputsInline(false);
            this.setPreviousStatement(true, 'response_error_local_endpoint');
            this.setNextStatement(false);
            this.setColour(0);
            this.setTooltip('');
            this.setHelpUrl('');
        },
    };


// -------------------------------------------------------------------------
// ------------------ CATEGORY: BLOCKCHAIN EXECUTION 23-06-2023 ------------

// ---------------------------
// Block: "rollback action rule transaction"
// ---------------------------

    Blockly.Blocks['rollback_transaction'] = {
        init: function() {
            this.appendDummyInput('rollback_transaction')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.ROLLBACK-TRANSACTION.TITLE'),'blockTitle'))
            this.appendDummyInput('rollback_error_message')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.ROLLBACK-TRANSACTION.ERROR-LABEL') + ': '))
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.ROLLBACK-TRANSACTION.ERROR-LABEL-PLACEHOLDER')), 'rollback_error_message');
            this.setPreviousStatement(true, 'rollback_transaction');
            this.setNextStatement(false);
            this.setColour(0);
            this.setTooltip('');
            this.setHelpUrl('');
        },
    };

// -------------------------------------------------------------------------
// ------------------ CATEGORY: CONTEXT VARIABLES --------------------------

// ---------------------------------------------------
// Block: "set context variable"
// ---------------------------------------------------

    Blockly.Blocks['set_context_variable'] = {
        contextVariableId: null,

        init: function() {
            let dropdownChoices = new Blockly.FieldDropdown([
                [translate.instant('BLOCKLY-BLOCKS.SET-CONTEXT-VARIABLE.NEW'), 'NEW'],
                [translate.instant('BLOCKLY-BLOCKS.SET-CONTEXT-VARIABLE.EXISTING'), 'EXISTING']
            ]);
            this.appendDummyInput('blockTitle')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SET-CONTEXT-VARIABLE.TITLE'), 'blockTitle'))
                .appendField(dropdownChoices, 'choice_context_variable');
            this.getField('choice_context_variable').setValidator(this.validatorNewExisting);
            this.setInputsInline(true);
            this.setOutput(true, 'set_context_variable');
            this.setColour(180);
            this.setOnChange(this.updateExistingContextVariables);
        },

        validatorNewExisting(newValue) {
            // Remove inputs to then add them according to choice
            let block = this.sourceBlock_;
            block.removeInputs();
            // Update shape depending on context variable dropdown choice
            switch (newValue) {
                case 'NEW':
                    // In case user wants to create new context variable
                    this.contextVariableId = null;
                    block.updateShapeNewContextVariable_();
                    break;
                case 'EXISTING':
                    // In case user wants to use existing context variables
                    block.updateShapeExistingContextVariable_();
                    break;
                default:
                //code block
            }
        },

        removeInputs: function() {
            let newConstantFieldExists = this.getInput('context_variable_name');
            let existingConstantFieldExists = this.getInput('context_variable_choice');
            if (newConstantFieldExists) {
                this.removeInput('context_variable_name');
            } else if (existingConstantFieldExists) {
                this.removeInput('context_variable_choice');
            }
        },

        updateShapeNewContextVariable_() {
            this.appendDummyInput('context_variable_name')
                .appendField(new Blockly.FieldTextInput(translate.instant('BLOCKLY-BLOCKS.SET-CONTEXT-VARIABLE.DEFAULT-NAME')),
                    'set_context_variable_name');
        },

        updateShapeExistingContextVariable_() {
            this.appendDummyInput('context_variable_choice')
                .appendField(new Blockly.FieldDropdown(getContextVariables, this.setBlockContextVariableId), 'set_context_variable_dropdown');
        },

        setBlockContextVariableId(newValue) {
            const block = this.sourceBlock_;
            block.contextVariableId = newValue;
        },

        updateExistingContextVariables(changeEvent) {
            if (this.getFieldValue('choice_context_variable') === 'EXISTING') {
                // Alter only when this block is created or when another 'set_context_variable' block is deleted or has its name changed
                // No need for these changes when the block is only being moved or the blocks fields are being changed
                const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
                if ((changeEvent.type === 'create' && (changeEvent.blockId === this.id || changeEvent.ids?.includes(this.id))) ||
                    (changeEvent.type === 'delete' && changeEvent.oldJson.type === 'set_context_variable') ||
                    (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'choice_context_variable') ||
                    (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'set_context_variable_name')
                ) {
                    // Get the context variables already saved in the DB
                    const contextVariableOptions = getContextVariables();
                    // Get all 'set context variable' blocks in the workspace
                    const setNewContextVariableBLocks = workspace.getBlocksByType('set_context_variable', true);
                    // For each of these blocks, check if they have a 'new' dropdown. If they do, add their name/blockId to the possible options
                    setNewContextVariableBLocks.forEach((contextVariableBlock) => {
                        if (contextVariableBlock.getField('set_context_variable_name')) {
                            contextVariableOptions.push([contextVariableBlock.getFieldValue('set_context_variable_name'), contextVariableBlock.id]);
                        }
                    });
                    // Set the obtained options in the block's dropdown and reset the current choice if no longer available
                    this.getField('set_context_variable_dropdown').menuGenerator_ = contextVariableOptions;
                    // When the block is being created/loaded, if the selected contextVariable is a 'new' contextVariable
                    // It will only have that option in the dropdown at this point, so we select that option
                    if (this.getFieldValue('set_context_variable_dropdown') !== this.contextVariableId) {
                        this.setFieldValue(this.contextVariableId, 'set_context_variable_dropdown');
                    }
                    resetDropdownChoiceIfNoLongerAvailable(this, 'set_context_variable_dropdown');
                }
            }
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('context_variable_id', this.contextVariableId);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.contextVariableId = xmlElement.getAttribute('context_variable_id');
        }
    };

// ---------------------------------------------------
// Block: "get context variable"
// ---------------------------------------------------

    Blockly.Blocks['get_context_variable'] = {
        contextVariableId: null,

        init: function() {
            this.appendDummyInput('blockTitle')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.GET-CONTEXT-VARIABLE.TITLE'), 'blockTitle'));
            this.appendDummyInput('get_context_variable_choice')
                .appendField(new Blockly.FieldDropdown(getContextVariables, this.setBlockContextVariableId), 'get_context_variable_dropdown');
            this.setInputsInline(true);
            this.setOutput(true,'get_context_variable');
            this.setColour(180);
            this.setOnChange(this.updateExistingContextVariables);
        },

        setBlockContextVariableId(newValue) {
            const block = this.sourceBlock_;
            block.contextVariableId = newValue;
        },

        updateExistingContextVariables(changeEvent) {
            // Alter only when this block is created or when the 'set_context_variable' block is deleted or has its name changed
            // No need for these changes when the block is only being moved or the blocks fields are being changed
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            if ((changeEvent.type === 'create' && (changeEvent.blockId === this.id || changeEvent.ids?.includes(this.id))) ||
                (changeEvent.type === 'delete' && changeEvent.oldJson.type === 'set_context_variable') ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'choice_context_variable') ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'set_context_variable_name')
            ) {
                // Get the context variables already saved in the DB
                const contextVariableOptions = getContextVariables();
                // Get all 'set context variable' blocks in the workspace
                const setNewContextVariableBLocks = workspace.getBlocksByType('set_context_variable', true);
                // For each of these blocks, check if they have a 'new' dropdown. If they do, add their name/blockId to the possible options
                setNewContextVariableBLocks.forEach((contextVariableBlock) => {
                    if (contextVariableBlock.getField('set_context_variable_name')) {
                        contextVariableOptions.push([contextVariableBlock.getFieldValue('set_context_variable_name'), contextVariableBlock.id]);
                    }
                });
                // Set the obtained options in the block's dropdown and reset the current choice if no longer available
                this.getField('get_context_variable_dropdown').menuGenerator_ = contextVariableOptions;
                // When the block is being created/loaded, if the selected contextVariable is a 'new' contextVariable
                // It will only have that option in the dropdown at this point, so we select that option
                if (this.getFieldValue('get_context_variable_dropdown') !== this.contextVariableId) {
                    this.setFieldValue(this.contextVariableId, 'get_context_variable_dropdown');
                }
                resetDropdownChoiceIfNoLongerAvailable(this, 'get_context_variable_dropdown');
            }
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('context_variable_id', this.contextVariableId);
            return container;
        },

        domToMutation: function (xmlElement) {
             this.contextVariableId = xmlElement.getAttribute('context_variable_id');
        }
    };

// ---------------------------------------------------
// Block: "update context variable"
// ---------------------------------------------------

    Blockly.Blocks['update_context_variable'] = {
        contextVariableId: null,

        init: function() {
            this.appendDummyInput('blockTitle')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.UPDATE-CONTEXT-VARIABLE.TITLE'), 'blockTitle'));
            this.appendDummyInput('update_context_variable_choice')
                .appendField(new Blockly.FieldDropdown(getContextVariables, this.setBlockContextVariableId), 'update_context_variable_dropdown');
            this.setInputsInline(true);
            this.setOutput(true,'update_context_variable');
            this.setColour(180);
            this.setColour(180);
            this.setOnChange(this.updateExistingContextVariables);
        },

        setBlockContextVariableId(newValue) {
            const block = this.sourceBlock_;
            block.contextVariableId = newValue;
        },

        updateExistingContextVariables(changeEvent) {
            // Alter only when this block is created or when the 'set_context_variable' block is deleted or has its name changed
            // No need for these changes when the block is only being moved or the blocks fields are being changed
            if ((changeEvent.type === 'create' && changeEvent.blockId === this.id) ||
                (changeEvent.type === 'delete' && changeEvent.oldJson.type === 'set_context_variable') ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'choice_context_variable') ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && changeEvent.name === 'set_context_variable_name')
            ) {
                // Get the context variables already saved in the DB
                const contextVariableOptions = getContextVariables();
                // Get all 'set context variable' blocks in the workspace
                const setNewContextVariableBLocks = workspace.getBlocksByType('set_context_variable', true);
                // For each of these blocks, check if they have a 'new' dropdown. If they do, add their name/blockId to the possible options
                setNewContextVariableBLocks.forEach((contextVariableBlock) => {
                    if (contextVariableBlock.getField('set_context_variable_name')) {
                        contextVariableOptions.push([contextVariableBlock.getFieldValue('set_context_variable_name'), contextVariableBlock.id]);
                    }
                });
                // Set the obtained options in the block's dropdown and reset the current choice if no longer available
                this.getField('update_context_variable_dropdown').menuGenerator_ = contextVariableOptions;
                // When the block is being created/loaded, if the selected contextVariable is a 'new' contextVariable
                // It will only have that option in the dropdown at this point, so we select that option
                if (this.getFieldValue('update_context_variable_dropdown') !== this.contextVariableId) {
                    this.setFieldValue(this.contextVariableId, 'update_context_variable_dropdown');
                }
                resetDropdownChoiceIfNoLongerAvailable(this, 'update_context_variable_dropdown');
            }
        },

        mutationToDom: function () {
            let container = document.createElement('mutation');
            container.setAttribute('context_variable_id', this.contextVariableId);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.contextVariableId = xmlElement.getAttribute('context_variable_id');
        }
    };

// -------------------------------------------------------------------------
// ------------------ CATEGORY: SCHEDULING SLOTS ---------------------------


// -----------------------------------
// Block: "schedule_block"
// -----------------------------------

    Blockly.Blocks['schedule_block'] = {

        init: function() {
            this.appendDummyInput('schedule_block_title')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE.TITLE'), 'blockTitle'));
            this.appendDummyInput('schedule_block_entity_type')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE.ENTITY-TYPE') + ':'),
                    'scheduling_entity_type_label')
                .appendField(new Blockly.FieldDropdown(getEntTypes), 'schedule_block_entity_type');
            this.appendValueInput('scheduling_user')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE.RESPONSIBLE-USER') + ':'))
                .setCheck('property_simplified_output');
            this.appendValueInput('scheduling_start_date')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE.START-DATE') + ':'))
                .setCheck('property_simplified_output');
            this.appendValueInput('scheduling_start_time')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE.START-TIME') + ':'))
                .setCheck('property_simplified_output');
            this.appendValueInput('scheduling_end_date')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE.END-DATE') + ':'))
                .setCheck('property_simplified_output');
            this.appendValueInput('schedule_end_time')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE.END-TIME') + ':'))
                .setCheck('property_simplified_output');
            this.appendValueInput('schedule_weekdays')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE.WEEKDAYS') + ':'))
                .setCheck('property_simplified_output');
            this.appendValueInput('schedule_duration')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE.DURATION') + ':'))
                .setCheck('property_simplified_output');
            this.appendValueInput('scheduling_slots_count')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE.SLOT-COUNT') + ':'))
                .setCheck('property_simplified_output');
            this.setInputsInline(false);
            this.setPreviousStatement(true, 'schedule_block');
            this.setNextStatement(false);
            this.setColour(290);
        },
    };

// -----------------------------------
// Block: "scheduling_slot"
// -----------------------------------

    Blockly.Blocks['scheduling_slot'] = {

        init: function() {
            this.appendDummyInput('scheduling_slot_title')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE-SLOT.TITLE'), 'blockTitle'));
            this.appendDummyInput('scheduling_slot_entity_type')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE-SLOT.ENTITY-TYPE') + ':'),
                    'scheduled_slot_entity')
                .appendField(new Blockly.FieldDropdown(getEntTypes), 'scheduling_slot_entity_type');
            this.appendValueInput('scheduled_slot_agenda')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE-SLOT.SCHEDULE-REF') + ':'))
                .setCheck('property_simplified_output');
            this.appendValueInput('scheduled_slot_number')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE-SLOT.SLOT-NUMBER') + ':'))
                .setCheck('property_simplified_output');
            this.appendValueInput('scheduled_slot_day')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE-SLOT.DAY') + ':'))
                .setCheck('property_simplified_output');
            this.appendValueInput('scheduled_slot_start_time')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE-SLOT.START-TIME') + ':'))
                .setCheck('property_simplified_output');
            this.appendValueInput('scheduled_slot_end_time')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULE-SLOT.END-TIME') + ':'))
                .setCheck('property_simplified_output');
            appendStatementInputCheckboxLabel(this, 'scheduled_slot_additional_properties', 'BLOCKLY-BLOCKS.SCHEDULE-SLOT.ADDITIONAL-PROPERTIES', true, this.validateCheckboxAdditionalPropertiesSchedulingSlot)
            this.appendStatementInput('scheduled_slot_additional_properties')
                .setCheck('scheduling_additional_property');
            this.setInputsInline(false);
            this.setPreviousStatement(true, 'scheduling_slot');
            this.setNextStatement(false);
            this.setColour(290);
        },

        validateCheckboxAdditionalPropertiesSchedulingSlot: function(newValue) {
            let block = this.sourceBlock_;
            removeStatementInputWithLabel(block, 'scheduled_slot_additional_properties');
            const i18nFieldLabel = 'BLOCKLY-BLOCKS.SCHEDULE-SLOT.ADDITIONAL-PROPERTIES';
            const checkboxValue = newValue === 'TRUE';
            appendStatementInputCheckboxLabel(block, 'scheduled_slot_additional_properties', i18nFieldLabel, checkboxValue, block.validateCheckboxAdditionalPropertiesSchedulingSlot);
            if (newValue === 'TRUE') {
                block.appendStatementInput('scheduled_slot_additional_properties')
                    .setCheck('scheduling_additional_property');
            }
        },
    };

// -----------------------------------
// Block: "scheduling_additional_property"
// -----------------------------------

    Blockly.Blocks['scheduling_additional_property'] = {

        init: function() {
            this.appendDummyInput('scheduling_additional_property_title')
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.SCHEDULING-ADDITIONAL-PROPERTY.TITLE'), 'blockTitle'));
            this.appendEndRowInput('scheduling_additional_property_end_first_row');
            this.appendValueInput('scheduling_additional_property')
                .setCheck(['property_simplified_output']);
            this.appendDummyInput('scheduling_additional_property_operator')
                .appendField('=', 'term_property_operator');
            this.appendValueInput('scheduling_additional_property_term_input')
                .setCheck(['constant', 'value', 'property_single', 'property_value', 'compute_expression',
                    'query', 'current_user', 'current_user_role', 'get_context_variable']);
            this.setInputsInline(true);
            this.setPreviousStatement(true, 'scheduling_additional_property');
            this.setNextStatement(true, ['scheduling_additional_property']);
            this.setColour(280);
            this.setOnChange(this.handleChange_);
        },

        handleChange_: function(changeEvent) {
            const blockType = workspace.getBlockById(changeEvent.blockId)?.type;
            const termPropertyExpressionInputBlocks = ['constant', 'value', 'property_single', 'property_value',
                'compute_expression', 'query', 'current_user', 'get_context_variable', 'property_simplified_output'];
            // Check for valueType compatibility in the block's two inputs
            // When blocks are attached to these inputs or when they are detached/deleted,
            // or when the attached block's fields change (ex: chosen property changes / value's value type changes)
            // Also, When block is duplicated, keep the warning in case it had one
            if ((changeEvent.type === 'move' && termPropertyExpressionInputBlocks.includes(blockType)) ||
                (changeEvent.type === 'delete' && termPropertyExpressionInputBlocks.includes(changeEvent.oldJson.type)) ||
                (changeEvent.type === 'change' && changeEvent.element === 'field' && termPropertyExpressionInputBlocks.includes(blockType)) ||
                (changeEvent.type === 'create' && changeEvent.blockId === this.id)
            ) {
                checkInputValueTypeCompatibility(this, 'scheduling_additional_property',
                    'scheduling_additional_property_term_input');
            }
        },
    };


// ---------------------------------------------------
// Block: "test date"
// ---------------------------------------------------

    Blockly.Blocks['test_date'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(translate.instant('BLOCKLY-BLOCKS.VALIDATION-CONDITION.TITLE'), 'blockTitle'))
                .appendField(new Blockly.FieldDate('2020-02-02'));
            this.setOutput(true,'validation_condition');
            this.setColour(180);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };

}
