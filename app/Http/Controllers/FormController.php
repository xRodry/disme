<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\ActionLog;
use App\ActionProp;
use App\ActionPropForm;
use App\ActionPropHasQuery;
use App\ActionText;
use App\CompEvaluatedExpression;
use App\ComputeExpression;
use App\ComputeExpressionHasTerm;
use App\Condition;
use App\Constant;
use App\EnableCondition;
use App\EnableConditionLog;
use App\Entity;
use App\EntTypeName;
use App\Form;
use App\FormCalculation;
use App\FormCalculationLog;
use App\FormContent;
use App\Http\Resources\ActionEntitySpecificationResource;
use App\Http\Resources\ActionPropFormResource;
use App\Http\Resources\ActionPropResource;
use App\Http\Resources\FormManagementResource;
use App\Http\Resources\FormResource;
use App\Http\Traits\FormUpdatingTrait;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use App\Property;
use App\PropertyName;
use App\TermHasComputeExpression;
use App\TermHasConstant;
use App\TermHasEntitySpecification;
use App\TermHasPropAllowedValue;
use App\TermHasProperty;
use App\TermHasPropRefValue;
use App\TermHasQuery;
use App\TermHasValue;
use App\Value;
use App\ValueText;
use DB;
use Illuminate\Http\Request;
use Log;

class FormController extends Controller
{
    use HTTPResponseTrait, GetMultilingualConceptName, FormUpdatingTrait;

    // Get forms based on user language (used in the form editor's table)
    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $forms = DB::table('form')
            ->join('form_content', 'form.id', '=', 'form_content.form_id')
            ->join('action','action.id', '=', 'form.action_id')
            ->join('action_rule', 'action.action_rule_id', '=', 'action_rule.id')
            ->select('form.id', 'form_content.name', 'form_content.language_id', 'form.action_id',
                'action_rule.id as action_rule_id', 'action_rule.transaction_type_id as transaction_type_id',
                'form_content.updated_at', 'form_content.created_at', 'action_rule.deleted_at as deleted_action_rule')
            ->where('form_content.language_id', $userLangId)
            ->oldest('form_content.created_at')
            ->whereNull(['form.deleted_at', 'form_content.deleted_at'])->get();

        foreach ($forms as $form) {
            $this->getFormAdditionalAttributes($form);
            $this->getFormFKNames($form, $userLangId);
        }

        return FormManagementResource::collection($forms);
    }

    private function getFormAdditionalAttributes($form) {
        // Check if form needs updating - form fields that haven't yet been inserted (has more actionProps than actionPropForms)
        $formActionPropsCount = ActionProp::where('action_id', $form->action_id)->whereNull('deleted_at')->count();
        $formActionPropFormsCount = ActionPropForm::where(['form_id' => $form->id, 'lang_id' => $form->language_id])->whereNull('deleted_at')->count();
        $form->needsUpdating = $formActionPropsCount !== $formActionPropFormsCount;
        // Check if form is being used/will be used in any ongoing AR execution (form's AR & action can be deleted, but
        // still be in use by a transactionState began before its deletion and that is still pending)
        $form->beingUsedInARExecution = ActionLog::whereHas('action', function($action) use ($form) {
            $action->withTrashed()->where('action_rule_id', $form->action_rule_id);
        })->whereHas('transactionState', function($transactionState) {
            $transactionState->where('state', 'pending');
        })->whereNull('deleted_at')->count();
    }

    // Get form depending on passed 'id' and user language
    public function show(Request $request, $formId)
    {
        $userLangId = $request->user()->language_id;

        $form = DB::table('form')
            ->join('form_content', 'form.id', '=', 'form_content.form_id')
            ->join('action','action.id', '=', 'form.action_id')
            ->join('action_rule', 'action.action_rule_id', '=', 'action_rule.id')
            ->select('form.id', 'form_content.name', 'form_content.json', 'form_content.language_id', 'form.action_id', 'action_rule.transaction_type_id as transaction_type_id',
                'form_content.updated_by', 'form_content.deleted_by', 'action_rule.deleted_at as deleted_action_rule')
            ->where([
                ['form_content.language_id', $userLangId],
                ['form.id', $formId]
            ])->latest('form_content.created_at')->first();

        return new FormResource($form);
    }

    private function getFormFKNames($form, $userLangId) {
        $form->language_abbrv = Language::find($form->language_id)->abbrv;
        $form->action_name = $this->getMultilingualConceptName('action_text', 'name',
            'action_id', $form->action_id, $userLangId);
        $form->transaction_type_name = $this->getMultilingualConceptName('transaction_type_name', 't_name',
            'transaction_type_id', $form->transaction_type_id, $userLangId);
    }

    // Allows the creation of a form
    public function store(Request $request)
    {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {

            // Check if there is a previously saved record for a form in this action [If there is, delete it and create new one]
            $form = $this->createNewFormFromAction($request->input('action_id'), $userId);
            // Create a form_content record for the new form in the user's language
            $formContent = $this->createNewFormContentRecord($form->id, $request->input('name'), $request->input('json'), $userId, $langId);

            $this->storeActionPropForms($request->input('actionPropForms'), $form->id, $userId, $langId);
            $this->storeEnableConditionLogs($request->input('enableConditionLogs'), $form->id, $userId);
            $this->storeFormCalculationLogs($request->input('formCalculationLogs'), $form->id, $userId);

            $success = true;
            DB::commit();
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }
        return (string)$success;
    }

    private function createNewFormFromAction($actionId, $userId) {
        // Check if there is a previously saved record for this form in this action
        $formExistsInCurrentAction = Form::where('action_id', $actionId)->whereNull('deleted_at')->first();
        if ($formExistsInCurrentAction) {
            $this->deleteFormFromCurrentAction($formExistsInCurrentAction->id, $userId);
        }
        // Create a new record to store the create form.
        return Form::create([
            'action_id' => $actionId,
            'updated_by' => $userId
        ]);
    }

    private function deleteFormFromCurrentAction($formId, $userId) {
        // Delete every form_content record for this form, as we will have a new one.
        $formContentsToDelete = FormContent::where([
            'form_id' => $formId,
        ])->whereNull('deleted_at')->get();
        foreach ($formContentsToDelete as $formContentToDelete) {
            $formContentToDelete->update([
                'deleted_by' => $userId
            ]);
            $formContentToDelete->delete();
        }
        // Delete the current form existing in this action
        $form = Form::find($formId);
        $form->update([
            'deleted_by' => $userId
        ]);
        $form->delete();
    }

    private function createNewFormContentRecord($formId, $formName, $formJson, $userId, $langId) {
        // Create a new record for the new form saved in the form editor
        return FormContent::create([
            'form_id' => $formId,
            'language_id' => $langId,
            'name' => $formName,
            'json' => $formJson,
            'updated_by' => $userId
        ]);
    }

    private function storeActionPropForms($actionPropForms, $formId, $userId, $langId) {
        foreach ($actionPropForms as $actionPropForm) {
            $newActionPropForm = ActionPropForm::create([
                'action_prop_id' => $actionPropForm["action_prop_id"],
                'form_field_type' => $actionPropForm["form_field_type"],
                'form_id' => $formId,
                'lang_id' => $langId,
                'updated_by' => $userId
            ]);
        }
    }

    private function storeEnableConditionLogs($enableConditionLogs, $formId, $userId) {
        foreach ($enableConditionLogs as $enableConditionLog) {
            $enableCondition = EnableCondition::where('action_prop_id', $enableConditionLog["action_prop_id"])->whereNull('deleted_at')->first();
            // Check if the json_logic has already been stored for this enable condition in this form.
            // Can be an already saved form but in another language. [json logic is language independent]
            $enableConditionLogExists = EnableConditionLog::where([
                'enable_condition_id' => $enableCondition->id,
                'form_id' => $formId
            ])->whereNull('deleted_at')->first();
            // Store it in the logging table if it hasn't been stored yet.
            if (!$enableConditionLogExists) {
                $newEnableConditionLog = EnableConditionLog::create([
                    'enable_condition_id' => $enableCondition->id,
                    'form_id' => $formId,
                    'json_logic' => $enableConditionLog["json_logic"],
                    'updated_by' => $userId
                ]);
            }
        }
    }

    private function storeFormCalculationLogs($formCalculationLogs, $formId, $userId) {
        foreach ($formCalculationLogs as $formCalculationLog) {
            $formCalculation = FormCalculation::where('action_prop_id', $formCalculationLog["action_prop_id"])->whereNull('deleted_at')->first();
            // Check if the json_logic has already been stored for this form calculation in this form.
            // Can be an already saved form but in another language. [json logic is language independent]
            $formCalculationLogExists = FormCalculationLog::where([
                'form_calculation_id' => $formCalculation->id,
                'form_id' => $formId
            ])->whereNull('deleted_at')->first();
            // Store it in the logging table if it hasn't been stored yet.
            if (!$formCalculationLogExists) {
                $newFormCalculationLog = FormCalculationLog::create([
                    'form_calculation_id' => $formCalculation->id,
                    'form_id' => $formId,
                    'json_logic' => $formCalculationLog["json_logic"],
                    'updated_by' => $userId
                ]);
            }
        }
    }

    // Allows a form update
    public function update(Request $request)
    {
        $userId = $request->user()->id;
        $langId = $request->user()->language_id;

        $form = Form::find($request->input('id'));
        $formContent = FormContent::where([
            'form_id' => $form->id,
            'language_id' => $langId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $formUpdated = false;

            $jsonChanged = $formContent->json !== $request->input('json');
            $nameChanged = $formContent->name !== $request->input('name');
            Log::debug('JSON CHANGED: '.$jsonChanged.' NAME CHANGED: '.$nameChanged);

            if ($jsonChanged || $nameChanged) {
                $formContent->update([
                    'name' => $request->input('name'),
                    'json' => $request->input('json'),
                    'updated_by' => $userId,
                ]);
                $formUpdated = true;
            }

            $formUpdated = $this->updateActionPropForms($request->input('actionPropForms'), $form->id, $formUpdated, $userId, $langId);

            // If anything has been updated on the form (name, json, actionPropForms), update the form's 'updated_by'/'updated_at' columns.
            if ($formUpdated) {
                $form->update([
                    'updated_by' => $userId
                ]);
                $form->touch();
            }

            $success = true;
            DB::commit();
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }
        return (string)$success;
    }

    private function updateActionPropForms($actionPropForms, $formId, $formUpdated, $userId, $langId) {
        foreach ($actionPropForms as $actionPropForm) {
            // If passed actionPropForm doesn't have id, it means the user removed it and then inserted it again on the formEditor
            // That is, it has been updated, so we update the 'updated_by'/'updated_at' columns.
            if (!isset($actionPropForm["id"])) {
                $previousActionPropForm = ActionPropForm::where([
                    'action_prop_id' => $actionPropForm["action_prop_id"],
                    'form_id' => $formId,
                    'lang_id' => $langId
                ])->whereNull('deleted_at')->first();
                if ($previousActionPropForm) {
                    $previousActionPropForm->update([
                        'form_field_type' => $actionPropForm["form_field_type"],
                        'updated_by' => $userId
                    ]);
                    // Update the 'updated_at' column
                    $previousActionPropForm->touch();
                } else {
                    $newActionPropForm = ActionPropForm::create([
                        'action_prop_id' => $actionPropForm["action_prop_id"],
                        'form_field_type' => $actionPropForm["form_field_type"],
                        'form_id' => $actionPropForm["form_id"],
                        'lang_id' => $langId,
                        'updated_by' => $userId
                    ]);
                }
                $formUpdated = true;
            }
        }
        return $formUpdated;
    }

    // Deletes form based on id
    public function destroy(Request $request, $id)
    {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        $form = Form::find($id);
        $formContent = FormContent::where([
            'form_id' => $form->id,
            'language_id' => $langId
        ])->whereNull('deleted_at')->first();

        $formContentOtherLanguages = FormContent::where([
            'form_id' => $form->id
        ])->where('language_id', '!=', $langId)->whereNull('deleted_at')->get();

        DB::beginTransaction();
        try {

            $formContent->update([
                'deleted_by' => $userId
            ]);
            $formContent->delete();


            if (!$formContentOtherLanguages) {
                $form->update([
                    'deleted_by' => $userId
                ]);
                $form->delete();
            }

            DB::commit();
            return 'true';
        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse(3, isset($e) ? $e->getMessage() . ' | Code Line: ' . $e->getLine() : null);
        }
    }

    public function deleteAllRetiredForms(Request $request) {

        DB::beginTransaction();
        try {

            foreach ($request->all() as $retiredFormId) {
                $this->destroy($request, $retiredFormId);
            }

            DB::commit();
            return 'true';
        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse(3, isset($e) ? $e->getMessage() . ' | Code Line: ' . $e->getLine() : null);
        }
    }

    public function getActionPropertiesForFormEditing(Request $request, $actionId) {
        $langId = $request->user()->language_id;

        $properties = $this->getPropertiesNeededInfoFromAction($actionId, $langId);
        $properties = $this->getDefaultNamesForUntranslatedProperties($properties);

        foreach($properties as $property) {
            $property->has_query_options = $this->hasQueryOptions($property->action_prop_id);
            $property->validation_conditions = $this->getValidationConditions($property->action_prop_id, $langId);
            $property->enable_condition = $this->getEnableConditionJsonLogic($property->action_prop_id);
            $property->form_calculation = $this->getFormCalculationJsonLogic($property->action_prop_id);
            $property->possible_values = $this->getPropertyPossibleValues($property,  $langId);
        }

        return ActionPropResource::collection($properties);
    }

    public function getActionEntityForFormEditing(Request $request, $actionId) {
        $langId = $request->user()->language_id;

        $termHasEntitySpecification = TermHasEntitySpecification::where('action_id', $actionId)
            ->whereNull('deleted_at')->first();
        $termHasEntitySpecification->ent_type_name = $this->getMultilingualConceptName('ent_type_name', 'name',
            'ent_type_id', $termHasEntitySpecification->ent_type_id, $langId);

        return new ActionEntitySpecificationResource($termHasEntitySpecification);
    }

    public function getActionPropertiesForFormRendering(Request $request, $actionId, $entityId = null) {

        $langId = $request->user()->language_id;
        $properties = $this->getPropertiesNeededInfoFromAction($actionId, $langId);

        if ($entityId) {
            foreach($properties as $property) {
                // If it's from an 'edit entity instance' action, get the current property values so that properties can be pre-filled in form
                $property->current_value = $this->getCurrentValues($property, $entityId);
            }
        }

        return ActionPropResource::collection($properties);
    }

    public function getActionPropertiesForFormTranslation(Request $request, $actionId, $formBeingTranslatedLangId) {
        $langId = $request->user()->language_id;

        $properties = $this->getPropertiesInfoFromActionForFormTranslation($actionId, $langId, $formBeingTranslatedLangId);

        foreach($properties as $property) {
            $property->validation_conditions = $this->getValidationConditions($property->action_prop_id, $langId);
            $property->enable_condition = $this->getEnableConditionJsonLogic($property->action_prop_id);
            $property->form_calculation = $this->getFormCalculationJsonLogic($property->action_prop_id);
            $property->possible_values = $this->getPropertyPossibleValues($property,  $langId);
        }

        return ActionPropResource::collection($properties);
    }

    private function getPropertiesNeededInfoFromAction($actionId, $langId) {
        $properties = $this->getPropertiesFromAction($actionId, $langId);

        // When editing an 'has many' ent type inside the 'part of' property's ent type, not all properties may be editable,
        // But we still load them so that each entity from this ent type can be well identified when editing.
        return $this->getRemainingPropertiesHasManyEntTypes($properties, $actionId, $langId);
    }

    private function getPropertiesInfoFromActionForFormTranslation($actionId, $langId, $formBeingTranslatedLangId) {
        $properties = $this->getPropertiesNeededInfoFromAction($actionId, $langId);

        // When a form is being translated, if a property/ent_type doesn't have a name in the translating language,
        // Get the property_name/ent_type_name in the 'original' form's language. Will be presented in the form of ex: EN_Car Type.
        // Used when editing/creating a form from a translated action. In this case, we don't have an original language.
        return $this->getDefaultNamesForUntranslatedProperties($properties, $formBeingTranslatedLangId);
    }

    private function hasQueryOptions($actionPropId) {
        return !!ActionPropHasQuery::where('action_prop_id', $actionPropId)
            ->whereNull('deleted_at')->first();
    }

    private function getPropertiesFromAction($actionId, $langId) {
        return Property::join('action_prop', 'property.id', '=', 'action_prop.prop_id')
            ->join('ent_type', 'property.ent_type_id', '=', 'ent_type.id')
            ->leftJoin('ent_type_name', function($query) use ($langId) {
                $query->on('property.ent_type_id', '=', 'ent_type_name.ent_type_id')
                    ->where('ent_type_name.language_id', '=', $langId)
                    ->whereNull('ent_type_name.deleted_at');
            })
            ->leftJoin('property_name', function($query) use ($langId) {
                $query->on('property.id', '=', 'property_name.property_id')
                    ->where('property_name.language_id', '=', $langId)
                    ->whereNull('property_name.deleted_at');
            })
            ->select('property.id AS id', 'property.id AS property_id', 'property.value_type', 'action_prop.id AS action_prop_id',
                'property_name.name AS property_name', 'property.fk_property_id', 'property.fk_entity_type_id', 'part_of', 'order',
                'multiple_values', 'requires_translation', 'ent_type.id as ent_type_id', 'ent_type.has_many',
                'ent_type_name.name as ent_type_name')
            ->where([
                ['action_prop.action_id', $actionId]
            ])->whereNull('action_prop.deleted_at')
            ->orderBy('action_prop.order')->get();
    }

    private function getRemainingPropertiesHasManyEntTypes($properties, $actionId, $langId) {
        // When editing an 'has many' ent type inside the 'part of' property's ent type, not all properties may be editable,
        // But we still load them and their respective saved values so that each entity from this ent type can be well identified.
        // [Ex: editing 'Car has Feature' entities when editing a 'Car'] - so we can identify the feature where we're editing the 'colour'.
        // if 'Car Has Feature' consists of 'Car'[part_of property], 'Feature' [not editable] and 'Colour'[editable].
        // In this example, this function gets the 'feature' property and adds it to the properties array.
        $entTypesHasMany = $properties->filter(function ($property) {
            return $property->has_many;
        })->unique('ent_type_id')->pluck('ent_type_id');
        foreach ($entTypesHasMany as $entTypeId) {
            $remainingPropertiesFromEntType = Property::join('ent_type', 'ent_type.id', '=', 'property.ent_type_id')
                ->leftJoin('ent_type_name', function($query) use ($langId) {
                    $query->on('property.ent_type_id', '=', 'ent_type_name.ent_type_id')
                        ->where('ent_type_name.language_id', '=', $langId)
                        ->whereNull('ent_type_name.deleted_at');
                })
                ->leftJoin('property_name', function($query) use ($langId) {
                    $query->on('property.id', '=', 'property_name.property_id')
                        ->where('property_name.language_id', '=', $langId)
                        ->whereNull('property_name.deleted_at');
                })
                ->select('property.id AS property_id', 'property.value_type', 'property_name.name AS property_name',
                    'property.fk_property_id', 'property.fk_entity_type_id', 'part_of', 'multiple_values', 'requires_translation',
                    'ent_type.id as ent_type_id', 'ent_type.has_many', 'ent_type_name.name as ent_type_name')
                ->whereNotIn('property_id',
                    ActionProp::where('action_id', $actionId)->whereNull('deleted_at')->get()->pluck('prop_id')
                )->where('ent_type.id', $entTypeId)->whereNull('property.deleted_at')->get();
            foreach($remainingPropertiesFromEntType as $remainingProp) {
                $remainingProp->unchangeable = 1;
            }
            $properties = $properties->concat($remainingPropertiesFromEntType);
        }
        return $properties;
    }

    private function getCurrentValues($property, $entityId) {
        // If directly editing an 'has many' ent type, only load values belonging to that entity id.
        // If editing an 'has many' ent type inside its 'parent' ent type editing, load all entities.
        $entity = Entity::find($entityId);
        $mainEntType = $entity->ent_type_id;
        $transactionId = $entity->transaction_id;
        if ($property->requires_translation && $property->value_type !== 'enum') {
            $currentValues = ValueText::whereHas('value', function($query) use ($mainEntType, $transactionId, $property, $entityId) {
                $query->where('property_id', $property->property_id)
                    ->when($property->has_many && $property->ent_type_id !== $mainEntType, function ($query) use ($transactionId) {
                        $query->whereHas('entity', function($query) use ($transactionId) {
                            $query->where('transaction_id', $transactionId)
                                ->whereNull('deleted_at');
                        });
                    }, function($query) use ($entityId) {
                        $query->where('entity_id', $entityId);
                    });
            })->select('text AS value', 'value_id')->whereNull('deleted_at')->get();
            foreach($currentValues as $currentValue) {
                $currentValue->entity_id = Value::find($currentValue->value_id)->entity_id;
            }
        } else {
            $currentValues = Value::where('property_id', $property->property_id)
                ->when($property->has_many && $property->ent_type_id !== $mainEntType, function ($query) use ($transactionId) {
                    $query->whereHas('entity', function($query) use ($transactionId) {
                        $query->where('transaction_id', $transactionId)
                            ->whereNull('deleted_at');
                    });
                }, function($query) use ($entityId) {
                    $query->where('entity_id', $entityId);
                })->whereNull('deleted_at')->select('value', 'entity_id')->get();
        }
        // In case property belongs to ent type 'has many', we need the entity_id, otherwise we only need the stored value
        $currentValues = $property->has_many ? $currentValues : $currentValues->pluck('value');
        return $currentValues->count() > 0 ? (($property->multiple_values || $property->has_many) ? $currentValues : $currentValues->first()) : null;
    }

    // When a form is being translated, if a property/ent_type doesn't have a name in the translating language,
    // Get the property_name/ent_type_name in the 'original' form's language. Will be presented in the form of ex: EN_Car Type.
    private function getDefaultNamesForUntranslatedProperties($properties, $defaultLanguageId = null) {
        // In case it's a form translation, we have an original language (from the form that is being translated)
        if ($defaultLanguageId) {
            $langAbbrv = strtoupper(Language::find($defaultLanguageId)->abbrv);
            foreach ($properties as $property) {
                if (!$property->property_name) {
                    $originalPropertyName = PropertyName::where([
                        'property_id' => $property->property_id,
                        'language_id' => $defaultLanguageId
                    ])->whereNull('deleted_at')->first()->name;
                    $property->property_name = $langAbbrv.'_'.$originalPropertyName;
                }
                if (!$property->ent_type_name) {
                    $originalEntTypeName = EntTypeName::where([
                        'ent_type_id' => $property->ent_type_id,
                        'language_id' => $defaultLanguageId
                    ])->whereNull('deleted_at')->first()->name;
                    $property->ent_type_name = $langAbbrv.'_'.$originalEntTypeName;
                }
            }
        } else {
            // In case it's a form editing/rendering - in this case we don't have an 'original language'
            // We search for names (on other languages) for the current property/ent_type and use the first one found
            // Same presentation: Will be presented in the form of ex: EN_Car Type.
            foreach ($properties as $property) {
                if (!$property->property_name) {
                    $originalPropertyName = PropertyName::where([
                        'property_id' => $property->property_id
                    ])->whereNull('deleted_at')->first();
                    $langAbbrv = strtoupper(Language::find($originalPropertyName->language_id)->abbrv);
                    $property->property_name = $langAbbrv . '_' . $originalPropertyName->name;
                }
                if (!$property->ent_type_name) {
                    $originalEntTypeName = EntTypeName::where([
                        'ent_type_id' => $property->ent_type_id
                    ])->whereNull('deleted_at')->first();
                    $langAbbrv = strtoupper(Language::find($originalEntTypeName->language_id)->abbrv);
                    $property->ent_type_name = $langAbbrv.'_'.$originalEntTypeName->name;
                }
            }
        }
        return $properties;
    }

    private function getValidationConditions($actionPropId, $langId) {
        return DB::table('validation_cond')
            ->leftJoin('validation_cond_has_template', function($query) use ($langId) {
                $query->on('validation_cond_has_template.validation_cond_id', '=', 'validation_cond.id')
                    ->join('template', 'validation_cond_has_template.template_id', '=', 'template.id')
                    ->leftJoin('template_text', function($query) use ($langId) {
                        $query->on('template_text.template_id','=','template.id')
                            ->where('template_text.language_id',$langId);
                    });
            })
            ->join('action_prop', 'action_prop.id', '=', 'validation_cond.action_prop_id')
            ->select('validation_cond.*', 'template_text.text as error_text')
            ->where([
                ['validation_cond.action_prop_id', $actionPropId]
            ])->whereNull('validation_cond.deleted_at')->get();
    }

    private function getPropertyPossibleValues($property,  $langId) {
        if ($property->value_type === 'enum') {
            return $this->getEnumPropertyValues($property, $langId, true);
        } else if ($property->value_type === 'prop_ref') {
            return $this->getPropRefPropertyValues($property, $langId, true);
        } else {
            return null;
        }
    }

    // Gets the form's associated actionPropForms
    public function getActionPropForms(Request $request, $formId)
    {
        $langId = $request->user()->language_id;

        $actionPropForm = ActionPropForm::where([
            ['form_id',$formId],
            ['lang_id',$langId]
        ])->whereNull('deleted_at')->get();

        return ActionPropFormResource::collection($actionPropForm);
    }

    // Get forms that can be translated - Forms that exist in other languages that aren't the user's language
    public function getFormsToTranslate(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $formsInUserLanguage = FormContent::where('language_id', $userLangId)
            ->whereNull('deleted_at')->get()->pluck('form_id');

        $formsForTranslation = Form::whereHas('action.actionRule', function ($query) {
            $query->whereNull('deleted_at');
        })
            ->join('form_content', 'form.id', '=', 'form_content.form_id')
            ->join('action', 'form.action_id', '=', 'action.id')
            ->join('action_rule', 'action.action_rule_id', '=', 'action_rule.id')
            ->leftJoin('action_text',function($query) use ($userLangId) {
                $query->on('action_text.action_id','=','action.id')
                    ->where('action_text.language_id', $userLangId)
                    ->whereNull('action_text.deleted_at');
            })
            ->select('form.id', 'form_content.name', 'form.action_id as action_id', 'transaction_type_id', 'form.updated_at',
                'form.created_at', 'form_content.language_id', 'action_text.name as action_name_user_language')
            ->whereNotIn('form.id', $formsInUserLanguage)
            ->whereNull('form_content.deleted_at')
            ->oldest('form_content.created_at')->get();

        foreach ($formsForTranslation as $form) {
            $this->getFormFKNames($form, $userLangId);
        }

        return FormManagementResource::collection($formsForTranslation);
    }

    // Get a form for translation through the form's id and origin language id
    public function getFormToTranslate(Request $request, $formId, $langId){

        $form = DB::table('form')
            ->join('form_content', 'form.id', '=', 'form_content.form_id')
            ->join('language', 'language.id', '=', 'form_content.language_id')
            ->select('form.*','form_content.*', 'form.id as id')
            ->where([
                ['language.id', $langId],
                ['form.id', $formId]
            ])->whereNull('form_content.deleted_at')->first();

        return new FormResource($form);
    }

    // Create a translated form - difference from createForm 'normal' is that it doesn't create a record for the 'form' table
    // as it is an instance of an existing form but in a different language
    public function createTranslatedForm(Request $request) {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        $formId = $request->input('id');

        DB::beginTransaction();
        try {

            if (!$request->input('hasTranslatedActionName')) {
                $actionNameRecordExists = ActionText::onlyTrashed()->where([
                    'action_id' => $request->input('action_id'),
                    'language_id' => $langId,
                ])->first();
                if ($actionNameRecordExists) {
                    $actionNameRecordExists->restore();
                    $actionNameRecordExists->update([
                        'name' => $request->input('action_name_user_language'),
                        'updated_by' => $userId,
                        'deleted_by' => null
                    ]);
                } else {
                    $actionNameTranslated = ActionText::create([
                        'action_id' => $request->input('action_id'),
                        'language_id' => $langId,
                        'name' => $request->input('action_name_user_language'),
                        'updated_by' => $userId
                    ]);
                }
            }

            $formContent = FormContent::create([
                'form_id' => $formId,
                'language_id' => $langId,
                'name' => $request->input('name'),
                'json' => $request->input('json'),
                'updated_by' => $userId
            ]);

            $actionPropForms = $request->input('actionPropForms');
            Log::debug($actionPropForms);
            foreach ($actionPropForms as $actionPropForm) {
                $newActionPropForm = ActionPropForm::create([
                    'action_prop_id' => $actionPropForm["action_prop_id"],
                    'form_field_type' => $actionPropForm["form_field_type"],
                    'form_id' => $actionPropForm["form_id"],
                    'lang_id' => $langId,
                    'updated_by' => $userId
                ]);
            }
            $success = true;
            DB::commit();
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }
        return (string)$success;
    }

    public function getFormCalculationJsonLogic($actionPropId) {
        // Example of what could be a form_calculation's jsonLogic:
        // { "+" : [ "5" , {"var":"data.5"} , "7" , {"x" :["2",{"var":"data.8"}]} ]}
        $formCalculation = FormCalculation::where('action_prop_id', $actionPropId)
            ->whereNull('deleted_at')->first();
        return $formCalculation ? $this->getComputeExpressionTermJsonLogic($formCalculation->compute_expression_id) : null;
    }

    public function getEnableConditionJsonLogic($actionPropId) {
        // Example of an enable_condition's jsonLogic with CompEvaluatedExpressions and subConditions:
        // {"and" : [                                                       enableCondition's main condition - start
        //	  { ">" : [ { "+" : ["1", {"var":"data.5"},"1","1"] } ,7]  },       compEvaluatedExpression
        //	  { "==" : ["Hello","Hello"] },                                     compEvaluatedExpression
        //    { "and" : [                                                       subCondition type and - start
        //	     { ">" : [ { "+" : ["3", {"var":"data.5"}] } ,7]  },                compEvaluatedExpression
        //	     { "==" : ["Hello","No"] }                                          compEvaluatedExpression
        //    ]},                                                               subCondition type and - end
        //    { "==" : ["Hello","Hello"] }                                      subCondition type istrue
        //] }                                                               enableCondition's main condition - end
        // Get the enable condition's main condition and its corresponding jsonLogic
        $enableCondition = EnableCondition::where('action_prop_id', $actionPropId)
            ->whereNull('deleted_at')->first();
        return $enableCondition ? $this->getConditionJsonLogic($enableCondition->condition_id) : null;
    }

    private function getConditionJsonLogic($conditionId) {
        $conditionJsonLogic = "";
        // Example1 type 'istrue': { "==" : [1, 1] } ; Example2 type 'and': {"and" : [ { ">" : [3,1] }, { "<" : [1,3] } ] }
        // More info/examples: https://jsonlogic.com/
        // Get the condition's type: 'istrue', 'not', 'or', 'and'.
        $conditionType = Condition::find($conditionId)->type;
        // When the condition isn't of type 'istrue', there's additional settings. Ex: {"or" : [ ... ] } | {"!" : [ ... ] }
        if ($conditionType !== 'istrue') {
            $conditionJsonLogic .= '{"'.$this->getJsonLogicOperator($conditionType).'" : [';
        }
        // Join the corresponding jsonLogic for each one of the condition's Comp Evaluated Expressions
        $compEvaluatedExpressions = CompEvaluatedExpression::where('parent_cond_id', $conditionId)->whereNull('deleted_at')->get();
        foreach($compEvaluatedExpressions as $key => $compEvaluatedExpression) {
            $conditionJsonLogic .= $this->getCompEvaluatedExpressionJsonLogic($compEvaluatedExpression);
            // In case there's a following Comp_Evaluated_Expression, we need a ',' on the end off the current expression's jsonLogic
            if (isset($compEvaluatedExpressions[$key + 1])) {
                $conditionJsonLogic .= ', ';
            }
        }
        // Join the corresponding jsonLogic for each one of the condition's Sub Conditions
        $subConditions = Condition::where('parent_cond_id', $conditionId)->whereNull('deleted_at')->get();
        // In case there are compEvaluatedExpressions AND subConditions, add a ',' after the last compEvaluatedExpression
        if ($compEvaluatedExpressions->isNotEmpty() && $subConditions->isNotEmpty()) {
            $conditionJsonLogic .= ', ';
        }
        // Get the jsonLogic string for each subCondition that the current condition may have
        foreach($subConditions as $key => $subCondition) {
            $conditionJsonLogic .= $this->getConditionJsonLogic($subCondition->id);
            // In case there's a following Comp_Evaluated_Expression, we need a ',' on the end off the current expression's jsonLogic
            if (isset($subConditions[$key + 1])) {
                $conditionJsonLogic .= ', ';
            }
        }
        // Due to the additional settings for when the condition isn't of type 'istrue'. Ex: {"or" : [ ... ] } | {"!" : [ ... ] }
        if ($conditionType !== 'istrue') {
            $conditionJsonLogic .= '] }';
        }
        return $conditionJsonLogic;
    }

    private function getCompEvaluatedExpressionJsonLogic($compEvaluatedExpression) {
        // compEvaluatedExpression's jsonLogic format: { "logical_operator" : [term1, term2]  }
        $jsonLogic = '{ "'.$compEvaluatedExpression->logical_operator.'" : [';
        // Join both terms' jsonLogic separated by a comma
        $jsonLogic .= $this->getTermJsonLogic($compEvaluatedExpression->term_1_id) . ',' .
            $this->getTermJsonLogic($compEvaluatedExpression->term_2_id);
        $jsonLogic .= '] }';
        return $jsonLogic;
    }

    private function getTermJsonLogic($termId) {
        switch($this->getTermType($termId)) {
            case 'propertyTerm':
                // Properties on our enable condition's jsonLogic are represented like: {"var": "data.7"} with 7 being the propertyId [the form field's id]
                $propertyId = TermHasProperty::where('term_id', $termId)->whereNull('deleted_at')->first()->property_id;
                return '{ "var": "data.'.$propertyId.'"}';
            case 'propAllowedValueTerm':
                $propAllowedValueId = TermHasPropAllowedValue::where('term_id', $termId)->whereNull('deleted_at')->first()->prop_allowed_value_id;
                return '"'.$propAllowedValueId.'"';
            case 'propRefValueTerm':
                $propRefValueId = TermHasPropRefValue::where('term_id', $termId)->whereNull('deleted_at')->first()->prop_ref_value_id;
                return '"'.$propRefValueId.'"';
            case 'queryTerm':
                // TODO after query behaviour is well defined
                return '';
            case 'constantTerm':
                $constantId = TermHasConstant::where('term_id', $termId)->whereNull('deleted_at')->first()->constant_id;
                $constantValue = Constant::where('id', $constantId)->whereNull('deleted_at')->first()->value;
                return '"'.$constantValue.'"';
            case 'valueTerm':
                $value = TermHasValue::where('term_id', $termId)->whereNull('deleted_at')->first()->value;
                return '"'.$value.'"';
            case 'computeExpressionTerm':
                // Compute Expressions on our enable condition's jsonLogic are represented like: { "+" : ["1", {"var":"data.5"},"1","1"] }
                $computeExpressionId = TermHasComputeExpression::where('term_id', $termId)->whereNull('deleted_at')->first()->compute_expression_id;
                return $this->getComputeExpressionTermJsonLogic($computeExpressionId);
            default:
                return 'error';
        }
    }

    private function getComputeExpressionTermJsonLogic($computeExpressionId) {
        // Example of compute expression's jsonLogic: { "+" : [1, {"var":"data.6"},1,1] }
        $computeExpressionOperator = ComputeExpression::find($computeExpressionId)->operator;
        if ($computeExpressionOperator === 'average') {
            // Start the jsonLogic as the division of the sum of its terms (average)
            $jsonLogic = '{"/" : [ { "+" : [';
        } else {
            // Start the jsonLogic with the compute expression's main operator
            $jsonLogic = '{ "'. $computeExpressionOperator . '" : [';
        }
        // Get the computeExpression's terms and for each of them get the corresponding jsonLogic
        $computeExpressionTerms = ComputeExpressionHasTerm::where('compute_expression_id', $computeExpressionId)
            ->whereNull('deleted_at')->orderBy('order', 'asc')->get();
        foreach($computeExpressionTerms as $key => $computeExpressionTerm) {
            $jsonLogic .= $this->getTermJsonLogic($computeExpressionTerm->term_id);
            // In case it isn't the last term inside the computeExpression, we need a ',' on the end off the current term's jsonLogic
            if (isset($computeExpressionTerms[$key + 1])) {
                $jsonLogic .= ', ';
            }
        }
        if ($computeExpressionOperator === 'average') {
            // Insert the numberOfTerms for the calculation of the average and close the jsonLogic
            $jsonLogic .=  '] }, '.$computeExpressionTerms->count() .' ] }';
        } else {
            // Close the jsonLogic
            $jsonLogic .= '] }';
        }
        return $jsonLogic;
    }

    private function getTermType ($termId): string
    {
        if (TermHasProperty::where('term_id', $termId)->exists()) {
            return 'propertyTerm';
        } else if (TermHasPropAllowedValue::where('term_id',$termId)->exists()) {
            return 'propAllowedValueTerm';
        } else if (TermHasPropRefValue::where('term_id',$termId)->exists()) {
            return 'propRefValueTerm';
        } else if (TermHasQuery::where('term_id',$termId)->exists()) {
            return 'queryTerm';
        } else if (TermHasConstant::where('term_id',$termId)->exists()) {
            return 'constantTerm';
        } else if (TermHasValue::where('term_id',$termId)->exists()) {
            return 'valueTerm';
        } else if (TermHasComputeExpression::where('term_id',$termId)->exists()) {
            return 'computeExpressionTerm';
        } else {
            return 'error';
        }
    }

    private function getJsonLogicOperator($conditionType) {
        switch($conditionType) {
            case 'not':
                return '!';
            case 'and':
                return 'and';
            case 'or':
                return 'or';
            default:
                return 'error';
        }
    }
}
