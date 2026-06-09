<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\ActionPropHasQuery;
use App\ActionPropHasQueryParameter;
use App\Entity;
use App\Http\Resources\QueryResource;
use App\Http\Traits\BlocklyXMLManipulatingTrait;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Property;
use App\Query;
use App\QueryFilter;
use App\QueryHasResult;
use App\QueryHasTerm;
use App\QueryName;
use App\QueryTerm;
use App\Ruleset;
use App\RulesetHasQueryTerm;
use App\TermHasQuery;
use App\TermHasQueryParameter;
use App\TransactionTypeHasRestrictionQuery;
use App\Value;
use App\RestApi;
use DB;
use Illuminate\Http\Request;
use Log;

class QueryController extends Controller
{
    use HTTPResponseTrait, GetMultilingualConceptName, BlocklyXMLManipulatingTrait;

    public function index(Request $request) {
        $userLangId = $request->user()->language_id;

        $queries = Query::whereNull('deleted_at')->get();

        foreach ($queries as $query) {
            $this->getQueryInformation($query, $userLangId);
        }

        return QueryResource::collection($queries);
    }

    public function show(Request $request, $queryId)
    {
        $userLangId = $request->user()->language_id;

        $query = Query::find($queryId);
        $this->getQueryInformation($query, $userLangId);

        return new QueryResource($query);
    }

    private function getQueryInformation($query, $userLangId) {
        // Get the query name
        $query->name = $this->getMultilingualConceptName('query_name', 'name', 'query_id',
            $query->id, $userLangId);
        // Get the query's included properties (properties to be shown in the results)
        $query->includedProperties = $this->getIncludedProperties($query->id);
        // Get the query's filter rules and properties present in these rules
        $queryBuilder = json_decode($query->query_builder, true);
        $queryFilters = $this->getFilterRules($queryBuilder);
        $query->filterProperties = $this->getFilterProperties($queryFilters);
        // Get the query's parameter properties
        $query->propertyParameters = $this->getQueryParameters($query->id, $userLangId);
        // Get the query's selected entity types
        $query->selectedEntityTypes = $this->getQueryEntityTypesChecked($query);
        // Get the query's filters in full, with property and value names
        $queryFiltersInFull = $this->getQueryFilters($queryFilters, $userLangId);
        // Get the query parts needed for the writing of the automatically generated name
        $query->automatedName = $this->getQueryPartsForAutomatedQueryName($query, $queryFiltersInFull, $userLangId);
    }

    private function getQueryParameters($queryId, $userLangId) {
        // Get the main query term, which will be a ruleset encompassing all filters/sub-ruleSets
        $mainQueryTerm = QueryHasTerm::where('query_id', $queryId)->whereNull('deleted_at')->first()->query_term_id;
        // Get the main query ruleset
        $mainRulesetId = Ruleset::where('query_term_id', $mainQueryTerm)->whereNull('deleted_at')->first()->id;
        // Get the main ruleSet's parameters from its filters and sub-ruleSets
        return $this->getRulesetParameters($mainRulesetId, $userLangId);
    }

    private function getRulesetParameters($rulesetId, $userLangId, $queryParameters = []) {
        // Get all query terms belonging to this ruleSet
        $rulesetTerms = RulesetHasQueryTerm::where('ruleset_id', $rulesetId)->whereNull('deleted_at')->get();
        foreach ($rulesetTerms as $rulesetTerm) {
            $queryTerm = QueryTerm::find($rulesetTerm->query_term_id);
            // If the ruleSet's term is a filter, check if its property is a query parameter
            if ($queryTerm->type === 'filter') {
                $queryFilter = QueryFilter::where('query_term_id', $queryTerm->id)->first();
                if ($queryFilter->is_parameter) {
                    // If so, get the property's name and info (such as the ent_type_id) and its name, and store it.
                    $propertyInfo = Property::find($queryFilter->property_id);
                    $propertyInfo->name = $this->getMultilingualConceptName('property_name', 'name',
                    'property_id', $propertyInfo->id, $userLangId);
                    $queryParameters[] = $propertyInfo;
                }
            } else {
                // If the term is a sub-ruleset, search for parameters inside that subRuleSet's terms
                $subRulesetId = Ruleset::where('query_term_id', $queryTerm->id)->first()->id;
                $queryParameters = $this->getRulesetParameters($subRulesetId, $userLangId, $queryParameters);
            }
        }
        return $queryParameters;
    }

    private function getIncludedProperties($queryId) {
        $queryProperties = QueryHasResult::where('query_id', $queryId)->select('property_id')->get();
        $queryIncludedProperties = [];

        foreach ($queryProperties as $property) {
            // Get entity type id of that property
            $property->ent_type_id = Property::find($property->property_id)->ent_type_id;
            $queryIncludedProperties[$property->ent_type_id][] = $property->property_id;
        }

        return $queryIncludedProperties;
    }

    private function getFilterRules($queryBuilder) {
        $filters = [];
        foreach ($queryBuilder['rules'] as $rule) {
            if (array_key_exists('rules', $rule)) {
                $filters = array_merge($filters, $this->getFilterRules($rule));
            } else {
                $filters[] = $rule;
            }
        }
        return $filters;
    }

    private function getFilterProperties($filters) {
        $queryFilterProperties = [];

        foreach ($filters as $filter) {
            $propertyId = $filter['field'];
            // Get entity type id of that property
            $propertyEntTypeId = Property::find($propertyId)->ent_type_id;
            // Add property id to respective entity type id key
            $queryFilterProperties[$propertyEntTypeId][] = $propertyId;
        }
        // Add to filter_properties array the filter properties of the query
        return $queryFilterProperties;
    }

    private function getQueryEntityTypesChecked($query) {
        $allIncludedEntityTypes = array_keys($query->includedProperties);
        // Put the baseEntType as the first element of the array to be returned and filter entTypes to be unique
        return array_unique(array_merge([$query->base_ent_type_id], $allIncludedEntityTypes));
    }

    private function getQueryFilters($queryFilters, $userLangId) {
        $queryFullFilters = [];
        foreach ($queryFilters as $filter) {
            $propertyName = $this->getMultilingualConceptName('property_name', 'name',
                'property_id', $filter['field'], $userLangId);
            $propertyInfo = Property::find($filter['field']);
            if (!array_key_exists('value', $filter)) {
                $filter['value'] = 'parameter';
            } else if ($propertyInfo->value_type === 'enum' and $filter['value'] !== '') {
                $filter['value'] = $this->getMultilingualConceptName('prop_allowed_value_name', 'name',
                    'p_a_v_id', $filter['value'], $userLangId);;
            } else if ($propertyInfo->value_type === 'prop_ref' and $filter['value'] !== '') {
                $filter['value'] = $this->getPropRefFilterValue($filter['value'], $propertyInfo, $userLangId);
            }
            $queryFullFilters[] = $propertyName . ' ' . $filter['operator'] . ' ' . $filter['value'];
        }
        return $queryFullFilters;
    }

    private function getPropRefFilterValue($filterValue, $propertyInfo,$userLangId) {
        $propRefFilterValue = '';
        // If propFilterValue is an array, as happens in e.g. 'Car Type "in [11, 14]"', get each individual value's value
        if (is_array($filterValue)) {
            foreach ($filterValue as $index => $filterSingleValue) {
                // Append each value in the same variable. Return it in the form of e.g. 'Economy, Standard'
                $propRefFilterValue .= $index === 0 ? null : ', ';
                $propRefFilterValue .= $this->getFilterReferencedValue($propertyInfo, $filterValue, $userLangId);
            }
        } else {
            // As there's only one value, no need to append several values into one variable
            $propRefFilterValue = $this->getFilterReferencedValue($propertyInfo, $filterValue, $userLangId);
        }
        return $propRefFilterValue;
    }

    private function getFilterReferencedValue($propertyInfo, $filterValue, $userLangId) {
        if ($propertyInfo->fk_property_id) {
            // If it's a 'prop_ref' property, check if refers to a 'requires_translation' property. If it does, get the
            // corresponding 'value text' record that will correspond to the 'value id' saved in the 'value' table
            if (Value::find($filterValue)) {
                return $propertyInfo->fkProperty->requires_translation ? $this->getMultilingualConceptName('value_text',
                    'text', 'value_id', $filterValue, $userLangId) : Value::find($filterValue)->value;
            }
        } else {
            // If it's a 'prop_ref' property without a 'fkProperty', it means it's referring to the overall 'fk entity type'.
            // In this case, get the internal id of the entity with its id saved in the 'value' table
            if (Entity::find($filterValue)) {
                return Entity::find($filterValue)->internal_id;
            }
        }
        return null;
    }

    private function getQueryPartsForAutomatedQueryName($query, $queryFiltersInFull, $userLangId) {
        $queryPartsAutomatedName = [];
        // Get entity types names to insert in the automated query name displayed in the queries' table
        $queryPartsAutomatedName['entTypes'] = '';
        foreach ($query->selectedEntityTypes as $entityType) {
            $entityTypeName = $this->getMultilingualConceptName('ent_type_name', 'name',
                'ent_type_id', $entityType, $userLangId);
            $queryPartsAutomatedName['entTypes'] .= $entityTypeName . ', ';
        }
        // Get property names to insert in the automated query name displayed in the queries' table
        $queryPartsAutomatedName ['properties'] = '';
        foreach ($query->includedProperties as $entTypeProperties) {
            foreach ($entTypeProperties as $propertyId) {
                $propertyName = $this->getMultilingualConceptName('property_name',
                    'name', 'property_id', $propertyId, $userLangId);
                $queryPartsAutomatedName ['properties'] .= $propertyName . ', ';
            }
        }
        // Get filters to insert in the automated query name displayed in the queries' table
        $numberOfFilters = count($queryFiltersInFull);
        if ($numberOfFilters > 0) {
            if ($numberOfFilters == 1) {
                $filters = $queryFiltersInFull[0];
            } else if ($numberOfFilters == 2) {
                $filters = $queryFiltersInFull[0] . ' and ' . $queryFiltersInFull[1];
            } else {
                $filters = $queryFiltersInFull[0] . ', ' . $queryFiltersInFull[1];
                $queryPartsAutomatedName['more_filters'] = $numberOfFilters - 2;
            }
            $queryPartsAutomatedName['filters'] = $filters;
        }
        return $queryPartsAutomatedName;
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        DB::beginTransaction();
        try {
            $this->createQuery($request, $userId, $userLangId);
            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
            // something went wrong
        }
        return (string)$success;
    }

    public function createQuery($queryData, $userId, $userLangId) {
        // Create the main query record
        $query = Query::create([
            'base_ent_type_id' => $queryData->input('base_ent_type_id'),
            'query_builder' => json_encode($queryData->input('queryBuilder')),
            'updated_by' => $userId
        ]);
        // Insert the query's name inserted by the user
        $queryName = QueryName::create([
            'query_id' => $query->id,
            'name' => $queryData->input('name'),
            'language_id' => $userLangId,
            'updated_by' => $userId
        ]);
        // Get an object reflecting the queryBuilder's rules
        $queryBuilder = json_decode(json_encode($queryData->input('queryBuilder')), true);
        // The main query ruleset that will encompass all the rules inserted
        $mainQueryTerm = QueryTerm::create([
            'type' => 'ruleset',
            'updated_by' => $userId
        ]);
        // Associate the main query's ruleset to the query
        QueryHasTerm::create([
            'query_id' => $query->id,
            'query_term_id' => $mainQueryTerm->id,
            'updated_by' => $userId
        ]);
        // Store every query rule inserted by the user in the system's database
        $this->storeQueryRuleset($queryBuilder, $mainQueryTerm->id, $userId);
        // Insert into the result table all includedProperties
        $includedProperties = $queryData->input('includedProperties');
        foreach ($includedProperties as $entTypeProperties) {
            foreach ($entTypeProperties as $entTypeProperty) {
                QueryHasResult::create([
                    'query_id' => $query->id,
                    'property_id' => $entTypeProperty,
                    'updated_by' => $userId
                ]);
            }
        }
        return $query->id;
    }

    private function storeQueryRuleset($queryBuilderRuleset, $queryTermId, $userId) {
        // Create a ruleset for the upcoming set of rules to be entered into the database
        $currentRuleset = Ruleset::create([
            'type' => $queryBuilderRuleset['condition'],
            'query_term_id' => $queryTermId,
            'updated_by' => $userId
        ]);
        // Store in the database each rule/ruleset in the current ruleset
        foreach($queryBuilderRuleset['rules'] as $rule) {
            if (array_key_exists('rules', $rule)) {
                $currentQueryTermId = $this->createQueryTerm('ruleset', $currentRuleset->id, $userId);
                $this->storeQueryRuleset($rule, $currentQueryTermId, $userId);
            } else {
                $currentQueryTermId = $this->createQueryTerm('filter', $currentRuleset->id, $userId);
                $fieldValue = array_key_exists('value',$rule) ? $this->getFieldValueForDatabase($rule['value']) : null;
                QueryFilter::create([
                    'query_term_id' => $currentQueryTermId,
                    'property_id' => $rule['field'],
                    'operator' => $rule['operator'],
                    'value' => $fieldValue,
                    'is_parameter' => $rule['isParameter'],
                    'updated_by' => $userId
                ]);
            }
        }

    }

    private function getFieldValueForDatabase($fieldValue) {
        // When we have an 'in' or 'not in' rule, we will have an array instead of a single value for the field value.
        // Keep expanding this function for the different type of rules, as there may be more cases as this one.
        return is_array($fieldValue) ? json_encode($fieldValue) : $fieldValue;
    }

    private function createQueryTerm($queryTermType, $rulesetId, $userId) {
        // Create a new QueryTerm and associate it to the current ruleset
        $currentQueryTerm = QueryTerm::create([
            'type' => $queryTermType,
            'updated_by' => $userId
        ]);
        RulesetHasQueryTerm::create([
            'ruleset_id' => $rulesetId,
            'query_term_id' => $currentQueryTerm->id,
            'updated_by' => $userId
        ]);
        return $currentQueryTerm->id;
    }

    public function update(Request $request, $queryId)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        DB::beginTransaction();
        try {

            // Create the new updated version of the query as a new query inserted into the system
            $updatedQueryId = $this->createQuery($request, $userId, $userLangId);

            // Adjust the links found in Action Rules with the updatedQuery
            $this->adjustQueryActionRuleLinks($queryId, $updatedQueryId, $userId);
            // Adjust the links found in transactionTypeHasRestrictionQuery table
            $this->adjustTransactionTypesRestrictionQueriesLinks($queryId, $updatedQueryId, $userId);

            // Delete the previous query version and its association to a restApi if it existed
            $this->destroy($request, $queryId);
            $restApiForThisQuery = RestApi::where('query_id', $queryId);
            if ($restApiForThisQuery->exists()) {
                $restApiId = $restApiForThisQuery->first()->id;
                $this->destroyRestApi($request, $restApiId);
            }

            DB::commit();
            $success = true;

        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string)$success;
    }

    public function destroy(Request $request, $queryId)
    {
        $userId = $request->user()->id;
        $query = Query::find($queryId);

        DB::beginTransaction();
        try {

            $query->update([
                'deleted_by' => $userId
            ]);
            $query->delete();

            // TODO não será preciso apagaar os restantes registos das tabelas query_filter, query_results, ..... ??

            DB::commit();
            $success = true;

        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string)$success;
    }

    public function destroyRestApi(Request $request, $id)
    {
        $userId = $request->user()->id;
        $query = RestApi::find($id);

        DB::beginTransaction();
        try {
            $query->update([
                'deleted_by' => $userId
            ]);
            $query->delete();
            DB::commit();
            $success = true;

        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string)$success;
    }

    private function adjustQueryActionRuleLinks($oldQueryId, $updatedQueryId, $userId)
    {
        // Update the query selected in Action Rules' XMLs that reference this query [in actionPropHasQuery/termHasQuery tables/blocks]
        $this->updateActionRulesSelectedQueryBlock($oldQueryId, $updatedQueryId, $userId);
        // If any of the parameters stayed the same, replace the links in actionPropHasQuery and termHasQuery tables
        // And also substitute them in the Action Rules' XMLs that contain these query parameters
        $this->updateActionPropHasQueryLinks($oldQueryId, $updatedQueryId, $userId);
        $this->updateTermHasQueryLinks($oldQueryId, $updatedQueryId, $userId);
    }

    private function updateActionPropHasQueryLinks($oldQueryId, $updatedQueryId, $userId)
    {
        // Get every actionPropHasQuery record that references the old queryId
        $actionPropHasQueryLinks = ActionPropHasQuery::where('query_id', $oldQueryId)
            ->whereHas('actionProp.action.actionRule', function ($actionRule) {
                $actionRule->whereNull('deleted_at');
            })->whereNull('deleted_at')->get();
        // For each one of those records, update their 'query_id' field and update the respective ActionPropHasQueryParameter records, if applicable
        foreach ($actionPropHasQueryLinks as $actionPropHasQueryLink) {
            // Check if these actionProps also have parameters specified that need updating
            $actionPropHasQueryParameters = ActionPropHasQueryParameter::where('action_prop_id', $actionPropHasQueryLink->action_prop_id)
                ->whereNull('deleted_at')->get();
            // If they do, update the parameter's 'query_id' and 'query_filter_id' fields for the updatedQuery
            foreach ($actionPropHasQueryParameters as $actionPropHasQueryParameter) {
                // Update the queryParameter to reference the updatedQuery's latest filters
                $this->updateQueryParameter($actionPropHasQueryParameter, $updatedQueryId, $userId);
            }
            // Update the 'query_id' field in the 'action_prop_has_query' records
            $actionPropHasQueryLink->update([
                'query_id' => $updatedQueryId,
                'updated_by' => $userId
            ]);
        }
    }

    private function updateTermHasQueryLinks($oldQueryId, $updatedQueryId, $userId)
    {
        // It will get termHasQuery records from already deleted Action Rules... [would be better if it only got from active ones]
        // Get every termHasQuery record that references the old queryId
        $termHasQueryLinks = TermHasQuery::where('query_id', $oldQueryId)->whereNull('deleted_at')->get();
        // For each one of those records, update their 'query_id' field and update the respective TermHasQueryParameter records, if applicable
        foreach ($termHasQueryLinks as $termHasQueryLink) {
            // Check if these terms also have parameters specified that need updating
            $termHasQueryParameters = TermHasQueryParameter::where('term_id', $termHasQueryLink->term_id)
                ->whereNull('deleted_at')->get();
            // If they do, update the parameter's 'query_id' and 'query_filter_id' fields for the updatedQuery
            foreach ($termHasQueryParameters as $termHasQueryParameter) {
                // Update the queryParameter to reference the updatedQuery's latest filters
                $this->updateQueryParameter($termHasQueryParameter, $updatedQueryId, $userId);
            }
            // Update the 'query_id' field in the 'action_prop_has_query' records
            $termHasQueryLink->update([
                'query_id' => $updatedQueryId,
                'updated_by' => $userId
            ]);
        }
    }

    private function updateQueryParameter($recordHasQueryParameter, $updatedQueryId, $userId) {
        $queryParameter = $recordHasQueryParameter->queryParameter;
        // Get the 'old' queryFilterId in case we need it for replacing in the AR's XML
        $oldQueryFilterId = $queryParameter->query_filter_id;
        $updatedQueryFilterId = null;
        // Get the updated query's filter terms
        $newQueryParameters = $this->getQueryFilterTerms($updatedQueryId);
        // Check what the new queryFilter is in the updatedQuery, related to the same parameter/property as in the oldQuery
        $newQueryFilter = QueryFilter::where([
            'property_id' => $queryParameter->queryFilter->property_id,
            'is_parameter' => 1,
        ])->whereIn('query_term_id', $newQueryParameters)->whereNull('deleted_at')->first();
        if ($newQueryFilter) {
            // If the parameter is still in the query, update the queryParameter's 'query_id' and 'query_filter_id' accordingly
            $queryParameter->update([
                'query_id' => $updatedQueryId,
                'query_filter_id' => $newQueryFilter->id,
                'updated_by' => $userId
            ]);
            $updatedQueryFilterId = $newQueryFilter->id;
        }
        // Update the queryParameter's queryFilterId on the AR's XML
        $this->updateActionRulesQueryBlockParameters($updatedQueryId, $oldQueryFilterId, $updatedQueryFilterId, $userId);
    }

    private function getQueryFilterTerms($queryId) {
        // Get the main query term, which will be a ruleset encompassing all filters/sub-ruleSets
        $mainQueryTerm = QueryHasTerm::where('query_id', $queryId)->whereNull('deleted_at')->first()->query_term_id;
        // Get the main query ruleset
        $mainRulesetId = Ruleset::where('query_term_id', $mainQueryTerm)->whereNull('deleted_at')->first()->id;
        // Get the main ruleSet's filter terms from its filters and sub-ruleSets
        return $this->getRulesetFilterTerms($mainRulesetId);
    }

    private function getRulesetFilterTerms($rulesetId, $queryTerms = []) {
        // Get all query filter terms belonging to this ruleSet
        $rulesetTerms = RulesetHasQueryTerm::where('ruleset_id', $rulesetId)->whereNull('deleted_at')->get();
        foreach ($rulesetTerms as $rulesetTerm) {
            $queryTerm = QueryTerm::find($rulesetTerm->query_term_id);
            // If the ruleSet's term is a filter, add it to the returning array
            if ($queryTerm->type === 'filter') {
                $queryTerms[] = $queryTerm->id;
            } else {
                // If the term is a sub-ruleset, search for filter terms inside that subRuleSet's terms
                $subRulesetId = Ruleset::where('query_term_id', $queryTerm->id)->first()->id;
                $queryTerms = $this->getRulesetFilterTerms($subRulesetId, $queryTerms);
            }
        }
        return $queryTerms;
    }

    private function adjustTransactionTypesRestrictionQueriesLinks($oldQueryId, $updatedQueryId, $userId){
        // Get every transactionTypeHasRestrictionQuery record that references the old queryId
        $transactionTypeRestrictionQueries = TransactionTypeHasRestrictionQuery::where('query_id', $oldQueryId)
            ->whereNull('deleted_at')->get();
        // Update its restriction_query link to the new version of the query
        foreach ($transactionTypeRestrictionQueries as $transactionTypeRestrictionQuery) {
            $transactionTypeRestrictionQuery->update([
                'query_id' => $updatedQueryId,
                'updated_by' => $userId
            ]);
        }
    }
}
