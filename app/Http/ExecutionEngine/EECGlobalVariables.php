<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine;

use App\TState;
use stdClass;

class EECGlobalVariables
{
    public $userId;
    public $langId;
    public $transTypeId;
    public $tStateId;
    public $tStateAbbrv;
    public $actionRuleType;
    public $transactionId;
    public $processId;
    public $transactionStateId;
    public $lastActionExecutedId;
    public $changedAR = false;
    public $firstParamsAssignment = null;
    public $originatingTasks = [];

    public $eecController = null;

    // Prevent direct object creation
    public function __construct() { }

    public function setUser($taskParameters)
    {
        $this->userId = $taskParameters->user()->id;
        $this->langId = $taskParameters->user()->language_id;
    }

    public function setExecutionParameters($newTaskParams)
    {
        // Action Rule to Be Performed Parameters:
        $this->transTypeId = $newTaskParams['transaction_type_id'];
        $this->transactionId = $newTaskParams['transaction_id'];
        $this->actionRuleType= $newTaskParams['action_rule_type'];
        $this->processId = $newTaskParams['process_id'];
        $this->transactionStateId = $newTaskParams['transaction_state_id'];
        $this->tStateId = $newTaskParams['t_state_id'];
        $this->tStateAbbrv = TState::where('id',$this->tStateId)
            ->whereNull('deleted_at')->first()->abbrv;
        $this->lastActionExecutedId = $newTaskParams['last_action_id'] ?? null;
        $this->originatingTasks = $newTaskParams['originating_tasks'] ?? [];
    }

    public function setStorageParameters($newTaskParams)
    {
        $this->processId = $newTaskParams['processId'];
        $this->transactionId = $newTaskParams['transactionId'];
        $this->transactionStateId = $newTaskParams['transactionStateId'];
    }

    public function getNewARParametersForClientSide(): stdClass
    {
        $actionRule = new STDClass();
        $actionRule->transaction_type_id = $this->transTypeId;
        $actionRule->t_state_id = $this->tStateId;
        $actionRule->action_rule_type = $this->actionRuleType;
        $actionRule->transaction_id = $this->transactionId;
        $actionRule->transaction_state_id = $this->transactionStateId;
        $actionRule->process_id = $this->processId;
        $actionRule->last_action_id = $this->lastActionExecutedId;
        $actionRule->originating_tasks = $this->originatingTasks;
        return $actionRule;
    }

    public function getCurrentTaskParams(): array
    {
        $taskParameters = array();
        $taskParameters['transaction_type_id'] = $this->transTypeId;
        $taskParameters['transaction_id'] = $this->transactionId;
        $taskParameters['transaction_state_id'] = $this->transactionStateId;
        $taskParameters['t_state_id'] = $this->tStateId;
        $taskParameters['action_rule_type'] = $this->actionRuleType;
        $taskParameters['process_id'] = $this->processId;
        $taskParameters['last_action_id'] = $this->lastActionExecutedId;
        $taskParameters['originating_tasks'] = $this->originatingTasks;
        return $taskParameters;
    }

    public function getNextTaskParamsToContinueExecution ($transactionState, $transTypeId): array
    {
        $taskParameters = array();
        $taskParameters['transaction_type_id'] = $transTypeId ?: $this->transTypeId;
        $taskParameters['transaction_id'] = $transactionState->transaction_id;
        $taskParameters['transaction_state_id'] = $transactionState->id;
        $taskParameters['t_state_id'] = $transactionState->t_state_id;
        $taskParameters['action_rule_type'] = $transactionState->type;
        $taskParameters['process_id'] = $this->processId;
        $taskParameters['last_action_id'] = $this->lastActionExecutedId;
        $taskParameters['originating_tasks'] = $this->originatingTasks;
        return $taskParameters;
    }
}
