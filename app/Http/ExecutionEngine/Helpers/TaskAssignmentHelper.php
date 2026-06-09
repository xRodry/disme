<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine\Helpers;

use App\ActionLog;
use App\Http\ExecutionEngine\EECGlobalVariables;
use App\TransactionAck;
use App\TransactionType;
use App\UserHasAccessToProcess;
use Log;

class TaskAssignmentHelper
{
    private $globalVariables;

    public function __construct()
    {
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    public function assignExecutorIfNeeded()
    {
        $alreadyHadExecuter = false;
        $executorActStates = ['pm', 'ex', 'de', 'dc', 'sp', 'rv_rq_al', 'rv_rq_rf', 'rv_ac_al', 'rv_ac_rf', 'rv_pm_rq', 'rv_de_rq'];
        $executorFactStates = ['rq', 'ac', 'rj', 'qt', 'rv_rq_rq', 'rv_ac_rq', 'rv_pm_al', 'rv_pm_rf', 'rv_de_al', 'rv_de_rf'];

        // Check if task is currently an executorTask
        if ($this->globalVariables->actionRuleType === 'act') {
            $executorTask = in_array($this->globalVariables->tStateAbbrv, $executorActStates);
        } else {
            $executorTask = in_array($this->globalVariables->tStateAbbrv, $executorFactStates);
        }

        $transType = TransactionType::where('id', $this->globalVariables->transTypeId)
            ->whereNull('deleted_at')->first();

        if ($executorTask && $transType->own_user_access_only) {
            // TODO Check for delegations
            // Check if uniqueExecutorTask already has an executor assigned to it
            $hasUniqueExecutorAssigned = UserHasAccessToProcess::where([
                'process_id' => $this->globalVariables->processId
            ])->whereHas('user.role', function($query) use ($transType) {
                $query->where('role_id', $transType->executer_role_id);
            })->whereNull('deleted_at')->get()->pluck('user_id')->toArray();
            // If it doesn't have one, assign the current user to the process
            if (!$hasUniqueExecutorAssigned) {
                Log::debug('Is Unique Executor Task & needs executor assignment.');
                UserHasAccessToProcess::create([
                    'user_id' => $this->globalVariables->userId,
                    'process_id' => $this->globalVariables->processId,
                    'updated_by' => $this->globalVariables->userId
                ]);
            } else {
                Log::debug('Is Unique Executor Task & DOESN\'T need executor assignment.');
                if (!in_array($this->globalVariables->userId, $hasUniqueExecutorAssigned)) {
                    Log::error('error - doesn\'t have access to task - another user is responsible for it');
                    $alreadyHadExecuter = true;
                }
            }
        }
        return $alreadyHadExecuter;
    }

    public function storeActionLog ($actionId, $state)
    {
        // For automatic execution actions: only store 'executed' record
        $actionLog = ActionLog::create([
            'state' => $state,
            'action_id' => $actionId,
            'transaction_state_id' => $this->globalVariables->transactionStateId,
            'updated_by' => $this->globalVariables->userId
        ]);
        Log::debug('ACTION LOG SAVED state: '.$actionLog->state.' id:'.$actionLog->id);
    }

    public function storeTransactionAck()
    {
        // Check if user has acknowledged/opened the task before
        $transactionAck = TransactionAck::where([
            'transaction_state_id' => $this->globalVariables->transactionStateId,
            'user_id' => $this->globalVariables->userId
        ])->whereNull('deleted_at')->first();
        // If there's already a record in the 'transaction_ack' table, it means that the transaction_state has at least already been acknowledged by the user
        if ($transactionAck) {
            // If it hasn't been opened yet, mark it as the first time the user's opening the transaction_state
            if (!$transactionAck->opened_on) {
                $transactionAck->update([
                    'opened_on' => now(),
                    'updated_by' => $this->globalVariables->userId
                ]);
            }
        } else {
            // If there isn't a record in the 'transaction_ack' table, create one with the ack_on and opened_on fields filled
            TransactionAck::create([
                'user_id' => $this->globalVariables->userId,
                'ack_on' => now(),
                'opened_on' => now(),
                'transaction_state_id' => $this->globalVariables->transactionStateId,
                'updated_by' => $this->globalVariables->userId
            ]);
        }
    }

}
