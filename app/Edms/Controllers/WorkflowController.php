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
use App\Edms\OpenAPI\Client\Models\WritableWorkflow;
use App\Edms\OpenAPI\Client\Models\Workflow;
use Response;
use function collect;
use function response;


class WorkflowController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $workflowsAPI = new WorkflowsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $workflowsAPI->workflowsList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($workflow) {
            return $workflow->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $workflowsAPI = new WorkflowsApi(null, $config, null, 0);

        $newWorkflow = new WritableWorkflow();
        $newWorkflow->setDocumentTypesPkList($request->input("document_types_pk_list"));
        $newWorkflow->setLabel($request->input("label"));
        $newWorkflow->setInternalName($request->input("internal_name"));

        //Check and call EDMS API
        if (!$newWorkflow->valid())
            return response()->json($newWorkflow->listInvalidProperties(), 500);
        else $responseEDMS = $workflowsAPI->workflowsCreate($newWorkflow);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $WorkflowsAPI = new WorkflowsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $WorkflowsAPI->workflowsRead($id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $workflowsAPI = new WorkflowsApi(null, $config, null, 0);

        $updatedWorkflow = new WritableWorkflow();
        $updatedWorkflow->setDocumentTypesPkList($request->input("document_types_pk_list"));
        $updatedWorkflow->setLabel($request->input("label"));
        $updatedWorkflow->setInternalName($request->input("internal_name"));

        //Check and call EDMS API
        if (!$updatedWorkflow->valid())
            return response()->json($updatedWorkflow->listInvalidProperties(), 500);
        else $responseEDMS = $workflowsAPI->workflowsUpdate($id, $updatedWorkflow);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $workflowsAPI = new WorkflowsApi(null, $config, null, 0);

        //Call EDMS API
        $workflowsAPI->workflowsDelete($id);

        return Response::json(null, 200);

    }

}
