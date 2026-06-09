<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine\Helpers;

use App\ActionPropHasQuery;
use App\ActionPropHasQueryParameter;
use App\Http\Controllers\DynSearchController;
use App\Http\ExecutionEngine\EECGlobalVariables;
use App\Http\Traits\ConceptDetailsTrait;
use App\Http\Traits\FormUpdatingTrait;
use App\Http\Traits\GetMultilingualConceptName;
use App\QueryParameter;
use App\TermHasEntitySpecification;
use App\TermHasQuery;
use App\TermHasQueryParameter;
use DB;

class FormDetailsHelper
{
    use GetMultilingualConceptName, FormUpdatingTrait, ConceptDetailsTrait;
    protected $termsExecutionHelper;
    private $globalVariables;

    public function __construct(TermsExecutionHelper $termsExecutionHelper)
    {
        $this->termsExecutionHelper = $termsExecutionHelper;
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    public function getFormDetails ($formId) {
        $formDetails = DB::table('form')
            ->join('form_content', 'form.id', '=', 'form_content.form_id')
            ->join('action','action.id', '=', 'form.action_id')
            ->join('action_rule', 'action.action_rule_id', '=', 'action_rule.id')
            ->select('form.id', 'form_content.name', 'form_content.json', 'form_content.language_id', 'form.action_id', 'action_rule.transaction_type_id as transaction_type_id',
                'form_content.updated_by', 'form_content.deleted_by', 'action_rule.deleted_at as deleted_action_rule')
            ->where([
                ['form_content.language_id', $this->globalVariables->langId],
                ['form.id', $formId]
            ])->latest('form_content.created_at')->first();

        // Check if there are fields in this form that need options to be renderer at run-time
        $formContent = json_decode($formDetails->json);
        $this->addQueryResultsToPropertySpecificationIfNecessary($formContent, $formDetails->action_id);
        $this->addEntityInstancesForEntitySpecificationIfNecessary($formContent, $formDetails->action_id);
        $formDetails->json = json_encode($formContent);

        return $formDetails;
    }

    private function addQueryResultsToPropertySpecificationIfNecessary($formContent, $actionId) {
        // Get actionProperties from this form that use a query's result for their selection options
        $hasQueryActionProperties = $this->formHasQueryActionProperties($actionId);

        foreach($hasQueryActionProperties as $queryActionProp) {
            // In case the action rule had query parameters defined, get the value to be used in the query execution
            $queryParamsValues = $this->getQueryParameterValues($actionId);
            // For the field containing this property, get its form component and update its selection options
            $componentToUpdate = $this->getFormComponentByKey($formContent->components, $queryActionProp->actionProp->prop_id);
            $componentToUpdate->queryValues = $this->getQueryResultsForComponent($queryParamsValues, $queryActionProp->query_id,
                $queryActionProp->actionProp->prop->fk_entity_type_id, $queryActionProp->actionProp->prop);
        }
    }

    private function formHasQueryActionProperties($actionId) {
        return ActionPropHasQuery::with('actionProp')
            ->whereHas('actionProp', function($query) use ($actionId) {
                $query->where('action_id', $actionId);
            })->whereNull('deleted_at')->get();
    }

    private function getQueryResultsForComponent($queryParamsValues, $queryId, $referencedEntityType, $formFieldProperty = null) {
        $dynSearchController = new DynSearchController();
        // Get the query results using the inserted parameters
        $queryResult = $dynSearchController->getResultsFromQueryId($queryId, $this->globalVariables->langId, true,
            $queryParamsValues, $formFieldProperty);
        $this->termsExecutionHelper->storeActionHasQueryLog($queryId, $queryResult);
        // Transform the query results array into the format ['value' => ..., 'label' => ...] to be used in the form field's
        // select box
        $referencedFormFieldProperty = $formFieldProperty ? $formFieldProperty->fk_property_id : null;
        return $this->transformQueryResultsToFormValues($queryResult, $this->globalVariables->langId,
            $referencedEntityType, $referencedFormFieldProperty);
    }

    private function getQueryParameterValues($actionId, $queryTermId = null) {
        // Check if there are any properties/entities with queryOptions in this form's defined action/queryTermId
        $actionQueryParameters = $queryTermId ? $this->getEntitySpecificationQueryParameters($queryTermId) :
            $this->getPropertySpecificationQueryParameters($actionId);

        // Get the information about each one of these parameters, if there are any
        $actionQueryParameterValues = QueryParameter::whereIn('id', $actionQueryParameters)->whereNull('deleted_by')->get();

        // For each queryParameter, get the exact value to be used in the query's execution
        foreach ($actionQueryParameterValues as $queryParameterValue) {
            $queryParameterValue->term_value = $this->termsExecutionHelper->analyzeTerm($queryParameterValue->term_id);
        }

        return $actionQueryParameterValues;
    }

    private function getEntitySpecificationQueryParameters($queryTermId) {
        return TermHasQueryParameter::where('term_id', $queryTermId)
            ->whereNull('deleted_at')->get()->pluck('query_parameter_id');
    }

    private function getPropertySpecificationQueryParameters($actionId) {
        return ActionPropHasQueryParameter::whereHas('actionProp', function($query) use ($actionId) {
            $query->where('action_id', $actionId);
        })->with('queryParameter')->whereNull('deleted_at')->get()->pluck('query_parameter_id');
    }

    private function addEntityInstancesForEntitySpecificationIfNecessary($formContent, $actionId) {
        // Check if there is an entitySpecification in this action
        $hasEntitySpecification = TermHasEntitySpecification::where('action_id', $actionId)
            ->whereNull('deleted_at')
            ->first();

        if ($hasEntitySpecification) {
            // Check if the entitySpecification gets its field options from a query result
            $entitySpecificationHasQueryResults = TermHasQuery::where('term_id', $hasEntitySpecification->term_id)
                ->whereNull('deleted_at')
                ->first();

            // For the field containing this entitySpecification, get its form component and update its selection options
            if ($entitySpecificationHasQueryResults) {
                // In case the action rule had query parameters defined, get the value to be used in the query execution
                $queryParamsValues = $this->getQueryParameterValues($actionId, $hasEntitySpecification->term_id);
                // The entity instances will come from the query execution's result
                $entityInstances = $this->getQueryResultsForComponent($queryParamsValues, $entitySpecificationHasQueryResults->query_id,
                    $hasEntitySpecification->ent_type_id);
            } else {
                // The entity instances will come from every entity instance in the system (containing the entityDetails specified)
                $entityInstancesWithDetails = $this->getEntityInstancesWithDetails($actionId, $hasEntitySpecification->ent_type_id, $this->globalVariables->langId);
                $entityInstances = $this->transformEntityInstancesToFormValues($entityInstancesWithDetails);
            }

            $entitySpecificationFieldIdentifier = 'entitySpecification' . $hasEntitySpecification->ent_type_id;
            $componentToUpdate = $this->getFormComponentByKey($formContent->components, $entitySpecificationFieldIdentifier);
            $componentToUpdate->entityInstances = $entityInstances;
        }
    }
}
