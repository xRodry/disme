<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\ObjectsApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\WritableAccessControlListPermission;
use Response;
use function collect;
use function response;


class ObjectAclPermissionController extends Controller
{

    public function index($app_label, $model_name, $object_id, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $objectAclPermissionsAPI = new ObjectsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $objectAclPermissionsAPI->objectsAclsPermissionsList($app_label, $model_name, $object_id, $id);

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($objectAclPermission) {
            return $objectAclPermission->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request, $app_label, $model_name, $object_id, $id)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $objectAclPermissionsAPI = new ObjectsApi(null, $config, null, 0);

        $newObjectAclPermission = new WritableAccessControlListPermission();
        $newObjectAclPermission->setPermissionPk($request->input("permission_pk"));

        //Check and call EDMS API
        if (!$newObjectAclPermission->valid())
            return response()->json($newObjectAclPermission->listInvalidProperties(), 500);
        else $responseEDMS = $objectAclPermissionsAPI->objectsAclsPermissionsCreate($app_label, $model_name, $object_id, $id, $newObjectAclPermission);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($app_label, $model_name, $object_id, $id, $permission_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");

        $objectAclPermissionsAPI = new ObjectsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $objectAclPermissionsAPI->objectsAclsPermissionsRead($app_label, $model_name, $object_id, $id, $permission_pk);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

/*    public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
$config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $objectAclPermissionsAPI = new ObjectAclPermissionsApi(null, $config, null, 0);

        $updatedObjectAclPermission = new WritableObjectAclPermission();
        $updatedObjectAclPermission->setDeleteTimePeriod($request->input("delete_time_period"));
        $updatedObjectAclPermission->setDeleteTimeUnit($request->input("delete_time_unit"));
        $updatedObjectAclPermission->setLabel($request->input("label"));
        $updatedObjectAclPermission->setTrashTimePeriod($request->input("trash_time_period"));
        $updatedObjectAclPermission->setTrashTimeUnit($request->input("trash_time_unit"));

        //Check and call EDMS API
        if (!$updatedObjectAclPermission->valid())
            return response()->json($updatedObjectAclPermission->listInvalidProperties(), 500);
        else $responseEDMS = $objectAclPermissionsAPI->objectAclPermissionsUpdate($id, $updatedObjectAclPermission);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }*/

    public function destroy($app_label, $model_name, $object_id, $id, $permission_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $objectAclPermissionsAPI = new ObjectsApi(null, $config, null, 0);

        //Call EDMS API
        $objectAclPermissionsAPI->objectsAclsPermissionsDelete($app_label, $model_name, $object_id, $id, $permission_pk);

        return Response::json(null, 200);

    }

}
