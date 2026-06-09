<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\MessagesApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\Message;
use Response;
use function collect;
use function response;

class MessageController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $messagesAPI = new MessagesApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $messagesAPI->messagesList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($message) {
            return $message->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $messagesAPI = new MessagesApi(null, $config, null, 0);

        $newMessage = new Message();
        $newMessage->setEndDatetime($request->input("end_datetime"));
        $newMessage->setEnabled($request->input("enabled"));
        $newMessage->setLabel($request->input("label"));
        $newMessage->setMessage($request->input("message"));
        $newMessage->setStartDatetime($request->input("start_datetime"));

        //Check and call EDMS API
        if (!$newMessage->valid())
            return response()->json($newMessage->listInvalidProperties(), 500);
        else $responseEDMS = $messagesAPI->messagesCreate($newMessage);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $MessagesAPI = new MessagesApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $MessagesAPI->messagesRead($id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $messagesAPI = new MessagesApi(null, $config, null, 0);

        $updatedMessage = new WritableMessage();
        $updatedMessage->setEndDatetime($request->input("end_datetime"));
        $updatedMessage->setEnabled($request->input("enabled"));
        $updatedMessage->setLabel($request->input("label"));
        $updatedMessage->setMessage($request->input("message"));
        $updatedMessage->setStartDatetime($request->input("start_datetime"));

        //Check and call EDMS API
        if (!$updatedMessage->valid())
            return response()->json($updatedMessage->listInvalidProperties(), 500);
        else $responseEDMS = $messagesAPI->messagesUpdate($id, $updatedMessage);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $messagesAPI = new MessagesApi(null, $config, null, 0);

        //Call EDMS API
        $messagesAPI->messagesDelete($id);

        return Response::json(null, 200);

    }

}
