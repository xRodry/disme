<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine\Helpers;

use App\Action;
use App\ActionLog;
use App\ActionRule;
use App\Http\ExecutionEngine\EECGlobalVariables;
use App\Http\Resources\ActionsDashboardResource;
use Log;

class ActionEvaluatorHelper
{
    private $globalVariables;

    public function __construct()
    {
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    public function getActionToEvaluate ($actionId): ?ActionsDashboardResource
    {
        if ($actionId) {
            $action = Action::withTrashed()->find($actionId);
        } else {
            // Check if task's execution has already started
            $transactionStateHasAlreadyStartedExecution = ActionLog::where('transaction_state_id', $this->globalVariables->transactionStateId)
                ->whereNull('deleted_at')->get()->count();
            if ($transactionStateHasAlreadyStartedExecution) {
                // The execution of the task has started (by user or automaticExecution) - not the first time executing AR
                Log::debug('Not First Time Executing this AR.');
                $action = $this->getExecutingAction();
            } else {
                // First Time Executing AR
                Log::debug('First Time Executing AR.');
                $action = $this->getFirstActionFromAR();
            }
        }
        return $action ? new ActionsDashboardResource($action) : null;
    }

    private function getExecutingAction ()
    {
        $lastActionLog = ActionLog::where('transaction_state_id', $this->globalVariables->transactionStateId)
            ->latest('id')
            ->whereNull('deleted_at')->first();
        $lastAction = Action::withTrashed()->find($lastActionLog->action_id);

        if ($lastActionLog->state == 'executing') {
            // Execute pending action
            $lastAction->action_log_id = $lastActionLog->id;
            return $lastAction;
        } else {
            // Check if there's an action after the last one executed. If there is, return it for execution.
            $hasNextAction = $this->getNextActionId($lastAction);
            if ($hasNextAction) {
                return Action::withTrashed()->find($hasNextAction);
            } else {
                return null;
            }
        }
    }

    public function getNextActionId($action, $nextActionType = null)
    {
        If ($action->type == 'if' && $thenElseFirstAction = $this->getThenElseFirstAction($action->id, $nextActionType)) {
            return $thenElseFirstAction;
        } else if ($nextActionType == 'do') {
            return $this->getLoopFirstAction($action->id);
        } else if ($action->next_action_id) {
            Log::debug('next: '.$action->next_action_id);
            return $action->next_action_id;
        } else if ($action->par_action_id) {
            return $this->getNextActionOutsideIfOrWhileAction($action->par_action_id);
        } else {
            return false;
        }
    }

    public function getThenElseFirstAction($ifActionId, $type)
    {
        $thenElseAction = Action::withTrashed()
            ->where([
                ['par_action_id',$ifActionId],
                ['type',$type]
            ])
            ->select('id')
            ->whereNull('deleted_at')
            ->first();
        // The 'else' action may not be defined
        if ($thenElseAction) {
            $firstAction = Action::withTrashed()
                ->where('par_action_id',$thenElseAction->id)
                ->select('id')
                ->whereNull(['prev_action_id','deleted_at'])
                ->first();
            return $firstAction->id;
        } else {
            return null;
        }
    }

    public function getLoopFirstAction($actionId)
    {
        $loopFirstAction = Action::withTrashed()
            ->where('par_action_id',$actionId)
            ->whereNull(['prev_action_id','deleted_at'])
            ->first();
        return $loopFirstAction->id;
    }

    public function getNextActionOutsideIfOrWhileAction ($currentParActionId)
    {
        // If the current action is inside a then/else action, we get that parent first and then the if action.
        // If the current action is inside a while loop, we only need to get the parent while action.
        $parentAction = Action::withTrashed()
            ->where('id',$currentParActionId)
            ->select('id', 'type', 'par_action_id', 'next_action_id')
            ->whereNull('deleted_at')
            ->first();
        // If the parent is a loop action (while), return it, so we can evaluate the condition again
        if ($parentAction->type == 'while') {
            return $parentAction->id;
        }
        // If it isn´t a looping action, it's a then/else action, get the parent if action
        $ifAction = Action::withTrashed()
            ->where('id',$parentAction->par_action_id)
            ->select('next_action_id', 'par_action_id')
            ->whereNull('deleted_at')
            ->first();
        // Check whether the if action is inside another if or has a next action to be executed
        if ($ifAction->next_action_id) {
            return $ifAction->next_action_id;
        } else if ($ifAction->par_action_id) {
            return $this->getNextActionOutsideIfOrWhileAction($ifAction->par_action_id);
        } else {
            Log::debug('No more actions to be performed in this AR.');
            return false;
        }
    }

    private function getFirstActionFromAR ()
    {
        $actionRule = ActionRule::where([
            ['transaction_type_id',$this->globalVariables->transTypeId],
            ['t_state_id',$this->globalVariables->tStateId],
            ['type', $this->globalVariables->actionRuleType]
        ])->whereNull('deleted_at')
            ->latest('created_at')->first();
        if ($actionRule) {
            $firstAction =  Action::where('action_rule_id',$actionRule->id)
                ->whereNull(['deleted_at','prev_action_id','par_action_id'])
                ->orderBy('id','asc')
                ->first();
            return $firstAction ?: null;
        } else {
            return null;
        }
    }
}
