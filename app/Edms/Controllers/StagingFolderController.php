<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\StagingFoldersApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\StagingFolder;
use Response;
use function collect;
use function response;


class StagingFolderController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $stagingFoldersAPI = new StagingFoldersApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $stagingFoldersAPI->stagingFoldersList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($stagingFolder) {
            return $stagingFolder->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $stagingFoldersAPI = new StagingFoldersApi(null, $config, null, 0);

        $newStagingFolder = new StagingFolder();
        $newStagingFolder->setDeleteAfterUpload($request->input("delete_after_upload"));
        $newStagingFolder->setEnabled($request->input("enabled"));
        $newStagingFolder->setFolderPath($request->input("folder_path"));
        $newStagingFolder->setLabel($request->input("label"));
        $newStagingFolder->setPreviewHeight($request->input("preview_height"));
        $newStagingFolder->setPreviewWidth($request->input("preview_width"));
        $newStagingFolder->setUncompress($request->input("uncompress"));

        //Check and call EDMS API
        if (!$newStagingFolder->valid())
            return response()->json($newStagingFolder->listInvalidProperties(), 500);
        else $responseEDMS = $stagingFoldersAPI->stagingFoldersCreate($newStagingFolder);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $StagingFoldersAPI = new StagingFoldersApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $StagingFoldersAPI->stagingFoldersRead($id);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $stagingFoldersAPI = new StagingFoldersApi(null, $config, null, 0);

        $updatedStagingFolder = new StagingFolder();
        $updatedStagingFolder->setDeleteAfterUpload($request->input("delete_after_upload"));
        $updatedStagingFolder->setEnabled($request->input("enabled"));
        $updatedStagingFolder->setFolderPath($request->input("folder_path"));
        $updatedStagingFolder->setLabel($request->input("label"));
        $updatedStagingFolder->setPreviewHeight($request->input("preview_height"));
        $updatedStagingFolder->setPreviewWidth($request->input("preview_width"));
        $updatedStagingFolder->setUncompress($request->input("uncompress"));

        //Check and call EDMS API
        if (!$updatedStagingFolder->valid())
            return response()->json($updatedStagingFolder->listInvalidProperties(), 500);
        else $responseEDMS = $stagingFoldersAPI->stagingFoldersUpdate($id, $updatedStagingFolder);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($id)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $stagingFoldersAPI = new StagingFoldersApi(null, $config, null, 0);

        //Call EDMS API
        $stagingFoldersAPI->stagingFoldersDelete($id);

        return Response::json(null, 200);

    }

}
