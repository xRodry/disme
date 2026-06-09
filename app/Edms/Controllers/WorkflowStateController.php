<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\WorkflowsApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\WorkflowState;
use Response;
use function collect;
use function response;


class WorkflowStateController extends Controller
{

    public function index($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $workflowStatesAPI = new WorkflowsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $workflowStatesAPI->workflowsStatesList($id);

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($workflowState) {
            return $workflowState->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request, $id)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $workflowStatesAPI = new WorkflowsApi(null, $config, null, 0);

        $newWorkflowState = new WorkflowState();
        $newWorkflowState->setCompletion($request->input("completion"));
        $newWorkflowState->setInitial($request->input("initial"));
        $newWorkflowState->setLabel($request->input("label"));

        //Check and call EDMS API
        if (!$newWorkflowState->valid())
            return response()->json($newWorkflowState->listInvalidProperties(), 500);
        else $responseEDMS = $workflowStatesAPI->workflowsStatesCreate($id, $newWorkflowState);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id, $state_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $WorkflowStatesAPI = new WorkflowsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $WorkflowStatesAPI->workflowsStatesRead($id, $state_pk);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id, $state_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $workflowStatesAPI = new WorkflowsApi(null, $config, null, 0);

        $updatedWorkflowState = new WorkflowState();
        $updatedWorkflowState->setCompletion($request->input("completion"));
        $updatedWorkflowState->setInitial($request->input("initial"));
        $updatedWorkflowState->setLabel($request->input("label"));

        //Check and call EDMS API
        if (!$updatedWorkflowState->valid())
            return response()->json($updatedWorkflowState->listInvalidProperties(), 500);
        else $responseEDMS = $workflowStatesAPI->workflowsStatesUpdate($id, $state_pk, $updatedWorkflowState);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id, $state_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $workflowStatesAPI = new WorkflowsApi(null, $config, null, 0);

        //Call EDMS API
        $workflowStatesAPI->workflowsStatesDelete($id, $state_pk);

        return Response::json(null, 200);

    }

}
