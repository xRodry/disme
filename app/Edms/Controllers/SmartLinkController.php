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
use App\Edms\OpenAPI\Client\Models\WritableSmartLink;
use Response;
use function collect;
use function response;


class SmartLinkController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $smartLinksAPI = new SmartLinksApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $smartLinksAPI->smartLinksList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($smartLink) {
            return $smartLink->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $smartLinksAPI = new SmartLinksApi(null, $config, null, 0);

        $newSmartLink = new WritableSmartLink();
        $newSmartLink->setDocumentTypesPkList($request->input("document_types_pk_list"));
        $newSmartLink->setDynamicLabel($request->input("dynamic_label"));
        $newSmartLink->setLabel($request->input("label"));
        $newSmartLink->setEnabled($request->input("enabled"));

        //Check and call EDMS API
        if (!$newSmartLink->valid())
            return response()->json($newSmartLink->listInvalidProperties(), 500);
        else $responseEDMS = $smartLinksAPI->smartLinksCreate($newSmartLink);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $smartLinksAPI = new SmartLinksApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $smartLinksAPI->smartLinksRead($id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $smartLinksAPI = new SmartLinksApi(null, $config, null, 0);

        $updatedSmartLink = new WritableSmartLink();
        $updatedSmartLink->setDocumentTypesPkList($request->input("document_types_pk_list"));
        $updatedSmartLink->setDynamicLabel($request->input("dynamic_label"));
        $updatedSmartLink->setLabel($request->input("label"));
        $updatedSmartLink->setEnabled($request->input("enabled"));

        //Check and call EDMS API
        if (!$updatedSmartLink->valid())
            return response()->json($updatedSmartLink->listInvalidProperties(), 500);
        else $responseEDMS = $smartLinksAPI->smartLinksUpdate($id, $updatedSmartLink);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $smartLinksAPI = new SmartLinksApi(null, $config, null, 0);

        //Call EDMS API
        $smartLinksAPI->smartLinksDelete($id);

        return Response::json(null, 200);

    }

}
