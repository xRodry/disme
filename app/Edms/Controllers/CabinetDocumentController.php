<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\CabinetsApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\NewCabinetDocument;
use Response;
use function collect;
use function response;


class CabinetDocumentController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $cabinetDocumentsAPI = new CabinetsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $cabinetDocumentsAPI->cabinetsDocumentsList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($cabinetDocument) {
            return $cabinetDocument->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $cabinetDocumentsAPI = new CabinetsApi(null, $config, null, 0);

        $newCabinetDocument = new NewCabinetDocument();
        $newCabinetDocument->setDocumentsPkList($request->input("documents_pk_list"));

        //Check and call EDMS API
        if (!$newCabinetDocument->valid())
            return response()->json($newCabinetDocument->listInvalidProperties(), 500);
        else $responseEDMS = $cabinetDocumentsAPI->cabinetsDocumentsCreate($newCabinetDocument);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $cabinetDocumentsAPI = new CabinetsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $cabinetDocumentsAPI->cabinetsDocumentsRead($id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }


    /*public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
    $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $cabinetDocumentsAPI = new CabinetDocumentsApi(null, $config, null, 0);

        $updatedCabinetDocument = new WritableCabinetDocument();
        $updatedCabinetDocument->setDeleteTimePeriod($request->input("delete_time_period"));
        $updatedCabinetDocument->setDeleteTimeUnit($request->input("delete_time_unit"));
        $updatedCabinetDocument->setLabel($request->input("label"));
        $updatedCabinetDocument->setTrashTimePeriod($request->input("trash_time_period"));
        $updatedCabinetDocument->setTrashTimeUnit($request->input("trash_time_unit"));

        //Check and call EDMS API
        if (!$updatedCabinetDocument->valid())
            return response()->json($updatedCabinetDocument->listInvalidProperties(), 500);
        else $responseEDMS = $cabinetDocumentsAPI->cabinetDocumentsUpdate($id, $updatedCabinetDocument);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }*/

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $cabinetDocumentsAPI = new CabinetsApi(null, $config, null, 0);

        //Call EDMS API
        $cabinetDocumentsAPI->cabinetsDocumentsDelete($id);

        return Response::json(null, 200);

    }

}
