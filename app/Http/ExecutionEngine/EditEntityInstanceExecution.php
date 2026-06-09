<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine;

use App\ActionDerivedProp;
use App\ActionProp;
use App\Entity;
use App\EntityDetail;
use App\EntityFilter;
use App\Form;
use App\Property;
use App\TermHasProperty;
use App\Users;
use App\Value;
use App\Http\ExecutionEngine\Helpers\FormDetailsHelper;
use App\Http\ExecutionEngine\Helpers\TermsExecutionHelper;
use App\Http\Resources\ActionsDashboardResource;
use App\Http\Traits\ConceptDetailsTrait;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\StoreActionDerivedPropsTrait;
use App\Http\Traits\StoreFormInputTrait;

class EditEntityInstanceExecution implements ActionTypeExecutionInterface
{
    use GetMultilingualConceptName, ConceptDetailsTrait, StoreFormInputTrait, StoreActionDerivedPropsTrait;
    protected $formDetailsHelper;
    protected $termsExecutionHelper;
    private $globalVariables;

    public function __construct(FormDetailsHelper $formDetailsHelper, TermsExecutionHelper $termsExecutionHelper)
    {
        $this->formDetailsHelper = $formDetailsHelper;
        $this->termsExecutionHelper = $termsExecutionHelper;
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    public function execute(ActionsDashboardResource $action)
    {
        // Get the actionProperties associated with this action
        $actionProps = ActionProp::where('action_id', $action->id)->whereNull('deleted_at')->get();
        // Get the entity instances that can be updated in this action, with attention to possibly defined entity filters
        $action->entityInstances = $this->getEntityInstances($action->id);
        if ($actionProps->count()) {
            // If there are actionProps in this action, get the associated form details to present to the user
            return $this->executeActionWithActionProperties($action);
        } else {
            // Otherwise, as there are no properties to be filled by the user, no need to have a form defined for this action
            return $this->executeActionWithDerivedPropertiesOnly($action);
        }
    }

    private function executeActionWithActionProperties($action)
    {
        // Get the form associated with this action so the user can fill all actionProperties
        $action->formId = Form::where('action_id', $action->id)->latest()->first()->id;
        // If it's a userDetailing process type, get the $userDetailingEntityId and detailingUserId
        if ($action->userDetailingProcessType) {
            $userDetailingEntityId = Entity::whereHas('transaction.process', function ($query) {
                $query->where('id', $this->globalVariables->processId);
            })->first()->id;
            $action->detailingUserId = Users::where('entity_id', $userDetailingEntityId)->first()->id;
        }
        // Get the remaining form details, such as its form json and query results for fields if necessary
        $action->formDetails = $this->formDetailsHelper->getFormDetails($action->formId);

        return $action;
    }

    private function executeActionWithDerivedPropertiesOnly($action)
    {
        if ($action->entityInstances->count() === 1) {
            // If there's only 1 entity instance, pre-select it, as there isn't a choice for the user to select the entity to edit
            $entityId = $action->entityInstances->first()->id;
            $this->storeDerivedPropertiesIfPresent($action->id, $entityId,  $this->termsExecutionHelper, $this->globalVariables);
            // As there's no actionProps (so there isn't a need for a form to be presented to the user), return null
            // so there isn't a userInterventionAction in the executionEngine to be returned to the client-side
            return null;
        } else {
            // If there is more than 1 entity instance, return it to client-side so user can select the entity where
            // these derivedProperties need to be stored
            return $action;
        }
    }

    private function getEntityInstances($actionId)
    {
        // Check if there are entity filters defined in this action
        $hasEntityFilter = EntityFilter::where('action_id', $actionId)->whereNull('deleted_at')->first();

        if ($hasEntityFilter) {
            // Get the entity filter's type (query or property) and its value
            $filterTermType = $this->termsExecutionHelper->getTermType($hasEntityFilter->term_id);
            $filterTermValue = $this->termsExecutionHelper->analyzeTerm($hasEntityFilter->term_id);

            if ($filterTermType === 'queryTerm') {
                // Transform the query results array into a collection of entities with the fields 'id', 'internal_id',
                // 'created_at', 'updated_at' and 'details' to be used in the entity selection table
                return $this->transformQueryResultsToEntityInstances($filterTermValue);
            } else if ($filterTermType === 'propertyTerm') {
                // Means the filter is a 'propertyTerm' referring to a propRef property/entity. Get the entity instance
                // (in this case it will only find one specific instance) from the saved propRef property value/entity.
                // Check if the property that is referenced in the term has a fkProperty, or it just references an entity
                $referencesSpecificFkProperty = TermHasProperty::where('term_id', $hasEntityFilter->term_id)
                    ->whereNull('deleted_at')->first()->property->fk_property_id;
                $entityId = $referencesSpecificFkProperty ? Value::where('id', $filterTermValue)->first()->entity_id : $filterTermValue;
                return Entity::where('id', $entityId)->get();
            } else if ($filterTermType === 'getContextVariableTerm') {
                // Term is a context variable (that stores an entity id), whose value was defined before.
                // Return the entity info from that context variable
                return Entity::where('id', $filterTermValue)->get();
            }
        } else {
            // If there are no entity filters defined, get all the entity instances of the action's selected entityType
            // Get the action's entTypeId (so we can get its instances) from the action's entityDetails, actionProps or derivedActionProps
            $entTypeId = $this->getActionEntTypeId($actionId);
            return $this->getEntityInstancesWithDetails($actionId, $entTypeId, $this->globalVariables->langId, $this->globalVariables->processId);
        }
        return null;
    }

    private function getActionEntTypeId($actionId) {
        // Get the entityDetails defined for this action
        $entityDetails = EntityDetail::where('action_id', $actionId)->whereNull('deleted_at')->get();
        if ($entityDetails->count()) {
            // Get the entType of this editEntityInstance action from the first defined entityDetail
            $entTypeID = Property::find($entityDetails->first()->property_id)->ent_type_id;
        } else {
            // If there are no entityDetails defined, get the action's entType from the first defined actionProp (if it exists)
            $actionProp = ActionProp::where('action_id', $actionId)->whereNull('deleted_at')->first();
            if ($actionProp->count()) {
                // As there can be properties in this action from the entity type's associated 'has many' ent types. So, if the first
                // actionProp is from an associated 'has many' ent type, its fk_entity_type_id will point to the entType being edited.
                $entTypeID = $actionProp->property->fk_entity_type_id ?: $actionProp->property->ent_type_id;
            } else {
                // If there are no actionProps defined, get the action's entType from the first defined derivedActionProp
                // (at least one of these three must exist, so if it gets here, there will be at least one derivedActionProp)
                $entTypeID = ActionDerivedProp::where('action_id', $actionId)
                    ->whereNull('deleted_at')->first()
                    ->property->ent_type_id;
            }
        }
        return $entTypeID;
    }

    private function transformQueryResultsToEntityInstances($queryResult)
    {
        // These queryResults must come with the corresponding entityId so that we can store the selected option in the DB
        $entityInstances = collect();

        // Transform the query results array into a collection of entities with the fields 'id', 'internal_id',
        // 'created_at', 'updated_at' and 'details' to be used in the entity selection table
        foreach ($queryResult["resultRows"] as $entityId => $resultRow) {

            // To get the entity's id, internal_id, crated_at and updated_at fields
            $entityInfo = Entity::find($entityId);
            // To store every query's result property, as in the title we can only have the internal_id
            $entityDetails = [];

            foreach($resultRow as $index => $resultValue) {
                // The header corresponding to the current query result value being analyzed, to be used in the description.
                $queryHeader = $queryResult["header"][$index];
                // Build the entityDetails array correct format of "[[header1 => value], [header2 => value], ...]"
                $entityDetails[] = isset($resultValue['value']) ? $queryHeader . ': ' . $resultValue['value'] : $queryHeader . ': ---';
            }
            $entityInfo->details = $entityDetails;
            $entityInstances->add($entityInfo);
        }

        return $entityInstances;
    }
}
