/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

// -------------------------------------------------------------------------
// --------------------------- CATEGORY: GENERAL ---------------------------


// ------------------------------------------------
// ------------- Block: "when_is_do" --------------

Blockly.JavaScript['when_is_do'] = function(block) {
    return '<action_rule>' +
        '<transaction_type>' + block.getFieldValue('when_is_do_transaction_type') + '</transaction_type>' +
        '<type>' + block.getFieldValue('action_rule_type') + '</type>' +
        '<t_state>' + block.getFieldValue('when_is_do_t_state') + '</t_state>' +
        '<actions>' + Blockly.JavaScript.statementToCode(block, 'actions') + '</actions>' +
        '</action_rule>'
};


// ------------------------------------------------
// ------------- Block: "action" ------------------

Blockly.JavaScript['action'] = function(block) {
    let actionType = block.getFieldValue('action_dropdown');

    let code = '<action>' +
        '<type>' + actionType + '</type>' +
        '<comment>' + _.escape(block.commentText) + '</comment>';

    if (actionType === 'ASSIGN_EXPRESSION')
    {
        code +=
            '<first_term>' + Blockly.JavaScript.valueToCode(block, 'assign_expression_first_input', Blockly.JavaScript.ORDER_ATOMIC) + '</first_term>\n' +
            '<second_term>' + Blockly.JavaScript.valueToCode(block, 'assign_expression_second_input', Blockly.JavaScript.ORDER_ATOMIC) + '</second_term>' +
            '<operator>=</operator>';
    }

    else if (actionType === 'USER_INPUT_MULT_ENT_TYPES' || actionType === 'USER_INPUT_SINGLE_ENT_TYPE')
    {
        code += '<action_name>' + _.escape(block.getFieldValue('action_name')) + '</action_name>';
        code += '<properties>' + Blockly.JavaScript.statementToCode(block, 'properties') + '</properties>';
        if (block.getInput('term_properties')) {
            code += '<derived_facts>' + Blockly.JavaScript.statementToCode(block, 'term_properties') + '</derived_facts>';
        }
    }

    else if (actionType === 'EDIT_ENTITY_INSTANCE') {
        code += '<action_name>' + _.escape(block.getFieldValue('action_name')) + '</action_name>';
        if (block.hasEntityDetailsBlock) {
            code += '<entity_details>' + Blockly.JavaScript.statementToCode(block, 'entityDetails') + '</entity_details>';
        } else if (block.hasEntityFiltersBlock) {
            code += '<entity_filters>' + Blockly.JavaScript.statementToCode(block, 'entityFilters') + '</entity_filters>';
        }
        if (block.getInput('properties')) {
            code += '<properties>' + Blockly.JavaScript.statementToCode(block, 'properties') + '</properties>';
        }
        if (block.getInput('term_properties')) {
            code += '<derived_facts>' + Blockly.JavaScript.statementToCode(block, 'term_properties') + '</derived_facts>';
        }
    }

    else if (actionType === 'CAUSAL_LINK')
    {
        code += '<transaction_type>' + block.getFieldValue('causal_link_transaction_type') + '</transaction_type>' +
            '<transaction_state>' + block.getFieldValue('c_fact') + '</transaction_state>' +
            '<cancel_process>' + block.getFieldValue('cancel_process') + '</cancel_process>' +
            '<continue_same_user>' + block.getFieldValue('continue_same_user') + '</continue_same_user>' +
            '<min>' + block.getFieldValue('min') + '</min>' +
            '<max>' + block.getFieldValue('max') + '</max>';
    }

    else if (actionType === 'USER_OUTPUT')
    {
        let dropdown_choice = block.getFieldValue('uo_template_choice');
        if (dropdown_choice === 'NEW') {

            let dropdown_template_type = block.getFieldValue('template_type');

            code += '<new_template>'  +
                '<blockId>' + block.id + '</blockId>' +
                '<type>' + dropdown_template_type + '</type>' +
                '<name>' + block.getFieldValue('template_name') + '</name>';

            let new_template_text;
            if (block.template_editor_text_) {
                code += '<openedEditor>opened</openedEditor>';
                new_template_text = block.template_editor_text_;
            } else {
                code += '<openedEditor>didnt_open</openedEditor>';
                new_template_text = new_template_text = block.getFieldValue('template_text');
            }

            code += '<text>' + _.escape(new_template_text) + '</text>';

            if (dropdown_template_type === 'MODAL') {

                code += '<header>' + _.escape(block.getFieldValue('template_header')) + '</header>' +
                    '<button>' + _.escape(block.getFieldValue('template_button')) + '</button>';

            } else if (dropdown_template_type === 'TOAST') {

                let template_class = block.getFieldValue('template_class');
                code += '<class>' + template_class + '</class>';

                if (template_class === 'CUSTOM') {

                    code += '<colour>' + block.getFieldValue('template_colour') + '</colour>' +
                        '<title>' + _.escape(block.getFieldValue('template_title')) + '</title>';

                }
            }

            code += '</new_template>' ;

        } else if (dropdown_choice === 'EXISTING') {

            code += '<existing_template>' + block.getFieldValue('template_text') + '</existing_template>' ;

        }
    }
    else if (actionType === 'CREATE_SCHEDULE_SLOTS')
    {
        code += '<schedule_slot_origin>' + Blockly.JavaScript.statementToCode(block, 'schedule_slots_scheduling_entity') + '</schedule_slot_origin>';
        code += '<schedule_slot_result>' + Blockly.JavaScript.statementToCode(block, 'schedule_slots_slot_records') + '</schedule_slot_result>';
    }

    code += '</action>\n';

    return code;
};


// ------------------------------------------------
// ------------- Block: "if_then" -----------------

Blockly.JavaScript['if_then'] = function(block) {
    let code = '<action>' +
        '<type>IF</type>' +
        '<ifCondition>' + Blockly.JavaScript.statementToCode(block, 'if_input') + '</ifCondition>' +
        '<thenAction>' + Blockly.JavaScript.statementToCode(block, 'then_input') + '</thenAction>';

    let statements_else_input = Blockly.JavaScript.statementToCode(block, 'else_input');

    if (statements_else_input) {
        code += '<elseAction>' + statements_else_input + '</elseAction>'
    }

    code += '</action>';

    return code;
};


// ------------------------------------------------
// ------------- Block: "while" -------------------

Blockly.JavaScript['while'] = function(block) {
    return '<action>' +
        '<type>WHILE</type>' +
        '<whileCondition>' + Blockly.JavaScript.statementToCode(block, 'while_condition') + '</whileCondition>' +
        '<doAction>' + Blockly.JavaScript.statementToCode(block, 'while_action') + '</doAction>' +
        '</action>';
};


// ------------------------------------------------
// ------------- Block: "for_each_set_do" ---------

Blockly.JavaScript['for_each_set_do'] = function(block) {
    return '<action>' +
        '<type>FOR_EACH_SET</type>' +
        '<set>' + block.getFieldValue('for_each_set') + '</set>' +
        '<doAction>' + Blockly.JavaScript.statementToCode(block, 'for_each_do') + '</doAction>' +
        '</action>';
};

// -------------------------------------------------------------------------
// --------------------------- CATEGORY: EVALUATE --------------------------

// ------------------------------------------------
// ------------- Block: "condition" ---------------

Blockly.JavaScript['condition'] = function(block) {
    return '<condition>' +
        '<type>' + block.getFieldValue('choice_condition') + '</type>' +
        '<terms>' + Blockly.JavaScript.statementToCode(block, 'input_terms') + '</terms>' +
        '</condition>';
};


// ------------------------------------------------
// ------ Block: "comp_evaluated_expression" ------

Blockly.JavaScript['comp_evaluated_expression'] = function(block) {
    return '<comp_evaluated_expression>' +
        '<left_term>' + Blockly.JavaScript.valueToCode(block, 'comp_evaluated_expression_first_input', Blockly.JavaScript.ORDER_ATOMIC) + '</left_term>' +
        '<operator>' + _.escape(block.getFieldValue('operator')) + "</operator>" +
        '<right_term>' + Blockly.JavaScript.valueToCode(block, 'comp_evaluated_expression_second_input', Blockly.JavaScript.ORDER_ATOMIC) + '</right_term>' +
        '</comp_evaluated_expression>' + '\n';
};


// ------------------------------------------------
// ------ Block: "user_evaluated_expression" ------

Blockly.JavaScript['user_evaluated_expression'] = function(block) {
    let dropdown_choice = block.getFieldValue('choice_expression');

    let code = '<user_evaluated_expression>';

    if (dropdown_choice === 'NEW') {

        code += '<new_expression>' +
            '<name>' + block.getFieldValue('expression_name') + '</name>';

        let newTemplateText;

        if (block.expression_editor_text) {
            newTemplateText = block.expression_editor_text;
            code += '<openedEditor>opened</openedEditor>';
        } else {
            newTemplateText = block.getFieldValue('expression_text');
            code += '<openedEditor>didnt_open</openedEditor>';
        }

        code += '<text>' + _.escape(newTemplateText) + '</text>' +
            '</new_expression>' ;

    } else if (dropdown_choice === 'EXISTING') {

        code += '<existing_expression>' + block.getFieldValue('existing_expression') + '</existing_expression>' ;

    }

    code += '</user_evaluated_expression>';

    return code;
};



// -------------------------------------------------------------------------
// --------------------------- CATEGORY: COMPUTE ---------------------------

// ------------------------------------------------
// ------- Block: "compute_expression" ------------

Blockly.JavaScript['compute_expression'] = function(block) {

    let additionalInputsNumber = block.additionalInputs_;
    let additionalInputs = new Array(additionalInputsNumber).fill(null);

    let code = '<compute_expression>';

    for (let i = 0; i < additionalInputsNumber ; i++) {
        let hasInput = Blockly.JavaScript.valueToCode(block, 'additionalInput' + i, Blockly.JavaScript.ORDER_ATOMIC);
        if (hasInput) {
            additionalInputs[i] = hasInput;
        }
    }

    code += '<operator>' + _.escape(block.getFieldValue('choice_operator')) + '</operator>' +
        '<term>' + Blockly.JavaScript.valueToCode(block, 'input_term1', Blockly.JavaScript.ORDER_ATOMIC) + '</term>' +
        '<term>' +  Blockly.JavaScript.valueToCode(block, 'input_term2', Blockly.JavaScript.ORDER_ATOMIC) + '</term>';

    for (let i = 0; i < additionalInputs.length ; i++) {
        if (additionalInputs[i]) {
            code += '<term>' + additionalInputs[i] + '</term>';
        }
    }

    if (block.valueType === 'time') {
        code += '<time_result_in>' + _.escape(block.getFieldValue('timeDateResultDropdown')) + '</time_result_in>';
    }

    code += '</compute_expression>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// ------------------------------------------------
// -------------- Block: "query" ------------------

Blockly.JavaScript['query'] = function(block) {
    let code = '<query>' +
        '<value>' + block.getFieldValue('query_choice') + '</value>';
    for (const queryFilterParam of block.queryFilterParameters) {
        code += '<query_parameter>' +
            '<query_filter_id>' + queryFilterParam + '</query_filter_id>'+
            '<term>' + Blockly.JavaScript.valueToCode(block, 'termInput' + queryFilterParam, Blockly.JavaScript.ORDER_ATOMIC) + '</term>' +
            '</query_parameter>'
    }

    code += '</query>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// ------------------------------------------------
// -------------- Block: "constant" ---------------

Blockly.JavaScript['constant'] = function(block) {
    let dropdown_choice = block.getFieldValue('choice_constant');
    let code = '<constant>';

    if (dropdown_choice === 'NEW') {

        code += '<new_constant>' +
            '<name>' + _.escape(block.getFieldValue('constant_name')) + '</name>' +
            '<value_type>' + block.getFieldValue('value_type') + '</value_type>' +
            '<value>' + _.escape(block.getFieldValue('value')) + '</value>' +
            '</new_constant>' ;

    } else if (dropdown_choice === 'EXISTING') {

        code += '<existing_constant>' + block.getFieldValue('constant_choice_dropdown') + '</existing_constant>' ;

    }

    code += '<numeric_constants_only>' + block.numericConstantsOnly + '</numeric_constants_only>'
    code += '<numeric_time_constants_only>' + block.numericTimeConstantsOnly + '</numeric_time_constants_only>'
    code += '<numeric_date_time_constants_only>' + block.numericDateTimeConstantsOnly + '</numeric_date_time_constants_only>'
    code += '</constant>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// ---------------------------------------------
// -------------- Block: "value" ---------------

Blockly.JavaScript['value'] = function(block) {
    let code = '<value>' +
        '<value>' + _.escape(block.getFieldValue('value')) + '</value>' +
        '<value_type>' + block.getFieldValue('value_type') + '</value_type>' +
        '</value>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};

// ------------------------------------------------
// -------------- Block: "current_user" -----------

Blockly.JavaScript['current_user'] = function(block) {
    let code = '<current_user>TRUE</current_user>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// ------------------------------------------------
// -------------- Block: "current_user_role" ------

Blockly.JavaScript['current_user_role'] = function(block) {
    let code = '<current_user_role>TRUE</current_user_role>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// ------------------------------------------------
// -------------- Block: "user_role" --------------

Blockly.JavaScript['user_role'] = function(block) {
    let code = '<user_role>' + block.getFieldValue('user_role_choice') + '</user_role>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};



// -----------------------------------------------------------------------
// --------------------------- CATEGORY: USER INPUT ----------------------

// ------------------------------------------------
// -------------- Block: "property_simplified" ----

Blockly.JavaScript['property_simplified'] = function(block) {
    let code = '<property_userInput>' +
        '<property_id>' + block.getFieldValue('user_input_property') + '</property_id>' +
        Blockly.JavaScript.valueToCode(block, 'form_calculation', Blockly.JavaScript.ORDER_ATOMIC) +
        Blockly.JavaScript.valueToCode(block, 'enable_condition', Blockly.JavaScript.ORDER_ATOMIC) +
        Blockly.JavaScript.valueToCode(block, 'validation_condition', Blockly.JavaScript.ORDER_ATOMIC) +
        Blockly.JavaScript.valueToCode(block, 'property_filter', Blockly.JavaScript.ORDER_ATOMIC);

    if (block.inputOptionsFromQuery_) {
        code += '<options_from_query>' + Blockly.JavaScript.valueToCode(block, 'options_from_query', Blockly.JavaScript.ORDER_ATOMIC) + '</options_from_query>';
    }

    code += '<mandatory>' + block.getFieldValue('mandatory_checkbox') + '</mandatory> </property_userInput>';

    return code;
};

// ------------------------------------------------
// -------------- Block: "property" ---------------

Blockly.JavaScript['property'] = function(block) {
    let code = '<property_userInput>' +
        '<property_id>' + block.getFieldValue('user_input_property') + '</property_id>' +
        Blockly.JavaScript.valueToCode(block, 'form_calculation', Blockly.JavaScript.ORDER_ATOMIC) +
        Blockly.JavaScript.valueToCode(block, 'enable_condition', Blockly.JavaScript.ORDER_ATOMIC) +
        Blockly.JavaScript.valueToCode(block, 'validation_condition', Blockly.JavaScript.ORDER_ATOMIC) +
        Blockly.JavaScript.valueToCode(block, 'property_filter', Blockly.JavaScript.ORDER_ATOMIC);

    if (block.inputOptionsFromQuery_) {
        code += '<options_from_query>' + Blockly.JavaScript.valueToCode(block, 'options_from_query', Blockly.JavaScript.ORDER_ATOMIC) + '</options_from_query>';
    }

    code += '<mandatory>' + block.getFieldValue('mandatory_checkbox') + '</mandatory>' +
        '</property_userInput>';

    return code;

};

// ------------------------------------------------
// // --------- Block: "form_property_output" -----

Blockly.JavaScript['form_property_output'] = function(block) {

    let code = '';

    if (block.valueType === 'entity_instances') {
        code = '<entity_specification_term>' +
            '<entity_type_id>' + block.getFieldValue('user_input_ent_type') + '</entity_type_id>'
    } else {
        code =  '<property_specification_term>' +
            '<property_id>' + block.getFieldValue('user_input_property') + '</property_id>' +
            Blockly.JavaScript.valueToCode(block, 'validation_condition', Blockly.JavaScript.ORDER_ATOMIC);
    }

    if (block.hasEntityDetailsBlock) {
        code += '<entity_details>' + Blockly.JavaScript.statementToCode(block, 'entityDetails') + '</entity_details>';
    } else if (block.inputOptionsFromQuery_) {
        code += '<options_from_query>' + Blockly.JavaScript.valueToCode(block, 'options_from_query', Blockly.JavaScript.ORDER_ATOMIC) + '</options_from_query>';
    }

    code += '<mandatory>' + block.getFieldValue('mandatory_checkbox') + '</mandatory>';

    code += block.valueType === 'entity_instances' ? '</entity_specification_term>' : '</property_specification_term>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// ------------------------------------------------
// -------------- Block: "term property" ----------

Blockly.JavaScript['property_simplified_output'] = function(block) {
    const code = '<property_simplified_output>' +  block.getFieldValue('property_simplified_output') + '</property_simplified_output>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// ------------------------------------------------
// -------------- Block: "term property" ----------

Blockly.JavaScript['term_property'] = function(block) {
    return '<derivedFact_userInput>' +
        '<property>' + Blockly.JavaScript.valueToCode(block, 'term_property_property_input', Blockly.JavaScript.ORDER_ATOMIC) + '</property>' +
        '<term>' + Blockly.JavaScript.valueToCode(block, 'term_property_term_input', Blockly.JavaScript.ORDER_ATOMIC) + '</term>' +
        '</derivedFact_userInput>';
};


// ------------------------------------------------
// ------- Block: "form_calculation" --------------

Blockly.JavaScript['form_calculation'] = function(block) {

    let additionalInputsNumber = block.additionalInputs_;
    let additionalInputs = new Array(additionalInputsNumber).fill(null);
    let code = '<form_calculation>';

    for (let i = 0; i < additionalInputsNumber ; i++) {
        let hasInput = Blockly.JavaScript.valueToCode(block, 'additionalInput' + i, Blockly.JavaScript.ORDER_ATOMIC);
        if (hasInput) {
            additionalInputs[i] = hasInput;
        }
    }

    code += '<operator>' + _.escape(block.getFieldValue('choice_operator')) + '</operator>' +
        '<term>' + Blockly.JavaScript.valueToCode(block, 'input_term1', Blockly.JavaScript.ORDER_ATOMIC) + '</term>' +
        '<term>' +  Blockly.JavaScript.valueToCode(block, 'input_term2', Blockly.JavaScript.ORDER_ATOMIC) + '</term>';

    for (let i = 0; i < additionalInputs.length ; i++) {
        if (additionalInputs[i]) {
            code += '<term>' + additionalInputs[i] + '</term>';
        }
    }

    code += '</form_calculation>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};



// ------------------------------------------------
// --------- Block: "enable_condition" ------------

Blockly.JavaScript['enable_condition'] = function(block) {
    let code = '<enable_condition>' + Blockly.JavaScript.statementToCode(block, 'condition') + '</enable_condition>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// ------------------------------------------------
// --------- Block: "validation_condition" --------

Blockly.JavaScript['validation_condition'] = function(block) {
    let code = '<validation_condition>' + Blockly.JavaScript.statementToCode(block, 'conditions') + '</validation_condition>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// ------------------------------------------------
// --- Block: "condition_validation_condition" ----

Blockly.JavaScript['condition_validation_condition'] = function(block) {
    const condition_type = block.getFieldValue('dropdown_choice');
    const dropdown_user_output = block.getFieldValue('choice_template');
    let code;

    code = '<condition_validation_condition>' +
        '<negation>' + block.getFieldValue('negation') + '</negation>' +
        '<dropdown_type>' + condition_type + '</dropdown_type>' +
        '<term1>' + block.getFieldValue('term1') + '</term1>' +
        '<term2>' + block.getFieldValue('term2') + '</term2>' +
        '<valueType>' + block.valueType + '</valueType>' +
        '<multipleValues>' + block.multipleValues + '</multipleValues>';

    if (condition_type === 'REG_EXPRESSION' || condition_type === 'CUSTOM_VALIDATION') {
        if (dropdown_user_output === 'NEW') {

            code += '<new_template>' +
                '<text>' + _.escape(block.getFieldValue('template_field')) + '</text>' +
                '</new_template>' ;

        } else if (dropdown_user_output === 'EXISTING') {

            code += '<existing_template>' + block.getFieldValue('template_field') + '</existing_template>' ;

        }
    }
    code += '</condition_validation_condition>';

    return code;
};


// ------------------------------------------------
// --------- Block: "property_filter" -------------

Blockly.JavaScript['property_filter'] = function(block) {
    let code = '<property_filter>' + Blockly.JavaScript.statementToCode(block, 'filters') + '</property_filter>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// ------------------------------------------------
// --- Block: "filter_property_filter" ------------

Blockly.JavaScript['filter_property_filter'] = function(block) {
    return '<filter>' +
        Blockly.JavaScript.valueToCode(block, 'filtered_property', Blockly.JavaScript.ORDER_ATOMIC) +
        '<operator>' + block.getFieldValue('filter_operator') + '</operator>' +
        '<term>' + Blockly.JavaScript.valueToCode(block, 'property_filter_second_input', Blockly.JavaScript.ORDER_ATOMIC) + '</term>' +
        '</filter>';
};


// ------------------------------------------------
// --- Block: "filter_referenced_property_select" -

Blockly.JavaScript['filter_referenced_property_select'] = function(block) {
    const code = '<property>' + block.getFieldValue('filter_referenced_property') + '</property>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};

// ------------------------------------------------
// --------- Block: "ent_type_form" ---------------

Blockly.JavaScript['ent_type_form'] = function(block) {

    return Blockly.JavaScript.statementToCode(block, 'properties');

};



// -------------------------------------------------------------------------
// --------------------------- CATEGORY: PROPERTY --------------------------

// ------------------------------------------------
// // --------- Block: "property_single" ----------

Blockly.JavaScript['property_single'] = function(block) {
    let code = '<property>' +
        '<value>' + block.getFieldValue('property_output') + '</value>';

    if (block.getFieldValue('property_single_entity_scope') === 'SPECIFIC_ENTITY') {
        code += '<specific_entity_term>' + Blockly.JavaScript.valueToCode(block, 'ddEntityScope', Blockly.JavaScript.ORDER_ATOMIC) + '</specific_entity_term>'
    }

    code += '</property>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// ------------------------------------------------
// --------- Block: "property_value" --------------

Blockly.JavaScript['property_value'] = function(block) {
    let code = '<property_value>' +
        '<value>' + block.getFieldValue('property_values') + '</value>' +
        '<propertyID>' + block.propertyID + '</propertyID>' +
        '</property_value>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};

// -------------------------------------------------------------------------
// ------ 'EDIT ENTITY INSTANCE ACTION' AUX BLOCKS -------------------------

// ------------------------------------------------
// --------- Block: "entity_details" --------------

Blockly.JavaScript['entity_details'] = function(block) {

    let code = '';
    for (const selectedProperty of block.selectedPropDetails) {
        code += '<property>' + selectedProperty + '</property>';
    }

    return code;
};

// ------------------------------------------------
// --------- Block: "entity_filters" --------------

Blockly.JavaScript['entity_filters'] = function(block) {

    let code = '';
    if (block.getInput('instances_from_query')) {
        code = Blockly.JavaScript.valueToCode(block, 'instances_from_query', Blockly.JavaScript.ORDER_ATOMIC);
    } else if (block.getInput('entity_filters_specific_instance')) {
        code = Blockly.JavaScript.valueToCode(block, 'entity_filters_specific_instance', Blockly.JavaScript.ORDER_ATOMIC);
    }

    return code;
};

// -------------------------------------------------------------------------
// --------------------------- CATEGORY: CONTEXT VARIABLES -----------------

// -----------------------------------------------------------
// -------------- Block: "set_context_variable" --------------

Blockly.JavaScript['set_context_variable'] = function(block) {
    let code = '<context_variable>' +
        '<type>set</type>';

    if (block.getFieldValue('choice_context_variable') === 'NEW') {
        code += '<new_context_variable>' +
                '<name>' + _.escape(block.getFieldValue('set_context_variable_name')) + '</name>' +
                '<block_id>' + block.id + '</block_id>' +
            '</new_context_variable>';
    } else {
        code += '<existing_context_variable>' + block.getFieldValue('set_context_variable_dropdown') + '</existing_context_variable>' ;
    }

    code += '</context_variable>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// -----------------------------------------------------------
// -------------- Block: "get_context_variable" --------------

Blockly.JavaScript['get_context_variable'] = function(block) {
    const code = '<context_variable>' +
        '<type>get</type>' +
        '<value>' + block.getFieldValue('get_context_variable_dropdown') + '</value>' +
        '</context_variable>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};


// -----------------------------------------------------------
// -------------- Block: "update_context_variable" -----------

Blockly.JavaScript['update_context_variable'] = function(block) {
    const code = '<context_variable>' +
        '<type>update</type>' +
        '<value>' + block.getFieldValue('update_context_variable_dropdown') + '</value>' +
        '</context_variable>';

    return [code, Blockly.JavaScript.ORDER_NONE];
};

// -------------------------------------------------------------------------
// --------------------------- CATEGORY: SCHEDULING SLOTS ------------------

// ------------------------------------------------
// -------------- Block: "schedule_block" ---------

Blockly.JavaScript['schedule_block'] = function(block) {
    return '<schedule_block>' +
        '<entity_type>' + block.getFieldValue('schedule_block_entity_type') + '</entity_type>' +
        '<scheduling_user>' + Blockly.JavaScript.valueToCode(block, 'scheduling_user', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduling_user>' +
        '<scheduling_start_date>' + Blockly.JavaScript.valueToCode(block, 'scheduling_start_date', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduling_start_date>' +
        '<scheduling_start_time>' + Blockly.JavaScript.valueToCode(block, 'scheduling_start_time', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduling_start_time>' +
        '<scheduling_end_date>' + Blockly.JavaScript.valueToCode(block, 'scheduling_end_date', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduling_end_date>' +
        '<scheduling_end_time>' + Blockly.JavaScript.valueToCode(block, 'schedule_end_time', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduling_end_time>' +
        '<scheduling_weekdays>' + Blockly.JavaScript.valueToCode(block, 'schedule_weekdays', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduling_weekdays>' +
        '<scheduling_duration>' + Blockly.JavaScript.valueToCode(block, 'schedule_duration', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduling_duration>' +
        '<scheduling_slots_count>' + Blockly.JavaScript.valueToCode(block, 'scheduling_slots_count', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduling_slots_count>' +
        '</schedule_block>';
};

// ------------------------------------------------
// -------------- Block: "scheduling_slot" --------

Blockly.JavaScript['scheduling_slot'] = function(block) {
    let code = '<scheduling_slot>' +
        '<entity_type>' + block.getFieldValue('scheduling_slot_entity_type') + '</entity_type>' +
        '<scheduled_slot_agenda>' + Blockly.JavaScript.valueToCode(block, 'scheduled_slot_agenda', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduled_slot_agenda>' +
        '<scheduled_slot_number>' + Blockly.JavaScript.valueToCode(block, 'scheduled_slot_number', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduled_slot_number>' +
        '<scheduled_slot_day>' + Blockly.JavaScript.valueToCode(block, 'scheduled_slot_day', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduled_slot_day>' +
        '<scheduled_slot_start_time>' + Blockly.JavaScript.valueToCode(block, 'scheduled_slot_start_time', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduled_slot_start_time>' +
        '<scheduled_slot_end_time>' + Blockly.JavaScript.valueToCode(block, 'scheduled_slot_end_time', Blockly.JavaScript.ORDER_ATOMIC) + '</scheduled_slot_end_time>';

    if (block.getInput('scheduled_slot_additional_properties')) {
        code += '<additional_slot_properties>' + Blockly.JavaScript.statementToCode(block, 'scheduled_slot_additional_properties') + '</additional_slot_properties>';
    }

    code += '</scheduling_slot>';

    return code;
};

// ------------------------------------------------
// --- Block: "scheduling_additional_property" ----

Blockly.JavaScript['scheduling_additional_property'] = function(block) {
    return '<scheduling_additional_property>' +
        '<property>' + Blockly.JavaScript.valueToCode(block, 'scheduling_additional_property', Blockly.JavaScript.ORDER_ATOMIC) + '</property>' +
        '<term>' + Blockly.JavaScript.valueToCode(block, 'scheduling_additional_property_term_input', Blockly.JavaScript.ORDER_ATOMIC) + '</term>' +
        '</scheduling_additional_property>';
};



// -------------------------------------------------------------------------
// --------------------------- CATEGORY: OTHERS ----------------------------

// ------------------------------------------------
// ------------- Block: "rollback_transaction" ----

Blockly.JavaScript['rollback_transaction'] = function(block) {
    return '<rollbackTransaction>' +
        '<errorMessage>' + block.getFieldValue('rollback_error_message') + '</errorMessage>' +
        '</rollbackTransaction>';
};
