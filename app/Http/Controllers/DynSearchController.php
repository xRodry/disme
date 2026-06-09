<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Entity;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Http\Traits\PropertyValuesFormTrait;
use App\Property;
use App\Query;
use App\QueryFilter;
use App\QueryHasResult;
use App\QueryHasTerm;
use App\QueryTerm;
use App\RestApi;
use App\Ruleset;
use App\RulesetHasQueryTerm;
use App\Value;
use Illuminate\Http\Request;
use DB;
use Log;

class DynSearchController extends Controller
{
    use HTTPResponseTrait, PropertyValuesFormTrait, GetMultilingualConceptName;

    protected $paramValue = [];
    protected $parameters = [];
    protected $restApi = false;

    private $queryId = null;
    private $queryParamsValues = null;

    //------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------
    //----------------------------------------- REST-API ---------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------

    public function executeQuery (Request $request)
    {
        // TODO comments

        $this->restApi = true;

        $endpoint = 'http://127.0.0.1:8001';
        $endpoint .= strtok($_SERVER["REQUEST_URI"], '?');

        $langId = 2;
        if (strpos(strtok($_SERVER["REQUEST_URI"], '?'), 'auth') !== false) {
            $langId = $request->user()->language_id;
        }

        $first = true;
        if(count($_GET) >= 1) {
            $endpoint .= '?';
            $queryString = explode("&", $_SERVER['QUERY_STRING']);
            for($i=0; $i<count($queryString); $i++){
                $parameter = explode("=", $queryString[$i]);
                if ($first) {
                    $endpoint .= $parameter[0] . '=';
                    $first = false;
                } else {
                    $endpoint .= '&' . $parameter[0] . '=';
                }
                $this->paramValue[] = $parameter[1];
            }
        }

        $restApiInfo = RestApi::where('endpoint', $endpoint)
            ->select('query_id', 'parameters')
            ->whereNull('deleted_at')
            ->first();

        if (!$restApiInfo) {
            return 'Endpoint not configured.';
        }

        $query = Query::where('id', $restApiInfo->query_id)
            ->select('query_builder', 'base_ent_type_id')
            ->whereNull('deleted_at')
            ->first();

        $queryProperties = QueryHasResult::select('property_id')->where(['query_id' => $restApiInfo->query_id])->get();
        $includedProperties = [];
        foreach ($queryProperties as $property) {
            // Get entity type id of that property
            $entTypeId = Property::select('ent_type_id')->where(['id' => $property['property_id']])->first()->ent_type_id;
            // Add property id to respective entity type id key
            $includedProperties[$entTypeId][] = $property['property_id'];
        }
        $queryBuilder = json_decode($query->query_builder, true);
        $this->parameters = json_decode($restApiInfo->parameters, true);

        return $this->buildQueryAndGetResults($queryBuilder, $includedProperties, $query->base_ent_type_id, $langId);
    }

    // In order to get the value of the rule, this function will get it from the previously filled paramValue array
    private function verifyParameterValue ($ruleNumber)
    {
        $value = '';
        foreach ($this->parameters as $i=>$parameter) {
            if ($parameter['rule'] == $ruleNumber) {
                //$value = $this->paramValue[$i];
                $value = $this->paramValue[0];
                array_shift($this->paramValue);
            }
        }
        return $value;
    }

    public function testQueryResults(Request $request): array
    {
        // TODO comments

        $splitUrl = parse_url($request->input('url'));
        $this->restApi = true;
        $endpoint = 'http://127.0.0.1:8001';
        $endpoint = $endpoint . $splitUrl['path'];

        $langId = 2;
        if (strpos($endpoint, 'auth') !== false) {
            $langId = $request->user()->language_id;
        }

        if(array_key_exists('query', $splitUrl)) {
            $queryString = explode("&", $splitUrl['query']);
            for($i=0; $i<count($queryString); $i++){
                $parameter = explode("=", $queryString[$i]);
                $this->paramValue[] = $parameter[1];
            }
        }

        $this->parameters = $request->input('params');

        $results = $this->buildQueryAndGetResults($request->input('query'), $request->input('includedProperties'),
            $request->input('baseTableId'), $langId);

        $stringRepresentation= json_encode($results);
        $resultsString = str_replace('"', '', $stringRepresentation);

        return [$resultsString];
    }

    public function saveURL(Request $request) {

        // Mount the endpoint without the values
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $endpoint = 'http://127.0.0.1:8001/api/';
        $endpoint = $endpoint . $request->input('auth');
        $endpoint = $endpoint . $request->input('queryName');

        $parametersForRestApi = $request->input('parametersForRestApi');
        $firstParameter = true;
        foreach ($parametersForRestApi as $parameter) {
            if ($parameter['parameterName'] != '') {
                if ($firstParameter){$endpoint = $endpoint . '?' . $parameter['parameterName'] . '='; $firstParameter = false;}
                else {$endpoint = $endpoint . '&' . $parameter['parameterName'] . '=';}
            }
        }

        // If the endpoint already exists, return an error message
        if (RestApi::where('endpoint', $endpoint)->exists()) {
            return 0;
        }

        DB::beginTransaction();
        try {
            $queryId = (new QueryController)->createQuery($request->input('query'), $userId, $userLangId);

            RestApi::create([
                'endpoint' => $endpoint,
                'query_id' => $queryId,
                'parameters' => json_encode($request->input('parameters')),
                'updated_by' => $userId
            ]);

            DB::commit();
            return 'true';
        } catch (\Exception $e) {
            DB::rollback();
            Log::debug($e);
            return 'false';
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------
    //-------------------------------- GET QUERY RESULTS ---------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------

    public function getResultsFromQueryId($queryId, $userLangId, $needValueRecordsIds = false, $queryParamsValues = null, $formFieldProperty = null)
    {
        $this->queryId = $queryId;
        $this->queryParamsValues = $queryParamsValues;
        $queryDetails = Query::find($queryId);

        $queryBuilderInfo = $this->objectToArray(json_decode($queryDetails->query_builder));

        return $this->buildQueryAndGetResults($queryBuilderInfo, $this->getQueryIncludedProperties($queryId, $formFieldProperty),
            $queryDetails->base_ent_type_id, $userLangId, $needValueRecordsIds);
    }

    private function objectToArray($data)
    {
        $result = [];
        foreach ($data as $key => $value)
        {
            $result[$key] = (is_array($value) || is_object($value)) ? $this->objectToArray($value) : $value;
        }
        return $result;
    }

    private function getQueryIncludedProperties($queryId, $formFieldProperty) {
        $queryResultProperties = QueryHasResult::with('property')
            ->where('query_id', $queryId)
            ->whereNull('deleted_at')->get();

        // If this query's result will be the options of a property's form field, check if that property's fk_property (if it has one)
        // is in the result properties. If it's not, add it, so we can have all the needed properties to construct the result.
        if ($formFieldProperty) {
            $queryResultProperties = $this->checkAndAddMissingFkProperty($queryResultProperties, $queryId, $formFieldProperty);
        }

        $includedProperties = [];
        foreach ($queryResultProperties as $resultProperty) {
            $propertyEntType = $resultProperty->property->ent_type_id;
            $includedProperties[$propertyEntType][] = $resultProperty->property_id;
        }

        return $includedProperties;
    }

    private function checkAndAddMissingFkProperty($queryResultProperties, $queryId, $formFieldProperty) {
        // If it has a fk_property and that property isn't part of the query's result properties, add it.
        $hasFkProperty = $formFieldProperty->fk_property_id;
        if ($hasFkProperty && !$queryResultProperties->contains('property_id', $hasFkProperty)) {
            // Create a 'fictitious' instance (without saving it in DB) and add it to the $queryResultsProperties collection
            $fictitiousRecord = new QueryHasResult([
                'query_id' => $queryId,
                'property_id' => $hasFkProperty
            ]);
            $queryResultProperties->push($fictitiousRecord);
        }
        return $queryResultProperties;
    }

    public function getQueryResults(Request $request): array
    {
        $userLangId = $request->user()->language_id;
        // Uncomment if needed
        // $filterProperties = $request->input('filterProps');
        // $selectedEntTypes = $request->input('selectedEntTypes');
        return $this->buildQueryAndGetResults($request->input('queryBuilder'), $request->input('includedProperties'),
            $request->input('base_ent_type_id'), $userLangId);
    }

    private function buildQueryAndGetResults($queryBuilder, $includedProperties, $baseTableEntTypeId, $userLangId, $needValueRecordsIds = false): array
    {
        // Query start -  that will include every rule specified in the QueryBuilder
        $mainQuery = Entity::where('ent_type_id', $baseTableEntTypeId)
            ->with('values');
        // Build the query with every rule specified, including sub-ruleSets
        $mainQuery = $this->applyQueryRules($mainQuery, $queryBuilder, $baseTableEntTypeId, $includedProperties);
        // Get the query results
        $mainQuery = $mainQuery->whereNull('deleted_at')->get();
        $queryResult = $this->organizeQueryResults($mainQuery, $includedProperties, $baseTableEntTypeId, $userLangId);

        return $needValueRecordsIds ? $queryResult : $this->transformQueryResultsForDisplay($queryResult);
    }

    private function applyQueryRules($mainQuery, $queryBuilder, $baseTableEntTypeId, $includedProperties, $subCondition = false) {
        $condition = $queryBuilder['condition'];
        $rules = $queryBuilder['rules'];
        if ($condition === 'and') {
            $mainQuery = $this->applyRulesetTypeAnd($mainQuery, $rules, $subCondition, $baseTableEntTypeId, $includedProperties);
        } else if ($condition === 'or') {
            $mainQuery = $this->applyRulesetTypeOr($mainQuery, $rules, $subCondition, $baseTableEntTypeId, $includedProperties);
        }
        return $mainQuery;
    }

    private function applyRulesetTypeAnd($mainQuery, $queryRules, $subCondition, $baseTableEntTypeId, $includedProperties) {
        $relationship = $subCondition ? 'entity.values' : 'values';
        return $mainQuery->where(function($query) use ($includedProperties, $baseTableEntTypeId, $queryRules, $relationship) {
            foreach ($queryRules as $queryRule) {
                // Check if current rule is a subCondition
                if (isset($queryRule['condition'])) {
                    $query->whereHas($relationship, function ($subQuery) use ($includedProperties, $baseTableEntTypeId, $queryRule) {
                        $subQuery->where(function($subQuery) use ($includedProperties, $baseTableEntTypeId, $queryRule) {
                            $subQuery =  $this->applyQueryRules($subQuery, $queryRule, $baseTableEntTypeId, $includedProperties, true);
                        });
                    });
                } else {
                    // Check if current rule belongs to a property from the baseTable's entType or to an associated table's entType
                    $entTypeId = Property::find($queryRule['field'])->ent_type_id;
                    if ($entTypeId === $baseTableEntTypeId) {
                        // Apply Query Rule
                        $query->whereHas($relationship, function ($subQuery) use ($queryRule) {
                            $this->applyRuleTypeAnd($subQuery, $queryRule);
                        });
                    } else {
                        // Apply query rule belonging to property of an associated table's entType
                        $query->whereHas($relationship, function ($subQuery) use ($includedProperties, $entTypeId, $baseTableEntTypeId, $queryRule) {
                            $this->applyRuleAssociatedEntType($subQuery, $queryRule, $baseTableEntTypeId, $entTypeId, $includedProperties);
                        });
                    }
                }
            }
        });
    }

    private function applyRulesetTypeOr($mainQuery, $queryRules, $subCondition, $baseTableEntTypeId, $includedProperties) {
        $relationship = $subCondition ? 'entity.values' : 'values';
        return $mainQuery->whereHas($relationship, function($query) use ($includedProperties, $relationship, $baseTableEntTypeId, $queryRules) {
            foreach ($queryRules as $key => $queryRule) {
                // First condition in the 'or' statement - key === 0
                if (!$key) {
                    // Check if first condition on the current rule is a subCondition
                    if (isset($queryRule['condition'])) {
                        $query->where(function ($subQuery) use ($includedProperties, $baseTableEntTypeId, $queryRule) {
                            $subQuery =  $this->applyQueryRules($subQuery, $queryRule, $baseTableEntTypeId, $includedProperties, true);
                        });
                    } else {
                        // Check if current rule belongs to a property from the baseTable's entType or to an associated table's entType
                        $entTypeId = Property::find($queryRule['field'])->ent_type_id;
                        if ($entTypeId === $baseTableEntTypeId) {
                            // Apply query rule belonging to property of the base table's entType
                            $this->applyRuleTypeOr($query, $queryRule, true);
                        } else {
                            // Apply query rule belonging to property of an associated table's entType
                            $query->where(function ($subQuery) use ($includedProperties, $entTypeId, $baseTableEntTypeId, $relationship, $queryRule) {
                                $this->applyRuleAssociatedEntType($subQuery, $queryRule, $baseTableEntTypeId, $entTypeId, $includedProperties);
                            });
                        }
                    }
                } // Rest of conditions in the 'or' statement
                else {
                    // Check if current rule is a subCondition
                    if (isset($queryRule['condition'])) {
                        $query->orWhere(function ($subQuery) use ($includedProperties, $baseTableEntTypeId, $queryRule) {
                            $subQuery =  $this->applyQueryRules($subQuery, $queryRule, $baseTableEntTypeId, $includedProperties, true);
                        });
                    } else {
                        // Check if current rule belongs to a property from the baseTable's entType or to an associated table's entType
                        $entTypeId = Property::find($queryRule['field'])->ent_type_id;
                        if ($entTypeId === $baseTableEntTypeId) {
                            // Apply query rule belonging to property of the base table's entType
                            $this->applyRuleTypeOr($query, $queryRule);
                        } else {
                            // Apply query rule belonging to property of an associated table's entType
                            $query->orWhere(function ($query) use ($includedProperties, $entTypeId, $baseTableEntTypeId, $relationship, $queryRule) {
                                $this->applyRuleAssociatedEntType($query, $queryRule, $baseTableEntTypeId, $entTypeId, $includedProperties);
                            });
                        }
                    }
                }
            }
        });
    }

    private function applyRuleAssociatedEntType($query, $queryRule, $baseTableEntTypeId, $entTypeId, $includedProperties) {
        // Get the properties of type 'prop_ref' that belong to the baseTable and are linked to the current property's entType.
        $baseTableLinkingProps = Property::where([
            'value_type' => 'prop_ref',
            'ent_type_id' => $baseTableEntTypeId])
            ->with('fkEntityType')
            ->whereHas('fkEntityType', function($query) use ($entTypeId) {
                $query->where('id', $entTypeId);
            })
            // ->whereIn('id', $includedProperties[$baseTableEntTypeId])
            ->whereNull('deleted_at')->get();
        Log::debug($baseTableLinkingProps);
        // Get an array containing the id's of the associating properties and one of its fk_property_id's.
        $linkingPropertiesBaseTable = $baseTableLinkingProps->pluck('id')->toArray();
        // Array_filter is to remove all nulls (for all linking props that don't have fkProperty)
        $linkedPropertiesCurrentEntType = array_filter($baseTableLinkingProps->pluck('fkProperty.id')->toArray());
        // Get the Linked Property values that obey the provided rule
        $rulePrimaryResult = Entity::where(['ent_type_id' => $entTypeId])
            ->with('values')
            ->whereHas('values', function ($query) use ($queryRule) {
                $this->applyRuleTypeAnd($query, $queryRule);
            })->whereNull('deleted_at');
        $rulePrimaryResult = $rulePrimaryResult->get();
        // After getting the values that obey the provided rule : Get the rule that will be applied to the baseTable!
        // Get the linked property's possible values of the current entType that correspond to the application of the rule
        // Ex: BaseTable: Rental; Associated Table: Car Type; Rule: Rental Tariff per day > 300;
        // possibleValues / rule applied to baseTable: Rental->Car Type in {Luxury, Special}
        $possibleValues = [];
        // If the base table's referencing property has a specific fk_property, save the value's id. Otherwise, save the entity's id.
        if (count($linkedPropertiesCurrentEntType)) {
            // For each entity in the result, get its records from the Value Table
            foreach($rulePrimaryResult as $entityResult) {
                foreach ($entityResult->values as $value) {
                    // Save the Value Table record's id if it refers to a linked Property of the Current Ent Type
                    if (in_array($value->property_id, $linkedPropertiesCurrentEntType)) {
                        $possibleValues[] = $value->id;
                    }
                }
            }
        } else {
            // For each entity in the result, get its records from the Value Table
            foreach($rulePrimaryResult as $entityResult) {
                $possibleValues[] = $entityResult->id;
            }
        }
        // Log::debug('poss values', $possibleValues);
        // Apply the rule to the base table's properties based on the possibleValues obtained through the $linkedProperties.
        $query->whereIn('property_id', $linkingPropertiesBaseTable)
            ->whereIn('value', $possibleValues);
    }

    private function applyQueryParamValues($queryRule) {
        // If the value of the rule is a parameter, it is necessary to look for its value in the paramValue array
        if ($queryRule['isParameter']) {
            if ($this->restApi) {
                $queryRule['value'] = $this->verifyParameterValue($queryRule['ruleNumber']);
            } else if ($this->queryParamsValues) {
                // Get the query's filters that have been defined as 'parameters' in their definition
                $queryFilterParameters = $this->getQueryFilterParameters();
                // Check what is the current query parameter being analyzed
                $queryFilter = QueryFilter::where([
                    'property_id' => $queryRule['field'],
                    'operator' => $queryRule['operator'],
                    'is_parameter' => 1,
                    'value' => $queryRule['value']
                ])->whereIn('id', $queryFilterParameters)->whereNull('deleted_at')->first()->id;
                // Get the parameter's value to be used in the query execution
                $queryRule['value'] = $this->queryParamsValues->firstWhere('query_filter_id', $queryFilter)->term_value;
            }
        }
        return $queryRule;
    }

    private function applyRuleTypeAnd($query, $queryRule) {
        $operator = $queryRule['operator'];

        $queryRule = $this->applyQueryParamValues($queryRule);

        // Tweak the retrieval process for applying the condition, as properties with the flag 'requires translation'
        // Will have their value in the 'value_text' table and not the 'value' table
        $propertyRequiresTranslation = Property::find($queryRule['field'])->requires_translation;

        return $propertyRequiresTranslation ?
            $this->applyRuleTypeAndRequiresTranslationProperty($query, $queryRule, $operator) :
            $this->applyRuleTypeAndNormalProperty($query, $queryRule, $operator);
    }

    private function applyRuleTypeAndNormalProperty($query, $queryRule, $operator) {
        switch ($operator) {
            case 'contains':
                return $query->where([
                    ['property_id', '=', $queryRule['field']],
                    ['value',  'like',  '%'.$queryRule['value'].'%']
                ]);
            case 'in':
                return $query->where(function ($subQuery) use ($queryRule) {
                    $subQuery->where([
                        ['property_id', '=', $queryRule['field']]
                    ])->whereIn('value', $queryRule['value']);
                });
            case 'not in':
                return $query->where(function ($subQuery) use ($queryRule) {
                    $subQuery->where([
                        ['property_id', '=', $queryRule['field']]
                    ])->whereNotIn('value', $queryRule['value']);
                });
            default:
                $booleanProperty = Property::find($queryRule['field'])->value_type === 'bool';
                if ($booleanProperty) {
                    $operators = $queryRule['value'] == 1 ? ['true', '1'] : ['false', '0'];
                    return $query->where(function ($subQuery) use ($operators, $queryRule) {
                        $subQuery->where([
                            ['property_id', '=', $queryRule['field']]
                        ])->whereIn('value', $operators);
                    });
                } else {
                    return $query->where([
                        ['property_id', '=', $queryRule['field']],
                        ['value',  $queryRule['operator'],  $queryRule['value']]
                    ]);
                }
        }
    }

    private function applyRuleTypeAndRequiresTranslationProperty($query, $queryRule, $operator) {
        switch ($operator) {
            case 'contains':
                return $query->where('property_id', '=', $queryRule['field'])
                    ->whereHas('valueText', function ($subQuery) use ($queryRule) {
                        $subQuery->where([
                            ['text',  'like',  '%'.$queryRule['value'].'%']
                        ]);
                    });
            case 'in':
                return $query->where('property_id', '=', $queryRule['field'])
                    ->whereHas('valueText', function ($subQuery) use ($queryRule) {
                        $subQuery->whereIn([
                            ['text', $queryRule['value']]
                        ]);
                    });
            case 'not in':
                return $query->where('property_id', '=', $queryRule['field'])
                    ->whereHas('valueText', function ($subQuery) use ($queryRule) {
                        $subQuery->whereNotIn([
                            ['text', $queryRule['value']]
                        ]);
                    });
            default:
                return $query->where('property_id', '=', $queryRule['field'])
                    ->whereHas('valueText', function ($subQuery) use ($queryRule) {
                        $subQuery->where([
                            ['text', $queryRule['operator'], $queryRule['value']]
                        ]);
                    });
        }
    }

    private function applyRuleTypeOr($query, $queryRule, $firstRule = false) {
        $operator = $queryRule['operator'];

        $queryRule = $this->applyQueryParamValues($queryRule);

        // The first rule of an 'or' Condition must be 'query->where(...)' and the rest of them must be 'query->orWhere(...)'
        if ($firstRule) {
            return $this->applyRuleTypeAnd($query, $queryRule);
        }

        // Tweak the retrieval process for applying the condition, as properties with the flag 'requires translation'
        // Will have their value in the 'value_text' table and not the 'value' table
        $propertyRequiresTranslation = Property::find($queryRule['field'])->requires_translation;

        return $propertyRequiresTranslation ?
            $this->applyRuleTypeOrRequiresTranslationProperty($query, $queryRule, $operator) :
            $this->applyRuleTypeOrNormalProperty($query, $queryRule, $operator);
    }

    private function getQueryFilterParameters() {
        // Get the main query term, which will be a ruleset encompassing all filters/sub-ruleSets
        $mainQueryTerm = QueryHasTerm::where('query_id', $this->queryId)->whereNull('deleted_at')->first()->query_term_id;
        // Get the main query ruleset
        $mainRulesetId = Ruleset::where('query_term_id', $mainQueryTerm)->whereNull('deleted_at')->first()->id;
        // Get the main ruleSet's parameters from its filters and sub-ruleSets
        return $this->getRulesetFilterParameters($mainRulesetId);
    }

    private function getRulesetFilterParameters($rulesetId, $queryParameters = []) {
        // Get all query terms belonging to this ruleSet
        $rulesetTerms = RulesetHasQueryTerm::where('ruleset_id', $rulesetId)->whereNull('deleted_at')->get();
        foreach ($rulesetTerms as $rulesetTerm) {
            $queryTerm = QueryTerm::find($rulesetTerm->query_term_id);
            // If the ruleSet's term is a filter, check if its property is a query parameter
            if ($queryTerm->type === 'filter') {
                $queryFilter = QueryFilter::where('query_term_id', $queryTerm->id)->first();
                $queryParameters[] = $queryFilter->id;
            } else {
                // If the term is a sub-ruleset, search for parameters inside that subRuleSet's terms
                $subRulesetId = Ruleset::where('query_term_id', $queryTerm->id)->first()->id;
                $queryParameters = $this->getRulesetFilterParameters($subRulesetId, $queryParameters);
            }
        }
        return $queryParameters;
    }

    private function applyRuleTypeOrNormalProperty($query, $queryRule, $operator) {
        switch ($operator) {
            case 'contains':
                return $query->orWhere([
                    ['property_id', '=', $queryRule['field']],
                    ['value',  'like',  '%'.$queryRule['value'].'%']
                ]);
            case 'in':
                return $query->orWhere(function ($subQuery) use ($queryRule) {
                    $subQuery->where([
                        ['property_id', '=', $queryRule['field']]
                    ])->whereIn('value', $queryRule['value']);
                });
            case 'not in':
                return $query->orWhere(function ($subQuery) use ($queryRule) {
                    $subQuery->where([
                        ['property_id', '=', $queryRule['field']]
                    ])->whereNotIn('value', $queryRule['value']);
                });
            default:
                $booleanProperty = Property::find($queryRule['field'])->value_type === 'bool';
                if ($booleanProperty) {
                    $operators = $queryRule['value'] == 1 ? ['true', '1'] : ['false', '0'];
                    return $query->orWhere(function ($subQuery) use ($operators, $queryRule) {
                        $subQuery->where([
                            ['property_id', '=', $queryRule['field']]
                        ])->whereIn('value', $operators);
                    });
                } else {
                    return $query->orWhere([
                        ['property_id', '=', $queryRule['field']],
                        ['value',  $queryRule['operator'],  $queryRule['value']]
                    ]);
                }
        }
    }

    private function applyRuleTypeOrRequiresTranslationProperty($query, $queryRule, $operator) {
        switch ($operator) {
            case 'contains':
                return $query->orWhere(function ($orQuery) use ($queryRule) {
                    $orQuery->where('property_id', '=', $queryRule['field'])
                        ->whereHas('valueText', function ($subQuery) use ($queryRule) {
                            $subQuery->where([
                                ['text',  'like',  '%'.$queryRule['value'].'%']
                            ]);
                        });
                });
            case 'in':
                return $query->orWhere(function ($orQuery) use ($queryRule) {
                    $orQuery->where('property_id', '=', $queryRule['field'])
                        ->whereHas('valueText', function ($subQuery) use ($queryRule) {
                            $subQuery->whereIn([
                                ['text', $queryRule['value']]
                            ]);
                        });
                });
            case 'not in':
                return $query->orWhere(function ($orQuery) use ($queryRule) {
                    $orQuery->where('property_id', '=', $queryRule['field'])
                        ->whereHas('valueText', function ($subQuery) use ($queryRule) {
                            $subQuery->whereNotIn([
                                ['text', $queryRule['value']]
                            ]);
                        });
                });
            default:
                return $query->orWhere(function ($orQuery) use ($queryRule) {
                    $orQuery->where('property_id', '=', $queryRule['field'])
                        ->whereHas('valueText', function ($subQuery) use ($queryRule) {
                            $subQuery->where([
                                ['text', $queryRule['operator'], $queryRule['value']]
                            ]);
                        });
                });
        }
    }

    private function organizeQueryResults($mainQuery, $includedProperties, $baseTableEntTypeId, $userLangId) {
        $tableHeader = [];
        $resultRows = [];
        // Get the result's assets to display on the client-side
        foreach ($includedProperties as $entTypeId => $entTypeProperties) {
            $isFromBaseTable = $entTypeId === $baseTableEntTypeId;
            foreach ($entTypeProperties as $includedProperty) {
                // If it's a property from the baseTable, get its name. Ex. 'Contracted Drop-Off Branch'
                // If it isn't, get all the linkedPropertyNames and the includedPropertyName. Ex: 'Contracted Drop-Off Branch: Location'
                $property = Property::find($includedProperty);
                if ($isFromBaseTable) {
                    $propertyName = $this->getPropertyNameForTableHeader($includedProperty, 'baseTable', $userLangId);
                    $tableHeader[] = $propertyName;
                } else {
                    $linkingPropertiesBaseTable = $this->getBaseTableLinkingProps($baseTableEntTypeId, $entTypeId);
                    $propertyNames = $this->getPropertyNameForTableHeader($includedProperty, 'associatedTable', $userLangId, $linkingPropertiesBaseTable);
                    foreach($propertyNames as $propertyName) {
                        $tableHeader[] = $propertyName;
                    }
                }
                foreach ($mainQuery as $entity) {
                    // In case the current property belongs to the baseTableEntType - the mainQuery's result will already have its properties' values
                    // In case the current property doesn't belong to the baseTableEntType - we have to get the propertyValues that will be displayed in the client-side
                    if ($isFromBaseTable) {
                        $resultRows = $this->addPropertyValueToResults($resultRows, $entity, $entity->id, $property, $userLangId);
                    } else {
                        // For each linking includedProp from the baseTable, save the result of the corresponding present property
                        $entityValues = $this->getLinkingPropEntityValues($entity, $entTypeId, $linkingPropertiesBaseTable, $userLangId);
                        foreach($entityValues as $entityValue) {
                            $resultRows = $this->addPropertyValueToResults($resultRows, $entityValue, $entity->id, $property, $userLangId, true);
                        }
                    }
                }
            }
        }
        return ['header' => $tableHeader, 'resultRows' => $resultRows];
    }

    private function getPropertyNameForTableHeader($includedProperty, $type, $userLangId, $linkingPropertiesBaseTable = null) {
        if ($type === 'baseTable') {
            // For the selectedProperty, search the name to be presented in the table Header
            $tableHeader = $this->getMultilingualConceptName('property_name', 'name',
                'property_id', $includedProperty, $userLangId);
        } else {
            $tableHeader = [];
            // For the selectedProperty, search the name to be presented in the table Header
            $selectedPropertyName = $this->getMultilingualConceptName('property_name', 'name',
                'property_id', $includedProperty, $userLangId);
            // Also get the name of its linkingProperties from the base Table
            foreach ($linkingPropertiesBaseTable as $linkingProperty) {
                $linkingPropertyName = $this->getMultilingualConceptName('property_name', 'name',
                    'property_id', $linkingProperty, $userLangId);
                $tableHeader[] = $linkingPropertyName . ': ' . $selectedPropertyName;
            }
        }
        return $tableHeader;
    }

    private function getLinkingPropEntityValues($entity, $entTypeId, $linkingPropertiesBaseTable, $userLangId) {
        $linkingPropertiesEntityValues = [];
        foreach($linkingPropertiesBaseTable as $linkingPropertyBaseTable) {
            // Get the linkingProp's value in the current mainQueryResult's entity (fk value id)
            $linkingPropValue = $this->getPropertyFromEntity($entity, $linkingPropertyBaseTable, $userLangId);
            if (isset($linkingPropValue)) {
                $linkingPropValues = array_column($linkingPropValue, 'value');
                // Check if the linkingProp references a specific property or the entire entity
                // If it specifies the entire entity, it will save the entity's id in the 'value' table
                // If it specifies a specific property, it will have a value's id in the 'value' table
                $propertyReferencesSpecificProp = Property::find($linkingPropertyBaseTable)->fk_property_id;
                // Get the property values of the entity of the referenced property that has the linkingPropValue
                // Ex: Get Car Type->Rental Tariff per day of Rental->Car Type
                $entityValues = Entity::with('values')
                    ->where('ent_type_id', $entTypeId)
                    ->whereHas('values', function($query) use ($propertyReferencesSpecificProp, $linkingPropValues) {
                        $query->when($propertyReferencesSpecificProp, function($subQuery) use ($linkingPropValues) {
                            $subQuery->whereIn('id', $linkingPropValues);
                        }, function($subQuery) use ($linkingPropValues) {
                            $subQuery->whereIn('entity_id', $linkingPropValues);
                        });
                    })->whereNull('deleted_at')->get();
                $linkingPropertiesEntityValues[] = $entityValues;
            } else {
                $linkingPropertiesEntityValues[] = null;
            }
        }
        return $linkingPropertiesEntityValues;
    }

    private function getBaseTableLinkingProps($baseTableEntTypeId, $linkedEntTypeId) {
        return Property::where([
            'value_type' => 'prop_ref',
            'ent_type_id' => $baseTableEntTypeId
        ])->with('fkEntityType')->whereHas('fkEntityType', function($query) use ($linkedEntTypeId) {
            $query->where('id', $linkedEntTypeId);
        })->whereNull('deleted_at')->get()->pluck('id');
    }

    private function getPropertyFromEntity($entity, $propertyId, $userLangId) {
        if(isset($entity['values'])) {
            $propertyValues = [];
            foreach($entity['values'] as $value) {
                if ($value['property_id'] === $propertyId) {
                    // For 'value' records related to properties with the 'requires_translation' flag, get its value from
                    // the 'value text' table, as they only have 'null' on the 'value' table
                    if ($value->property->requires_translation) {
                        $value->value = $this->getMultilingualConceptName('value_text',
                            'text', 'value_id', $value->id, $userLangId);
                    }
                    $propertyValues[] = $value;
                }
            }
            return $propertyValues;
        }
        return null;
    }

    private function getCorrespondingPropertyValue($entityValues, $property, $userLangId, $linkingProperty) {
        $propertyValueRecords = [];
        if (isset($entityValues) && $linkingProperty && count($entityValues) > 1) {
            // If it's a linking 'multiple values' property, and we really have assigned several values to that property
            // We will have several 'related entities' references for the same property. We need to get all values.
            foreach ($entityValues as $entityValue) {
                $propertyValue = $this->getPropertyFromEntity($entityValue, $property->id, $userLangId);
                // In each referenced entity from this property, get the assigned property's value
                // Keep them all in the same array, so we can display it in the same table cell.
                if ($propertyValue) {
                    $propertyValueRecords = array_merge($propertyValueRecords, $propertyValue);
                }
            }
        } else if (isset($entityValues)) {
            // In case we have only assigned one value to the linking 'multiple values' property
            // Or in case it's a 'normal' property, get its value(s) for the current entity
            $propertyValueRecords = $this->getPropertyFromEntity($entityValues, $property->id, $userLangId);
        }

        return  !empty($propertyValueRecords) ?
            $this->resolvePropertyValueWithId($property, $propertyValueRecords, $userLangId) : null;
    }

    private function resolvePropertyValueWithId($property, $propertyValueRecords, $userLangId) {
        if ($property->value_type === 'prop_ref') {
            return array("id" => $propertyValueRecords[0]['value'], "value" => $this->getFormattedPropertyValue($property, $propertyValueRecords, $userLangId));
        } else {
            return array("id" => $propertyValueRecords[0]['id'], "value" => $this->getFormattedPropertyValue($property, $propertyValueRecords, $userLangId));
        }
    }

    private function getFormattedPropertyValue($property, $propertyValueRecords, $userLangId) {
        if (count($propertyValueRecords) > 1) {
            // For 'multiple values' properties, resolve the property's value for each value stored in the DB.
            // Then, join them in the same string, separated by ',' so we can display it in the same table cell.
            $propertyValues = [];
            foreach ($propertyValueRecords as $propertyValueRecord) {
                $propertyValues[] = $this->resolvePropertyValue($property, $propertyValueRecord['value'], $userLangId);
            }
            return implode(', ', $propertyValues);
        } else {
            // For properties with only 1 value, resolve the property's value for the value stored in the DB.
            return $this->resolvePropertyValue($property, $propertyValueRecords[0]['value'], $userLangId);
        }
    }

    private function resolvePropertyValue($property, $propertyValue, $userLangId) {
        if ($property->value_type === 'prop_ref') {
            if ($property->fk_property_id) {
                // If it's a 'prop_ref' property, check if refers to a 'requires_translation' property. If it does, get the
                // corresponding 'value text' record that will correspond to the 'value id' saved in the 'value' table
                $referencedProperty = Property::find($property->fk_property_id);
                if ($referencedProperty->requires_translation) {
                    $resolvedPropertyValue = $this->getMultilingualConceptName('value_text', 'text',
                        'value_id', $propertyValue, $userLangId);
                } else  {
                    $resolvedPropertyValue = Value::find($propertyValue)->value;
                }
            } else {
                // If it's a 'prop_ref' property without a 'fkProperty', it means it's referring to the overall 'fk entity type'.
                // In this case, get the internal id of the entity with its id saved in the 'value' table
                $resolvedPropertyValue = Entity::find($propertyValue)->internal_id;
            }
        } else if ($property->value_type === 'enum') {
            // If it's an 'enum' property, get the corresponding 'prop allowed value name' record
            // That will correspond to the 'prop allowed value id' saved in the 'value' table
            $resolvedPropertyValue =  $this->getMultilingualConceptName('prop_allowed_value_name', 'name',
                'p_a_v_id', $propertyValue, $userLangId);
        } else if ($property->value_type === 'bool') {
            $value = filter_var($propertyValue, FILTER_VALIDATE_BOOLEAN) ? 'Yes' : 'No';
            if ($userLangId != 2) {
                $value = filter_var($propertyValue, FILTER_VALIDATE_BOOLEAN) ? 'Sim' : 'Não';
            }
            $resolvedPropertyValue = $value;
        } else {
            // Otherwise, the value in the 'value' table is the correct value we want to display to the user
            $resolvedPropertyValue = $propertyValue;
        }
        // On all cases, return the resolved property value
        return  $resolvedPropertyValue;
    }

    private function addPropertyValueToResults($resultRows, $entityValues, $entityId, $property, $userLangId, $linkingProperty = false) {
        // For each entity that obeys all the query rules specified, get the values for the present includedProperty
        $propertyValue = $this->getCorrespondingPropertyValue($entityValues, $property, $userLangId, $linkingProperty);
        // Save the value of the includedProperty in the current entity being iterated in the results array
        // If it's the first time we're saving a propertyValue of an entity, initialize the corresponding entity results array
        if (!isset($resultRows[$entityId])) {
            $resultRows[$entityId] = [];
        }
        $resultRows[$entityId][] = $propertyValue;
        return $resultRows;
    }

    private function transformQueryResultsForDisplay($queryResult) {
        // When it's just to display the query results, we do not need the individual value id's for the tables.
        foreach ($queryResult["resultRows"] as $key => $resultRow) {
            $transformedRow = [];
            foreach($resultRow as $resultValue) {
                if (isset($resultValue['value'])) {
                    $transformedRow[] = $resultValue['value'];
                } else {
                    $transformedRow[] = '---';
                }
            }
            $queryResult["resultRows"][$key] = $transformedRow;
        }
        return $queryResult;
    }

    //------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------
    //------------------------------- MONGODB --------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------

    public function saveQueryMongoDB($data)
    {
        // FILTERS
        $mainRule = json_decode(json_encode($data[3]), FALSE);
        $rules = $mainRule->rules;
        if($rules == []){ return []; }
        $layers = $this->create_layers($mainRule);
        $actual_layer = 0;
        $bbb = [];

        foreach($layers as $layer) {
            $results_ids_filters = [];
            $previous_layer = $actual_layer - 1;

            foreach($layer as $rule) {
                if(property_exists($rule, 'field')){
                    if(empty($rule->value)){ $rule->value = ''; }
                    // -- table query_term
                    $queryTermId = DB::connection('mongodb')->table('query_term')->insertGetId(['type' => 'filter']);
                    // -- table query_filter
                    //*********************
                    $isParameter = 0;
                    /*for ($i = 0; $i < count($param); $i++) {
                        if (in_array($rule->field, $param[$i])) {
                            $isParameter = 1;
                        }
                    }*/
                    //*********************
                    DB::connection('mongodb')->table('query_filter')->insert(
                        ['query_term_id' => $queryTermId, 'property_id' => $rule->field, 'operator' => $rule->operator, 'value' => $rule->value, 'isparameter' => $isParameter]
                    );
                    $results_ids_filters[] = $queryTermId;
                }else{
                    // -- table query_term
                    $queryTermId = DB::connection('mongodb')->table('query_term')->insertGetId(['type' => 'ruleset']);
                    // -- table ruleset
                    $results_ids_filters[] = $queryTermId;
                    $queryTerms = [];
                    for ($i = 0; $i < count($rule->rules); $i++) {
                        $queryTerms[] = $bbb[$previous_layer][0];
                        array_splice($bbb[$previous_layer], 0, 1);
                    }
                    DB::connection('mongodb')->table('ruleset')->insert(['query_term_id' => $queryTermId, 'type' => $rule->condition, 'query_terms' => $queryTerms]);
                }
            }
            $bbb[] = $results_ids_filters;
            $actual_layer++;
        }

        // ** MAIN RULESET **
        // -- table query_term
        $queryTermId = DB::connection('mongodb')->table('query_term')->insertGetId(['type' => 'ruleset']);

        // table ruleset
        $queryTerms = [];
        for ($i = 0; $i < count($rules); $i++) {
            $queryTerms[] = $bbb[$actual_layer - 1][$i];
        }

        DB::connection('mongodb')->table('ruleset')->insert(['query_term_id' => $queryTermId, 'type' => $mainRule->condition, 'query_terms' => $queryTerms]);

        DB::connection('mongodb')->table('query')->insert([
            'base_ent_type_id' => $data[0],
            'name' => json_encode($data[3]),
            'firststep' => json_encode($data[1]),
            'properties' => json_encode($data[2]),
            'fields' => json_encode($data[4]),
            'results' => $data[2][1],
            'query_term_id' => $queryTermId,
            'created_at' => date('y-m-d H:i:s'),
            'updated_at' => date('y-m-d H:i:s')
        ]);
        return 0;
    }

    public function getEntTypesWithPropertiesMongoDB(Request $request): array
    {
        $langId = $request->user()->language_id;
        $entTypes = DB::connection('mongodb')->table('ent_type')->get()->toArray();
        $aux = [];
        foreach ($entTypes as $entType) {
            $properties = [];
            $name = '';
            foreach ($entType['names'] as $entName) {
                if ($entName['language_id'] == $langId){
                    $name = $entName['name'];
                }
            }
            $allProperties = DB::connection('mongodb')->table('property')->where([['ent_type_id', '=', $entType['_id']]])->get()->toArray();
            foreach ($allProperties as $property) {
                $nameProp = '';
                foreach ($property['names'] as $p) {
                    if ($p['language_id'] == $langId){
                        $nameProp = $p['name'];
                    }
                }
                $fk_property = "NULL";
                if ($property['fk_property_id'] != "NULL") {
                    $fk_property_aux = DB::connection('mongodb')->table('property')->where([['_id', '=', $property['fk_property_id']]])->get();
                    $ent_type_name = DB::connection('mongodb')->table('ent_type')->where([['_id', '=', $fk_property_aux[0]['ent_type_id']]])->get();
                    $name1 = '';
                    foreach ($ent_type_name[0]['names'] as $e) {
                        if ($e['language_id'] == $langId){
                            $name1 = $e['name'];
                        }
                    }
                    $obj1 = array('ent_type_id' => $name1);
                    //$fk_property = $fk_property_aux[0];
                    $fk_property = $obj1;
                }
                $obj = array(
                    'ent_type_id' => $property['ent_type_id'],
                    'fk_property' => $fk_property,
                    'fk_property_id' => $property['fk_property_id'],
                    'id' => $property['_id'],
                    'name' => $nameProp,
                    'value_type' => $property['value_type']
                );
                $properties[] = $obj;
            }
            $obj = array('id' => $name, 'name' => $name, 'properties' => $properties);
            $aux[] = $obj;
        }
        return $aux;
    }
}
