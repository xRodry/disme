<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\MetadataTypesApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\MetadataType;
use Response;
use function collect;
use function response;


class MetadataTypeController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $metadataTypesAPI = new MetadataTypesApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $metadataTypesAPI->metadataTypesList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($metadataType) {
            return $metadataType->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $metadataTypesAPI = new MetadataTypesApi(null, $config, null, 0);

        $newMetadataType = new MetadataType();
        $newMetadataType->setDefault($request->input("default"));
        $newMetadataType->setLabel($request->input("label"));
        $newMetadataType->setLookup($request->input("lookup"));
        $newMetadataType->setName($request->input("name"));
        $newMetadataType->setParser($request->input("parser"));
        $newMetadataType->setValidation($request->input("validation"));

        //Check and call EDMS API
        if (!$newMetadataType->valid())
            return response()->json($newMetadataType->listInvalidProperties(), 500);
        else $responseEDMS = $metadataTypesAPI->metadataTypesCreate($newMetadataType);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($metadata_type_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $MetadataTypesAPI = new MetadataTypesApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $MetadataTypesAPI->metadataTypesRead($metadata_type_pk);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $metadata_type_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $metadataTypesAPI = new MetadataTypesApi(null, $config, null, 0);

        $updatedMetadataType = new MetadataType();
        $updatedMetadataType->setDefault($request->input("default"));
        $updatedMetadataType->setLabel($request->input("label"));
        $updatedMetadataType->setLookup($request->input("lookup"));
        $updatedMetadataType->setName($request->input("name"));
        $updatedMetadataType->setParser($request->input("parser"));
        $updatedMetadataType->setValidation($request->input("validation"));

        //Check and call EDMS API
        if (!$updatedMetadataType->valid())
            return response()->json($updatedMetadataType->listInvalidProperties(), 500);
        else $responseEDMS = $metadataTypesAPI->metadataTypesUpdate($metadata_type_pk, $updatedMetadataType);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($metadata_type_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $metadataTypesAPI = new MetadataTypesApi(null, $config, null, 0);

        //Call EDMS API
        $metadataTypesAPI->metadataTypesDelete($metadata_type_pk);

        return Response::json(null, 200);

    }

}
