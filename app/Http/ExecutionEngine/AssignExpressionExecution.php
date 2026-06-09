<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine;

use App\AssignExpression;
use App\AssignExpressionLog;
use App\ContextVariableValue;
use App\Entity;
use App\EntType;
use App\Form;
use App\Http\ExecutionEngine\Helpers\FormDetailsHelper;
use App\Http\ExecutionEngine\Helpers\TermsExecutionHelper;
use App\Http\Resources\ActionsDashboardResource;
use App\InterProcDep;
use App\Property;
use App\TermHasContextVariable;
use App\TermHasProperty;
use App\Value;
use Log;

class AssignExpressionExecution implements ActionTypeExecutionInterface
{
    protected $termsExecutionHelper;
    protected $formDetailsHelper;
    private $globalVariables;

    public function __construct(TermsExecutionHelper $termsExecutionHelper, FormDetailsHelper $formDetailsHelper = null)
    {
        $this->termsExecutionHelper = $termsExecutionHelper;
        $this->formDetailsHelper = $formDetailsHelper;
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    public function execute(ActionsDashboardResource $action)
    {
        $assignExpression = AssignExpression::where('action_id', $action->id)
            ->whereNull('deleted_at')->first();

        $destinationTermType = $this->termsExecutionHelper->getTermType($assignExpression->destination_term_id);
        $sourceTermType = $this->termsExecutionHelper->getTermType($assignExpression->source_term_id);

        // If we have a 'propertySpecificationTerm'/'entitySpecificationTerm' that the user hasn't submitted its value yet,
        // get its form and return it to client-side
        if (($sourceTermType === 'propertySpecificationTerm' || $sourceTermType === 'entitySpecificationTerm') &&
            !$action->factSpecificationTermValueAssigned) {
                $action->formId = Form::where('action_id', $action->id)->latest()->first()->id;
                $action->formDetails = $this->formDetailsHelper->getFormDetails($action->formId);
                return $action;
        }

        // If we're storing a 'propertySpecificationTerm'/'entitySpecificationTerm', its value will be in the 'factSpecificationTermValueAssigned'
        // of the action object. In case it's any other term type, its value will be on the database, so we get it from there
        $sourceTermValue = ($sourceTermType === 'propertySpecificationTerm' || $sourceTermType === 'entitySpecificationTerm') ?
            $action->factSpecificationTermValueAssigned : $this->termsExecutionHelper->analyzeTerm($assignExpression->source_term_id);

        if ($destinationTermType === 'propertyTerm') {

            Log::debug('Assigning Expression Value to Property');
            $this->assignTermValueToProperty($assignExpression->id, $assignExpression->destination_term_id, $sourceTermValue);

        } else if ($destinationTermType === 'setContextVariableTerm') {

            Log::debug('Setting Expression Value to Context Variable');
            $this->setContextVariableTermValue($assignExpression->destination_term_id, $sourceTermValue);

        } else if ($destinationTermType === 'updateContextVariableTerm') {

            Log::debug('Updating Expression Value to Context Variable');
            $this->updateContextVariableTermValue($assignExpression->destination_term_id, $sourceTermValue);

        }

        return null;
    }

    private function assignTermValueToProperty($assignExpressionId, $destinationTermId, $sourceTermValue)
    {
        $destinationPropertyId = TermHasProperty::where('term_id', $destinationTermId)
            ->whereNull('deleted_at')->first()->property_id;
        $destinationPropertyInfo = Property::find($destinationPropertyId);
        // Check if property's ent_type already has an entity defined for this transaction
        $entity = Entity::where('ent_type_id', $destinationPropertyInfo->ent_type_id)
            ->where('transaction_id', $this->globalVariables->transactionId)
            ->whereNull('deleted_at')
            ->first();

        // If it doesn't, create one
        if (!$entity) {
            $entity = $this->createEntity($destinationPropertyInfo->ent_type_id);
        }

        // Assign the expression to the property on the 'value' table
        $assignedValue = Value::create([
            'entity_id' => $entity->id,
            'property_id' => $destinationPropertyInfo->id,
            'value' => $sourceTermValue,
            'state' => 'active',
            'updated_by' => $this->globalVariables->userId
        ]);

        // INTER-PROC-DEP check if property is of type 'prop_ref'. If it is, check the value selected by the user.
        // If the user selected value belongs to a different process, establish dependency.
        $this->defineInterProcDependencyIfNecessary($destinationPropertyInfo, $entity->transaction->process_id, $sourceTermValue);

        // Save log information about the assigned expression
        $assignExpressionLog = AssignExpressionLog::create([
            'assign_expression_id' => $assignExpressionId,
            'transaction_state_id' => $this->globalVariables->transactionStateId,
            'value_id' => $assignedValue->id,
            'updated_by' => $this->globalVariables->userId
        ]);

        Log::debug('Assign Expression done: assigned value'.$assignedValue->id.' ; logId:'.$assignExpressionLog->id);
    }

    private function createEntity($entTypeId)
    {
        // Get the entType, so we know the value of the 'last_internal_id'
        $entType = EntType::where('id', $entTypeId)
            ->whereNull('deleted_at')->first();
        // Create the entity that will be associated to the property
        $entity = Entity::create([
            'internal_id' => $entType->last_internal_id + 1,
            'ent_type_id' => $entType->id,
            'state' => 'active',
            'transaction_id' => $this->globalVariables->transactionId,
            'updated_by' => $this->globalVariables->userId
        ]);
        // Update the last_internal_id of the corresponding entType
        $entType->update([
            'last_internal_id' => $entity->internal_id,
            'updated_by' => $this->globalVariables->userId
        ]);
        return $entity;
    }

    // INTER-PROC-DEP check if property is of type 'prop_ref'. If it is, check the value selected by the user.
    // If the user selected value belongs to a different process, establish dependency.
    private function defineInterProcDependencyIfNecessary($assignExpressionProperty, $processId, $assignedValue)
    {
        if ($assignExpressionProperty->value_type === 'prop_ref') {
            // Get the 'assign expression' property's process
            $assignExpressionPropertyProcess = $processId;
            // Get the 'assign expression' created value's process
            if ($assignExpressionProperty->fk_property_id) {
                $valueProcess = Value::find($assignedValue)->entity->transaction->process_id;
            } else {
                $valueProcess = Entity::find($assignedValue)->transaction->process_id;
            }
            // If the assigned value belongs to a different process than the property, establish dependency.
            if ($assignExpressionPropertyProcess !== $valueProcess) {
                // Check if dependency has been established before. (could happen in a previous property assignment, for example)
                $dependencyAlreadyDefined = InterProcDep::where([
                    'depending_proc' => $assignExpressionPropertyProcess,
                    'depended_on_proc' => $valueProcess
                ])->whereNull('deleted_at')->first();
                if (!$dependencyAlreadyDefined) {
                    // Establish dependency in case it hasn't been established before.
                    $processDependency = InterProcDep::create([
                        'depending_proc' => $assignExpressionPropertyProcess,
                        'depended_on_proc' => $valueProcess,
                        'updated_by' => $this->globalVariables->userId
                    ]);
                }
            }
        }
    }

    private function setContextVariableTermValue($destinationTermId, $sourceTermValue)
    {
        $contextVariableId = TermHasContextVariable::where('term_id', $destinationTermId)
            ->whereNull('deleted_at')->first()->context_variable_id;

        ContextVariableValue::create([
            'context_variable_id' => $contextVariableId,
            'transaction_state_id' => $this->globalVariables->transactionStateId,
            'value' => $sourceTermValue,
            'updated_by' => $this->globalVariables->userId
        ]);
    }

    private function updateContextVariableTermValue($destinationTermId, $sourceTermValue)
    {
        $contextVariableId = TermHasContextVariable::where('term_id', $destinationTermId)
            ->whereNull('deleted_at')->first()->context_variable_id;

        $contextVariable = ContextVariableValue::where('context_variable_id', $contextVariableId)
            ->whereHas('transactionState.transaction', function($transaction) {
                $transaction->where('id', $this->globalVariables->transactionId);
            })->whereNull('deleted_at')->first();

        $contextVariable->update([
            'value' => $sourceTermValue,
            'transaction_state_id' => $this->globalVariables->transactionStateId,
            'updated_by' => $this->globalVariables->userId
        ]);
    }

}
