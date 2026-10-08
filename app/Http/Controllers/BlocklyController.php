<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App;
use App\Action;
use App\ActionDerivedProp;
use App\ActionHasTemplate;
use App\ActionProp;
use App\ActionPropForm;
use App\ActionPropHasQuery;
use App\ActionPropHasQueryParameter;
use App\ActionRule;
use App\ActionText;
use App\AssignExpression;
use App\CausalLink;
use App\CompEvaluatedExpression;
use App\ComputeExpression;
use App\ComputeExpressionHasTerm;
use App\Condition;
use App\ConditionHasUserEvaluatedExpression;
use App\Constant;
use App\ConstantName;
use App\ContextVariable;
use App\ContextVariableText;
use App\EnableCondition;
use App\EntityDetail;
use App\EntityFilter;
use App\Form;
use App\FormCalculation;
use App\FormContent;
use App\Http\Resources\ActionRuleResource;
use App\Http\Resources\QueryResource;
use App\Http\Traits\FormUpdatingTrait;
use App\Http\Traits\GetMultilingualConceptName;
use App\Language;
use App\Property;
use App\QueryFilter;
use App\QueryHasTerm;
use App\QueryParameter;
use App\QueryTerm;
use App\Ruleset;
use App\RulesetHasQueryTerm;
use App\ScheduleSlotOrigin;
use App\ScheduleSlotResult;
use App\ScheduleSlotResultAdditionalProperty;
use App\Template;
use App\TemplateModal;
use App\TemplateText;
use App\TemplateToast;
use App\Term;
use App\TermHasEntitySpecification;
use App\TermHasPropertyHasSpecificEntityTerm;
use App\TermHasComputeExpression;
use App\TermHasConstant;
use App\TermHasContextVariable;
use App\TermHasExecutingUser;
use App\TermHasExecutingUserRole;
use App\TermHasPropAllowedValue;
use App\TermHasProperty;
use App\TermHasPropertySpecification;
use App\TermHasPropRefValue;
use App\TermHasQuery;
use App\TermHasQueryParameter;
use App\TermHasUserRole;
use App\TermHasValue;
use App\UserEvaluatedExpression;
use App\UserEvaluatedExpressionText;
use App\ValidationCond;
use App\ValidationCondHasTemplate;
use DB;
use Illuminate\Http\Request;
use Log;
use stdClass;

class BlocklyController extends Controller
{
    use GetMultilingualConceptName, FormUpdatingTrait;

    public function getActionRules(Request $request)
    {
        $userLangId = $request->user()->language_id;

        // Get all action rules in the system along with its FK names in the user's language
        $actionRules = DB::table('action_rule')
            ->join('transaction_type', 'action_rule.transaction_type_id', '=', 'transaction_type.id')
            ->whereNull(['action_rule.deleted_at', 'transaction_type.deleted_at'])
            ->select('action_rule.*')
            ->get();

        foreach ($actionRules as $actionRule) {
            $this->hydrateActionRuleFKNames($actionRule, $userLangId);
        }

        return ActionRuleResource::collection($actionRules);
    }

    public function getActionRule(Request $request, $id)
    {
        $userLangId = $request->user()->language_id;

        $actionRule = ActionRule::where('id',$id)
            ->whereNull('deleted_at')->first();
        $this->hydrateActionRuleFKNames($actionRule, $userLangId);

        $actionRule->causal_links = DB::table('action')
            ->join('causal_link', 'causal_link.causing_action', '=', 'action.id')
            ->where('action.action_rule_id', $actionRule->id)
            ->where('action.type', 'causal_link')
            ->whereNull('action.deleted_at')
            ->whereNull('causal_link.deleted_at')
            ->select(
                'action.id as action_id',
                'causal_link.caused_transaction_type_id',
                'causal_link.caused_t_state_id',
                'causal_link.min',
                'causal_link.max',
                'causal_link.cancel_proc',
                'causal_link.continue_if_same_user'
            )
            ->orderBy('action.id', 'asc')
            ->get();

        return new ActionRuleResource($actionRule);
    }

    public function getQueries(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $queries = DB::table('query')->whereNull('deleted_at')->get();
        foreach ($queries as $query) {
            $query->name = $this->getMultilingualConceptName('query_name',
                'name', 'query_id', $query->id, $userLangId);
            $query->propertyParameters = $this->getQueryParameters($query->id, $userLangId);
        }

        return QueryResource::collection($queries);
    }

    private function getQueryParameters($queryID, $userLangId)
    {
        $mainQueryTermId = QueryHasTerm::where('query_id', $queryID)->first()->query_term_id;
        // The main query term is always a ruleset, which encompasses all query filters/sub-ruleSets
        $mainRulesetId = Ruleset::where('query_term_id', $mainQueryTermId)->first()->id;
        // Get every property that is a parameter inside the query
        $propertyParameters = $this->getQueryRulesetParameters($mainRulesetId, $userLangId);
        return count($propertyParameters) ? $propertyParameters : null;
    }

    private function getQueryRulesetParameters($rulesetId, $userLangId, $propertyParameters = []) {
        // Get the query_terms involved in the current query ruleset
        $mainRulesetTerms = RulesetHasQueryTerm::where('ruleset_id', $rulesetId)->get();
        // Get the queryTerm records from the ones involved in this ruleset
        $subQueryTerms = QueryTerm::whereIn('id', $mainRulesetTerms->pluck('query_term_id'))->get();
        // For each queryTerm: If it's a filter, check if its properties are parameters
        // If it's a ruleset, check if the ruleSet's filters' properties are parameters
        foreach ($subQueryTerms as $subQueryTerm) {
            if ($subQueryTerm->type === 'filter') {
                $filterProperty = QueryFilter::where('query_term_id', $subQueryTerm->id)->first();
                if ($filterProperty && $filterProperty->is_parameter && $filterProperty->property) {
                    $filterProperty->property_name = $this->getMultilingualConceptName('property_name', 'name',
                    'property_id', $filterProperty->property_id, $userLangId);
                    $filterProperty->ent_type_name = $this->getMultilingualConceptName('ent_type_name', 'name',
                    'ent_type_id', $filterProperty->property->ent_type_id, $userLangId);
                    $propertyParameters[] = $filterProperty;
                }
            } else {
                $subRulesetId = Ruleset::where('query_term_id', $subQueryTerm->id)->first()->id;
                $propertyParameters = $this->getQueryRulesetParameters($subRulesetId, $userLangId, $propertyParameters);
            }
        }
        return $propertyParameters;
    }

    private $createdObjectsInThisActionRule = [];

    public function storeActionRule(Request $request)
    {
        // Get user id and language
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        $langAbbrv = Language::where('id',$langId)
            ->select('abbrv')
            ->whereNull('deleted_at')->first()->abbrv;

        App::setLocale($langAbbrv);

        DB::beginTransaction();
        try {
            // Frontend passes 'id'
            $actionRuleId = $request->input('id');

            $action_rule = ActionRule::find($actionRuleId);

            if (!$action_rule) {
                throw new \Exception('ActionRule not found for ID: ' . $actionRuleId);
            }

            // We do NOT delete the action rule.
            // We ONLY delete the logic actions that belong to this action rule.
            $logicActions = Action::where('action_rule_id', $actionRuleId)
                ->where('type', '!=', 'causal_link')
                ->whereNull('deleted_at')
                ->get();

            foreach ($logicActions as $actionToDelete) {
                $actionToDelete->update([
                    'deleted_by' => $userId
                ]);
                $actionToDelete->delete();
            }

            $blockly_XML = $request->input('blockly_xml');
            
            $action_rule->blockly_code = $request->input('blockly_code');
            $action_rule->preview = $request->input('preview');
            $action_rule->updated_by = $userId;

            $actions = $request->input('actions');
            $blockly_XML = $this->storeActions ($blockly_XML, $actions, $action_rule->id, null, $action_rule, $userId, $langId);

            $action_rule->blockly_xml = $blockly_XML;
            $action_rule->save();

            DB::commit();
            return $action_rule;
        } catch (\Exception $e) {
            DB::rollback();
            Log::debug($e);
            return 'false';
        }
    }

    public function deleteActionRule(Request $request, $actionRuleId)
    {
        $userId = $request->user()->id;

        $isStructurallyBound = Action::where('action_rule_id', $actionRuleId)
            ->where('type', 'causal_link')
            ->whereNull('deleted_at')
            ->exists();

        if ($isStructurallyBound) {
            return response()->json([
                'success' => false,
                'error_code' => 'STRUCTURAL_DEPENDENCY'
            ]);
        }

        $actionRule = ActionRule::find($actionRuleId);

        $actionsBelongingToAR = Action::where('action_rule_id', $actionRuleId)
            ->whereNull('deleted_at')->get();

        DB::beginTransaction();
        try {
            foreach ($actionsBelongingToAR as $actionToDelete) {
                $actionToDelete->update([
                    'deleted_by' => $userId
                ]);
                $actionToDelete->delete();
            }

            if ($actionRule) {
                $actionRule->update([
                    'deleted_by' => $userId
                ]);
                $actionRule->delete();
            }

            DB::commit();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollback();
            Log::debug($e);
            return response()->json(['success' => false]);
        }
    }

    private function storeActions ($blockly_XML, $actions, $action_rule_id, $par_action_id, $previousActionRuleVersion, $userId, $langId) {

        // Saving the previous action, we can establish its next_action_id from the current action.
        // We can also set the current action's previous_action_id from it.
        $previous_action = null;

        foreach ($actions as $input_action) {
            
            // Phase 2: Structural actions are managed by the Process Diagram.
            // Blockly only handles executable logic actions.
            if ($input_action["type"] == 'causal_link') {
                continue;
            }

            $action = new Action;
            $action->action_rule_id = $action_rule_id;
            $action->type = $input_action["type"];
            if ($par_action_id) {
                $action->par_action_id = $par_action_id;
            }
            if ($previous_action) {
                $action->prev_action_id = $previous_action->id;
            }
            $action->updated_by = $userId;
            $action->save();

            if ($previous_action) {
                $previous_action->next_action_id = $action->id;
                $previous_action->save();
            }

            // Save the current action as the next iteration's previous_action
            $previous_action = $action;

            $actionName = $input_action["name"] ?? null;
            $actionComment = $input_action["comment"] ?? null;

            // Save the action's name or comment if it is present
            if ($actionName || $actionComment) {
                $action_text = new ActionText;
                $action_text->action_id = $action->id;
                $action_text->language_id = $langId;
                $action_text->name = $actionName;
                $action_text->comment = $actionComment;
                $action_text->updated_by = $userId;
                $action_text->save();
            }

            // In case action if of type assign expression
            if($action->type == 'assign_expression') {

                list($destinationTermId, $blockly_XML) = $this->storeTerm($blockly_XML, $input_action['destinationTerm'], $userId, $langId, $action->id);
                list($sourceTermId, $blockly_XML) = $this->storeTerm($blockly_XML, $input_action['sourceTerm'], $userId, $langId, $action->id);

                AssignExpression::create([
                    'destination_term_id' => $destinationTermId,
                    'source_term_id' => $sourceTermId,
                    'action_id' => $action->id,
                    'updated_by' => $userId
                ]);

                $sourceTermIsPropertySpecificationTerm = TermHasPropertySpecification::where('term_id', $sourceTermId)->whereNull('deleted_at')->exists();
                $sourceTermIsEntitySpecificationTerm = TermHasEntitySpecification::where('term_id', $sourceTermId)->whereNull('deleted_at')->exists();

                // If the sourceTerm is a property/entity specification term, we will have to design a form for this action
                if ($sourceTermIsPropertySpecificationTerm || $sourceTermIsEntitySpecificationTerm) {
                    // Save a custom name for this action, as it will be needed in the FormsManagement table/modal
                    // As 'assign expression' actions don't have a name, we construct one from its scope ('TransactionTypeName - tStateName: propertyName/contextVariableName')
                    $this->saveFactSpecificationAssignExpressionActionName($action->id, $actionComment, $userId, $langId);
                    // Check AR's last version and duplicate (and update) form if the property (propertySpecificationTerm) is still the same
                    if ($previousActionRuleVersion) {
                        $factTypeSpecification = $sourceTermIsPropertySpecificationTerm ? 'property' : 'entity';
                        $this->duplicateAndUpdateLatestFormVersion($previousActionRuleVersion, $action, $factTypeSpecification, $userId, $langId);
                    }
                }

            // In case action is of type 'user_output'
            }  else if($action->type == 'user_output') {

                // Get the template related info
                $input_template = $input_action["template"];
                // Check if the template is new or an existing one
                $is_new_expression = isset($input_template["text"]);
                // If it's a new template, create one record each in the DB in the template and template_text table
                if ($is_new_expression) {

                    // To be used in the function that will be a part of the 'NEW->EXISTING' XML transformation
                    $blockInformationForNewExistingReplacement = new stdClass();
                    $blockInformationForNewExistingReplacement->action_block_comment = $actionComment;
                    $blockInformationForNewExistingReplacement->opened_editor = $input_template["openedEditor"];

                    $template = new Template;
                    $template->type = $input_template["type"];
                    $template->updated_by = $userId;
                    $template->save();

                    // To be used in the function that will be a part of the 'NEW->EXISTING' XML transformation
                    $blockInformationForNewExistingReplacement->template_id = $template->id;
                    $blockInformationForNewExistingReplacement->template_type = $template->type;

                    // Get the id of the template created to use it after in action_has_template
                    $template_id = $template->id;

                    $template_text = new TemplateText;
                    $template_text->template_id = $template_id;
                    $template_text->language_id = $langId;
                    $template_text->name = $input_template["name"];
                    $template_text->text = $input_template["text"];
                    $template_text->updated_by = $userId;
                    $template_text->save();

                    // To be used in the function that will be a part of the 'NEW->EXISTING' XML transformation
                    $blockInformationForNewExistingReplacement->template_text = $template_text->text;
                    $blockInformationForNewExistingReplacement->template_name = $template_text->name;

                    // Save the extra information of the new templates
                    // If it's a modal template, create a new record in the template_modal table to store its extra info
                    if ($template->type == 'modal') {

                        $template_modal = new TemplateModal;
                        $template_modal->template_id = $template_id;
                        $template_modal->language_id = $langId;
                        $template_modal->header_text = $input_template["header"];
                        $template_modal->button_text = $input_template["button"];
                        $template_modal->updated_by = $userId;
                        $template_modal->save();

                        // To be used in the function that will be a part of the 'NEW->EXISTING' XML transformation
                        $blockInformationForNewExistingReplacement->modal_header_text = $template_modal->header_text;
                        $blockInformationForNewExistingReplacement->modal_button_text = $template_modal->button_text;

                    } else if ($template->type == 'toast') {

                        // If it's a toast template, create a new record in the template_toast table to store its extra info
                        $template_toast = new TemplateToast;
                        $template_toast->template_id = $template_id;
                        $template_toast->language_id = $langId;
                        $template_toast->class = $input_template["class"];

                        // To be used in the function that will be a part of the 'NEW->EXISTING' XML transformation
                        $blockInformationForNewExistingReplacement->toast_class = $template_toast->class;

                        // If it's a custom toast, save the colour and title text info to be used in the toast
                        if ($template_toast->class == 'custom') {
                            $template_toast->colour = $input_template["colour"];
                            $template_toast->title_text = $input_template["title"];

                            // To be used in the function that will be a part of the 'NEW->EXISTING' XML transformation
                            $blockInformationForNewExistingReplacement->toast_colour = $template_toast->colour;
                            $blockInformationForNewExistingReplacement->toast_title_text = $template_toast->title_text;
                        }

                        $template_toast->updated_by = $userId;
                        $template_toast->save();
                    }


                    // Replace the 'NEW' part of the XML code with an 'EXISTING', as the template is now created
                    $blockly_XML = $this->replaceBlockNewTypeWithExistingType($blockly_XML, 'action_user_output',
                        $blockInformationForNewExistingReplacement, $langId);

                } else {
                    // If it's an existing template, get its id
                    $template_id = $input_template["id"];
                }

                // Insert record in the action_has_template table in the DB
                $action_has_template = new ActionHasTemplate;
                $action_has_template->action_id = $action->id;
                $action_has_template->template_id = $template_id;
                $action_has_template->updated_by = $userId;
                $action_has_template->save();

            // In case action if of type 'user_input' or 'edit_entity_instance'
            } else if ($action->type == 'user_input' || $action->type == 'edit_entity_instance') {

                // On 'edit entity instance' actions, there's additional resources to be saved compared to 'user input' actions
                if ($action->type == 'edit_entity_instance') {

                    // Get the properties to be shown in the 'entity selection dropdown' before the 'edit data form'
                    if (isset($input_action["entity_details"])) {
                        $this->storeEntityDetails($input_action["entity_details"], $action->id, $userId);
                    }

                    // Get the filter to be applied to the entity selection functions
                    if (isset($input_action["entityFilterTerm"])) {
                        list($entityFilterTermId, $blockly_XML) = $this->storeTerm($blockly_XML, $input_action["entityFilterTerm"], $userId, $langId);
                        EntityFilter::create([
                            'action_id' => $action->id,
                            'term_id' => $entityFilterTermId,
                            'updated_by' => $userId
                        ]);
                    }

                }

                // Get the properties to be shown in the form, if applicable
                $properties = $input_action["properties"];

                if($properties) {
                    $orderActionProp = 1;

                    // Store each property and its associated info
                    foreach ($properties as $input_property) {
                        list($actionPropId, $blockly_XML) = $this->storeActionProperty($blockly_XML, $action->id, $input_property, $orderActionProp, $userId, $langId);
                        $orderActionProp += 1;
                    }
                }

                // Get the derived properties that belong to this action, if applicable
                $derivedProperties = $input_action["derivedProperties"];

                if($derivedProperties) {
                    foreach ($derivedProperties as $derivedProperty) {
                        list($termId, $blockly_XML) = $this->storeTerm($blockly_XML, $derivedProperty["term"], $userId, $langId);
                        ActionDerivedProp::create([
                            'action_id' => $action->id,
                            'property_id' => $derivedProperty["property_id"],
                            'term_id' => $termId,
                            'updated_by' => $userId
                        ]);
                    }
                }

                // Check AR's last version and duplicate (and update) form if properties are >= 50% the same
                if ($previousActionRuleVersion) {
                    $this->duplicateAndUpdateLatestFormVersion($previousActionRuleVersion, $action, 'property', $userId, $langId);
                }

            } else if ($action->type == 'if') {

                // Get the info on the condition and actions present in the if block
                $if_condition = $input_action["ifCondition"];
                $input_then_action = $input_action["thenAction"];
                $has_else_action = isset($input_action["elseAction"]);

                // Store the if condition
                $blockly_XML = $this->storeCondition($blockly_XML, $if_condition, $action->id, $userId, $langId);

                // Create an entry in the Action Table for the then action, associating it with the if action (par_action_id)
                $then_action = new Action;
                $then_action->action_rule_id = $action_rule_id;
                $then_action->type = 'then';
                $then_action->par_action_id = $action->id;
                $then_action->updated_by = $userId;
                $then_action->save();

                // Store the action associated with the then action
                $blockly_XML = $this->storeActions ($blockly_XML, $input_then_action, $action_rule_id, $then_action->id, $previousActionRuleVersion, $userId, $langId);

                if ($has_else_action) {

                    // If it has an else action specified, get that action
                    $input_else_action = $input_action["elseAction"];

                    // Create an entry in the Action Table for the else action, associating it with the if action (par_action_id)
                    $else_action = new Action;
                    $else_action->action_rule_id = $action_rule_id;
                    $else_action->type = 'else';
                    $else_action->par_action_id = $action->id;

                    $else_action->updated_by = $userId;
                    $else_action->save();

                    // Store the action associated with the else action
                    $blockly_XML = $this->storeActions ($blockly_XML, $input_else_action, $action_rule_id, $else_action->id, $previousActionRuleVersion, $userId, $langId);

                }

            } else if ($action->type == 'while') {

                // Get the info on the condition and action present in the while block
                $while_condition = $input_action["whileCondition"];
                $input_do_action = $input_action["doAction"];

                // Store the while condition
                $blockly_XML = $this->storeCondition($blockly_XML, $while_condition, $action->id, $userId, $langId);

                // Store the do Action, associating it with the while entry
                $blockly_XML = $this->storeActions ($blockly_XML, $input_do_action, $action_rule_id, $action->id, $previousActionRuleVersion, $userId, $langId);

            } else if ($action->type === 'create_schedule_slots') {

                $scheduleSlotOrigin = $input_action["scheduleSlotOrigin"];
                ScheduleSlotOrigin::create([
                    'action_id' => $action->id,
                    'responsible_user' => $scheduleSlotOrigin["scheduling_user"],
                    'start_date' => $scheduleSlotOrigin["scheduling_start_date"],
                    'start_time' => $scheduleSlotOrigin["scheduling_start_time"],
                    'end_date' => $scheduleSlotOrigin["scheduling_end_date"],
                    'end_time' => $scheduleSlotOrigin["scheduling_end_time"],
                    'weekdays' => $scheduleSlotOrigin["scheduling_weekdays"],
                    'duration' => $scheduleSlotOrigin["scheduling_duration"],
                    'slot_count' => $scheduleSlotOrigin["scheduling_slots_count"],
                    'updated_by' => $userId
                ]);

                $scheduleSlotResult = $input_action["scheduleSlotResult"];
                $scheduleSlotResultRecord = ScheduleSlotResult::create([
                    'action_id' => $action->id,
                    'schedule_reference' => $scheduleSlotResult["scheduled_slot_agenda"],
                    'slot_number' => $scheduleSlotResult["scheduled_slot_number"],
                    'day' => $scheduleSlotResult["scheduled_slot_day"],
                    'start_time' => $scheduleSlotResult["scheduled_slot_start_time"],
                    'end_time' => $scheduleSlotResult["scheduled_slot_end_time"],
                    'updated_by' => $userId
                ]);

                if (isset($scheduleSlotResult["scheduled_slot_additional_properties"])) {
                    foreach ($scheduleSlotResult["scheduled_slot_additional_properties"] as $additionalProperty) {

                        list($additionalPropertyTermId, $blockly_XML) = $this->storeTerm($blockly_XML,
                            $additionalProperty["term"], $userId, $langId);

                        ScheduleSlotResultAdditionalProperty::create([
                            'schedule_slot_result_id' => $scheduleSlotResultRecord->id,
                            'property_id' => $additionalProperty["property_id"],
                            'term_id' => $additionalPropertyTermId
                        ]);
                    }
                }
            }
        }
        return $blockly_XML;
    }

    private function storeEntityDetails($entityDetails, $actionId, $userId) {
        foreach ($entityDetails as $entityDetail) {
            EntityDetail::create([
                'action_id' => $actionId,
                'property_id' => $entityDetail["id"],
                'updated_by' => $userId
            ]);
        }
    }

    private function storeActionProperty($blocklyXML, $actionId, $inputProperty, $orderActionProp, $userId, $userLangId) {
        $property_id = $inputProperty["id"];
        // Create an entry in the 'action prop' table that associates the property and the user input action
        $action_prop = new ActionProp;
        $action_prop->action_id = $actionId;
        $action_prop->prop_id = $property_id;
        $action_prop->order = $orderActionProp;
        $action_prop->updated_by = $userId;
        $action_prop->save();

        // If action prop is mandatory, save that validation condition in its respective table
        if ($inputProperty["mandatory"]) {
            $validation_cond = new ValidationCond;
            $validation_cond->type = 'required';
            $validation_cond->action_prop_id = $action_prop->id;
            $validation_cond->negative = 0;
            $validation_cond->updated_by = $userId;
            $validation_cond->save();
        }

        // As the 3 fields of 'form compute', 'enable condition' and 'validation condition' are optional
        // We firstly check which ones the property has and that we need to store
        $property_has_form_calculation = isset($inputProperty["form_calculation"]);
        $property_has_enable_condition = isset($inputProperty["enable_condition"]);
        $property_has_validation_conditions = isset($inputProperty["validation_conditions"]);
        $propertyHasOptionsFromQuery = isset($inputProperty["optionsFromQueryTerm"]);

        // For properties of type 'integer', we automatically insert a validation condition of type 'isInteger' in the DB
        $propertyIsInteger = Property::find($property_id)->value_type === 'int';
        if ($propertyIsInteger) {
            $isIntegerValidationCondition = ValidationCond::create([
                'type' => 'isInteger',
                'action_prop_id' => $action_prop->id,
                'negative' => 0,
                'updated_by' => $userId
            ]);
        }

        // If it has form compute defined, store the json logic in the 'form compute' table
        if ($property_has_form_calculation) {
            [$blocklyXML, $computeExpressionId] = $this->storeComputeExpressionTerm($blocklyXML, $inputProperty["form_calculation"], $userId, $userLangId, null, true);

            $form_calculation = new FormCalculation;
            $form_calculation->action_prop_id = $action_prop->id;
            $form_calculation->compute_expression_id = $computeExpressionId;
            $form_calculation->updated_by = $userId;
            $form_calculation->save();
        }

        // If it has an enable condition, it'll store the condition and all its inputs
        if ($property_has_enable_condition) {
            $input_enable_condition = $inputProperty["enable_condition"];

            // Create a new entry in the 'condition' table to store the enable condition
            [$blocklyXML, $condition_id]= $this->storeCondition($blocklyXML, $input_enable_condition, $actionId, $userId, $userLangId, true);

            $enable_condition = new EnableCondition;
            $enable_condition->action_prop_id = $action_prop->id;
            $enable_condition->condition_id = $condition_id;
            $enable_condition->updated_by = $userId;
            $enable_condition->save();
        }

        // If it has validation conditions, we store them all with its info
        if ($property_has_validation_conditions) {
            $validation_conditions = $inputProperty["validation_conditions"];
            // Every validation condition is processed and stored
            foreach($validation_conditions as $validation_condition) {
                // Check if the current validation condition has these fields that change depending on type
                $has_param_1 = isset($validation_condition["param_1"]);
                $has_param_2 = isset($validation_condition["param_2"]);
                $has_custom_validation = isset($validation_condition["custom_validation"]);

                // Store the info of the validation condition, including the optional elements is applicable
                $validation_cond = new ValidationCond;
                $validation_cond->type = $validation_condition["type"];
                $validation_cond->action_prop_id = $action_prop->id;
                $validation_cond->negative = $validation_condition["negative"];

                if ($has_param_1) {
                    $validation_cond->param_1 = $validation_condition["param_1"];
                }
                if ($has_param_2) {
                    $validation_cond->param_2 = $validation_condition["param_2"];
                }
                if ($has_custom_validation) {
                    $validation_cond->custom_validation = $validation_condition["custom_validation"];
                }

                $validation_cond->updated_by = $userId;
                $validation_cond->save();

                // Only save template info if the validation condition has a template associated to it
                if (isset($validation_condition["template"])) {
                    $validation_condition_template = $validation_condition["template"];
                    // Check if the user output template to be used is an existing one
                    $template_exists = isset($validation_condition_template["id"]);
                    // If it's a new one
                    if (!$template_exists) {

                        // To be used in the function that will be a part of the 'NEW->EXISTING' XML transformation
                        $blockInformationForNewExistingReplacement = new stdClass();
                        $blockInformationForNewExistingReplacement->property_value_type = $validation_condition["valueType"];
                        $blockInformationForNewExistingReplacement->property_multiple_values = $validation_condition["multipleValues"];
                        $blockInformationForNewExistingReplacement->validation_cond_negative = $validation_cond->negative ? 'TRUE' : 'FALSE';
                        $blockInformationForNewExistingReplacement->validation_cond_type = $this->getValidationTypeUsedInBlocklyXML($validation_cond->type);
                        // In the block, the field 'term1' refers to table parameters 'param1' or 'custom validation'
                        $blockInformationForNewExistingReplacement->validation_cond_param_1 = $has_param_1 ? $validation_cond->param_1 :
                            ($has_custom_validation ? $validation_cond->custom_validation : null);
                        $blockInformationForNewExistingReplacement->validation_cond_param_2 = $has_param_2 ? $validation_cond->param_2 : null;

                        // Creates an entry in the template table with type validation warning
                        $new_template = new Template;
                        $new_template->type = 'validation_warning';
                        $new_template->updated_by = $userId;
                        $new_template->save();

                        // Gets the template id that will be needed to associate it to the validation condition
                        $validation_condition_template_id = $new_template->id;

                        // Also creates an entry in the template text table containing the text specified by the user
                        $new_template_text = new TemplateText;
                        $new_template_text->template_id = $validation_condition_template_id;
                        $new_template_text->language_id = $userLangId;
                        $new_template_text->name = $validation_condition_template["text"];
                        $new_template_text->text = $validation_condition_template["text"];
                        $new_template_text->updated_by = $userId;
                        $new_template_text->save();

                        // To be used in the function that will be a part of the 'NEW->EXISTING' XML transformation
                        $blockInformationForNewExistingReplacement->template_id = $new_template->id;
                        $blockInformationForNewExistingReplacement->template_text = $new_template_text->text;

                        // Replace the 'NEW' part of the XML code with an 'EXISTING', as the val cond template is now created
                        $blocklyXML = $this->replaceBlockNewTypeWithExistingType($blocklyXML, 'validation_condition_user_output',
                            $blockInformationForNewExistingReplacement, $userLangId);

                    } else {
                        // If it's an existing template, get its id
                        $validation_condition_template_id = $validation_condition_template["id"];
                    }
                    // Finally, associate the template to the validation condition
                    $validation_cond_has_template = new ValidationCondHasTemplate;
                    $validation_cond_has_template->template_id = $validation_condition_template_id;
                    $validation_cond_has_template->validation_cond_id = $validation_cond->id;
                    $validation_cond_has_template->updated_by = $userId;
                    $validation_cond_has_template->save();
                }
            }
        }

        if ($propertyHasOptionsFromQuery) {
            $queryDetails = $inputProperty["optionsFromQueryTerm"]["details"];
            ActionPropHasQuery::create([
                'action_prop_id' => $action_prop->id,
                'query_id' => $queryDetails["query_id"],
                'updated_by' => $userId
            ]);

            if (isset($queryDetails["blockly_parameters"])) {
                foreach ($queryDetails["blockly_parameters"] as $queryParameter) {
                    list($termId, $blocklyXML) = $this->storeTerm($blocklyXML, $queryParameter["term"], $userId, $userLangId);
                    $queryParameterRecord = QueryParameter::create([
                        'query_id' => $queryDetails["query_id"],
                        'query_filter_id' => $queryParameter["query_filter_id"],
                        'term_id' => $termId,
                        'updated_by' => $userId
                    ]);
                    ActionPropHasQueryParameter::create([
                        'action_prop_id' => $action_prop->id,
                        'query_parameter_id' => $queryParameterRecord->id,
                        'updated_by' => $userId
                    ]);
                }
            }
        }

        return [$action_prop->id, $blocklyXML];
    }

    private function storeTerm($blocklyXML, $termObject, $userId, $userLangId, $actionId = null, $termId = null) {
        // Create the initial entry for the 'term' table if there's no "termParentId" passed
        if (!$termId) {
            $term = Term::create([
                'updated_by' => $userId
            ]);
            $termId = $term->id;
        }
        // Save the term details depending on its type
        switch ($termObject["type"]) {
            case 'constant':
                $blocklyXML = $this->storeConstantTerm($blocklyXML, $termObject["details"], $termId, $userId, $userLangId);
                break;
            case 'value':
                $this->storeValueTerm($termObject["details"], $termId, $userId);
                break;
            case 'property':
                $blocklyXML = $this->storePropertyTerm($blocklyXML, $termObject["details"], $termId, $userId, $userLangId);
                break;
            case 'property_value':
                $this->storePropertyValueTerm($termObject["details"], $termId, $userId);
                break;
            case 'compute_expression':
                $blocklyXML = $this->storeComputeExpressionTerm($blocklyXML, $termObject["details"], $userId, $userLangId, $termId);
                break;
            case 'query':
                $blocklyXML = $this->storeQueryTerm($blocklyXML, $termObject["details"], $termId, $userId, $userLangId);
                break;
            case 'context_variable':
                $blocklyXML = $this->storeContextVariableTerm($blocklyXML, $termObject["details"], $termId, $userId, $userLangId);
                break;
            case 'property_specification':
                $blocklyXML = $this->storePropertySpecificationTerm($blocklyXML, $actionId, $termObject["details"], $termId, $userId, $userLangId);
                break;
            case 'entity_specification':
                $blocklyXML = $this->storeEntitySpecificationTerm($blocklyXML, $actionId, $termObject["details"], $termId, $userId, $userLangId);
                break;
            case 'executing_user':
                $this->storeExecutingUserTerm($termId, $userId);
                break;
            case 'executing_user_role':
                $this->storeExecutingUserRoleTerm($termId, $userId);
                break;
            case 'user_role':
                $this->storeUserRoleTerm($termId, $termObject["userRoleId"], $userId);
                break;
            default:
                break;
        }
        return array($termId, $blocklyXML);
    }

    private function storeConstantTerm ($blockly_XML, $constant_term, $term_id, $userId, $langId) {
        // Check whether it is a new or existing constant
        $type = $constant_term["type"];
        // If it's an existing constant, we get the id
        if ($type == 'existingConstant') {
            $constant_id = $constant_term["constant_id"];
        } else {
            // If it's a new constant, we create it and then get its id
            $constant = new Constant;
            $constant->value_type = $constant_term["value_type"];
            $constant->value = $constant_term["value"];
            $constant->updated_by = $userId;
            $constant->save();
            $constant_id = $constant->id;
            // We also create a register for its name
            $constant_name = new ConstantName;
            $constant_name->constant_id = $constant_id;
            $constant_name->language_id = $langId;
            $constant_name->name = $constant_term["name"];
            $constant_name->updated_by = $userId;
            $constant_name->save();

            // To be used in the function that will be a part of the 'NEW->EXISTING' XML transformation
            $blockInformationForNewExistingReplacement = new stdClass();
            $blockInformationForNewExistingReplacement->constant_id = $constant_id;
            $blockInformationForNewExistingReplacement->constant_value = $constant->value;
            $blockInformationForNewExistingReplacement->constant_name = $constant_name->name;
            $blockInformationForNewExistingReplacement->constant_value_type = $constant->value_type;
            $blockInformationForNewExistingReplacement->numeric_constants_only = $constant_term["numeric_constants_only"];
            $blockInformationForNewExistingReplacement->numeric_time_constants_only = $constant_term["numeric_time_constants_only"];
            $blockInformationForNewExistingReplacement->numeric_date_time_constants_only = $constant_term["numeric_date_time_constants_only"];

            // Replace the 'NEW' part of the XML code with an 'EXISTING', as the val cond template is now created
            $blockly_XML = $this->replaceBlockNewTypeWithExistingType($blockly_XML, 'constant',
                $blockInformationForNewExistingReplacement, $langId);
        }
        // Create a new entry in the term has constant table
        $term_has_constant = new TermHasConstant;
        $term_has_constant->term_id = $term_id;
        $term_has_constant->constant_id = $constant_id;
        $term_has_constant->updated_by = $userId;
        $term_has_constant->save();

        return $blockly_XML;
    }

    private function storePropertyValueTerm ($property_value_term, $term_id, $userId) {
        // Get the table that the property value comes from
        $propertyType = Property::find($property_value_term["property_id"])->value_type;

        // As it can come through table prop allowed value or table value (prop ref), we act accordingly
        if ($propertyType === 'enum') {
            $term_has_prop_allowed_value = new TermHasPropAllowedValue;
            $term_has_prop_allowed_value->term_id = $term_id;
            $term_has_prop_allowed_value->prop_allowed_value_id = $property_value_term["id"];
            $term_has_prop_allowed_value->updated_by = $userId;
            $term_has_prop_allowed_value->save();
        } else if ($propertyType === 'prop_ref') {
            $term_has_prop_ref_value = new TermHasPropRefValue;
            $term_has_prop_ref_value->term_id = $term_id;
            $term_has_prop_ref_value->prop_ref_value_id = $property_value_term["id"];
            $term_has_prop_ref_value->updated_by = $userId;
            $term_has_prop_ref_value->save();
        }
    }

    private function storePropertyTerm ($blocklyXML, $propertyTerm, $termId, $userId, $userLangId) {
        // Create an entry in the 'term has property' table
        $termHasProperty = TermHasProperty::create([
            'term_id' => $termId,
            'property_id' => $propertyTerm["id"],
            'updated_by' => $userId
        ]);

        // If there's a specific entity term defined, store it and then associate it with the $termHasProperty record
        if (isset($propertyTerm["specificEntityTerm"])) {
            list($specificEntityTermId, $blocklyXML) = $this->storeTerm($blocklyXML, $propertyTerm["specificEntityTerm"], $userId, $userLangId);
            TermHasPropertyHasSpecificEntityTerm::create([
                'term_has_property_term_id' => $termId,
                'term_id' => $specificEntityTermId,
                'updated_by' => $userId
            ]);
        }

        return $blocklyXML;
    }

    private function storeValueTerm ($value_term, $term_id, $userId) {
        // Create an entry in the 'term has value' table
        $term_has_value = new TermHasValue;
        $term_has_value->term_id = $term_id;
        $term_has_value->value_type = $value_term["value_type"];
        $term_has_value->value = $value_term["value"];
        $term_has_value->updated_by = $userId;
        $term_has_value->save();
    }

    private function storeQueryTerm ($blocklyXML, $queryTermDetails, $parentTermId, $userId, $langId) {

         TermHasQuery::create([
            'term_id' => $parentTermId,
            'query_id' => $queryTermDetails["query_id"],
            'updated_by' => $userId
        ]);

         if (isset($queryTermDetails["blockly_parameters"])) {
             foreach ($queryTermDetails["blockly_parameters"] as $queryBlocklyParameter) {
                 Log::debug($queryBlocklyParameter);
                 list($termId, $blocklyXML) = $this->storeTerm($blocklyXML, $queryBlocklyParameter["term"], $userId, $langId);

                 $queryParameter = QueryParameter::create([
                     'query_id' => $queryTermDetails["query_id"],
                     'query_filter_id' => $queryBlocklyParameter["query_filter_id"],
                     'term_id' => $termId,
                     'updated_by' => $userId
                 ]);

                 TermHasQueryParameter::create([
                     'term_id' => $parentTermId,
                     'query_parameter_id' => $queryParameter->id,
                     'updated_by' => $userId
                 ]);
             }
         }

        return $blocklyXML;
    }

    private function storeComputeExpressionTerm ($blockly_XML, $compute_expression_term, $userId, $langId, $parentTermId = null, $formCalculation = false) {
        // Create an entry in the 'compute expression' table with its operator
        $computeExpression = new ComputeExpression;
        $computeExpression->operator = $compute_expression_term["operator"];
        $computeExpression->updated_by = $userId;
        $computeExpression->save();

        if ($parentTermId) {
            // Associate the term to the compute expression
            $termHasComputeExpression = new TermHasComputeExpression;
            $termHasComputeExpression->term_id = $parentTermId;
            $termHasComputeExpression->compute_expression_id = $computeExpression->id;
            $termHasComputeExpression->updated_by = $userId;
            $termHasComputeExpression->save();
        }

        // Associate the corresponding terms in the compute expression
        foreach($compute_expression_term["terms"] as $computeExpressionTerm) {
            list($newTermId, $blockly_XML) = $this->storeTerm($blockly_XML, $computeExpressionTerm, $userId, $langId);
            $this->storeComputeExpressionHasTerm($computeExpression->id, $newTermId, $computeExpressionTerm["order"], $userId);
        }

        return $formCalculation ? [$blockly_XML, $computeExpression->id] : $blockly_XML;
    }

    private function storeComputeExpressionHasTerm($computeExpressionId, $termId, $order, $userId) {
        $compute_expression_has_term = new ComputeExpressionHasTerm;
        $compute_expression_has_term->compute_expression_id = $computeExpressionId;
        $compute_expression_has_term->term_id = $termId;
        $compute_expression_has_term->order = $order;
        $compute_expression_has_term->updated_by = $userId;
        $compute_expression_has_term->save();
    }

    private function createContextVariable($name, $userId, $userLangId) {

        $contextVariable = ContextVariable::create([
            'updated_by' => $userId
        ]);

        ContextVariableText::create([
            'context_variable_id' => $contextVariable->id,
            'language_id' => $userLangId,
            'text' => $name
        ]);

        return $contextVariable->id;
    }

    private function storeContextVariableTerm($blocklyXML, $contextVariableTerm, $parentTermId, $userId, $langId) {
        // If it's a new context variable (has the 'text' property), create it and add it to createdObjectsInThisActionRule
        if ($contextVariableTerm["type"] === 'set' && array_key_exists('text', $contextVariableTerm)) {
            // Create a new context variable from its specified name
            $contextVariableId = $this->createContextVariable($contextVariableTerm["text"], $userId, $langId);
            // Get the details needed for the block's 'NEW'->'EXISTING' transformation
            $blockInformationForNewExistingReplacement = new stdClass();
            $blockInformationForNewExistingReplacement->context_variable_name = $contextVariableTerm["text"];
            $blockInformationForNewExistingReplacement->context_variable_id = $contextVariableId;
            // Replace the 'NEW' part of the XML code with an 'EXISTING', as the context variable is now created
            $blocklyXML = $this->replaceBlockNewTypeWithExistingType($blocklyXML, 'context_variable',
                $blockInformationForNewExistingReplacement, $langId);
            // Store in the createdObjectsInThisActionRule array this contextVariable, in case it's used in another block in the same AR
            $this->createdObjectsInThisActionRule[] = ['id' => $contextVariableId, 'blockId' => $contextVariableTerm['blockId']];
        } else {
            $contextVariableId = $contextVariableTerm['id'];
            // Check if the contextVariableId from blockly is numeric (in case it's a new ContextVariable (blockId) it won't be numeric)
            // Or if there's any contextVariable in the DB with that contextVariableId (in this case it's not a new contextVariable)
            // The double check is because if we do ContextVariable::find($contextVariableId) with $contextVariableId="5Yip4XHqMuJoXmIs0/e2"
            // It gets the ContextVariable with id="5" due to the conversion Laravel makes
            if (!is_numeric($contextVariableId) || !ContextVariable::find($contextVariableId)) {
                // In case we had selected a context variable that was created in the same AR, we have the blockId,
                // So we need to check which contextVariableId was created from that block
                foreach ($this->createdObjectsInThisActionRule as $createdObjectInActionRule) {
                    if ($createdObjectInActionRule['blockId'] === $contextVariableId) {
                        $contextVariableId = $createdObjectInActionRule['id'];
                        break;
                    }
                }
                // Replace the id of the contextVariable from the blockId to the created contextVariableId, as the context variable is now created
                $blockType = $contextVariableTerm["type"] . '_context_variable';
                $blocklyXML = $this->replaceIdInBlockAfterObjectCreation($blocklyXML, $blockType, $contextVariableTerm['id'], $contextVariableId);
            }
        }

        TermHasContextVariable::create([
            'term_id' => $parentTermId,
            'context_variable_id' => $contextVariableId,
            'operation' => $contextVariableTerm["type"],
            'updated_by' => $userId
        ]);

        return $blocklyXML;

    }

    private function storePropertySpecificationTerm($blocklyXML, $actionId, $propertySpecificationTerm, $parentTermId, $userId, $userLangId) {

        list($actionPropId, $blocklyXML) = $this->storeActionProperty($blocklyXML, $actionId, $propertySpecificationTerm, 1, $userId, $userLangId);

        TermHasPropertySpecification::create([
            'term_id' => $parentTermId,
            'action_prop_id' => $actionPropId,
            'updated_by' => $userId
        ]);

        return $blocklyXML;
    }

    private function storeEntitySpecificationTerm($blocklyXML, $actionId, $termDetails, $parentTermId, $userId, $userLangId) {

        if (isset($termDetails["optionsFromQueryTerm"])) {
            list($termId, $blocklyXML) = $this->storeTerm($blocklyXML, $termDetails["optionsFromQueryTerm"], $userId, $userLangId, $actionId, $parentTermId);
        } else if (isset($termDetails["entity_details"])) {
            $this->storeEntityDetails($termDetails["entity_details"], $actionId, $userId);
        }

        TermHasEntitySpecification::create([
            'term_id' => $parentTermId,
            'action_id' => $actionId,
            'ent_type_id' => $termDetails["id"],
            'updated_by' => $userId
        ]);

        return $blocklyXML;
    }

    private function storeExecutingUserTerm($parentTermId, $userId) {
        TermHasExecutingUser::create([
            'term_id' => $parentTermId,
            'updated_by' => $userId
        ]);
    }

    private function storeExecutingUserRoleTerm($parentTermId, $userId) {
        TermHasExecutingUserRole::create([
            'term_id' => $parentTermId,
            'updated_by' => $userId
        ]);
    }

    private function storeUserRoleTerm($parentTermId, $roleId, $userId) {
        TermHasUserRole::create([
            'term_id' => $parentTermId,
            'role_id' => $roleId,
            'updated_by' => $userId
        ]);
    }

    private function storeCondition ($blockly_XML, $input_condition, $action_id, $userId, $langId, $enableCondition = false) {
        // Create a new entry in the 'condition' table to store the input condition
        $condition = new Condition;
        $condition->type = $input_condition["type"];
        $condition->action_id = $action_id;
        $condition->updated_by = $userId;
        $condition->save();


        // Check what kind of inputs the condition has - user evaluated / comp evaluated / sub conditions
        $condition_has_user_evaluated_expressions = isset($input_condition["user_evaluated_expressions"]);
        $condition_has_comp_evaluated_expressions = isset($input_condition["comp_evaluated_expressions"]);
        $condition_has_sub_conditions = isset($input_condition["conditions"]);

        // Depending on what it has, store all of the information for every input inside the condition
        if ($condition_has_user_evaluated_expressions) {
            foreach ($input_condition["user_evaluated_expressions"] as $uee_input) {
                $blockly_XML = $this->storeUserEvaluatedExpressionInputCondition($blockly_XML, $uee_input, $condition, $userId, $langId);
            }
        }
        if ($condition_has_comp_evaluated_expressions) {
            foreach ($input_condition["comp_evaluated_expressions"] as $cee_input) {
                $blockly_XML = $this->storeCompEvaluatedExpressionInputCondition($blockly_XML, $cee_input, $condition->id, $userId, $langId);
            }
        }
        if ($condition_has_sub_conditions) {
            foreach ($input_condition["conditions"] as $sub_condition) {
                $blockly_XML = $this->storeSubConditionInputCondition($blockly_XML, $sub_condition, $condition->id, $action_id, $userId, $langId);
            }
        }
        if ($enableCondition) {
            return [$blockly_XML, $condition->id];
        } else {
            return $blockly_XML;
        }
    }

    private function storeUserEvaluatedExpressionInputCondition ($blockly_XML, $input_uee, $parent_condition, $userId, $langId) {
        // Check if the expression to be used is an existing one - case where we get its id
        if ($input_uee["type"] == 'existingExpression') {
            $user_evaluated_expression_id = $input_uee["id"];
        } else {
            // If it's a new one, we create an entry in the 'user evaluated expression' table
            $user_evaluated_expression = new UserEvaluatedExpression;
            $user_evaluated_expression->updated_by = $userId;
            $user_evaluated_expression->save();

            // Also create an entry in 'user evaluated expression text' with the text that the user inserted
            $user_evaluated_expression_text = new UserEvaluatedExpressionText;
            $user_evaluated_expression_text->user_evaluated_expression_id = $user_evaluated_expression->id;
            $user_evaluated_expression_text->language_id = $langId;
            $user_evaluated_expression_text->expression_name = $input_uee["expression_name"];
            $user_evaluated_expression_text->expression_text = $input_uee["expression_text"];
            $user_evaluated_expression_text->updated_by = $userId;
            $user_evaluated_expression_text->save();

            // Get the id of the newly created expression, so we can associate it to the condition
            $user_evaluated_expression_id = $user_evaluated_expression->id;

            // To be used in the function that will be a part of the 'NEW->EXISTING' XML transformation
            $blockInformationForNewExistingReplacement = new stdClass();
            $blockInformationForNewExistingReplacement->user_evaluated_expression_id = $user_evaluated_expression_id;
            $blockInformationForNewExistingReplacement->user_evaluated_expression_name = $user_evaluated_expression_text->expression_name;
            $blockInformationForNewExistingReplacement->user_evaluated_expression_text = $user_evaluated_expression_text->expression_text;
            $blockInformationForNewExistingReplacement->opened_editor = $input_uee["openedEditor"];
            // If condition is of type 'istrue'/'not', there can can only be 1 block inside the condition and so that block can't have a nextConnection
            $blockInformationForNewExistingReplacement->no_next_connection = ($parent_condition->type === 'istrue' ||
                $parent_condition->type === 'not') ? 'true' : 'false';

            // Replace the 'NEW' part of the XML code with an 'EXISTING', as the val cond template is now created
            $blockly_XML = $this->replaceBlockNewTypeWithExistingType($blockly_XML, 'user_evaluated_expression',
                $blockInformationForNewExistingReplacement, $langId);
        }

        // Associate the entry with the condition in the respective table
        $condition_has_uee = new ConditionHasUserEvaluatedExpression;
        $condition_has_uee->condition_id = $parent_condition->id;
        $condition_has_uee->user_evaluated_expression_id = $user_evaluated_expression_id;
        $condition_has_uee->updated_by = $userId;
        $condition_has_uee->save();

        return $blockly_XML;
    }

    private function storeCompEvaluatedExpressionInputCondition ($blockly_XML, $input_cee, $parent_condition_id, $userId, $langId) {

        list($term1Id, $blockly_XML) = $this->storeTerm($blockly_XML, $input_cee["term1"], $userId, $langId);
        list($term2Id, $blockly_XML) = $this->storeTerm($blockly_XML, $input_cee["term2"], $userId, $langId);

        CompEvaluatedExpression::create([
            'parent_cond_id' => $parent_condition_id,
            'logical_operator' => $input_cee["logical_operator"],
            'term_1_id' => $term1Id,
            'term_2_id' => $term2Id,
            'updated_by' => $userId
        ]);

        return $blockly_XML;
    }

    private function storeSubConditionInputCondition ($blockly_XML, $input_condition, $parent_condition_id, $action_id, $userId, $langId) {
        // Create an entry in the 'condition' table that will represent this sub condition
        $sub_condition = new Condition;
        $sub_condition->type = $input_condition["type"];
        $sub_condition->parent_cond_id = $parent_condition_id;
        $sub_condition->action_id = $action_id;
        $sub_condition->updated_by = $userId;
        $sub_condition->save();

        // Check what kind of inputs are present in this sub-condition
        $condition_has_user_evaluated_expressions = isset($input_condition["user_evaluated_expressions"]);
        $condition_has_comp_evaluated_expressions = isset($input_condition["comp_evaluated_expressions"]);
        $condition_has_sub_conditions = isset($input_condition["conditions"]);

        // Act accordingly with these inputs, associating them with the sub condition
        if ($condition_has_user_evaluated_expressions) {
            foreach ($input_condition["user_evaluated_expressions"] as $uee_input) {
                $blockly_XML = $this->storeUserEvaluatedExpressionInputCondition($blockly_XML, $uee_input, $sub_condition, $userId, $langId);
            }
        }
        if ($condition_has_comp_evaluated_expressions) {
            foreach ($input_condition["comp_evaluated_expressions"] as $cee_input) {
                $blockly_XML = $this->storeCompEvaluatedExpressionInputCondition($blockly_XML, $cee_input, $sub_condition->id, $userId, $langId);
            }
        }
        if ($condition_has_sub_conditions) {
            foreach ($input_condition["conditions"] as $condition_input) {
                $blockly_XML = $this->storeSubConditionInputCondition($blockly_XML, $condition_input, $sub_condition->id, $action_id, $userId, $langId);
            }
        }
        return $blockly_XML;
    }

    // Transform the validation type to what it receives in the XML
    private function getValidationTypeUsedInBlocklyXML ($validation_type) {
        switch ($validation_type) {
            case 'equalTo':
                return 'EQUAL_TO';
            case 'maxWordLength':
                return 'MAX_WORD_LENGTH';
            case 'lessEqual':
                return 'LESS_EQUAL';
            case 'higherEqual':
                return 'HIGHER_EQUAL';
            case 'higherThan':
                return 'HIGHER_THAN';
            case 'lessThan':
                return 'LESS_THAN';
            case 'minLength':
                return 'MIN_LENGTH';
            case 'belongsRange':
                return 'BELONGS_RANGE';
            case 'maxLength':
                return 'MAX_LENGTH';
            case 'minWordLength':
                return 'MIN_WORD_LENGTH';
            case 'hasCharacter':
                return 'HAS_CHARACTER';
            case 'regExpression':
                return 'REG_EXPRESSION';
            case 'hasWord':
                return 'HAS_WORD';
            case 'isEmail':
                return 'IS_EMAIL';
            case 'isURL':
                return 'IS_URL';
            case 'customValidation':
                return 'CUSTOM_VALIDATION';
            case 'afterDate':
                return 'AFTER_DATE';
            case 'beforeDate':
                return 'BEFORE_DATE';
            case 'minChoice':
                return 'MIN_CHOICE';
            case 'maxChoice':
                return 'MAX_CHOICE';
        }
        return '';
    }

    private function duplicateAndUpdateLatestFormVersion($previousActionRuleVersion, $newAction, $factTypeSpecification, $userId, $langId) {
        // Get forms designed from actions belonging to the last version of the AR
        $previousActionRuleVersionForms = Form::whereHas('action', function($query) use ($newAction, $previousActionRuleVersion) {
            $query->withTrashed()->where('action_rule_id', $previousActionRuleVersion->id)
                ->where('type', $newAction->type);
        })->whereNull('deleted_at')->get();
        // Get the new action's facts (properties/entity)
        $newActionFacts = $this->getNewActionFacts($newAction->id, $factTypeSpecification);
        // Check if there is a form designed from the last AR version that can be reused in this actin - so the user
        // doesn't need to designed a new form from scratch. A form will be reused if at least [50%] of formFacts that
        // were on it are still in the new action.
        foreach ($previousActionRuleVersionForms as $previousActionRuleVersionForm) {
            // Get the previous action rule's form facts (properties/entity)
            $previousActionRuleFormFacts = $this->getPreviousActionVersionFormFacts($previousActionRuleVersionForm, $factTypeSpecification);
            // Compare the two form versions (this 'AR old version' form and the new action being saved)
            $formComparisonDetails = $this->getSimilarityBetweenTwoForms($newActionFacts, $previousActionRuleFormFacts);
            // If the similarity is greater than [50%], adjust and duplicate the form
            if ($formComparisonDetails->similarityPercentage > 50) {
                $this->duplicateFormFromLastVersion($newAction->id, $previousActionRuleVersionForm->id,
                    $formComparisonDetails, $factTypeSpecification, $userId, $langId);
                break;
            }
        }
    }

    private function getNewActionFacts($newActionId, $factTypeSpecification) {
        if ($factTypeSpecification === 'property') {
            // Get the properties that belong to the new version of the AR's action being saved
            return ActionProp::where('action_id', $newActionId)
                ->whereNull('deleted_at')
                ->get()
                ->pluck('prop_id')->toArray();
        } else if ($factTypeSpecification === 'entity') {
            // Get the entity that belongs to the new version of the AR's action being saved
            return TermHasEntitySpecification::where('action_id', $newActionId)
                ->whereNull('deleted_at')
                ->get()
                ->pluck('ent_type_id')->toArray();
        }
        return null;
    }

    private function getPreviousActionVersionFormFacts($previousVersionForm, $factTypeSpecification) {
        if ($factTypeSpecification === 'property') {
            // Get the properties that are present on this form (that belongs to the last version of this Action Rule)
            return ActionProp::whereHas('actionPropForms', function($actionPropForm) use ($previousVersionForm) {
                $actionPropForm->where('form_id', $previousVersionForm->id)
                    ->whereNull('deleted_at');
            })
                ->whereNull('deleted_at')
                ->get()
                ->pluck('prop_id')->toArray();
        } else if ($factTypeSpecification === 'entity') {
            // Get the entity that belongs to the old version of the AR's action being saved
            return TermHasEntitySpecification::where('action_id', $previousVersionForm->action_id)
                ->whereNull('deleted_at')
                ->get()
                ->pluck('ent_type_id')->toArray();
        }
        return null;
    }

    private function getSimilarityBetweenTwoForms($newFormFacts, $oldFormFacts) {
        // Get an array containing only facts that appear in both forms
        $factsToKeep = array_intersect($newFormFacts, $oldFormFacts);
        // Get the facts to be removed from the form being duplicated
        // (were present in the last action version, but aren't in the new version)
        $factsToDelete =array_diff($oldFormFacts, $newFormFacts);
        // Get number of facts in the oldForm
        $oldFormFactsCount = count($oldFormFacts);
        // Return the similarity of the newFormFacts in relation to the oldFormFacts
        $similarityPercentage = count($oldFormFacts) === 0 ? 0 : count($factsToKeep) / $oldFormFactsCount * 100;
        return (object) array('factsToKeep' => $factsToKeep, 'factsToDelete' => $factsToDelete, 'similarityPercentage' => $similarityPercentage);
    }

    private function duplicateFormFromLastVersion($newActionId, $formToBeDuplicatedId, $formComparisonDetails, $factTypeSpecification, $userId, $langId) {
        // Get the form to be duplicated
        $formContentToDuplicate = $this->getFormContentToBeDuplicated($formToBeDuplicatedId, $langId);
        $formJsonToDuplicate = json_decode($formContentToDuplicate->json);
        // Log::debug('FORM TO BE DUPLICATED');
        // Log::debug(json_encode($formJsonToDuplicate));
        // EntityFacts (entitySpecifications) can't have validationConditions and don't need the checking for options from query removing
        // Also, as we can only have 1 entitySpecification per form, similarity is either 100% or 0%, so if we got here, there's no factsToDelete
        if ($factTypeSpecification === 'property') {
            // PropertyFacts that had changes to their validationConditions (except from 'mandatory' flag) will be removed and
            // have to be inserted again (as the validationCondition rendering is done on the client-side).
            // Also, if a fact got its options from a query result and now doesn't, remove it, and vice-versa.
            $formComparisonDetails = $this->getKeptPropertyFactsToRemoveFromForm($formComparisonDetails, $formToBeDuplicatedId, $newActionId);
            // Remove from the form the properties that are no longer present in the action
            foreach ($formComparisonDetails->factsToDelete as $factToDelete) {
                // Remove this fact's component in the previously designed form
                $formJsonToDuplicate->components = $this->deleteFormComponentByKey($formJsonToDuplicate->components, $factToDelete);
            }
        }
        // Log::debug('NEW FORM JSON:');
        // Log::debug(json_encode($formJsonToDuplicate));
        // Create and update the duplicated form, attached to the current action being created
        $this->createAndUpdateDuplicatedForm($newActionId, $formContentToDuplicate, $formJsonToDuplicate, $formComparisonDetails, $factTypeSpecification, $userId);
    }

    private function getFormContentToBeDuplicated($formId, $langId) {
        // Try to get the form content in the user's language
        $formContent = FormContent::where([
            'form_id' => $formId,
            'language_id' => $langId
        ])->whereNull('deleted_at')->first();
        // If that doesn't exist, get the first form content that appears in the DB (independent of the form's language)
        if (!$formContent) {
            $formContent = FormContent::where('form_id', $formId)->whereNull('deleted_at')->first();
        }
        return $formContent;
    }

    private function getKeptPropertyFactsToRemoveFromForm($formComparisonDetails, $formToBeDuplicatedId, $newActionId) {
        $removeFactsDueToChanges = [];
        foreach ($formComparisonDetails->factsToKeep as $factToKeep) {
            // Get the fact's old and new ActionPropId to check for validationConditions and actionPropHasQuery records
            list($newActionPropId, $oldActionPropId) = $this->getNewAndOldActionPropIds($factToKeep, $newActionId, $formToBeDuplicatedId);
            // Properties that had changes to their validationConditions (except from 'mandatory' flag) will be removed and
            // have to be inserted again (as the validationCondition rendering is done on the client-side).
            // Also, if a property got its options from a query result and now doesn't, remove it, and vice-versa.
            if (!$this->checkIfActionPropValidationConditionsMatch($oldActionPropId, $newActionPropId) || !$this->checkIfActionPropOptionsFromQueryMatch($newActionPropId, $oldActionPropId)) {
                $removeFactsDueToChanges[] = $factToKeep;
            }
        }
        // Remove these properties from the factsToKeep array and pass them to the factsToDelete array
        foreach($removeFactsDueToChanges as $factToRemove) {
            $formComparisonDetails->factsToDelete[] = $factToRemove;
            $formComparisonDetails->factsToKeep = array_values(array_diff($formComparisonDetails->factsToKeep, array($factToRemove)));
        }
        // Return the formComparisonDetails object with the adjusted factsToKeep and factsToDelete arrays
        return $formComparisonDetails;
    }

    private function getNewAndOldActionPropIds($propertyId, $newActionId, $formToBeDuplicatedId) {
        // Get the latest actionPropId from the propId/actionId pair
        $newActionPropId = ActionProp::where([
            'action_id' => $newActionId,
            'prop_id' => $propertyId
        ])->whereNull('deleted_at')->first()->id;
        // Get the older actionPropId from the propId/formId pair
        $oldActionPropId = ActionProp::whereHas('actionPropForms', function($actionPropForm) use ($formToBeDuplicatedId) {
            $actionPropForm->where('form_id', $formToBeDuplicatedId)
                ->whereNull('deleted_at');
        })->where('prop_id', $propertyId)->whereNull('deleted_at')->first()->id;
        return array($newActionPropId, $oldActionPropId);
    }

    private function checkIfActionPropValidationConditionsMatch($oldActionPropId, $newActionPropId) {
        // Get the old actionProp's validationConditions
        $oldActionPropValidationConditions = ValidationCond::where('type', '!=', 'required')
            ->where('action_prop_id', $oldActionPropId)
            ->whereNull('deleted_at')->get();
        // Get the new actionProp's validationConditions
        $newActionPropValidationConditions = ValidationCond::where('type', '!=', 'required')
            ->where('action_prop_id', $newActionPropId)
            ->whereNull('deleted_at')->get();
        // Check if every row in the new ValidationConditions has a match in the old ValidationConditions
        $allMatchFromNewValidationConditions = $newActionPropValidationConditions->every(function ($newValidationCondition) use ($oldActionPropValidationConditions) {
            return $oldActionPropValidationConditions->contains(function ($oldValidationCondition) use ($newValidationCondition) {
                return $oldValidationCondition['type'] === $newValidationCondition['type'] &&
                    $oldValidationCondition['param_1'] === $newValidationCondition['param_1'] &&
                    $oldValidationCondition['param_2'] === $newValidationCondition['param_2'];
            });
        });
        // Check if every row in the old ValidationConditions has a match in the new ValidationConditions
        $allMatchFromOldValidationConditions = $oldActionPropValidationConditions->every(function ($oldValidationCondition) use ($newActionPropValidationConditions) {
            return $newActionPropValidationConditions->contains(function ($newValidationCondition) use ($oldValidationCondition) {
                return $oldValidationCondition['type'] === $newValidationCondition['type'] &&
                    $oldValidationCondition['param_1'] === $newValidationCondition['param_1'] &&
                    $oldValidationCondition['param_2'] === $newValidationCondition['param_2'];
            });
        });
        // Return true only if both checks pass (meaning that validation conditions haven't changed at all), otherwise return false
        return $allMatchFromNewValidationConditions && $allMatchFromOldValidationConditions;
    }

    private function checkIfActionPropOptionsFromQueryMatch($newActionPropId, $oldActionPropId) {
        // Check if the old actionProp had its options coming from a query result
        $oldActionPropHasQuery = ActionPropHasQuery::where('action_prop_id', $oldActionPropId)->whereNull('deleted_at')->exists();
        // Check if the new actionProp has its options coming from a query result
        $newActionPropHasQuery = ActionPropHasQuery::where('action_prop_id', $newActionPropId)->whereNull('deleted_at')->exists();
        // Return true only if both checks match (both have its options coming from a query result, or both don't), otherwise return false
        return  $newActionPropHasQuery === $oldActionPropHasQuery;
    }

    private function createAndUpdateDuplicatedForm($newActionId, $formContentToDuplicate, $formJsonToDuplicate, $formComparisonDetails, $factTypeSpecification, $userId) {
        // Create the new 'form'
        $newForm = Form::create([
            'action_id' => $newActionId,
            'updated_by' => $userId
        ]);

        foreach ($formComparisonDetails->factsToKeep as $factToKeep) {
            if ($factTypeSpecification === 'property') {
                // Get the action prop on this new action being saved for this property and Create an actionPropForm to be
                // associated with this actionProp/form being duplicated
                $newActionProp = $this->getActionPropAndCreateActionPropForm($factToKeep, $newActionId, $newForm->id,
                    $formJsonToDuplicate, $formContentToDuplicate->language_id, $userId);
                // Update the actionProp identifier (form has the previous action's actionProp identifier in the component)
                // And if applicable, update its required flag, enableCondition and/or formCalculation
                $formJsonToDuplicate->components = $this->updatePropertyComponentOptionsByKey($formJsonToDuplicate->components,
                    $factToKeep, $newActionProp, $newForm->id, $userId);
            } else if ($factTypeSpecification === 'entity') {
                // Get the entity specification term on this new action being saved for this entity
                $newEntitySpecificationTerm = $this->getEntitySpecificationTerm($newActionId);
                // Update the entitySpecificationTerm identifier (form has the previous action's entitySpecificationTerm identifier in the component)
                $formJsonToDuplicate->components = $this->updateEntityComponentOptionsByKey($formJsonToDuplicate->components,
                    'entitySpecification'.$factToKeep, $newEntitySpecificationTerm);
            }
        }

        // Create the new 'formContent' record with the updated properties from the updated action
        FormContent::create([
            'form_id' => $newForm->id,
            'language_id' => $formContentToDuplicate->language_id,
            'name' => $formContentToDuplicate->name,
            'json' => json_encode($formJsonToDuplicate),
            'updated_by' => $userId
        ]);
    }

    private function getActionPropAndCreateActionPropForm($propertyId, $actionId, $formId, $formJson, $formLangId, $userId){
        // Get the action prop on this new action being saved for this property
        $newActionProp = ActionProp::where([
            'action_id' => $actionId,
            'prop_id' => $propertyId
        ])->whereNull('deleted_at')->first()->id;
        // Create an actionPropForm to be associated with this actionProp/form being duplicated
        ActionPropForm::create([
            'action_prop_id' => $newActionProp,
            'form_id' => $formId,
            'form_field_type' =>  $this->getFormComponentByKey($formJson->components, $propertyId)->type,
            'lang_id' => $formLangId,
            'updated_by' => $userId
        ]);
        return $newActionProp;
    }

    private function getEntitySpecificationTerm($actionId){
        return TermHasEntitySpecification::where('action_id', $actionId)
            ->whereNull('deleted_at')->first()->term_id;
    }

    private function saveFactSpecificationAssignExpressionActionName($actionId, $actionComment, $userId, $userLangId)
    {
        $action = Action::find($actionId);

        // Get the transaction type's name of the current action scope
        $transactionTypeName = $this->getMultilingualConceptName('transaction_type_name', 't_name',
            'transaction_type_id', $action->actionRule->transaction_type_id, $userLangId);
        // Get the transaction state's name/act_name of the current action scope
        $tStateNameField = $action->actionRule->type === 'act' ? 'act_name' : 'name';
        $transactionStateName = $this->getMultilingualConceptName('t_state_name', $tStateNameField,
            't_state_id', $action->actionRule->t_state_id, $userLangId);

        // Return the action name as 'TransactionTypeName - tStateName: propertyName/contextVariableName'
        $actionName = $transactionTypeName . ' - ' . $transactionStateName . ': ';

        $assignExpressionAction = AssignExpression::where('action_id', $action->id)
            ->whereNull('deleted_at')->first();

        // Assign Expression actions can only have a 'context variable' or a 'property' on its left side
        if (TermHasContextVariable::where('term_id', $assignExpressionAction->destination_term_id)->exists()) {
            // If it's a context variable, get its id, so we can then get its name.
            $contextVariableId = TermHasContextVariable::where('term_id', $assignExpressionAction->destination_term_id)
                ->whereNull('deleted_at')->first()->context_variable_id;
            $actionName .= $this->getMultilingualConceptName('context_variable_text', 'text',
                'context_variable_id', $contextVariableId, $userLangId);
        } else {
            // If it's a property, get its id, so we can then get its name.
            $propertyId = TermHasProperty::where('term_id', $assignExpressionAction->destination_term_id)
                ->whereNull('deleted_at')->first()->property_id;
            $actionName .= $this->getMultilingualConceptName('property_name', 'name',
                'property_id', $propertyId, $userLangId);
        }

        if ($actionComment) {
            // If it has an action comment, a record for the 'action text' table has already been created, we just
            // need to update it by inserting this generated action name
            $existingActionText = ActionText::where('action_id', $actionId)
                ->whereNull('deleted_at')->first();
            $existingActionText->update([
                'name' => $actionName,
                'updated_by' => $userId
            ]);
        } else {
            // Create an actionText for this action, as it will be needed in the 'Forms Management' table/modal
            $action_text = new ActionText;
            $action_text->action_id = $action->id;
            $action_text->language_id = $userLangId;
            $action_text->name = $actionName;
            $action_text->updated_by = $userId;
            $action_text->save();
        }
    }

}
