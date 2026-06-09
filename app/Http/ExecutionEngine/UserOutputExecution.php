<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine;

use App;
use App\ActionHasTemplate;
use App\Edms\Controllers\DocumentController;
use App\Edms\OpenAPI\Client\Api\DocumentsApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Edms\OpenAPI\Client\Exceptions\ApiException;
use App\Edms\OpenAPI\Client\Models\NewDocument;
use App\Edms\OpenAPI\Client\Models\NewDocumentVersion;
use App\Http\Resources\ActionsDashboardResource;
use App\Http\Resources\TemplateModalResource;
use App\Http\Resources\TemplateToastResource;
use App\Template;
use App\TemplateDoc;
use App\TemplateDocLog;
use App\TemplateText;
use DB;
use Illuminate\Support\Facades\Storage;
use Log;

class UserOutputExecution implements ActionTypeExecutionInterface
{
    private $globalVariables;

    public function __construct()
    {
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    public function execute(ActionsDashboardResource $action)
    {
        $action->template = $this->getTemplateFromAction($action->id);
        return $action;
    }

    private function getTemplateFromAction ($actionId)
    {
        $template = ActionHasTemplate::where('action_id',$actionId)
            ->select('template_id')
            ->whereNull('deleted_at')
            ->latest()
            ->first();

        // Get the template record on the DB, so we can see which type it has
        $template = Template::find($template->template_id);

        if ($template->type == 'modal') {

            $templateModal = DB::table('template')
                ->join('template_text', 'template.id', '=', 'template_text.template_id')
                ->join('template_modal', 'template.id', '=', 'template_modal.template_id')
                ->join('language', 'language.id', '=', 'template_text.language_id')
                ->select('template.id', 'template.type',
                    'template_text.name', 'template_text.text', 'template_text.language_id',
                    'template_modal.header_text', 'template_modal.button_text', 'template_modal.template_id',
                    'template.updated_by', 'template.deleted_by', 'template.updated_at', 'template.created_at')
                ->where([
                    ['language.id', '=', $this->globalVariables->langId],
                    ['template.id', '=', $template->id]
                ])
                ->whereNull('template.deleted_at')
                ->first();

            return new TemplateModalResource($templateModal);

        } else if ($template->type == 'toast') {

            $templateToast = DB::table('template')
                ->join('template_text', 'template.id', '=', 'template_text.template_id')
                ->join('template_toast', 'template.id', '=', 'template_toast.template_id')
                ->join('language', 'language.id', '=', 'template_text.language_id')
                ->select('template.id', 'template.type',
                    'template_text.name', 'template_text.text', 'template_text.language_id',
                    'template_toast.class', 'template_toast.colour', 'template_toast.title_text', 'template_toast.template_id',
                    'template.updated_by', 'template.deleted_by', 'template.updated_at', 'template.created_at')
                ->where([
                    ['language.id', '=', $this->globalVariables->langId],
                    ['template.id', '=', $template->id]
                ])
                ->whereNull('template.deleted_at')
                ->first();

            return new TemplateToastResource($templateToast);

        } else if ($template->type == 'doc') {

            // Get the document's template information
            $templateDoc = TemplateDoc::where([
                ['template_id', $template->id],
                ['language_id', $this->globalVariables->langId]
            ])->whereNull('deleted_at')->first();

            // Create the document, store it in Mayan EDMS and insert a log record in TemplateDocLog
            $createdDoc = $this->createAndStoreDocument($templateDoc);

            // The object to be returned
            $templateDocument = array();
            // TYPE so we know the expected behaviour of the dashboard
            $templateDocument['type'] = 'doc';
            // EDMS ID so we can get the document from Mayan and display it in the dashboard, allowing user to view/download it
            $templateDocument['edms_id'] = $createdDoc->edms_id;

            return $templateDocument;

        } else {
            return null;
        }
    }

    private function createAndStoreDocument($templateDoc)
    {
        // Build the document name for Mayan: Currently: templateName_processId_transactionStateId
        $templateName = TemplateText::where([
            'template_id' => $templateDoc->template_id,
            'language_id' => $this->globalVariables->langId
        ])->whereNull('deleted_at')->first()->name;
        $documentName =  $templateName . '_' . $this->globalVariables->processId . '_' . $this->globalVariables->transactionStateId;

        try {
            // Create the document in the Mayan EDMS
            $edmsRet = $this->createEdmsDocument($templateDoc->blade_file, $documentName);
            // Document has been created and stored: At this point we can assign the edms_id to the logged info about it
            return TemplateDocLog::create([
                'template_doc_id' => $templateDoc->id,
                'transaction_state_id' => $this->globalVariables->transactionStateId,
                'edms_id' => $edmsRet->getId(),
                'updated_by' => $this->globalVariables->userId
            ]);
        }
        catch(\InvalidArgumentException $exception){
            // A problem occurred, thus the "rollback" of the EDMS file if it occurred
            if(isset($edmsRet)){
                $docCtrl = new DocumentController();
                $edmsRet = $docCtrl->destroy($edmsRet->getId());
            }
            // Delete the produced PDF from local storage if it was saved
            if (Storage::exists(env('TEMPLATE_FILES_PATH_PREFIX').$documentName.'.pdf')) {
                Log::debug('oi 1');
                Storage::delete(env('TEMPLATE_FILES_PATH_PREFIX').$documentName.'.pdf');
            }
            throw new \Exception($exception);
        }
        catch(ApiException $edmsException){
            // A problem occurred, thus the "rollback" of the EDMS file if they occurred
            if(isset($edmsRet)){
                $docCtrl = new DocumentController();
                $edmsRet = $docCtrl->destroy($edmsRet->getId());
            }
            // Delete the produced PDF from local storage if it was saved
            if (Storage::exists(env('TEMPLATE_FILES_PATH_PREFIX').$documentName.'.pdf')) {
                Log::debug('oi 1');
                Storage::delete(env('TEMPLATE_FILES_PATH_PREFIX').$documentName.'.pdf');
            }
            throw new \Exception($edmsException);
        }
    }

    private function createEdmsDocument($bladeFilename, $docName)
    {
        // Data passed to the Blade Directive function. Used to get the dynamic values to be inserted into the document
        $docData = ['processId' => $this->globalVariables->processId, 'userId' => $this->globalVariables->userId, 'langId' => $this->globalVariables->langId];
        // Get the contents of the blade file and insert dynamic values through blade directives
        $viewObj = view($bladeFilename, $docData);
        $html = $viewObj->render();
        // Create the pfd wrapper and insert the template's content
        $pdf = App::make('dompdf.wrapper');
        $pdf->loadHTML($html);
        // Store a copy of the generated pdf in the project files TODO: needed?
        $output = $pdf->output();
        Storage::put(env('TEMPLATE_FILES_PATH_PREFIX').$docName.'.pdf', $output);
        // Store the file in Mayan EDMS
        $edmsRet = $this->storeWithParameterValues(1/*to be reviewed*/,$docName/*$bladeFilename*/, "en"/* to be reviewed - */, $output/*base64_encode(mb_convert_encoding($output, 'UTF-8', 'UTF-8'))*//*C:\\xampp\\htdocs\\disme-27-07\\storage\\app\\resources\\templates\\Template_64.pdf"*//*json_encode(*//*base64_encode(mb_convert_encoding($output, 'UTF-8', 'UTF-8'))*/);

        return $edmsRet;
    }

    private function createEdmsDocumentVersion($templateId, $userLangId, $bladeFilename, $docName, $comment = "")
    {
        // Data passed to the Blade Directive function. Used to get the dynamic values to be inserted into the document
        $docData = ['processId' => $this->globalVariables->processId, 'userId' => $this->globalVariables->userId, 'langId' => $this->globalVariables->langId];
        // Get the contents of the blade file and insert dynamic values through blade directives
        $viewObj = view($bladeFilename, $docData);
        $html = $viewObj->render();
        // Create the pfd wrapper and insert the template's content
        $pdf = App::make('dompdf.wrapper');
        $pdf->loadHTML($html);
        // Store a copy of the generated pdf in the project files TODO: needed?
        $output = $pdf->output();
        Storage::put(env('TEMPLATE_FILES_PATH_PREFIX').$docName.'.pdf', $output);
        // Get the template_doc's EDMS id
        $edmsId = TemplateDoc::where([
            'template_id' => $templateId,
            'language_id' => $userLangId
        ])->whereNull('deleted_at')->pluck('edms_id')->first();
        // Store the file's new version in Mayan EDMS
        $edmsRet = $this->storeVersionWithParameterValues($edmsId, $comment, $output);

        return $edmsRet;
    }

    private function storeWithParameterValues($documentType, $label, $language, $file)
    {
        $config = new Configuration();
        //$config->setAccessToken("Token e397ba76d4e9af17b10ad5332d225a8fb5f4cae9");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentsAPI = new DocumentsApi(null, $config, null, 0);

        $newDocument = new NewDocument();
        // $newDocument->setDescription($description);
        $newDocument->setDocumentType($documentType);
        $newDocument->setLabel($label);
        $newDocument->setLanguage($language);
        $newDocument->setFile($file);

        // TODO add descriptions to the document, tags/insert into cabinet...

        // Check and call EDMS API
        if (!$newDocument->valid())
            return response()->json($newDocument->listInvalidProperties(), 500);
        else $responseEDMS = $documentsAPI->documentsCreate($newDocument);

        return $responseEDMS;
        //return Response::json($responseEDMS->jsonSerialize(), 200);
    }


    private function storeVersionWithParameterValues($edms_id, $comment, $file)
    {
        $config = new Configuration();
        //$config->setAccessToken("Token e397ba76d4e9af17b10ad5332d225a8fb5f4cae9");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentsAPI = new DocumentsApi(null, $config, null, 0);

        $newDocumentVersion = new NewDocumentVersion();
        $newDocumentVersion->setComment($comment);
        $newDocumentVersion->setFile($file);

        //Check and call EDMS API
        if (!$newDocumentVersion->valid())
            return response()->json($newDocumentVersion->listInvalidProperties(), 500);
        else $responseEDMS = $documentsAPI->documentsVersionsCreate($edms_id, $newDocumentVersion);

        return $responseEDMS;
        //return Response::json($responseEDMS->jsonSerialize(), 200);
    }
}
