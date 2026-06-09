<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine;

use App\CausalLink;
use App\Http\ExecutionEngine\Helpers\ActionEvaluatorHelper;
use App\Http\ExecutionEngine\Helpers\ExecutionFlowHelper;
use App\Http\ExecutionEngine\Helpers\TaskAssignmentHelper;
use App\Http\Resources\ActionsDashboardResource;
use App\Process;
use App\Transaction;
use App\TransactionState;

class CausalLinkExecution implements ActionTypeExecutionInterface
{
    protected $actionEvaluatorHelper;
    protected $executionFlowHelper;
    protected $taskAssignmentHelper;
    private $globalVariables;

    public function __construct(ActionEvaluatorHelper $actionEvaluatorHelper, ExecutionFlowHelper $executionFlowHelper, TaskAssignmentHelper $taskAssignmentHelper)
    {
        $this->actionEvaluatorHelper = $actionEvaluatorHelper;
        $this->executionFlowHelper = $executionFlowHelper;
        $this->taskAssignmentHelper = $taskAssignmentHelper;
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    public function execute(ActionsDashboardResource $action)
    {
        // Get the Causal Link associated with the current action.
        $causalLink = CausalLink::where('causing_action', $action->id)
            ->whereNull('deleted_at')->first();

        // Create the transaction_state record according to the Causal Link's caused AR parameters.
        $causedARTransactionState = $this->createCausalLinkCausedTransactionState($action, $causalLink);

        // Pass the causal link's associated process to the 'cancelled' state if the flag 'cancel_proc' is active, and all active tasks inside that process.
        if ($causalLink->cancel_proc) {
            $this->cancelCurrentProcess($causedARTransactionState->id);
        }

        // Continue execution through the causedAR if the user can execute it and the flag 'continue_if_same_user' is active.
        return $this->continueCausalLinkExecution($action, $causedARTransactionState, $causalLink->caused_transaction_type_id, $causalLink->continue_if_same_user);
    }

    private function createCausalLinkCausedTransactionState($action, $causalLink)
    {
        // Check whether there's already a transaction of the causedAR's transactionType active in the process
        $transaction = Transaction::where([
            'transaction_type_id' => $causalLink->caused_transaction_type_id,
            'state' => 'active',
            'process_id' => $this->globalVariables->processId
        ])->whereNull('deleted_at')->first();
        if (!$transaction) {
            // Create new Transaction instance if it hasn't been created yet
            $transaction = Transaction::create([
                'transaction_type_id' =>  $causalLink->caused_transaction_type_id,
                'state' => 'active',
                'process_id' => $this->globalVariables->processId,
                'updated_by' => $this->globalVariables->userId
            ]);
        } else {
            // If the affected transaction has an active state, end it, so we can start the new caused state
            $transactionState = TransactionState::where([
                ['transaction_id',$transaction->id],
                ['state','pending']
            ])->whereNull('deleted_at')->first();
            if ($transactionState) {
                $transactionState->update([
                    'fact_action_id' => $action->id,
                    'state' => 'performed',
                    'updated_by' => $this->globalVariables->userId
                ]);
                $this->executionFlowHelper->checkForBlockedWaitingLinks($transactionState);
            }
        }
        // Create the transaction_state record according to the Causal Link's causedAR parameters
        $newTransactionState = TransactionState::create([
            'transaction_id' => $transaction->id,
            't_state_id' => $causalLink->caused_t_state_id,
            'type' => 'act',
            'act_action_id' => $action->id,
            'state' => 'pending',
            'updated_by' => $this->globalVariables->userId
        ]);
        // Check if the causedAR transaction_state has blocking waiting links. If yes, pass it to state 'waiting'
        $this->executionFlowHelper->checkForBlockingWaitingLinks($newTransactionState, $causalLink->caused_transaction_type_id);
        return $newTransactionState;
    }

    // Automatically execute new causedAR until userInterventionAction is found (including advancing t_states if none is found)
    private function continueCausalLinkExecution($action, $causedARTransactionState, $transTypeId, $returnUserActionIfFound)
    {
        // Mark the action as executed in the 'action_log' table
        $this->taskAssignmentHelper->storeActionLog($action->id, 'executed');
        // If there is no action in the AR after this causal link action, mark the transaction_state as performed and continue automatic
        // execution of the  new transaction state, so we don't end up with tasks on the dashboard that don't require userIntervention
        if(!$this->actionEvaluatorHelper->getNextActionId($action)) {
            $this->globalVariables->lastActionExecutedId = $action->id;
            $nextTransactionState = $this->executionFlowHelper->goToNextTState();
            if ($nextTransactionState && $transTypeId !== $this->globalVariables->transTypeId) {
                $this->executionFlowHelper->resumeSideTaskExecution($nextTransactionState, $this->globalVariables->transTypeId);
            }
        }
        return array($this->executionFlowHelper->resumeSideTaskExecution($causedARTransactionState, $transTypeId, $returnUserActionIfFound), true);
    }

    private function cancelCurrentProcess($causedARTransactionStateId)
    {
        $process = Process::where('id', $this->globalVariables->processId)
            ->whereNull('deleted_at')->first();
        $process->update([
            'proc_state' => 'cancelled',
            'updated_by' =>$this->globalVariables->userId
        ]);

        // Cancel any task that is active in the cancelled process, except for the task caused by the causal link
        $tasksToCancel = TransactionState::whereHas('transaction', function ($query) use ($process) {
            $query->where('process_id', $process->id);
        })->whereIn('state', ['pending', 'waiting'])
            ->where('id', '!=', $causedARTransactionStateId)
            ->whereNull('deleted_at')->get();

        foreach ($tasksToCancel as $taskToCancel) {
            $taskToCancel->update([
                'state' => 'cancelled',
                'updated_by' => $this->globalVariables->userId
            ]);
        }
    }
}
