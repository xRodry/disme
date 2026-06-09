<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\DocumentsApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\NewDocumentMetadata;
use App\Edms\OpenAPI\Client\Models\DocumentMetadata;
use App\Edms\OpenAPI\Client\Models\Document;
use Response;

class DocumentMetadataController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentMetadataAPI = new DocumentsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $documentMetadataAPI->documentsMetadataList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($documentMetadata) {
            return $documentMetadata->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request, $document_pk)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentMetadataAPI = new DocumentsApi(null, $config, null, 0);

        $newDocumentMetadata = new NewDocumentMetadata();
        $newDocumentMetadata->setMetadataTypePk($request->input("metadata_type_pk"));
        $newDocumentMetadata->setValue($request->input("value"));

        //Check and call EDMS API
        if (!$newDocumentMetadata->valid())
            return response()->json($newDocumentMetadata->listInvalidProperties(), 500);
        else $responseEDMS = $documentMetadataAPI->documentsMetadataCreate($document_pk, $newDocumentMetadata);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($document_pk, $metadata_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $DocumentMetadataAPI = new DocumentsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $DocumentMetadataAPI->documentsMetadataRead($document_pk, $metadata_pk);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $document_pk, $metadata_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentMetadataAPI = new DocumentsApi(null, $config, null, 0);

        $updatedDocumentMetadata = new DocumentMetadata();
        $updatedDocumentMetadata->setValue($request->input("delete_time_period"));
        $doc = new Document();
        $doc->setLabel($request->input("document.label"));
        $doc->setDescription($request->input("document.description"));
        $doc->setLanguage($request->input("document.language"));
        $updatedDocumentMetadata->setDocument($request->input("delete_time_unit"));


        //Check and call EDMS API
        if (!$updatedDocumentMetadata->valid())
            return response()->json($updatedDocumentMetadata->listInvalidProperties(), 500);
        else $responseEDMS = $documentMetadataAPI->documentsMetadataUpdate($document_pk, $metadata_pk, $updatedDocumentMetadata);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $documentMetadataAPI = new DocumentsApi(null, $config, null, 0);

        //Call EDMS API
        $documentMetadataAPI->documentsMetadataDelete($id);

        return Response::json(null, 200);

    }

}
