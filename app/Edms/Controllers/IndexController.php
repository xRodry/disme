<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\IndexesApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\Index;
use App\Edms\OpenAPI\Client\Models\IndexInstanceNode;
use Response;
use function collect;
use function response;


class IndexController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $indexesAPI = new IndexesApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $indexesAPI->indexesList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($index) {
            return $index->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $indexesAPI = new IndexesApi(null, $config, null, 0);

        $newIndex = new Index();
        $newIndex->setDocumentTypes($request->input("document_types"));
        $newIndex->setEnabled($request->input("enabled"));

        $indexInstanceNode = new IndexInstanceNode();
        $indexInstanceNode->setParent($request->input("instance_root.parent"));
        $indexInstanceNode->setValue($request->input("instance_root.value"));
        $newIndex->setInstanceRoot($indexInstanceNode);

        $newIndex->setLabel($request->input("label"));

        //Check and call EDMS API
        if (!$newIndex->valid())
            return response()->json($newIndex->listInvalidProperties(), 500);
        else $responseEDMS = $indexesAPI->indexesCreate($newIndex);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $indexesAPI = new IndexesApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $indexesAPI->indexesRead($id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $indexesAPI = new IndexesApi(null, $config, null, 0);

        $updatedIndex = new Index();
        $updatedIndex->setDocumentTypes($request->input("document_types"));
        $updatedIndex->setEnabled($request->input("enabled"));

        $indexInstanceNode = new IndexInstanceNode();
        $indexInstanceNode->setParent($request->input("instance_root.parent"));
        $indexInstanceNode->setValue($request->input("instance_root.value"));
        $updatedIndex->setInstanceRoot($indexInstanceNode);

        $updatedIndex->setLabel($request->input("label"));

        //Check and call EDMS API
        if (!$updatedIndex->valid())
            return response()->json($updatedIndex->listInvalidProperties(), 500);
        else $responseEDMS = $indexesAPI->indexesUpdate($id, $updatedIndex);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $indexesAPI = new IndexesApi(null, $config, null, 0);

        //Call EDMS API
        $indexesAPI->indexesDelete($id);

        return Response::json(null, 200);

    }

}
