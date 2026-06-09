<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Traits;

use App\ActionRule;
use App\Language;
use Log;
use SimpleXMLElement;
use stdClass;

trait BlocklyXMLManipulatingTrait
{
    /**
     * Removes the validationConditions of action rules ('blockly') using this property's blocks.
     *
     * @param int $propertyId The ID of the property block that will have its validationConditions changed
     *
     * @param int $userId The user making these changes
     */
    private function removeActionRulesValidationConditions($propertyId, $userId) {
        $actionRulesToBeModified = ActionRule::whereHas('actions.actionProps', function($query) use ($propertyId) {
            $query->where('prop_id', $propertyId)
                ->whereNull('deleted_at');
        })->whereNull('deleted_at')->get();
        foreach ($actionRulesToBeModified as $actionRuleToModify) {
            $blocklyXMLModified = $this->removeBlocklyValidationConditions($actionRuleToModify, $propertyId);
            $actionRuleToModify->update([
                'blockly_xml' => $blocklyXMLModified,
                'updated_by' => $userId
            ]);
        }
    }

    private function removeBlocklyValidationConditions($actionRule, $propertyId) {
        $xmlToSearch = new SimpleXMLElement($actionRule->blockly_xml);
        // Register the blockly namespace used by Blockly in the initial definition of its xml
        $xmlToSearch->registerXPathNamespace('b', 'https://developers.google.com/blockly/xml');
        $this->changeMutationValidationConditionVariables($xmlToSearch, $propertyId);
        $this->deleteValidationConditionInputAndSubBlocks($xmlToSearch, $propertyId);
        // Return the modified XML so that we can update the Action Rule's xml on the DB
        return $xmlToSearch->asXML();
    }

    private function changeMutationValidationConditionVariables($xmlToSearch, $propertyId) {
        // Register the blockly namespace used by Blockly in the <mutation> tags
        $xmlToSearch->registerXPathNamespace('m', 'http://www.w3.org/1999/xhtml');
        // Block must have a <field name="user_input_property">propertyId</field>.
        // We want the <mutation ...></mutation> "sibling" part of that field tag to change some attributes value
        $propertyBlockMutation = $xmlToSearch->xpath("//b:block[b:field = \"" . $propertyId . "\"" .
            "and b:field[@name=\"user_input_property\"]]/m:mutation");
        $propertyBlockMutation[0][0]["validation_condition"] = "false";
        $propertyBlockMutation[0][0]["has_validation_condition_blocks"] = "false";
    }

    private function deleteValidationConditionInputAndSubBlocks($xmlToSearch, $propertyId) {
        // Get the valueInput(validation_condition) for the property_simplified/property block that refers to this property
        // Block must have a <field name="user_input_property">propertyId</field>. We want the <value name="validation_condition">... </value>
        // "sibling" part of that field tag, which is what contains the validation condition input and all its sub-blocks
        $validationConditionInput = $xmlToSearch->xpath("//b:block[b:field = \"" . $propertyId . "\"" .
            "and b:field[@name=\"user_input_property\"]]/b:value[@name=\"validation_condition\"]");
        // Delete the XML part that contains the validation_condition input and all its sub-blocks.
        unset($validationConditionInput[0][0]);
    }

    /**
     * Replaces a *new* type block with an *existing* type block for objects that were created during action rule saving.
     *
     * @param string $blocklyXML The Blockly generated XML of the block that needs this replacement.
     *
     * @param string $blockType the type of the block that is being manipulated. One of the following:
     * 'user_evaluated_expression', 'action_user_output', 'validation_condition_user_output, 'constant', 'context_variable'.
     *
     * @param stdClass $blockInformation An object containing the information of the block needed for this replacement.
     *
     * @param string $langId The language of the user promoting these changes.
     */
    private function replaceBlockNewTypeWithExistingType (string $blocklyXML, string $blockType, stdClass $blockInformation, string $langId) {
        $currentBlockCode = $this->getNewTypeCurrentBlockCode($blockType, $blockInformation, $langId);
        $replacementBlockCode = $this->getExistingTypeReplacementBlockCode($blockType, $blockInformation);
        return str_replace($currentBlockCode, $replacementBlockCode, $blocklyXML);
    }

    // Get the XML Code that represents a 'NEW' part on a block - ex: a new template for user_output
    private function getNewTypeCurrentBlockCode(string $blockType, stdClass $blockInformation, string $langId) {
        $currentBlockCode = '';
        switch ($blockType) {

            case 'user_evaluated_expression':
                /* <xml xmlns="http://www.w3.org/1999/xhtml">
                    <block type="user_evaluated_expression" id="3jh4#Oo)P!Q@}?uaa3j!">
                      <mutation xmlns="http://www.w3.org/1999/xhtml" no_next_connection="false"></mutation>
                      <field name="choice_expression">NEW</field>
                      <field name="expression_name">Template Name</field>
                      <field name="expression_text">Yo</field>
                    </block>
                   </xml> */

                $currentBlockCode = '<mutation xmlns="http://www.w3.org/1999/xhtml" no_next_connection="'. $blockInformation->no_next_connection .'"></mutation>'.
                    '<field name="choice_expression">NEW</field>'.
                    '<field name="expression_name">'. $blockInformation->user_evaluated_expression_name .'</field>';

                // If the tinyMCE editor was opened to edit the text, the text in the block is 'Custom Text' or the equivalent in other language
                $currentBlockCode .= $blockInformation->opened_editor === 'didnt_open' ?
                    '<field name="expression_text">'. htmlspecialchars($blockInformation->user_evaluated_expression_text, ENT_HTML401) .'</field>' :
                    '<field name="expression_text">'. $this->getTemplateCustomTextString($langId) .'</field>';

                break;

            case 'action_user_output':
                // MODAL
                /* <xml xmlns="http://www.w3.org/1999/xhtml">
                    <block type="action" id="i_|an3e7IMv?baraik_p" inline="false">
                      <mutation xmlns="http://www.w3.org/1999/xhtml" ae_input1="false" ui_input1="false" ui_input_single_enttype1="false" cl_input1="false"
                       uo_input1="true" uo_existing="false" uo_new_toast="false" uo_new_toast_custom="false" comment_text="" no_next_connection="false"></mutation>
                      <field name="action">USER_OUTPUT</field>
                      <field name="choice_template">NEW</field>
                      <field name="template_type">MODAL</field>
                      <field name="template_text">insert new text here</field>
                      <field name="template_header">information</field>
                      <field name="template_button">continue</field>
                    </block>
                   </xml> */
                // TOAST
                /* <xml xmlns="http://www.w3.org/1999/xhtml">
                    <block type="action" id="i_|an3e7IMv?baraik_p" inline="false">
                      <mutation xmlns="http://www.w3.org/1999/xhtml" ae_input1="false" ui_input1="false" cl_input1="false" uo_input1="true" uo_existing="false"
                      uo_new_toast="true" uo_new_toast_custom="true" comment_text="" no_next_connection="false"></mutation>
                      <field name="action">USER_OUTPUT</field>
                      <field name="choice_template">NEW</field>
                      <field name="template_type">TOAST</field>
                      <field name="template_text">insert new text here</field>
                      <field name="template_class">CUSTOM</field>
                      <field name="template_colour">#8080ff</field>
                      <field name="template_title">notification</field>
                    </block>
                   </xml> */

                // The 'inline="false">' in the beginning is to be replaced with '>' in the 'EXISTING' block.
                //This way, when the block is loaded from XML with 'EXISTING' inputs, they will be set inline
                $currentBlockCode = 'inline="false"><mutation xmlns="http://www.w3.org/1999/xhtml" ';

                $currentBlockCode .= 'comment_text="'. $blockInformation->action_block_comment .'" no_next_connection="false" has_entity_details_block="false" has_entity_filters_block="false" only_allow_ent_type_form_blocks="false" endpoint_ent_types="" execution_type="NATIVE_EXECUTION" crud_operation="null" has_update_delete_id_block="false"></mutation>';
                $currentBlockCode .= '<field name="action_dropdown">USER_OUTPUT</field>'.
                    '<field name="uo_template_choice">NEW</field>'.
                    '<field name="template_name">'. $blockInformation->template_name .'</field>'.
                    '<field name="template_type">'. strtoupper($blockInformation->template_type) .'</field>';
                // If the tinyMCE editor was opened to edit the text, the text in the block is 'CustomText' or the equivalent in other language
                $currentBlockCode .= $blockInformation->opened_editor === 'didnt_open' ?
                    '<field name="template_text">'. htmlspecialchars($blockInformation->template_text, ENT_HTML401) .'</field>' :
                    '<field name="template_text">'. $this->getTemplateCustomTextString($langId) .'</field>';
                // Depending on the template type, complete the block's generated code
                if ($blockInformation->template_type === 'modal') {
                    $currentBlockCode .= '<field name="template_header">'. $blockInformation->modal_header_text .'</field>'.
                        '<field name="template_button">'. $blockInformation->modal_button_text .'</field>';
                } else if ($blockInformation->template_type === 'toast') {
                    $currentBlockCode .= '<field name="template_class">'. strtoupper($blockInformation->toast_class) .'</field>';
                    if ($blockInformation->toast_class === 'custom') {
                        $currentBlockCode .= '<field name="template_colour">'. $blockInformation->toast_colour .'</field>'.
                            '<field name="template_title">'. $blockInformation->toast_title_text .'</field>';
                    }
                }

                break;

            case 'validation_condition_user_output':
                /* <xml xmlns="http://www.w3.org/1999/xhtml">
                    <block type="condition_validation_condition" id="HY!r^T{;K[^A.RnVmdUG">
                      <mutation xmlns="http://www.w3.org/1999/xhtml" dropdownchoice="MAX_WORD_LENGTH" valuetype="text" co_existing="false"></mutation>
                      <field name="negation">FALSE</field>
                      <field name="dropdown_choice">MAX_WORD_LENGTH</field>
                      <field name="term1">7</field>
                      <field name="choice_template">NEW</field><field name="template_field">insert new text here</field>
                    </block>
                   </xml> */

                $currentBlockCode = '<mutation xmlns="http://www.w3.org/1999/xhtml" dropdownchoice="'. $blockInformation->validation_cond_type .
                    '" valuetype="'. $blockInformation->property_value_type. '" multiple_values="'. $blockInformation->property_multiple_values.
                    '" co_existing="false"></mutation>';
                $currentBlockCode .= '<field name="negation">'. $blockInformation->validation_cond_negative .'</field>';
                $currentBlockCode .= '<field name="dropdown_choice">'. $blockInformation->validation_cond_type .'</field>';
                if ($blockInformation->validation_cond_param_1) {
                    $currentBlockCode .= '<field name="term1">'. $blockInformation->validation_cond_param_1 .'</field>';
                }
                if ($blockInformation->validation_cond_param_2) {
                    $currentBlockCode .= '<field name="term2">'. $blockInformation->validation_cond_param_2 .'</field>';
                }
                $currentBlockCode .= '<field name="choice_template">NEW</field>'.
                    '<field name="template_field">'. $blockInformation->template_text .'</field>';

                break;

            case 'constant':
                /* <xml xmlns="http://www.w3.org/1999/xhtml">
                    <block type="constant" id="zSQZQ)pF){8P;Tr^}rQO" x="96" y="215">
                      <mutation xmlns="http://www.w3.org/1999/xhtml" constantnew="true"
                      numericconstantsonly="false" valuetype="text"></mutation>
                      <field name="choice_constant">NEW</field>
                      <field name="constant_name">Insert name here</field>
                      <field name="value_type">STRING</field>
                      <field name="value">Insert value here</field>
                    </block>
                   </xml> */

                $currentBlockCode = '<mutation xmlns="http://www.w3.org/1999/xhtml" constant_new="true"'.
                    ' numeric_constants_only="'. $blockInformation->numeric_constants_only .'"'.
                    ' numeric_time_constants_only="'. $blockInformation->numeric_time_constants_only .'"'.
                    ' numeric_date_time_constants_only="'. $blockInformation->numeric_date_time_constants_only .'"'.
                    ' value_type="'. $blockInformation->constant_value_type .'"></mutation>'.
                    '<field name="choice_constant">NEW</field>'.
                    '<field name="constant_name">'. $blockInformation->constant_name .'</field>'.
                    '<field name="value_type">'. strtoupper($blockInformation->constant_value_type) .'</field>'.
                    '<field name="value">'.  $blockInformation->constant_value .'</field>';

                break;

            case 'context_variable':
                /* <xml xmlns="https://developers.google.com/blockly/xml">
                    <block type="set_context_variable" id="76anc:RDBlYLG*AdLsa~" x="39" y="71">
                        <mutation xmlns="http://www.w3.org/1999/xhtml" context_variable_id="null"></mutation>
                        <field name="choice_context_variable">NEW</field>
                        <field name="set_context_variable_name">Oficial para Query</field>
                    </block>
                   </xml> */

                $currentBlockCode = 'context_variable_id="null"></mutation>' .
                    '<field name="choice_context_variable">NEW</field>'.
                    '<field name="set_context_variable_name">'. $blockInformation->context_variable_name .'</field>';

                break;
        }
        // Log::debug('XML To Be Replaced: '.$currentBlockCode);
        return $currentBlockCode;
    }

    private function getTemplateCustomTextString($langId) {
        $langAbbrv = Language::find($langId)->abbrv;
        switch ($langAbbrv) {
            case 'pt':
                return 'Texto Personalizado';
            case 'en':
                return 'Custom Text';
            default:
                return 'error';
        }
    }

    // Get the XML Code that represents an 'EXISTING' part on a block - to replace the 'NEW' part code existing
    private function getExistingTypeReplacementBlockCode(string $blockType, stdClass $blockInformation) {
        $replacementBlockCode = '';
        switch ($blockType) {

            case 'user_evaluated_expression':
                /* <xml xmlns="http://www.w3.org/1999/xhtml">
                    <block type="user_evaluated_expression" id="f$vrzYUI9;cX)f4I)LIK" x="144" y="253">
                      <mutation xmlns="http://www.w3.org/1999/xhtml" no_next_connection="true"></mutation>
                      <field name="choice_expression">EXISTING</field>
                      <field name="existing_expression">5</field>
                    </block>
                   </xml> */

                $replacementBlockCode = '<mutation xmlns="http://www.w3.org/1999/xhtml" no_next_connection="'.$blockInformation->no_next_connection.'"></mutation>'.
                    '<field name="choice_expression">EXISTING</field>'.
                    '<field name="existing_expression">'. $blockInformation->user_evaluated_expression_id .'</field>';

                break;

            case 'action_user_output':
                /* <xml xmlns="http://www.w3.org/1999/xhtml">
                    <block type="action" id="i_|an3e7IMv?baraik_p" x="192" y="160">
                      <mutation xmlns="http://www.w3.org/1999/xhtml" ae_input1="false" ui_input1="false" ui_input_single_enttype1="false" cl_input1="false" uo_input1="true" uo_existing="true"
                      uo_new_toast="false" uo_new_toast_custom="false"></mutation>
                      <field name="action">USER_OUTPUT</field>
                      <field name="choice_template">EXISTING</field>
                      <field name="template_text">3</field>
                    </block>
                   </xml> */

                // The first '>' is to replace the 'inline="false">' that we had in the block with 'NEW' inputs
                // This way, when the block is loaded from XML with 'EXISTING' inputs, they will be set inline
                $replacementBlockCode = '><mutation xmlns="http://www.w3.org/1999/xhtml" ';
                $replacementBlockCode .= 'comment_text="'.$blockInformation->action_block_comment.'" no_next_connection="false" has_entity_details_block="false" has_entity_filters_block="false" only_allow_ent_type_form_blocks="false" endpoint_ent_types="" execution_type="NATIVE_EXECUTION"  crud_operation="null" has_update_delete_id_block="false"></mutation>'.
                    '<field name="action_dropdown">USER_OUTPUT</field>'.
                    '<field name="uo_template_choice">EXISTING</field>'.
                    '<field name="template_text">'. $blockInformation->template_id .'</field>';

                break;

            case 'validation_condition_user_output':
                /* <xml xmlns="http://www.w3.org/1999/xhtml">
                    <block type="condition_validation_condition" id="HY!r^T{;K[^A.RnVmdUG">
                      <mutation xmlns="http://www.w3.org/1999/xhtml" dropdownchoice="MAX_WORD_LENGTH" valuetype="text" co_existing="true"></mutation>
                      <field name="negation">FALSE</field>
                      <field name="dropdown_choice">MAX_WORD_LENGTH</field>
                      <field name="term1">7</field><field name="choice_template">EXISTING</field>
                      <field name="template_field">165</field>
                    </block>
                   </xml> */

                $replacementBlockCode = '<mutation xmlns="http://www.w3.org/1999/xhtml" dropdownchoice="'.$blockInformation->validation_cond_type.
                    '" valuetype="'. $blockInformation->property_value_type. '" multiple_values="'. $blockInformation->property_multiple_values.
                    '" co_existing="true"></mutation>';
                $replacementBlockCode .= '<field name="negation">'. $blockInformation->validation_cond_negative .'</field>';
                $replacementBlockCode .= '<field name="dropdown_choice">'. $blockInformation->validation_cond_type .'</field>';
                if ($blockInformation->validation_cond_param_1) {
                    $replacementBlockCode .= '<field name="term1">'. $blockInformation->validation_cond_param_1 .'</field>';
                }
                if ($blockInformation->validation_cond_param_2) {
                    $replacementBlockCode .= '<field name="term2">'. $blockInformation->validation_cond_param_2 .'</field>';
                }
                $replacementBlockCode .= '<field name="choice_template">EXISTING</field>'.
                    '<field name="template_field">'. $blockInformation->template_id .'</field>';

                break;

            case 'constant':
                /* <xml xmlns="http://www.w3.org/1999/xhtml">
                    <block type="constant" id="zSQZQ)pF){8P;Tr^}rQO" x="126" y="250">
                      <mutation xmlns="http://www.w3.org/1999/xhtml" constantnew="false"
                      numericconstantsonly="false" valuetype="text"></mutation>
                      <field name="choice_constant">EXISTING</field>
                      <field name="constant_choice_dropdown">NONE</field>
                    </block>
                   </xml> */

                $replacementBlockCode = '<mutation constant_new="false"'.
                    ' numeric_constants_only="'. $blockInformation->numeric_constants_only .'"'.
                    ' numeric_time_constants_only="'. $blockInformation->numeric_time_constants_only .'"'.
                    ' numeric_date_time_constants_only="'. $blockInformation->numeric_date_time_constants_only .'"'.
                    ' value_type="'.  $blockInformation->constant_value_type .'"></mutation>'.
                    '<field name="choice_constant">EXISTING</field>'.
                    '<field name="constant_choice_dropdown">'. $blockInformation->constant_id .'</field>';

                break;

            case 'context_variable':
                /* <xml xmlns="https://developers.google.com/blockly/xml">
                    <block type="set_context_variable" id="76anc:RDBlYLG*AdLsa~" x="39" y="71">
                        <mutation xmlns="http://www.w3.org/1999/xhtml" context_variable_id="5"></mutation>
                        <field name="choice_context_variable">EXISTING</field>
                        <field name="set_context_variable_dropdown">5</field>
                    </block>
                   </xml> */

                $replacementBlockCode = 'context_variable_id="'. $blockInformation->context_variable_id .'"></mutation>' .
                    '<field name="choice_context_variable">EXISTING</field>'.
                    '<field name="set_context_variable_dropdown">'. $blockInformation->context_variable_id .'</field>';

                break;
        }
        // Log::debug('XML To Replace: '.$replacementBlockCode);
        return $replacementBlockCode;
    }

    /**
     * Replaces the block's id field with the id of the object that was created during action rule saving.
     *
     * @param string $blocklyXML The Blockly generated XML of the block that needs this replacement.
     *
     * @param string $blockType the type of the block that is being manipulated. One of the following:
     * 'get_context_variable', 'update_context_variable'.
     *
     * @param string $blockId the created object's blockId that is currently in the block and will get replaced.
     *
     * @param int $createdObjectId the database id of the object created and that is to be inserted in the block.
     */
    private function replaceIdInBlockAfterObjectCreation(string $blocklyXML, string $blockType, string $blockId, int $createdObjectId) {
        $currentBlockCode = $this->getBlockCodeWithId($blockType, $blockId);
        $replacementBlockCode = $this->getBlockCodeWithId($blockType, $createdObjectId);
        return str_replace($currentBlockCode, $replacementBlockCode, $blocklyXML);
    }

    private function getBlockCodeWithId(string $blockType, $id) {
        $currentBlockCode = '';
        switch ($blockType) {

            case 'set_context_variable':
                /* <xml xmlns="https://developers.google.com/blockly/xml">
                    <block type="set_context_variable" id="mlON6D81O-@]3!,nrhhi" x="139" y="139">
                        <mutation xmlns="http://www.w3.org/1999/xhtml" context_variable_id="e{:|/a}9F)i-Z;.7KTHu"></mutation>
                        <field name="choice_context_variable">EXISTING</field>
                        <field name="set_context_variable_dropdown">e{:|/a}9F)i-Z;.7KTHu</field>
                    </block>
                   </xml> */

                $currentBlockCode = 'context_variable_id="' . $id . '"></mutation>' .
                    '<field name="choice_context_variable">EXISTING</field>' .
                    '<field name="set_context_variable_dropdown">'. $id .'</field>';

                break;

            case 'get_context_variable':
                /* <xml xmlns="https://developers.google.com/blockly/xml">
                    <block type="get_context_variable" id="mlON6D81O-@]3!,nrhhi" x="139" y="139">
                        <mutation xmlns="http://www.w3.org/1999/xhtml" context_variable_id="e{:|/a}9F)i-Z;.7KTHu"></mutation>
                        <field name="get_context_variable_dropdown">e{:|/a}9F)i-Z;.7KTHu</field>
                    </block>
                   </xml> */

                $currentBlockCode = 'context_variable_id="' . $id . '"></mutation>' .
                    '<field name="get_context_variable_dropdown">'. $id .'</field>';

                break;

            case 'update_context_variable':
                /* <xml xmlns="https://developers.google.com/blockly/xml">
                    <block type="update_context_variable" id="Tm#kfjIv03z}-P0+1#7h" x="139" y="139">
                        <mutation xmlns="http://www.w3.org/1999/xhtml" context_variable_id="e{:|/a}9F)i-Z;.7KTHu"></mutation>
                        <field name="update_context_variable_dropdown">e{:|/a}9F)i-Z;.7KTHu</field>
                    </block>
                   </xml> */

                $currentBlockCode = 'context_variable_id="' . $id . '"></mutation>' .
                    '<field name="update_context_variable_dropdown">'. $id .'</field>';

                break;
        }
        // Log::debug('XML To Be Replaced: '.$currentBlockCode);
        return $currentBlockCode;
    }

    /**
     * Updates the selected query of an action rule block ('blockly'), using the updated query's info.
     *
     * @param int $oldQueryId The ID of the query before the update
     *
     * @param int $updatedQueryId The ID of the query after the update
     *
     * @param int $userId The user making these changes
     */
    private function updateActionRulesSelectedQueryBlock($oldQueryId, $updatedQueryId, $userId) {
        // Gets all the active AR's and checks for 'query blocks' usage [only way to update both actionPropHasQuery and termHasQuery blocks
        $actionRulesToBeModified = ActionRule::whereNull('deleted_at')->get();
        foreach ($actionRulesToBeModified as $actionRuleToModify) {
            list($actionRuleUpdated, $blocklyXMLModified) = $this->changeSelectedQueryInQueryBlock($actionRuleToModify, $oldQueryId, $updatedQueryId);
            if ($actionRuleUpdated) {
                $actionRuleToModify->update([
                    'blockly_xml' => $blocklyXMLModified,
                    'updated_by' => $userId
                ]);
            }
        }
    }

    private function changeSelectedQueryInQueryBlock($actionRule, $oldQueryId, $updatedQueryId) {
        $actionRuleUpdated = false;

        $xmlToSearch = new SimpleXMLElement($actionRule->blockly_xml);
        // Register the blockly namespace used by Blockly in the initial definition of its xml
        $xmlToSearch->registerXPathNamespace('b', 'https://developers.google.com/blockly/xml');
        $queryChoiceFields = $xmlToSearch->xpath("//b:block[b:field = \"" . $oldQueryId . "\"" .
            "and b:field[@name=\"query_choice\"]]/b:field[@name=\"query_choice\"]");
        foreach ($queryChoiceFields as $queryChoiceField) {
            // Change the query's selection in the block to the new updated query
            $queryChoiceField[0] = $updatedQueryId;
            $actionRuleUpdated = true;
        }
        // Return the modified XML so that we can update the Action Rule's xml on the DB
        return array($actionRuleUpdated, $xmlToSearch->asXML());
    }

    /**
     * Updates the queryParameters input name of an action rule ('blockly'), if it's an actionPropHasQuery, using the updated query's blocks.
     *
     * @param int $updatedQueryId The ID of the query after the update
     *
     * @param int $oldQueryFilterId The ID of the queryParameter's filter before the update
     **
     * @param int $updatedQueryFilterId The ID of the queryParameter's filter after the update
     *
     * @param int $userId The user making these changes
     */
    private function updateActionRulesQueryBlockParameters($updatedQueryId, $oldQueryFilterId, $updatedQueryFilterId, $userId) {
        // Gets all the active AR's and checks for 'query blocks' usage [only way to update both actionPropHasQuery and termHasQuery blocks
        $actionRulesToBeModified = ActionRule::whereNull('deleted_at')->get();
        foreach ($actionRulesToBeModified as $actionRuleToModify) {
            list($actionRuleUpdated, $blocklyXMLModified) = $this->changeParameterInputNameInQueryBlock($actionRuleToModify, $updatedQueryId, $oldQueryFilterId, $updatedQueryFilterId);
            if ($actionRuleUpdated) {
                $actionRuleToModify->update([
                    'blockly_xml' => $blocklyXMLModified,
                    'updated_by' => $userId
                ]);
            }
        }
    }

    private function changeParameterInputNameInQueryBlock($actionRule, $updatedQueryId, $oldQueryFilterId, $updatedQueryFilterId) {
        $actionRuleUpdated = false;

        $xmlToSearch = new SimpleXMLElement($actionRule->blockly_xml);
        // Register the blockly namespace used by Blockly in the initial definition of its xml
        $xmlToSearch->registerXPathNamespace('b', 'https://developers.google.com/blockly/xml');
        $queryParameterInputs = $xmlToSearch->xpath("//b:block[b:field = \"" . $updatedQueryId . "\"" .
            "and b:field[@name=\"query_choice\"]]/b:value[@name=\"termInput" . $oldQueryFilterId . "\"]");

        // For each node found, if there is a new queryFilter for the same parameter, change it. If not, delete that node.
        foreach ($queryParameterInputs as $queryParameterInput) {
            if ($updatedQueryFilterId) {
                // Update the value input's name using the updated queryFilterId
                $queryParameterInput[0]["name"] = "termInput" . $updatedQueryFilterId;
            } else {
                // Remove the node, as this parameter no longer exists
                unset($xmlToSearch->xpath("//b:value[@name='termInput" . $oldQueryFilterId . "']")[0][0]);
            }
            $actionRuleUpdated = true;
        }

        // Return the modified XML so that we can update the Action Rule's xml on the DB
        return array($actionRuleUpdated, $xmlToSearch->asXML());
    }

}
