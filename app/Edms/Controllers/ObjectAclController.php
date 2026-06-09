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
use App\Edms\OpenAPI\Client\Models\WritableAccessControlList;
use App\Edms\OpenAPI\Client\Models\ContentType;
use Response;
use function collect;
use function response;


class ObjectAclController extends Controller
{

    public function index($app_label, $model_name, $object_id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $objectAclsAPI = new ObjectsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $objectAclsAPI->objectsAclsList($app_label, $model_name, $object_id);

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($objectAcl) {
            return $objectAcl->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request, $app_label, $model_name, $object_id)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $objectAclsAPI = new ObjectsApi(null, $config, null, 0);

        $newObjectAcl = new WritableAccessControlList();
        $newObjectAcl->setPermissionsPkList($request->input("permissions_pk_list"));
        $newObjectAcl->setRolePk($request->input("role_pk"));

        $contentType = new ContentType();
        $contentType->setAppLabel($request->input("content_type.app_label"));
        $contentType->setModel($request->input("content_type.model"));
        $newObjectAcl->setContentType($contentType);

        //Check and call EDMS API
        if (!$newObjectAcl->valid())
            return response()->json($newObjectAcl->listInvalidProperties(), 500);
        else $responseEDMS = $objectAclsAPI->objectsAclsCreate($app_label, $model_name, $object_id, $newObjectAcl);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($app_label, $model_name, $object_id, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $ObjectAclsAPI = new ObjectsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $ObjectAclsAPI->objectsAclsRead($app_label, $model_name, $object_id, $id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    /*public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
    $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $objectAclsAPI = new ObjectAclsApi(null, $config, null, 0);

        $updatedObjectAcl = new WritableObjectAcl();
        $updatedObjectAcl->setDeleteTimePeriod($request->input("delete_time_period"));
        $updatedObjectAcl->setDeleteTimeUnit($request->input("delete_time_unit"));
        $updatedObjectAcl->setLabel($request->input("label"));
        $updatedObjectAcl->setTrashTimePeriod($request->input("trash_time_period"));
        $updatedObjectAcl->setTrashTimeUnit($request->input("trash_time_unit"));

        //Check and call EDMS API
        if (!$updatedObjectAcl->valid())
            return response()->json($updatedObjectAcl->listInvalidProperties(), 500);
        else $responseEDMS = $objectAclsAPI->objectAclsUpdate($id, $updatedObjectAcl);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }*/

    public function destroy($app_label, $model_name, $object_id, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $objectAclsAPI = new ObjectsApi(null, $config, null, 0);

        //Call EDMS API
        $objectAclsAPI->objectsAclsDelete($app_label, $model_name, $object_id, $id);

        return Response::json(null, 200);

    }

}
