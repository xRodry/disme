<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine\Helpers;

use App\Http\ExecutionEngine\EECGlobalVariables;
use App\InterProcDep;
use App\Process;
use App\RoleHasUser;
use App\RoleInitiatesTransaction;
use App\TransactionState;
use App\TransactionType;
use App\TState;
use App\UserHasAccessToProcess;
use App\WaitingLink;
use Log;

class ExecutionFlowHelper
{
    private $globalVariables;

    public function __construct()
    {
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    public function goToNextTState()
    {
        // Check if AR Execution contained Causal Link that already changed the state of the current transaction
        if ($nextTransactionState = $this->transactionHasChangedStateDuringExecution()) {
            // Has already changed tState, no need to finish current tState and pass to the next tState
            if ($nextTransactionState == 'finishedTransactionExecution' || $nextTransactionState->state == 'waiting') {
                // Transaction was finished after the Causal Link execution, or its new tState is in 'waiting' state.
                // In both cases, user can't continue the transaction's execution
                return null;
            }
            return $nextTransactionState;
        }

        // When AR is of type 'act', the next state is the same tState but with type 'fact'
        // When AR is of type 'fact', the next state is obtained through the transaction pattern
        $nextARType = $this->globalVariables->actionRuleType === 'act' ? 'fact' : 'act';
        $nextTState = $this->globalVariables->actionRuleType === 'act' ? $this->globalVariables->tStateAbbrv : $this->getNextTStateAbbrv($this->globalVariables->tStateAbbrv);
        $nextTStateId = $nextTState ? TState::where('abbrv', $nextTState)->whereNull('deleted_at')->first()->id : null;

        $this->finishTransactionState();

        if ($nextTStateId) {
            $nextTransactionState = TransactionState::create([
                'transaction_id' => $this->globalVariables->transactionId,
                't_state_id' => $nextTStateId,
                'type' => $nextARType,
                'act_action_id' => $this->globalVariables->lastActionExecutedId,
                'state' => 'pending',
                'updated_by' => $this->globalVariables->userId,
            ]);
            $this->globalVariables->lastActionExecutedId = null;
        } else {
            // When transaction finishes a terminal state, if it is a transaction that ends the associated process, do just that.
            $transactionType = TransactionType::where('id', $this->globalVariables->transTypeId)
                ->whereNull('deleted_at')->first();
            if ($transactionType->end_proc) {
                $process = Process::where('id', $this->globalVariables->processId)
                    ->whereNull('deleted_at')->first();
                // When process is already 'cancelled', maintain that state when it is finished
                if ($process->proc_state === 'execution') {
                    $process->update([
                        'proc_state' => 'finished',
                        'updated_by' => $this->globalVariables->userId
                    ]);
                }
            }
            return null;
        }
        return $nextTransactionState;
    }

    // Check if AR Execution contained Causal Link as its lastAction, meaning that it already changed the state of the current transaction
    private function transactionHasChangedStateDuringExecution()
    {
        $taskIsPending = TransactionState::where([
            'transaction_id' => $this->globalVariables->transactionId,
            't_state_id' => $this->globalVariables->tStateId,
            'type' => $this->globalVariables->actionRuleType,
            'state' => 'pending'
        ])->whereNull('deleted_at')->first();
        if (!$taskIsPending) {
            // If the task is no longer in state 'pending', get the tState in which the transaction is at the moment
            $newTaskState = TransactionState::where('transaction_id',$this->globalVariables->transactionId)
                ->whereIn('state',['pending', 'waiting'])
                ->whereNull('deleted_at')->first();
            if (!$newTaskState) {
                return 'finishedTransactionExecution';
            }
            return $newTaskState;
        } else {
            return false;
        }
    }

    private function getNextTStateAbbrv ($tStateAbbrv)
    {
        switch($tStateAbbrv) {
            case 'rq':
                return 'pm';
            case 'pm':
            case 'rv_de_al':
                return 'ex';
            case 'ex':
            case 'rj':
                return 'de';
            case 'de':
                return 'ac';
            case 'dc':
                return 'rq';
            case 'rv_rq_rq':
                return 'rv_rq_al';
            case 'rv_rq_al':
                return 'qt';
            case 'rv_ac_rq':
                return 'rv_ac_al';
            case 'rv_ac_al':
                return 'rj';
            case 'rv_pm_rq':
                return 'rv_pm_al';
            case 'rv_pm_al':
                return 'dc';
            case 'rv_de_rq':
                return 'rv_de_al';
            case 'ac':
            case 'qt':
            case 'sp':
            case 'rv_rq_rf':
            case 'rv_ac_rf':
            case 'rv_pm_rf':
            case 'rv_de_rf':
                return null;
            default:
                return 'error';
        }
    }

    public function finishTransactionState()
    {
        $transactionState = TransactionState::where([
            ['transaction_id',$this->globalVariables->transactionId],
            ['t_state_id', $this->globalVariables->tStateId],
            ['state','pending']
        ])->whereNull('deleted_at')->first();
        Log::debug('Finishing transaction state id:'.$transactionState->id);
        $transactionState->update([
            'state'  => 'performed',
            'fact_action_id' => $this->globalVariables->lastActionExecutedId,
            'updated_by' => $this->globalVariables->userId
        ]);
        // Waiting Link tasks only unblock other blocked tasks when their 'fact task' has been performed
        if ($transactionState->type == 'fact') {
            $this->checkForBlockedWaitingLinks($transactionState);
        }
    }

    public function checkForBlockedWaitingLinks ($transactionState)
    {
        Log::debug('Checking for blocked waiting links!!! transType:'.$transactionState->transaction->transaction_type_id.
            ' state:'.$transactionState->t_state_id);
        // Only used when a task is completed, so we can use the global variables for the processId, tStateId, etc.,
        // because these global variables always reflect the current task being evaluated.
        // Get waiting links that may have blocked tasks with the task that was just performed.
        $waitingLinks = WaitingLink::where([
            'waited_t' => $transactionState->transaction->transaction_type_id,
            'waited_act' => $transactionState->t_state_id
        ])->whereNull('deleted_at')->get();
        // Get processes that depend on the current process - they can be blocked by the current process.
        // [ex: Retail Order blocked by Gross Order]
        $interProcDeps = InterProcDep::where('depended_on_proc', $transactionState->transaction->process_id)
            ->whereNull('deleted_at')->get()->pluck('depending_proc');
        // For each waiting link, check if there are tasks blocked by it that can be 'unblocked'
        foreach ($waitingLinks as $waitingLink) {
            // Look for tasks whose execution was blocked by the task that was just performed
            $blockedTransactionStates = TransactionState::where([
                't_state_id' => $waitingLink->waiting_act,
                'state' => 'waiting'
            ])->with('transaction')->whereHas('transaction', function($query) use ($transactionState, $waitingLink, $interProcDeps) {
                $query->where('transaction_type_id', $waitingLink->waiting_t)
                    ->where(function ($query) use ($transactionState, $interProcDeps) {
                        $query->where('process_id', $transactionState->transaction->process_id)
                            ->orWhereIn('process_id', $interProcDeps);
                    })->whereNull('deleted_at');
            })->whereNull('deleted_at')->get();
            Log::debug('Blocked Transaction States:');
            Log::debug($blockedTransactionStates);
            // Check if the task that was blocked by this waiting link is blocked by other waiting links
            // If it isn't, mark it as pending for execution. If it is, it remains in the waiting state.
            foreach($blockedTransactionStates as $blockedTransactionState) {
                if (!$this->hasBlockingWaitingLink($blockedTransactionState->t_state_id,
                    $blockedTransactionState->transaction->transaction_type_id,
                    $blockedTransactionState->transaction->process_id)
                ) {
                    Log::debug('Unblocking transaction state '.$blockedTransactionState->id);
                    $blockedTransactionState->update([
                        'state' => 'pending',
                        'updated_by' => $this->globalVariables->userId
                    ]);
                    // Resume execution until userInterventionAction is found [so that we don't have tasks on the Dashboard that don't require user intervention].
                    $this->resumeSideTaskExecution($blockedTransactionState, $blockedTransactionState->transaction->transaction_type_id);
                }
            }
        }
    }

    // In case of causal_links, if the flag continue_if_same_user is active and userInterventionAction is found, return it to client-side for execution.
    // In causal_links without the userInterventionAction flag or in waiting_links that have gone to 'pending' state, just execute the action until userInterventionAction
    //  is found so that we don't have pending tasks in the dashboard that don't require user intervention (all automatic EEC execution)
    public function resumeSideTaskExecution($transactionState, $transTypeId, $returnUserActionIfFound = false)
    {
        // Get the current AR params so that we can continue execution afterwards if needed
        $originatingTaskParameters = $this->globalVariables->getCurrentTaskParams();
        // Continue Execution on the causal link's causedAR/waiting link's AR
        $foundUserInterventionAction = $this->continueTransactionExecution($transactionState, $transTypeId);
        if ($foundUserInterventionAction && $returnUserActionIfFound) {
            // Save the originating task so that we can return to it after the causedAR's actions have all been executed
            array_unshift($this->globalVariables->originatingTasks, $originatingTaskParameters);
            return $foundUserInterventionAction;
        }
        // Set back the global variables, as we exited the execution of the intended AR.
        // Will allow us to continue the execution of the AR that originated this call.
        $this->globalVariables->setExecutionParameters($originatingTaskParameters);
        return null;
    }

    public function continueTransactionExecution($transactionState, $transTypeId = null)
    {
        $nextTaskParameters = $this->globalVariables->getNextTaskParamsToContinueExecution($transactionState, $transTypeId);
        $this->globalVariables->changedAR = true;
        if (!$this->checkForBlockingWaitingLinks($transactionState, $transTypeId)) {
            // Execute the transaction pattern automatically from the new transaction state.
            // Stop when userInterventionAction is found and return to dashboard if user is executor of that task.
            // TODO check if there's a problem starting a transaction within another transaction - calls evaluateAction
            $foundUserInterventionAction = $this->globalVariables->eecController->evaluateAction($this->globalVariables->firstParamsAssignment, true, null, $nextTaskParameters);
            // In case a userInterventionAction is found, check if the user can execute it before returning it.
            if ($foundUserInterventionAction && $this->canExecuteAR($this->globalVariables->transTypeId, $this->globalVariables->tStateId, $this->globalVariables->actionRuleType)) {
                return $foundUserInterventionAction;
            }
        }
        return null;
    }

    public function checkForBlockingWaitingLinks($transactionState, $transactionTypeId = null): bool
    {
        $hasBlockingWaitingLink  = $this->hasBlockingWaitingLink($transactionState->t_state_id, $transactionTypeId);
        // If the task has blocking waiting links, pass it to the 'waiting' state
        // Once the blocking task is performed, this task will be back to 'pending' state so the user can execute it
        if ($hasBlockingWaitingLink) {
            $transactionState->update([
                'state' => 'waiting',
                'updated_by' => $this->globalVariables->userId
            ]);
        }
        return $hasBlockingWaitingLink;
    }

    // Check if the transaction has a 'waiting link' blocking its execution
    public function hasBlockingWaitingLink($tStateId, $transactionTypeId, $processId = null)
    {
        // Only in causal link caused AR's do we get the transactionType to be checked for waiting links
        // In the other cases, the transactionType to be checked is the one in the global variable $transTypeId
        $transactionTypeId = $transactionTypeId ?: $this->globalVariables->transTypeId;
        // In case we're checking for inter process dependency, the process for the waiting task needs to be passed
        // because it may not be the same one as the process of the current task that is being evaluated.
        $processId = $processId ?: $this->globalVariables->processId;
        // Get waiting links that may block this task.
        $waitingLinks = WaitingLink::where([
            ['waiting_t',$transactionTypeId],
            ['waiting_act',$tStateId]
        ])->whereNull('deleted_at')->get();
        // Get processes that the current process depends on - they can block the current process.
        // [ex: Gross Order blocks Retail Order]
        $interProcDeps = InterProcDep::where('depending_proc', $processId)
            ->whereNull('deleted_at')->get()->pluck('depended_on_proc');
        // For each waiting link, check if the tasks that can block this task have been executed, so it can resume execution
        foreach ($waitingLinks as $waitingLink) {
            Log::debug("Found waiting link");
            Log::debug('has waiting link: '.$waitingLink->id);
            // As soon as it encounters a waitingLink that is blocking the task - returns 'true'.
            // Check if the waited task (transType/tState) has already been created and executed
            $waitedTransactionExists = TransactionState::where([
                ['t_state_id', $waitingLink->waited_act],
                ['type', 'fact']
            ])->with('transaction')->whereHas('transaction', function($query) use ($processId, $waitingLink, $interProcDeps) {
                $query->where('transaction_type_id', $waitingLink->waited_t)
                    ->where(function ($query) use ($processId, $interProcDeps) {
                        $query->where('process_id', $processId)
                            ->orWhereIn('process_id', $interProcDeps);
                    })->whereNull('deleted_at');
            })->whereNull('deleted_at')->first();
            if ($waitedTransactionExists) {
                if (!$waitedTransactionExists->state == 'performed') {
                    return true;
                }
            } else
                return true;
        }
        return false;
    }

    // Check if user can execute an AR based on the controller AR's transType, tState and type
    private function canExecuteAR($transTypeId, $tStateId, $actionRuleType)
    {
        $canExecute = false;

        $tStateAbbrv = TState::where('id', $tStateId)
            ->whereNull('deleted_at')->first()->abbrv;

        // Distinguish between initiatorStates and executorStates, according to the transaction pattern
        // Caused AR is always of the 'act' type, so we don't need to consider 'fact' ARs
        $initiatorStates = ['rq', 'ac', 'rj', 'qt', 'rv_rq_rq', 'rv_ac_rq', 'rv_pm_al', 'rv_pm_rf', 'rv_de_al', 'rv_de_rf'];
        $executorStates = ['pm', 'ex', 'de', 'dc', 'sp', 'rv_rq_al', 'rv_rq_rf', 'rv_ac_al', 'rv_ac_rf', 'rv_pm_rq', 'rv_de_rq'];

        $userRoles = RoleHasUser::where('user_id', $this->globalVariables->userId)
            ->whereNull('deleted_at')->get();

        // Check if user is an initiator/executor (depending on the task's tState) of the task.
        foreach($userRoles as $userRole) {
            // For initiatorTasks - if type == 'act' and is in the initiatorStates array OR type == 'fact' and is in the executorStates array
            if ((in_array($tStateAbbrv, $initiatorStates) && $actionRuleType === 'act')  || (in_array($tStateAbbrv, $executorStates) && $actionRuleType === 'fact')) {
                $taskInitiator = RoleInitiatesTransaction::where([
                    'role_id' => $userRole->role_id,
                    'transaction_type_id' => $transTypeId,
                ])->whereNull('deleted_at')->first();
                if ($taskInitiator) {
                    $canExecute = $this->checkUserHasAccessToTransaction($taskInitiator, $taskInitiator->role_id);
                }
            }
            // For executorTasks - if type == 'act' and is in the executorStates array OR type == 'act' and is in the initiatorStates array
            else if ((in_array($tStateAbbrv, $executorStates) && $actionRuleType === 'act')  || (in_array($tStateAbbrv, $initiatorStates) && $actionRuleType === 'fact')) {
                $taskExecutor = TransactionType::where([
                    'executer_role_id' => $userRole->role_id,
                    'id' => $transTypeId
                ])->whereNull('deleted_at')->first();
                if ($taskExecutor) {
                    $canExecute = $this->checkUserHasAccessToTransaction($taskExecutor, $taskExecutor->executer_role_id);
                }
            }
        }
        return $canExecute;
    }

    // For Transactions where the flag 'own_user_access_only' is active.
    // Check whether the user has access to the assigned transaction's process
    private function checkUserHasAccessToTransaction($transaction, $responsibleRole)
    {
        if ($transaction->own_user_access_only) {
            $userHasAccessToProcess = UserHasAccessToProcess::where([
                ['user_id', $this->globalVariables->userId],
                ['process_id', $this->globalVariables->processId]
            ])->whereHas('user.role', function($query) use ($responsibleRole) {
                $query->where('role_id', $responsibleRole);
            })->whereNull('deleted_at')->first();
            if (!$userHasAccessToProcess) {
                return false;
            }
        }
        return true;
    }
}
