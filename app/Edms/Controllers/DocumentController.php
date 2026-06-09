<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use App\Edms\OpenAPI\Client\Models\WritableDocument;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\DocumentsApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\NewDocument;
use Response;
use function collect;
use function response;


class DocumentController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentsAPI = new DocumentsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $documentsAPI->documentsList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($document) {
            return $document->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token e397ba76d4e9af17b10ad5332d225a8fb5f4cae9");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentsAPI = new DocumentsApi(null, $config, null, 0);

        $newDocument = new NewDocument();
        $newDocument->setDescription($request->input("description"));
        $newDocument->setDocumentType($request->input("documentType"));
        $newDocument->setLabel($request->input("label"));
        $newDocument->setLanguage($request->input("language"));

        //Check and call EDMS API
        if (!$newDocument->valid())
            return response()->json($newDocument->listInvalidProperties(), 500);
        else $responseEDMS = $documentsAPI->documentsCreate($newDocument);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $DocumentsAPI = new DocumentsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $DocumentsAPI->documentsRead($id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentsAPI = new DocumentsApi(null, $config, null, 0);

        $updatedDocument = new WritableDocument();
        $updatedDocument->setDescription($request->input("description"));
        $updatedDocument->setLabel($request->input("label"));
        $updatedDocument->setLanguage($request->input("language"));

        //Check and call EDMS API
        if (!$updatedDocument->valid())
            return response()->json($updatedDocument->listInvalidProperties(), 500);
        else $responseEDMS = $documentsAPI->documentsUpdate($id, $updatedDocument);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentsAPI = new DocumentsApi(null, $config, null, 0);

        //Call EDMS API
        $documentsAPI->documentsDelete($id);

        return Response::json(null, 200);

    }

}
