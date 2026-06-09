<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\RolesApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\WritableRole;
use Response;

class RoleEdmsController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $roleEdmsAPI = new RolesApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $roleEdmsAPI->rolesList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($roleEdms) {
            return $roleEdms->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $roleEdmsAPI = new RolesApi(null, $config, null, 0);

        $newRoleEdms = new WritableRole();
        $newRoleEdms->setGroupsPkList($request->input("groups_pk_list"));
        $newRoleEdms->setLabel($request->input("label"));
        $newRoleEdms->setPermissionsPkList($request->input("permissions_pk_list"));

        //Check and call EDMS API
        if (!$newRoleEdms->valid())
            return response()->json($newRoleEdms->listInvalidProperties(), 500);
        else $responseEDMS = $roleEdmsAPI->rolesCreate($newRoleEdms);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $roleEdmsAPI = new RolesApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $roleEdmsAPI->rolesRead($id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $roleEdmsAPI = new RolesApi(null, $config, null, 0);

        $updatedRoleEdms = new WritableRole();
        $updatedRoleEdms->setGroupsPkList($request->input("groups_pk_list"));
        $updatedRoleEdms->setLabel($request->input("label"));
        $updatedRoleEdms->setPermissionsPkList($request->input("permissions_pk_list"));

        //Check and call EDMS API
        if (!$updatedRoleEdms->valid())
            return response()->json($updatedRoleEdms->listInvalidProperties(), 500);
        else $responseEDMS = $roleEdmsAPI->rolesUpdate($id, $updatedRoleEdms);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $roleEdmsAPI = new RolesApi(null, $config, null, 0);

        //Call EDMS API
        $roleEdmsAPI->rolesDelete($id);

        return Response::json(null, 200);

    }

}
