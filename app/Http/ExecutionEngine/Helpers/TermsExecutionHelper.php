<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine\Helpers;

use App\ActionHasQueryLog;
use App\ComputeExpression;
use App\ComputeExpressionHasTerm;
use App\ComputeExpressionLog;
use App\Constant;
use App\ContextVariableValue;
use App\Entity;
use App\Http\Controllers\DynSearchController;
use App\Http\ExecutionEngine\EECGlobalVariables;
use App\Property;
use App\QueryParameter;
use App\TermHasEntitySpecification;
use App\TermHasPropertyHasSpecificEntityTerm;
use App\TermHasComputeExpression;
use App\TermHasConstant;
use App\TermHasContextVariable;
use App\TermHasExecutingUser;
use App\TermHasPropAllowedValue;
use App\TermHasProperty;
use App\TermHasPropertySpecification;
use App\TermHasPropRefValue;
use App\TermHasQuery;
use App\TermHasQueryParameter;
use App\TermHasValue;
use App\Value;
use App\ValueText;
use Log;
use Symfony\Component\ExpressionLanguage\ExpressionLanguage;

class TermsExecutionHelper
{
    private $globalVariables;

    public function __construct()
    {
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    // TODO handle dates/date_times (in constant/value/compute_expression(?)) and everywhere that calls this function
    public function analyzeTerm ($termId, $intermediateCalculations = false)
    {
        Log::debug('term is '.$this->getTermType($termId).' with termId: '.$termId);
        switch ($this->getTermType($termId)) {
            case 'propertyTerm':

                // TODO consider the fact it might be multipleValues ??
                Log::debug("term has property. Value's value: ".$this->getValueFromPropertyTerm($termId)->value);
                return $this->getValueFromPropertyTerm($termId)->value;

            case 'propAllowedValueTerm':

                $propAllowedValueTerm = TermHasPropAllowedValue::where('term_id',$termId)->whereNull('deleted_at')->first();
                Log::debug("term has property allowed value. Prop Allowed Value Id: ".$propAllowedValueTerm->prop_allowed_value_id);
                return $propAllowedValueTerm->prop_allowed_value_id;

            case 'propRefValueTerm':

                $propRefValueTerm = TermHasPropRefValue::where('term_id',$termId)->whereNull('deleted_at')->first();
                return $propRefValueTerm->prop_ref_value_id;

            case 'queryTerm':

                return $this->getQueryTermResults($termId);

            case 'constantTerm':

                $constantTerm = TermHasConstant::where('term_id',$termId)->whereNull('deleted_at')->first();
                $constant = Constant::where('id', $constantTerm->constant_id)
                    ->whereNull('deleted_at')->first();
                Log::debug("term has constant. Value: ".$constant->value);
                return $constant->value;

            case 'valueTerm':

                $valueTerm = TermHasValue::where('term_id',$termId)->whereNull('deleted_at')->first();
                Log::debug("term has value. Value: ".$valueTerm->value);
                return $valueTerm->value;

            case 'computeExpressionTerm':

                return $this->getComputeExpressionTermResult($termId, $intermediateCalculations);

            case 'getContextVariableTerm':

                $contextVariableTerm = TermHasContextVariable::where('term_id',$termId)->whereNull('deleted_at')->first();
                // Get the context variable's value in the current transactionState's transaction (even if it's in another tState)
                return ContextVariableValue::where('context_variable_id', $contextVariableTerm->context_variable_id)
                    ->whereHas('transactionState.transaction', function($transaction) {
                        $transaction->where('id', $this->globalVariables->transactionId);
                    })->whereNull('deleted_at')->first()->value;

            case 'executingUserTerm':

                return $this->globalVariables->userId;

            default:
                return false;
        }
    }

    private function getValueFromPropertyTerm($termId)
    {
        $property = TermHasProperty::where('term_id',$termId)->whereNull('deleted_at')->first()->property;
        $propertyTermHasSpecificEntity = TermHasPropertyHasSpecificEntityTerm::where('term_has_property_term_id', $termId)
            ->whereNull('deleted_at')->first();

        if ($propertyTermHasSpecificEntity) {
            // Get the specific entity in which we should look for the property value
            $entityId = $this->analyzeTerm($propertyTermHasSpecificEntity->term_id);
        } else {
            // Search for the entity (of the property's entityType) in the current transactionState's specific transaction
            // (in case there are multiple transactions of the same type in the process - may happen in tasks that start inside a process)
            $currentProcessEntity = Entity::where([
                'ent_type_id' => $property->ent_type_id,
                'transaction_id' => $this->globalVariables->transactionId
            ])->whereNull('deleted_at')->latest()->first();
            // If there aren't any entities (of the property's entityType) in the current transactionState's transaction,
            // get the process's latest entity from this entityType (if it was specified in another task that isn't the current one)
            if (!$currentProcessEntity) {
                $currentProcessEntity = Entity::whereHas('transaction', function($transaction) use ($property) {
                    $transaction->where([
                        'state' => 'active',
                        'process_id' => $this->globalVariables->processId
                    ]);
                })->where('ent_type_id', $property->ent_type_id)->whereNull('deleted_at')->latest()->first();
            }
            $entityId = $currentProcessEntity ? $currentProcessEntity->id : null;
        }
        // If an entity was found, get the corresponding property's value
        if ($entityId) {
            return Value::where([
                ['entity_id', $entityId],
                ['property_id', $property->id]
            ])->whereNull('deleted_at')->first();
        }
        return null;
    }

    private function getPropRefValue ($value)
    {
        $property = Property::find($value->property_id);
        if ($property->requires_translation) {
            return ValueText::where([
                'value_id' => $value->id,
                'language_id' => $this->globalVariables->langId
            ])->whereNull('deleted_at')->first()->text;
        } else {
            return $value->value;
        }
    }

    private function getComputeExpressionTermResult($termId, $intermediateCalculations)
    {
        $computeExpressionTerm = TermHasComputeExpression::where('term_id',$termId)->whereNull('deleted_at')->first();
        $computeExpression = ComputeExpression::where(
            'id',$computeExpressionTerm->compute_expression_id
        )->whereNull('deleted_at')->first();
        // Construct the full 'computeExpression' expression to be evaluated
        $expression = $this->analyzeComputeExpression($computeExpression);
        Log::debug("term has compute expression. Expression: ". $expression);
        Log::warning('Operations involving strings, ex: "str + wrt", will give an error');
        // Get the result of the expression returned by the analyzeComputeExpression function, in case an expression
        // was constructed. There are cases (average operator) where, due to missing property values, an expression isn't constructed.
        $result = $expression ? (new ExpressionLanguage())->evaluate($expression) : null;
        // If an expression was evaluated by the Expression Language, log it into the ComputeExpressionLog table
        if ($result) {
            ComputeExpressionLog::create([
                'compute_expression_id' => $computeExpression->id,
                'transaction_state_id' => $this->globalVariables->transactionStateId,
                'expression_computed' => $expression,
                'expression_result' => $result,
                'updated_by' => $this->globalVariables->userId
            ]);
        }
        // When dealing with intermediate calculations, return the expression so that we don't have approximations
        // in the intermediate expressions of the resulting global expression.
        return $intermediateCalculations ? $expression : $result;
    }

    public function getTermType ($termId): string
    {
        if (TermHasProperty::where('term_id', $termId)->exists()) {
            return 'propertyTerm';
        } else if (TermHasPropAllowedValue::where('term_id',$termId)->exists()) {
            return 'propAllowedValueTerm';
        } else if (TermHasPropRefValue::where('term_id',$termId)->exists()) {
            return 'propRefValueTerm';
        } else if (TermHasPropertySpecification::where('term_id', $termId)->exists()) {
            return 'propertySpecificationTerm';
        }  else if (TermHasEntitySpecification::where('term_id', $termId)->exists()) {
            return 'entitySpecificationTerm';
        } else if (TermHasQuery::where('term_id',$termId)->exists()) {
            return 'queryTerm';
        } else if (TermHasConstant::where('term_id',$termId)->exists()) {
            return 'constantTerm';
        } else if (TermHasValue::where('term_id',$termId)->exists()) {
            return 'valueTerm';
        } else if (TermHasComputeExpression::where('term_id',$termId)->exists()) {
            return 'computeExpressionTerm';
        } else if (TermHasContextVariable::where('term_id',$termId)->exists()) {
            $contextVariableTerm = TermHasContextVariable::where('term_id', $termId)->whereNull('deleted_at')->first();
            if ($contextVariableTerm->operation === 'set') {
                return 'setContextVariableTerm';
            } else if ($contextVariableTerm->operation === 'update') {
                return 'updateContextVariableTerm';
            } else {
                return 'getContextVariableTerm';
            }
        } else if (TermHasExecutingUser::where('term_id',$termId)->exists()) {
            return 'executingUserTerm';
        } else {
            return 'error';
        }
    }

    private function analyzeComputeExpression($computeExpression): ?string
    {
        $computeExpressionTerms = ComputeExpressionHasTerm::where('compute_expression_id',$computeExpression->id)
            ->whereNull('deleted_at')
            ->orderBy('order','asc')
            ->get();

        if ($computeExpression->operator === 'average') {
            return $this->constructAverageOperatorComputeExpression($computeExpression, $computeExpressionTerms);
        } else {
            return $this->constructNormalOperatorComputeExpression($computeExpression, $computeExpressionTerms);
        }
    }

    private function constructAverageOperatorComputeExpression($computeExpression, $computeExpressionTerms)
    {
        $expression = null;
        // As we have the 'average' operator, we'll be adding up its terms and then dividing by its number of filled terms.
        $computeExpressionOperator = '+';
        // 'Average' operator compute expressions ignore terms that contain unfilled properties.
        // Unfilled properties are kept so that we can log a warning message if there is no expression due to them.
        $numberOfFilledTerms = 0;
        $unfilledProperties = [];

        foreach($computeExpressionTerms as $computeExpressionTerm) {
            // Keep track of unfilled properties in this term, whether they are directly within the term or through subComputeExpressions.
            // 'Average' operator subComputeExpressions aren't checked at this stage, as they will be checked through that
            // compute expression's analyzeComputeExpression function.
            $hasUnfilledPropertyTerms = $this->hasUnfilledPropertyTerms($computeExpressionTerm);
            if ($hasUnfilledPropertyTerms) {
                $unfilledProperties = array_merge($unfilledProperties, $hasUnfilledPropertyTerms);
            }
            // If a term has unfilled properties, disregard that term and move onto the next one.
            if (!$hasUnfilledPropertyTerms) {
                // Get the term's expression so that it is attached to the global 'average' operator compute expression.
                $expressionTerm = $this->analyzeTerm($computeExpressionTerm->term_id, true);
                // 'Average' operator ComputeExpressions can themselves have 'average' operator subComputeExpressions,
                // with the main 'average' operator computeExpression having an expression even if its 'average' operator
                // subComputeExpressions don't have one because of unfilled properties.
                // As subComputeExpressions with the 'average' operator aren't checked above, they can also not have
                // an expression if all of their property terms are unfilled properties.
                if (!$expressionTerm) {
                    $expressionTerm = '0';
                    $expression .= $numberOfFilledTerms === 0 ? $expressionTerm :
                        ' '.$computeExpressionOperator.' '.$expressionTerm;
                    ++$numberOfFilledTerms;
                } else {
                    $expression .= $numberOfFilledTerms === 0 ? $expressionTerm :
                        ' '.$computeExpressionOperator.' '.$expressionTerm;
                    ++$numberOfFilledTerms;
                }
            }
        }

        // If the main 'average' operator computeExpression doesn't have an expression due to unfilled properties,
        // log that information in the 'compute_expression_log' table, declaring the unfilled properties.
        if (!$numberOfFilledTerms) {
            $this->storeUnevaluatedComputeExpressionLog($computeExpression->id, $unfilledProperties);
        }

        // Return the 'average' operator computeExpression's complete expression to be evaluated.
        return $numberOfFilledTerms ? '(('.$expression.') / '.$numberOfFilledTerms.' )' : null;
    }

    private function constructNormalOperatorComputeExpression($computeExpression, $computeExpressionTerms)
    {
        $expression = null;
        // Construct the main computeExpression through its terms' expressions.
        foreach($computeExpressionTerms as $index=>$computeExpressionTerm) {
            // Get the term's result to be included in the expression.
            $expressionTerm = $this->analyzeTerm($computeExpressionTerm->term_id, true);
            // If we have the 'power' operator, transform it to the ExpressionLanguage's syntax.
            $computeExpressionOperator = $computeExpression->operator === '^' ? '**' : $computeExpression->operator;
            // TODO Check this out (see if always works or needs a better fix)
            if (!$expressionTerm) {
                $expressionTerm = '0';
                $expression .= $index === 0 ? $expressionTerm :
                    ' '.$computeExpressionOperator.' '.$expressionTerm;
            } else {
                $expression .= $index === 0 ? $expressionTerm :
                    ' '.$computeExpressionOperator.' '.$expressionTerm;
            }
        }
        // Return the constructed expression for evaluation.
        return '('.$expression.')';
    }

    private function hasUnfilledPropertyTerms($computeExpressionTerm)
    {
        // Get unfilled properties in this term or its terms/subTerms.
        $unfilledProperties = $this->getTermUnfilledPropertiesInCurrentProcess($computeExpressionTerm);
        // Check if it's a ComputeExpression term
        $termIsAComputeExpression = TermHasComputeExpression::where('term_id', $computeExpressionTerm->term_id)
            ->whereNull('deleted_at')->first();
        // If it is a ComputeExpression [with its operator not being the 'average' operator] term and has unfilled properties,
        // log that information in the 'compute_expression_log' table, declaring the unfilled properties.
        // This is logged here because as it isn't an 'average' operator ComputeExpression and has unfilled properties,
        // it won't be analyzed in the superior functions.
        if ($termIsAComputeExpression) {
            $computeExpression = ComputeExpression::find($termIsAComputeExpression->compute_expression_id);
            if (count($unfilledProperties) && $computeExpression->operator !== 'average') {
                $this->storeUnevaluatedComputeExpressionLog($computeExpression->id, $unfilledProperties);
            }
        }
        // If it has unfilled properties, return them. Otherwise, return false, indicating that it doesn't have unfilled properties.
        return count($unfilledProperties) ? $unfilledProperties : false;
    }

    private function getTermUnfilledPropertiesInCurrentProcess($computeExpressionTerm)
    {
        // Get the propertyTerms in this computeExpressionTerm or in its subComputeExpression's terms.
        $propertyTerms = TermHasProperty::where('term_id', $computeExpressionTerm->term_id)
            ->orWhere(function($query) use ($computeExpressionTerm) {
                // Check if this term has a subComputeExpression to check for unfilled properties.
                $subComputeExpression = TermHasComputeExpression::where('term_id', $computeExpressionTerm->term_id)
                    ->whereNull('deleted_at')->first();
                // If it has, search for any terms in that subComputeExpression, including any possible sub-subComputeExpression terms.
                $subComputeExpressionTerms = $subComputeExpression ?
                    $this->getComputeExpressionTermsToSearchForUnfilledProperties($subComputeExpression->compute_expression_id) : [];
                $query->whereIn('term_id', $subComputeExpressionTerms);
            })->whereNUll('deleted_at')->get();
        // Check if any of these property terms are unfilled. Join the unfilled properties in an array to be returned.
        $unfilledProperties = [];
        foreach($propertyTerms as $propertyTerm) {
            if ($this->getValueFromPropertyTerm($propertyTerm->term_id) === null) {
                $unfilledProperties[] = $propertyTerm->property_id;
            }
        }
        // Return an array containing all the unfilled properties in this term/subTerms.
        return $unfilledProperties;
    }

    private function getComputeExpressionTermsToSearchForUnfilledProperties ($computeExpressionId)
    {
        $mainComputeExpressionTerms = [];
        // Get the Compute Expression's operator
        $computeExpressionOperator = ComputeExpression::where('id', $computeExpressionId)
            ->whereNull('deleted_at')->first()->operator;
        // Only check for computeExpressions that don't have the 'average' operator, as those don't impact the current term
        // because they can have an expression without having all of its properties filled.
        if ($computeExpressionOperator !== 'average') {
            // Get all the ComputeExpression's terms and join it into the mainComputeExpression's terms array.
            $computeExpressionTerms = ComputeExpressionHasTerm::where('compute_expression_id', $computeExpressionId)
                ->whereNull('deleted_at')->get()->pluck('term_id');
            $mainComputeExpressionTerms = array_merge($mainComputeExpressionTerms, $computeExpressionTerms->toArray());
            // Check if this computeExpression has subComputeExpressions.
            $subComputeExpressions = TermHasComputeExpression::whereIn('term_id', $computeExpressionTerms)
                ->whereNull('deleted_at')->get();
            foreach ($subComputeExpressions as $subComputeExpression) {
                // For all of its subComputeExpressions, look for its terms and add them to the mainComputeExpression's terms array.
                $mainComputeExpressionTerms = array_merge($mainComputeExpressionTerms,
                    $this->getComputeExpressionTermsToSearchForUnfilledProperties($subComputeExpression->compute_expression_id));
            }
        }
        // Return an array containing all the computeExpression's terms (including terms from its subComputeExpressions).
        return $mainComputeExpressionTerms;
    }

    private function storeUnevaluatedComputeExpressionLog($computeExpressionId, $unfilledProperties)
    {
        return ComputeExpressionLog::create([
            'compute_expression_id' => $computeExpressionId,
            'transaction_state_id' => $this->globalVariables->transactionStateId,
            'expression_computed' => 'No values for properties '.implode(', ', $unfilledProperties).' on the current process. No computed expression',
            'expression_result' => 'No expression evaluated',
            'updated_by' => $this->globalVariables->userId
        ]);
    }

    private function getQueryTermResults($termId) {
        $queryId = TermHasQuery::where('term_id', $termId)->whereNull('deleted_at')->first()->query_id;
        $dynSearchController = new DynSearchController();
        // In case the action rule had query parameters defined, get the value to be used in the query execution
        $queryParamsValues = $this->getQueryParameterValues($termId);
        // Get the query results using the inserted parameters if applicable
        $queryResults = $dynSearchController->getResultsFromQueryId($queryId, $this->globalVariables->langId, true, $queryParamsValues);
        $this->storeActionHasQueryLog($queryId, $queryResults);
        return $queryResults;
    }

    private function getQueryParameterValues($termId) {
        // Check if there are any queryParameters in this term
        $queryParameters = TermHasQueryParameter::where('term_id', $termId)
            ->whereNull('deleted_at')
            ->get()->pluck('query_parameter_id');

        // Get the information about each one of these parameters, if there are any
        $queryTermParameterValues = QueryParameter::whereIn('id', $queryParameters)->whereNull('deleted_by')->get();

        // For each queryParameter, get the exact value to be used in the query's execution
        foreach ($queryTermParameterValues as $queryParameterValue) {
            $queryParameterValue->term_value = $this->getTermValueAndCheckIfNeedsTransformation($queryParameterValue->term_id,
                $queryParameterValue->queryFilter->property_id);
        }

        return $queryTermParameterValues;
    }

    public function getTermValueAndCheckIfNeedsTransformation($termId, $targetPropertyId) {
        // Get the term's type and value depending on its term type
        $termType = $this->getTermType($termId);
        $termValue = $this->analyzeTerm($termId);
        // Get the info about the property that we are about to assign a value
        $targetProperty = Property::find($targetPropertyId);
        // If the targetProperty is a propRef property and the term is a propertyTerm (with a prop_ref property)
        // May need transformation - due to differences in fkProperties between the targetProperty and the termProperty
        // Although both of them need to reference the same fkEntity, they may differ in fkProperty
        if ($targetProperty->value_type === 'prop_ref' && $termType === 'propertyTerm') {
            // Get the propertyTerm's property information
            $termProperty = TermHasProperty::where('term_id', $termId)->first()->property;
            Log::debug('TERM VALUE BEFORE CHANGE: ' . $termValue);
            // Check if the target property has a specific referenced property (fk property)
            $targetPropertyHasFkProperty = $targetProperty->fk_property_id;
            // Check if the term's property has a specific referenced property (fk property)
            $termPropertyHasFkProperty = $termProperty->fk_property_id;
            // If they differ in this aspect (if they don't have the same fkProperty)
            // Transform the termValue in the corresponding acceptable value for the targetProperty
            if ($targetPropertyHasFkProperty !== $termPropertyHasFkProperty) {
                // Get the termValue's entityId
                if ($termPropertyHasFkProperty) {
                    //  If the termProperty has a fkProperty, get the entityId from the termValue record
                    $termPropertyValueEntityId = Value::find($termValue)->entity_id;
                } else {
                    // If the termProperty doesn't have a fkProperty, the termValue is already the entityId
                    $termPropertyValueEntityId = $termValue;
                }
                // Get the corresponding acceptable value for the targetProperty from the termValue's entityId
                if ($targetPropertyHasFkProperty) {
                    // If the targetProperty's fkProperty is different from the termProperty's fkProperty, get it from
                    // searching for the targetProperty's fkProperty value with the above entityId
                    $termValue = Value::where([
                        'property_id' => $targetPropertyHasFkProperty,
                        'entity_id' => $termPropertyValueEntityId
                    ])->whereNull('deleted_at')->first()->id;
                } else {
                    // If the targetProperty doesn't have a fkProperty, the termValue is the entityId that we got above
                    $termValue = $termPropertyValueEntityId;
                }
                Log::debug('TERM VALUE TRANSFORMED TO: ' . $termValue);
            }
        }
        return $termValue;
    }

    public function storeActionHasQueryLog($queryId, $queryResults) {
        $alreadyHasQueryResultsLogged = ActionHasQueryLog::where([
            'query_id' => $queryId,
            'transaction_state_id' => $this->globalVariables->transactionStateId
        ])->whereNull('deleted_at')->exists();

        if (!$alreadyHasQueryResultsLogged) {
            ActionHasQueryLog::create([
                'query_id' => $queryId,
                'transaction_state_id' => $this->globalVariables->transactionStateId,
                'query_result' => json_encode($queryResults),
                'updated_by' => $this->globalVariables->userId
            ]);
        }
    }

}
