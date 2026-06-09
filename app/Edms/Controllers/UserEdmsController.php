<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\UsersApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\User;
use Response;
use function collect;
use function response;


class UserEdmsController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $usersEdmsAPI = new UsersApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $usersEdmsAPI->usersList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($userEdms) {
            return $userEdms->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $usersEdmsAPI = new UsersApi(null, $config, null, 0);

        $newUserEdms = new User();
        $newUserEdms->setFirstName($request->input("first_name"));
        $newUserEdms->setEmail($request->input("email"));
        $newUserEdms->setGroupsPkList($request->input("groups_pk_list"));
        $newUserEdms->setLastName($request->input("last_name"));
        $newUserEdms->setPassword($request->input("password"));
        $newUserEdms->setUsername($request->input("username"));

        //Check and call EDMS API
        if (!$newUserEdms->valid())
            return response()->json($newUserEdms->listInvalidProperties(), 500);
        else $responseEDMS = $usersEdmsAPI->usersCreate($newUserEdms);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $UsersEdmsAPI = new UsersApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $UsersEdmsAPI->usersRead($id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $usersEdmsAPI = new UsersApi(null, $config, null, 0);

        $updatedUserEdms = new User();
        $updatedUserEdms->setFirstName($request->input("first_name"));
        $updatedUserEdms->setEmail($request->input("email"));
        $updatedUserEdms->setGroupsPkList($request->input("groups_pk_list"));
        $updatedUserEdms->setLastName($request->input("last_name"));
        $updatedUserEdms->setPassword($request->input("password"));
        $updatedUserEdms->setUsername($request->input("username"));

        //Check and call EDMS API
        if (!$updatedUserEdms->valid())
            return response()->json($updatedUserEdms->listInvalidProperties(), 500);
        else $responseEDMS = $usersEdmsAPI->usersUpdate($id, $updatedUserEdms);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $usersEdmsAPI = new UsersApi(null, $config, null, 0);

        //Call EDMS API
        $usersEdmsAPI->usersDelete($id);

        return Response::json(null, 200);

    }

}
