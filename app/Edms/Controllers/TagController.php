<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\TagsApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\WritableTag;
use Response;
use function collect;
use function response;


class TagController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $tagsAPI = new TagsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $tagsAPI->tagsList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($tag) {
            return $tag->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $tagsAPI = new TagsApi(null, $config, null, 0);

        $newTag = new WritableTag();
        $newTag->setColor($request->input("color"));
        $newTag->setDocumentsPkList($request->input("documents_pk_list"));
        $newTag->setLabel($request->input("label"));

        //Check and call EDMS API
        if (!$newTag->valid())
            return response()->json($newTag->listInvalidProperties(), 500);
        else $responseEDMS = $tagsAPI->tagsCreate($newTag);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $TagsAPI = new TagsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $TagsAPI->tagsRead($id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $tagsAPI = new TagsApi(null, $config, null, 0);

        $updatedTag = new WritableTag();
        $updatedTag->setColor($request->input("color"));
        $updatedTag->setDocumentsPkList($request->input("documents_pk_list"));
        $updatedTag->setLabel($request->input("label"));

        //Check and call EDMS API
        if (!$updatedTag->valid())
            return response()->json($updatedTag->listInvalidProperties(), 500);
        else $responseEDMS = $tagsAPI->tagsUpdate($id, $updatedTag);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $tagsAPI = new TagsApi(null, $config, null, 0);

        //Call EDMS API
        $tagsAPI->tagsDelete($id);

        return Response::json(null, 200);

    }

}
