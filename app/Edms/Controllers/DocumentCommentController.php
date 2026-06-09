<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Edms\Controllers;

use App\Edms\OpenAPI\Client\Models\Comment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Edms\OpenAPI\Client\Api\DocumentsApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Models\WritableComment;
use App\Edms\OpenAPI\Client\Models\Document;
use Response;
use function collect;
use function response;


class DocumentCommentController extends Controller
{

    public function index()
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentCommentsAPI = new DocumentsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $documentCommentsAPI->documentsCommentsList();

        //Compose the results
        //Isto também poderia ser refactorizado para uma function auxiliar
        $results = collect($responseEDMS->getResults())->map(function ($documentComment) {
            return $documentComment->jsonSerialize();
        });

        return Response::json($results, 200);

    }

    public function store(Request $request, $document_pk)
    {

        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentCommentsAPI = new DocumentsApi(null, $config, null, 0);

        $newDocumentComment = new WritableComment();
        $newDocumentComment->setComment($request->input("comment"));
        $doc = new Document();
        $doc->setLabel($request->input("document.label"));
        $doc->setDescription($request->input("document.description"));
        $doc->setLanguage($request->input("document.language"));
        $newDocumentComment->setDocument($doc);

        //Check and call EDMS API
        if (!$newDocumentComment->valid())
            return response()->json($newDocumentComment->listInvalidProperties(), 500);
        else $responseEDMS = $documentCommentsAPI->documentsCommentsCreate($document_pk, $newDocumentComment);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function show($document_pk, $comment_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentCommentsAPI = new DocumentsApi(null, $config, null, 0);

        //Call EDMS API
        $responseEDMS = $documentCommentsAPI->documentsCommentsRead($document_pk, $comment_pk);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function update(Request $request, $document_pk, $comment_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentCommentsAPI = new DocumentsApi(null, $config, null, 0);

        $updatedDocumentComment = new Comment();
        $updatedDocumentComment->setComment($request->input("comment"));
        $doc = new Document();
        $doc->setLabel($request->input("document.label"));
        $doc->setDescription($request->input("document.description"));
        $doc->setLanguage($request->input("document.language"));
        $updatedDocumentComment->setDocument($doc);

        //Check and call EDMS API
        if (!$updatedDocumentComment->valid())
            return response()->json($updatedDocumentComment->listInvalidProperties(), 500);
        else $responseEDMS = $documentCommentsAPI->documentsCommentsUpdate($document_pk, $comment_pk, $updatedDocumentComment);

        return Response::json($responseEDMS->jsonSerialize(), 200);

    }

    public function destroy($document_pk, $comment_pk)
    {

        //Configure EDMS API
        $config = new Configuration();
        //$config->setAccessToken("Token 997a87b1e3d12e4daff460c4441af558995c1fa3");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentCommentsAPI = new DocumentsApi(null, $config, null, 0);

        //Call EDMS API
        $documentCommentsAPI->documentsCommentsDelete($document_pk, $comment_pk);

        return Response::json(null, 200);

    }

}
