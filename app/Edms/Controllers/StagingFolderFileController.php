<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\StagingFoldersApi;
use App\Edms\OpenAPI\Client\Authentication\Configurationon;
use App\Edms\OpenAPI\Client\Models\StagingFolderFile;
use App\Edms\OpenAPI\Client\Models\StagingFolderFileUpload;
use Response;
use function response;


class StagingFolderFileController extends Controller
{

    /*public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
    $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $stagingFolderFilesAPI = new StagingFoldersApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $stagingFolderFilesAPI->stagistagingFolderFilesList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($stagingFolderFile) {
            return $stagingFolderFile->jsonSerialize();
        });

        return Response::json($results, 200);

    }*/

    public function store(Request $request, $staging_folder_pk, $encoded_filename)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $stagingFolderFilesAPI = new StagingFoldersApi(null, $config, null, 0);

        $newStagingFolderFile = new StagingFolderFileUpload();
        $newStagingFolderFile->setDocumentType($request->input("document_type"));
        $newStagingFolderFile->setExpand($request->input("expand"));

        //Check and call EDMS API
        if (!$newStagingFolderFile->valid())
            return response()->json($newStagingFolderFile->listInvalidProperties(), 500);
        else $responseEDMS = $stagingFolderFilesAPI->stagingFoldersFileUploadCreate($staging_folder_pk, $encoded_filename, $newStagingFolderFile);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $StagingFolderFilesAPI = new StagingFoldersApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $StagingFolderFilesAPI->stagingFoldersRead($id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    /*public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
    $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $stagingFolderFilesAPI = new StagingFoldersApi(null, $config, null, 0);

        $updatedStagingFolderFile = new WritableStagingFolderFile();
        $updatedStagingFolderFile->setDeleteTimePeriod($request->input("delete_time_period"));
        $updatedStagingFolderFile->setDeleteTimeUnit($request->input("delete_time_unit"));
        $updatedStagingFolderFile->setLabel($request->input("label"));
        $updatedStagingFolderFile->setTrashTimePeriod($request->input("trash_time_period"));
        $updatedStagingFolderFile->setTrashTimeUnit($request->input("trash_time_unit"));

        //Check and call EDMS API
        if (!$updatedStagingFolderFile->valid())
            return response()->json($updatedStagingFolderFile->listInvalidProperties(), 500);
        else $responseEDMS = $stagingFolderFilesAPI->stagingFolderFilesUpdate($id, $updatedStagingFolderFile);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }*/

    public function destroy($staging_folder_pk, $encoded_filename)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $stagingFolderFilesAPI = new StagingFoldersApi(null, $config, null, 0);

        //Call EDMS API
        $stagingFolderFilesAPI->stagingFoldersFileDelete($staging_folder_pk, $encoded_filename);

        return Response::json(null, 200);

    }

}
