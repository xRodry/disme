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
use App\Edms\OpenAPI\Client\Models\NewDocumentVersion;
use App\Edms\OpenAPI\Client\Models\WritableDocumentVersion;
use Response;
use function collect;
use function response;


class DocumentVersionController extends Controller
{

    public function index($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentVersionsAPI = new DocumentsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $documentVersionsAPI->documentsVersionsList($id);

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($documentVersion) {
            return $documentVersion->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request, $id)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentVersionsAPI = new DocumentsApi(null, $config, null, 0);

        $newDocumentVersion = new NewDocumentVersion();
        $newDocumentVersion->setComment($request->input("comment"));

        //Check and call EDMS API
        if (!$newDocumentVersion->valid())
            return response()->json($newDocumentVersion->listInvalidProperties(), 500);
        else $responseEDMS = $documentVersionsAPI->documentsVersionsCreate($id, $newDocumentVersion);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id, $version_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $DocumentVersionsAPI = new DocumentsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $DocumentVersionsAPI->documentsVersionsRead($id, $version_pk);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id, $version_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentVersionsAPI = new DocumentsApi(null, $config, null, 0);

        $updatedDocumentVersion = new WritableDocumentVersion();
        $updatedDocumentVersion->setComment($request->input("comment"));

        //Check and call EDMS API
        if (!$updatedDocumentVersion->valid())
            return response()->json($updatedDocumentVersion->listInvalidProperties(), 500);
        else $responseEDMS = $documentVersionsAPI->documentsVersionsUpdate($id, $version_pk, $updatedDocumentVersion);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id, $version_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentVersionsAPI = new DocumentsApi(null, $config, null, 0);

        //Call EDMS API
        $documentVersionsAPI->documentsVersionsDelete($id, $version_pk);

        return Response::json(null, 200);

    }

}
