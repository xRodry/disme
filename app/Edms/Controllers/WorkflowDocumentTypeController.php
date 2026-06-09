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
use App\Edms\OpenAPI\Client\Models\WorkflowDocumentType;
use App\Edms\OpenAPI\Client\Models\NewWorkflowDocumentType;
use Response;
use function collect;
use function response;


class WorkflowDocumentTypeController extends Controller
{

    public function index($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $workflowDocumentsAPI = new WorkflowsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $workflowDocumentsAPI->workflowsDocumentTypesList($id);

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($workflowDocument) {
            return $workflowDocument->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request, $id)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");

        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));

        $workflowDocumentsAPI = new WorkflowsApi(null, $config, null, 0);

        $newWorkflowDocument = new NewWorkflowDocumentType();
        $newWorkflowDocument->setDocumentTypePk($request->input("document_type_pk"));

        //Check and call EDMS API
        if (!$newWorkflowDocument->valid())
            return response()->json($newWorkflowDocument->listInvalidProperties(), 500);
        else $responseEDMS = $workflowDocumentsAPI->workflowsDocumentTypesCreate($id, $newWorkflowDocument);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id, $document_type_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $WorkflowDocumentsAPI = new WorkflowsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $WorkflowDocumentsAPI->workflowsDocumentTypesRead($id, $document_type_pk);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    /*public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
    $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $workflowDocumentsAPI = new WorkflowsApi(null, $config, null, 0);

        $updatedWorkflowDocument = new WritableWorkflowDocument();
        $updatedWorkflowDocument->setDeleteTimePeriod($request->input("delete_time_period"));
        $updatedWorkflowDocument->setDeleteTimeUnit($request->input("delete_time_unit"));
        $updatedWorkflowDocument->setLabel($request->input("label"));
        $updatedWorkflowDocument->setTrashTimePeriod($request->input("trash_time_period"));
        $updatedWorkflowDocument->setTrashTimeUnit($request->input("trash_time_unit"));

        //Check and call EDMS API
        if (!$updatedWorkflowDocument->valid())
            return response()->json($updatedWorkflowDocument->listInvalidProperties(), 500);
        else $responseEDMS = $workflowDocumentsAPI->update($id, $updatedWorkflowDocument);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }*/

    public function destroy($id, $document_type_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $workflowDocumentsAPI = new WorkflowsApi(null, $config, null, 0);

        //Call EDMS API
        $workflowDocumentsAPI->workflowsDocumentTypesDelete($id, $document_type_pk);

        return Response::json(null, 200);

    }

}
