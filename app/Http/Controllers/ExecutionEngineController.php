<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\ExecutionEngine\AssignExpressionExecution;
use App\Http\ExecutionEngine\CausalLinkExecution;
use App\Http\ExecutionEngine\CreateScheduleSlotsExecution;
use App\Http\ExecutionEngine\EditEntityInstanceExecution;
use App\Http\ExecutionEngine\EECGlobalVariables;
use App\Http\ExecutionEngine\Helpers\ActionEvaluatorHelper;
use App\Http\ExecutionEngine\Helpers\ExecutionFlowHelper;
use App\Http\ExecutionEngine\Helpers\FormDetailsHelper;
use App\Http\ExecutionEngine\Helpers\TaskAssignmentHelper;
use App\Http\ExecutionEngine\Helpers\TermsExecutionHelper;
use App\Http\ExecutionEngine\IfWhileLoopExecution;
use App\Http\ExecutionEngine\UserInputExecution;
use App\Http\ExecutionEngine\UserOutputExecution;
use Illuminate\Http\Request;
use DB;
use Log;
use Throwable;

class ExecutionEngineController extends Controller
{
    private $actionEvaluatorHelper;
    private $executionFlowHelper;
    private $taskAssignmentHelper;
    private $termsExecutionHelper;
    private $formDetailsHelper;
    private $globalVariables;

    public function __construct()
    {
        $this->actionEvaluatorHelper = new ActionEvaluatorHelper();
        $this->executionFlowHelper = new ExecutionFlowHelper();
        $this->taskAssignmentHelper = new TaskAssignmentHelper();
        $this->termsExecutionHelper = new TermsExecutionHelper();
        $this->formDetailsHelper = new FormDetailsHelper($this->termsExecutionHelper);
        $this->globalVariables = app(EECGlobalVariables::class);
        $this->globalVariables->eecController = $this;
    }

    /**
     * @throws Throwable
     */
    public function evaluateAction(Request $taskParameters, $automaticExecution = false, $actionId = null, $changedTaskParameters = null)
    {
        DB::beginTransaction();
        try {

            // In case it's the function's first execution, define the user and task's global params to be used in the controller's functions
            if (is_null($this->globalVariables->firstParamsAssignment)) {
                $this->globalVariables->setUser($taskParameters);
                $this->globalVariables->setExecutionParameters($taskParameters->all());
                if ($this->taskAssignmentHelper->assignExecutorIfNeeded()) {
                    return json_encode('alreadyHadExecutor');
                }
                $this->globalVariables->firstParamsAssignment = $taskParameters;
            } else if ($changedTaskParameters) {
                // In case the task is changed during the ExecutionEngine's execution (causal link, changing tState), adjust the controller's params
                $this->globalVariables->setExecutionParameters($changedTaskParameters);
            }

            Log::debug('Started action Evaluation!!! '.
                $this->globalVariables->transTypeId.' '. $this->globalVariables->tStateAbbrv.' '.$this->globalVariables->actionRuleType.
                ' transactionState'.$this->globalVariables->transactionStateId);

            // Auxiliary variables
            $userInterventionAction = $nextActionType = $nextActionId = $savedExecutedActionLog = null;

            // In case AR is started for evaluation after all its actions have already been performed - save last executed action as the fact_action
            // For example, when the last action from an AR is a 'user intervention action' - goes to the client-side and comes back for execution continuation
            if (!$action = $this->actionEvaluatorHelper->getActionToEvaluate($actionId)) {
                Log::debug('FINISHED AR ACTIONS');
                goto finishedActions;
            }

            // Store/Update transaction_ack record if there wasn't one already. Only store/update a record if the action execution isn't automatic.
            if (!$automaticExecution) {
                $this->taskAssignmentHelper->storeTransactionAck();
            }

            Log::debug('Action TYPE: '.$action->type);
            switch($action->type) {
                case 'causal_link':

                    $causalLinkExecution = new CausalLinkExecution($this->actionEvaluatorHelper,
                        $this->executionFlowHelper, $this->taskAssignmentHelper);
                    list($userInterventionAction, $savedExecutedActionLog) = $causalLinkExecution->execute($action);
                    break;

                case 'assign_expression':

                    $assignExpressionExecution = new AssignExpressionExecution($this->termsExecutionHelper, $this->formDetailsHelper);
                    $userInterventionAction = $assignExpressionExecution->execute($action);
                    break;

                case 'edit_entity_instance':

                    $action->userDetailingProcessType = $taskParameters->input('user_detailing_process_type');

                    $editEntityInstanceExecution = new EditEntityInstanceExecution($this->formDetailsHelper, $this->termsExecutionHelper);
                    $userInterventionAction = $editEntityInstanceExecution->execute($action);
                    break;

                case 'user_input':

                    $action->userDetailingProcessType = $taskParameters->input('user_detailing_process_type');
                    $action->userDetailingUserId = $taskParameters->input('user_detailing_user_id');

                    $userInputExecution = new UserInputExecution($this->formDetailsHelper);
                    $userInterventionAction = $userInputExecution->execute($action);
                    break;

                case 'user_output':

                    $userOutputExecution = new UserOutputExecution();
                    $userInterventionAction = $userOutputExecution->execute($action);
                    break;

                case 'if':
                case 'while':

                    $ifWhileLoopExecution = new IfWhileLoopExecution($this->termsExecutionHelper);
                    list($userInterventionAction, $nextActionType) = $ifWhileLoopExecution->execute($action);
                    break;

                case 'create_schedule_slots':

                    $scheduleSlotCreationExecution = new CreateScheduleSlotsExecution($this->termsExecutionHelper);
                    $userInterventionAction = $scheduleSlotCreationExecution->execute($action);
                    break;

                case 'foreach':
                    Log::debug('FOREACH');
                    break;
                case 'read_value':
                    Log::debug('READ VALUE');
                    break;
                case 'external_call':
                    Log::debug('EXTERNAL CALL');
                    break;
                case 'produce_doc':
                    LOG::debug('PRODUCE DOC');
                    break;
            }

            // In case an action that needs user intervention is found, return it immediately to client-side to be handled
            if ($userInterventionAction) {
                // If it isn't an executing action (action that has been started previously), save a record in 'action_log' table as executing
                if (!$action->action_log_id && !$savedExecutedActionLog) {
                    $this->taskAssignmentHelper->storeActionLog($action->id, 'executing');
                }
                DB::commit();
                Log::debug('Found User Intervention Action in transaction_state: '.$this->globalVariables->transactionStateId);
                // When userInterventionAction is found, return it to the dashboard with the new AR parameters (if AR has changed) so the user can complete it
                // These new parameters are needed so that the AR continues execution
                $userInterventionAction->action_rule = $this->globalVariables->changedAR ? $this->globalVariables->getNewARParametersForClientSide() : false;
                return $userInterventionAction;
            }

            // Save the action as executed in the action_log table, unless it has already been saved before (valid for Causal Links)
            if (!$savedExecutedActionLog) {
                $this->taskAssignmentHelper->storeActionLog($action->id, 'executed');
            }

            // Get the next action to be performed if there is one
            $nextActionId = $this->actionEvaluatorHelper->getNextActionId($action, $nextActionType);

            $this->globalVariables->lastActionExecutedId = $action->id;

            finishedActions:
            // Finished all actions inside the AR
            if (!$nextActionId) {
                // Continue to next transaction's tState and check for blockingWaitingLinks
                $nextTransactionState = $this->executionFlowHelper->goToNextTState();
                // Continue Automatic Execution of the  new transaction state, if we're not finishing a terminal tState
                if ($nextTransactionState) {
                    $foundUserInterventionAction = $this->executionFlowHelper->continueTransactionExecution($nextTransactionState);
                } else {
                    if (!empty($this->globalVariables->originatingTasks)) {
                        Log::debug('Returning to originating task');
                        $foundUserInterventionAction = $this->evaluateAction($this->globalVariables->firstParamsAssignment, true, null, array_shift($this->globalVariables->originatingTasks));
                    }
                }
                DB::commit();
                return $foundUserInterventionAction ?? null;
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Exception Occurred, Transaction Rollback: '.$e->getMessage());
            throw $e;
        } catch (Throwable $e) {
            DB::rollBack();
            Log::error('Throwable Occurred, Transaction Rollback: '.$e->getMessage());
            throw $e;
        }

        return $this->evaluateAction($this->globalVariables->firstParamsAssignment, true, $nextActionId);
    }
}
