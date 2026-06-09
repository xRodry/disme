<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine;

use App\CompEvaluatedExpression;
use App\CompEvaluatedExpressionLog;
use App\Condition;
use App\ConditionHasUserEvaluatedExpression;
use App\ConditionLog;
use App\Constant;
use App\Http\ExecutionEngine\Helpers\TermsExecutionHelper;
use App\Http\Resources\ActionsDashboardResource;
use App\Http\Resources\UserEvaluatedExpressionResource;
use App\Property;
use App\TermHasConstant;
use App\TermHasProperty;
use App\TermHasValue;
use App\UserEvaluatedExpressionLog;
use App\UserEvaluatedExpressionText;
use Log;
use Symfony\Component\ExpressionLanguage\ExpressionLanguage;

class IfWhileLoopExecution implements ActionTypeExecutionInterface
{
    protected $termsExecutionHelper;
    private $globalVariables;

    public function __construct(TermsExecutionHelper $termsExecutionHelper)
    {
        $this->termsExecutionHelper = $termsExecutionHelper;
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    public function execute(ActionsDashboardResource $action)
    {
        $condition = Condition::where('action_id',$action->id)->whereNull('deleted_at')->first();
        $conditionLog = $this->getConditionLogIfWhileAction($condition);

        // Before evaluating the condition, check for uee that are unevaluated and send it back, so they can get evaluated
        $userInterventionAction = $this->checkForUnevaluatedUserEvaluatedExpressions($action, $condition, $conditionLog);

        $nextActionType = null;

        if (!$userInterventionAction) {
            // Evaluate the condition and get its next action type (then/else for if actions; do/null for while actions)
            $nextActionType = $this->analyzeCondition($action->type, $condition, $conditionLog);
            Log::debug($action->type.' next Action Type: '.$nextActionType);
        }

        return array($userInterventionAction, $nextActionType);
    }

    private function getConditionLogIfWhileAction($condition, $parentConditionLogId = null): ?ConditionLog
    {
        $conditionLog = ConditionLog::where([
            'condition_id' => $condition->id,
            'transaction_state_id' => $this->globalVariables->transactionStateId
        ])->whereNull('deleted_at')->first();
        if (!$conditionLog) {
            $conditionLog = ConditionLog::create([
                'condition_id' => $condition->id,
                'transaction_state_id' => $this->globalVariables->transactionStateId,
                'parent_cond_log_id' => $parentConditionLogId,
                'updated_by' => $this->globalVariables->userId
            ]);
        }
        return $conditionLog;
    }

    private function checkForUnevaluatedUserEvaluatedExpressions($action, $condition, $conditionLog)
    {
        // Check if the condition has unevaluated user_evaluated_expressions (uee), even if they're part of a sub-condition.
        // Get user_evaluated_expressions belonging to the condition that haven't been evaluated by the client
        $evaluatedUEE = $conditionLog->userEvaluatedExpressions()->pluck('user_evaluated_expression_id');
        $conditionHasUnevaluatedUEE = ConditionHasUserEvaluatedExpression::where('condition_id',$condition->id)
            ->whereNotIn('user_evaluated_expression_id',$evaluatedUEE)
            ->whereNull('deleted_at')->first();
        if ($conditionHasUnevaluatedUEE) {
            // If an unevaluated user_evaluated_expression is found, return straight away, so we can send it to the client-side for evaluation.
            $userEvaluatedExpression = UserEvaluatedExpressionText::where([
                ['user_evaluated_expression_id',$conditionHasUnevaluatedUEE->user_evaluated_expression_id],
                ['language_id',$this->globalVariables->langId]
            ])->whereNull('deleted_at')->first();
            // Add the additional info needed for the handling of the unevaluated user_evaluated_expression
            $userEvaluatedExpression = new UserEvaluatedExpressionResource($userEvaluatedExpression);
            $userEvaluatedExpression->condition_log_id = $conditionLog->id;
            $action->type = 'user_evaluated_expression';
            $action->user_evaluated_expression = $userEvaluatedExpression;
            return $action;
        } else {
            // Check if condition has sub-conditions to search for unevaluated user_evaluated_expressions.
            $subConditions = Condition::where([
                ['parent_cond_id',$condition->id],
                ['action_id',$action->id]
            ])->whereNull('deleted_at')->get();
            foreach($subConditions as $subCondition) {
                $subConditionLog = $this->getConditionLogIfWhileAction($subCondition, $conditionLog->id);
                $checkForUnevaluatedUEE = $this->checkForUnevaluatedUserEvaluatedExpressions($action, $subCondition, $subConditionLog);
                if ($checkForUnevaluatedUEE) {
                    return $checkForUnevaluatedUEE;
                }
            }
        }
        return null;
    }

    private function analyzeCondition($actionType, $condition, $conditionLog): ?string
    {
        Log::debug("analyzeCondition: ");
        // Analyse the condition's compute/user_evaluated_expressions and get the complete expression to be evaluated
        $completeExpression = $this->getConditionContent($condition, $conditionLog);
        Log::debug('Complete Expression: '.$completeExpression);

        // Use ExpressionLanguage to evaluate the expression and get its result (true/false)
        $expressionLanguage = new ExpressionLanguage();
        $conditionResult = $expressionLanguage->evaluate($completeExpression);
        Log::debug($actionType.' Condition Result: '.$conditionResult);

        // Define what's the nextActionType expected depending on the condition result
        if ($actionType == 'if') {
            return $conditionResult ? 'then' : 'else';
        } else if ($actionType == 'while') {
            return $conditionResult ? 'do' : null;
        } else {
            return null;
        }
    }

    private function getConditionContent ($condition, $conditionLog)
    {
        $expression = null;
        $expressionLanguage = new ExpressionLanguage();
        // Check if current condition has sub-conditions and/or user/comp evaluated expressions
        $hasUserEvaluatedExpressions = ConditionHasUserEvaluatedExpression::where('condition_id',$condition->id)->exists();
        $hasCompEvaluatedExpressions = CompEvaluatedExpression::where('parent_cond_id',$condition->id)->exists();
        $hasSubConditions = Condition::where('parent_cond_id',$condition->id)->exists();

        if ($hasUserEvaluatedExpressions) {
            $userEvaluatedExpressions = ConditionHasUserEvaluatedExpression::where('condition_id',$condition->id)->get();
            foreach($userEvaluatedExpressions as $userEvaluatedExpression) {
                $userEvaluatedExpressionLog = UserEvaluatedExpressionLog::where([
                    ['condition_log_id',$conditionLog->id],
                    ['user_evaluated_expression_id',$userEvaluatedExpression->user_evaluated_expression_id]
                ])->whereNull('deleted_at')->first();
                // Transform 1/0 into 'true'/'false, otherwise when expression_result=0, it acts as false and doesn't add to expression as expected
                $appendToExpression = $userEvaluatedExpressionLog->expression_result ? 'true' : 'false';
                $expression = $this->appendToConditionExpression($condition, $expression, $appendToExpression);
                Log::debug("has userEvaluatedExpression: ".$appendToExpression);
            }
        }

        if ($hasCompEvaluatedExpressions) {
            $compEvaluatedExpressions = CompEvaluatedExpression::where('parent_cond_id',$condition->id)->get();
            foreach ($compEvaluatedExpressions as $compEvaluatedExpression) {
                $appendToExpression = $this->handleCompEvaluatedExpression($compEvaluatedExpression);
                Log::debug("has compEvaluatedExpression: ".$appendToExpression);
                // Logging of the expression and result belonging to the comp_evaluated_expression
                $compEvaluatedExpressionLog = CompEvaluatedExpressionLog::create([
                    'condition_log_id' => $conditionLog->id,
                    'comp_evaluated_expression_id' => $compEvaluatedExpression->id,
                    'expression_evaluated' => $appendToExpression,
                    'expression_result' => $expressionLanguage->evaluate($appendToExpression),
                    'updated_by' => $this->globalVariables->userId
                ]);
                // Append the current comp_evaluated_expression to the rest of the condition expression
                $expression = $this->appendToConditionExpression($condition, $expression, $appendToExpression);
            }
        }

        if ($hasSubConditions) {
            $subConditions = Condition::where('parent_cond_id',$condition->id)->get();
            foreach($subConditions as $subCondition) {
                Log::debug('hasSubCondition');
                // Get the current subCondition's complete expression
                $appendToExpression = $this->getSubConditionContent($subCondition, $conditionLog->id);
                // Append the current subCondition to the rest of the condition expression
                $expression = $this->appendToConditionExpression($condition, $expression, $appendToExpression);
            }
        }
        // Logging of the current condition's complete expression and result
        $conditionLog->expression_evaluated = $expression;
        $conditionLog->expression_result = $expressionLanguage->evaluate($expression);
        $conditionLog->save();
        Log::debug('Expression: ('.$expression.')');
        return '('.$expression.')';
    }

    private function getSubConditionContent ($condition, $parentConditionLogId)
    {
        // A log record has already been created when checking for unevaluatedUEE
        $subConditionLog = ConditionLog::where([
            'condition_id' => $condition->id,
            'transaction_state_id' => $this->globalVariables->transactionStateId,
            'parent_cond_log_id' => $parentConditionLogId,
            'updated_by' => $this->globalVariables->userId
        ])->whereNull('deleted_at')->first();
        return $this->getConditionContent($condition, $subConditionLog);
    }

    private function handleCompEvaluatedExpression ($compEvaluatedExpression)
    {
        $term1 = $this->analyzeTermForExpressionLanguage($compEvaluatedExpression->term_1_id);
        $term2 = $this->analyzeTermForExpressionLanguage($compEvaluatedExpression->term_2_id);

        return $term1.' '.$compEvaluatedExpression->logical_operator.' '.$term2;
    }

    private function analyzeTermForExpressionLanguage ($termId)
    {
        $termValue = $this->termsExecutionHelper->analyzeTerm($termId);
        $termType = $this->termsExecutionHelper->getTermType($termId);
        $valueType = null;
        if ($termType === 'propertyTerm') {
            $propertyId = TermHasProperty::where('term_id', $termId)->first()->property_id;
            $valueType = Property::find($propertyId)->value_type;
        } else if ($termType === 'constantTerm') {
            $constantId = TermHasConstant::where('term_id', $termId);
            $valueType = Constant::find($constantId)->value_type;
        } else if ($termType === 'valueTerm') {
            $valueType = TermHasValue::where('term_id', $termId)->first()->value_type;
        }
        if ($valueType === 'text') {
            $termValue = '"'.$termValue.'"';
        }
        return $termValue;
    }

    private function appendToConditionExpression ($condition, $conditionExpression, $expressionToAppend)
    {
        if (!$conditionExpression || $condition->type == 'istrue' || $condition->type == 'not') {
            if ($condition->type == 'not') {
                return 'not '.$expressionToAppend;
            } else {
                return $expressionToAppend;
            }
        } else {
            return $conditionExpression.' '.$condition->type.' '.$expressionToAppend;
        }
    }
}
