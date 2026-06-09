<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\GroupsApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\Group;
use Response;
use function collect;
use function response;


class GroupController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $groupsAPI = new GroupsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $groupsAPI->groupsList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($group) {
            return $group->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $groupsAPI = new GroupsApi(null, $config, null, 0);

        $newGroup = new Group();
        $newGroup->setName($request->input("name"));

        //Check and call EDMS API
        if (!$newGroup->valid())
            return response()->json($newGroup->listInvalidProperties(), 500);
        else $responseEDMS = $groupsAPI->groupsCreate($newGroup);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $GroupsAPI = new GroupsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $GroupsAPI->groupsRead($id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $groupsAPI = new GroupsApi(null, $config, null, 0);

        $updatedGroup = new Group();
        $updatedGroup->setName($request->input("name"));

        //Check and call EDMS API
        if (!$updatedGroup->valid())
            return response()->json($updatedGroup->listInvalidProperties(), 500);
        else $responseEDMS = $groupsAPI->groupsUpdate($id, $updatedGroup);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $groupsAPI = new GroupsApi(null, $config, null, 0);

        //Call EDMS API
        $groupsAPI->groupsDelete($id);

        return Response::json(null, 200);

    }

}
