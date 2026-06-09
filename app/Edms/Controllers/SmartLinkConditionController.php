<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\SmartLinksApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\SmartLinkCondition;
use Response;

class SmartLinkConditionController extends Controller
{

    public function index($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");

        $smartLinkConditionsAPI = new SmartLinksApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $smartLinkConditionsAPI->smartLinksConditionsList($id);

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($smartLinkCondition) {
            return $smartLinkCondition->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request, $id)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $smartLinkConditionsAPI = new SmartLinksApi(null, $config, null, 0);

        $newSmartLinkCondition = new SmartLinkCondition();
        $newSmartLinkCondition->setEnabled($request->input("enabled"));
        $newSmartLinkCondition->setExpression($request->input("expression"));
        $newSmartLinkCondition->setForeignDocumentData($request->input("foreign_document_data"));
        $newSmartLinkCondition->setInclusion($request->input("inclusion"));
        $newSmartLinkCondition->setNegated($request->input("negated"));
        $newSmartLinkCondition->setOperator($request->input("operator"));

        //Check and call EDMS API
        if (!$newSmartLinkCondition->valid())
            return response()->json($newSmartLinkCondition->listInvalidProperties(), 500);
        else $responseEDMS = $smartLinkConditionsAPI->smartLinksConditionsCreate($id, $newSmartLinkCondition);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id, $condition_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $SmartLinkConditionsAPI = new SmartLinksApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $SmartLinkConditionsAPI->smartLinksConditionsRead($id, $condition_pk);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id, $condition_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $smartLinkConditionsAPI = new SmartLinksApi(null, $config, null, 0);

        $updatedSmartLinkCondition = new SmartLinkCondition();
        $updatedSmartLinkCondition->setEnabled($request->input("enabled"));
        $updatedSmartLinkCondition->setExpression($request->input("expression"));
        $updatedSmartLinkCondition->setForeignDocumentData($request->input("foreign_document_data"));
        $updatedSmartLinkCondition->setInclusion($request->input("inclusion"));
        $updatedSmartLinkCondition->setNegated($request->input("negated"));
        $updatedSmartLinkCondition->setOperator($request->input("operator"));
        $updatedSmartLinkCondition->setSmartLinkUrl($request->input("smart_link_url"));
        $updatedSmartLinkCondition->setUrl($request->input("url"));

        //Check and call EDMS API
        if (!$updatedSmartLinkCondition->valid())
            return response()->json($updatedSmartLinkCondition->listInvalidProperties(), 500);
        else $responseEDMS = $smartLinkConditionsAPI->smartLinksConditionsUpdate($id, $condition_pk, $updatedSmartLinkCondition);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id, $condition_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $smartLinkConditionsAPI = new SmartLinksApi(null, $config, null, 0);

        //Call EDMS API
        $smartLinkConditionsAPI->smartLinksConditionsDelete($id, $condition_pk);

        return Response::json(null, 200);

    }

}
