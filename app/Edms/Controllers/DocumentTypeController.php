<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\DocumentTypesApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\WritableDocumentType;
use Response;
use function collect;
use function response;


class DocumentTypeController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token e397ba76d4e9af17b10ad5332d225a8fb5f4cae9");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentTypesAPI = new DocumentTypesApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $documentTypesAPI->documentTypesList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($documentType) {
            return $documentType->jsonSerialize();
        });

        return Response::json($results,200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token e397ba76d4e9af17b10ad5332d225a8fb5f4cae9");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentTypesAPI = new DocumentTypesApi(null, $config, null, 0);

        $newDocType = new WritableDocumentType();
        $newDocType->setDeleteTimePeriod($request->input('delete_time_period'));
        $newDocType->setDeleteTimeUnit($request->input('delete_time_unit'));
        $newDocType->setLabel($request->input('label'));
        $newDocType->setTrashTimePeriod($request->input('trash_time_period'));
        $newDocType->setTrashTimeUnit($request->input('trash_time_unit'));

        //Check and call EDMS API
        if(!$newDocType->valid())
            //throw new Exception($newDocType->listInvalidProperties());
            return response()->json($newDocType->listInvalidProperties(), 500);
        else $responseEDMS = $documentTypesAPI->documentTypesCreate($newDocType);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token e397ba76d4e9af17b10ad5332d225a8fb5f4cae9");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentTypesAPI = new DocumentTypesApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $documentTypesAPI->documentTypesRead($id);

        return Response::json($responseEDMS->jsonSerialize(),200);

    }

    public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token e397ba76d4e9af17b10ad5332d225a8fb5f4cae9");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentTypesAPI = new DocumentTypesApi(null, $config, null, 0);

        $updatedDocType = new WritableDocumentType();
        $updatedDocType->setDeleteTimePeriod($request->input('delete_time_period'));
        $updatedDocType->setDeleteTimeUnit($request->input('delete_time_unit'));
        $updatedDocType->setLabel($request->input('label'));
        $updatedDocType->setTrashTimePeriod($request->input('trash_time_period'));
        $updatedDocType->setTrashTimeUnit($request->input('trash_time_unit'));

        //Call EDMS API
        //$responseEDMS = $documentTypesAPI->documentTypesUpdate($id, $updatedDocType);

        //Check and call EDMS API
        if(!$updatedDocType->valid())
            //throw new Exception($newDocType->listInvalidProperties());
            return response()->json($updatedDocType->listInvalidProperties(), 500);
        else $responseEDMS = $documentTypesAPI->documentTypesUpdate($id, $updatedDocType);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token e397ba76d4e9af17b10ad5332d225a8fb5f4cae9");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentTypesAPI = new DocumentTypesApi(null, $config, null, 0);

        //Call EDMS API
        $documentTypesAPI->documentTypesDelete($id);

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        /*$results = collect($responseEDMS->getResults())->map(function ($documentType) {
            return $documentType->jsonSerialize();
        });*/

        return Response::json(null,200);

    }

}
