<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\ActionHasTemplate;
use App\Edms\OpenAPI\Client\Api\DocumentsApi;
use App\Edms\OpenAPI\Client\Authentication\Configuration;
use App\Http\Resources\TemplateDocResource;
use App\Http\Resources\TemplateModalResource;
use App\Http\Resources\TemplateResource;
use App\Http\Resources\TemplateToastResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use App\Template;
use App\TemplateDoc;
use App\TemplateModal;
use App\TemplateText;
use App\TemplateToast;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Log;

class TemplateController extends Controller
{
    use HTTPResponseTrait, GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $templates = Template::whereNull('deleted_at')->get();

        foreach ($templates as $template) {
            $this->getTemplateNames($template, $userLangId);
        }

        return TemplateResource::collection($templates);
    }

    private function getTemplateNames($template, $userLangId) {
        list($template->language_id, $template->name) = $this->getMultilingualConceptName('template_text',
        'name', 'template_id', $template->id, $userLangId, true);
        $template->language_abbrv = Language::find($template->language_id)->abbrv;
        $template->text = $this->getMultilingualConceptName('template_text', 'text',
            'template_id', $template->id, $userLangId, false, true);
    }

    public function show(Request $request, $templateId)
    {
        $userLangId = $request->user()->language_id;

        $template = Template::find($templateId);

        if ($template->type === 'modal') {

            $this->getTemplateNames($template, $userLangId);
            $templateModal = TemplateModal::where([
                'template_id' => $template->id,
                'language_id' => $template->language_id
            ])->whereNull('deleted_at')->first();
            $template->header_text = $templateModal->header_text;
            $template->button_text = $templateModal->button_text;

            return new TemplateModalResource($template);

        } else if ($template->type === 'toast') {

            $this->getTemplateNames($template, $userLangId);
            $templateToast = TemplateToast::where([
                'template_id' => $template->id,
                'language_id' => $template->language_id
            ])->whereNull('deleted_at')->first();
            $template->class = $templateToast->class;
            $template->colour = $templateToast->colour;
            $template->title_text = $templateToast->title_text;

            return new TemplateToastResource($template);

        } else if ($template->type === 'doc') {

            $this->getTemplateNames($template, $userLangId);
            $templateDoc = TemplateDoc::where([
                'template_id' => $template->id,
                'language_id' => $template->language_id
            ])->whereNull('deleted_at')->first();
            $template->blade_file = $templateDoc->blade_file;
            $template->pdf_generator = $templateDoc->pdf_generator;

            return new TemplateDocResource($template);

        } else {
            // Never gets here
            return null;
        }
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        DB::beginTransaction();
        try {
            $template = Template::create([
                'type' => $request->input('type'),
                'updated_by' => $userId
            ]);
            $templateText = TemplateText::create([
                'template_id' => $template->id,
                'language_id' => $userLangId,
                'name' => $request->input('name'),
                'text' => $request->input('text'),
                'updated_by' => $userId
            ]);

            switch ($template->type) {
                case 'modal':
                    // Create content record for the 'modal' template in the 'template_modal' table
                    TemplateModal::create([
                        'template_id' => $template->id,
                        'language_id' => $userLangId,
                        'header_text' => $request->input('header'),
                        'button_text' => $request->input('button'),
                        'updated_by' => $userId
                    ]);
                    break;
                case 'toast':
                    // Create content record for the 'toast' template in the 'template_toast' table
                    $templateToast = TemplateToast::create([
                        'template_id' => $template->id,
                        'language_id' => $userLangId,
                        'class' => $request->input('class'),
                        'updated_by' => $userId
                    ]);
                    // If it's a custom class toast template, save its colour and title
                    if ($templateToast->class === 'custom') {
                        $templateToast->colour = $request->input('colour');
                        $templateToast->title_text = $request->input('title');
                        $templateToast->save();
                    }
                    break;
                case 'doc':
                    // Create/Update the blade file with the template text defined by the user
                    $bladeFilename = $this->createTemplateBladeFile($template->id, $request->input('text'), $userLangId);
                    // Create content record for the 'doc' template in the 'template_doc' table
                    TemplateDoc::create([
                        'template_id' => $template->id,
                        'language_id' => $userLangId,
                        'blade_file' => $bladeFilename,
                        'pdf_generator' => 'dompdf',
                        'updated_by' => $userId
                    ]);
                    break;
            }

            DB::commit();
            $success = true;
            // all good
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
            // something went wrong
        }
        return (string) $success;
    }

    public function update(Request $request, $templateId)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;
        // Get the template & templateText records of the template being updated
        $template = Template::find($templateId);
        $templateText = TemplateText::where([
            'template_id' => $templateId,
            'language_id' => $userLangId
        ])->whereNull('deleted_at')->first();
        $templateOldType = $template->type;
        // Check if the template's type has changed (comparing the one stored and the submitted updated template)
        $templateTypeHasChanged = $template->type !== $request->input('type');

        DB::beginTransaction();
        try {
            // Updates in the template and templateText table
            $this->updateTemplateAndTemplateText($template, $templateText, $request, $userId);
            if ($templateTypeHasChanged) {
                $this->deleteTemplateContentRecords($templateId, $templateOldType, $userId, $userLangId);
                // If user has changed the type when updating, create a new one/update a soft_deleted record
                if ($template->type === 'toast') {
                    $this->createOrRestoreTemplateToast($templateId, $request, $userId, $userLangId);
                } else if ($template->type === 'modal') {
                    $this->createOrRestoreTemplateModal($template->id, $request, $userId, $userLangId);
                } else if ($template->type === 'doc') {
                    $this->createOrRestoreTemplateDoc($template->id, $request, $userId, $userLangId);
                }
            } else {
                // In case type hasn't changed - Update the record in the table corresponding to template type
                if ($template->type === 'modal') {
                    $this->updateModalTemplate($template, $request, $userId, $userLangId);
                } else if ($template->type === 'toast') {
                    $this->updateToastTemplate($template, $request, $userId, $userLangId);
                } else if ($template->type === 'doc') {
                    $this->updateDocTemplate($template, $request, $userId, $userLangId);
                }
            }

            DB::commit();
            $success = true;
            // all good
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
            // something went wrong
        }
        return (string) $success;
    }

    private function deleteTemplateContentRecords($templateId, $templateType, $userId, $userLangId) {
        // Get definitions of this template in other languages (table template_text)
        $templateTextsOtherLanguages = TemplateText::where('template_id', $templateId)
            ->where('language_id', '!=', $userLangId)->whereNull('deleted_at')->get();
        $templateContents = [];
        // Get definition of this template content (table template_modal/template_toast/template_doc depending on template type)
        if ($templateType === 'modal') {
            $templateContents = TemplateModal::where('template_id', $templateId)->whereNull('deleted_at')->get();
        } else if ($templateType === 'toast') {
            $templateContents = TemplateToast::where('template_id', $templateId)->whereNull('deleted_at')->get();
        } else if ($templateType === 'doc') {
            $templateContents = TemplateDoc::where('template_id', $templateId)->whereNull('deleted_at')->get();
        }
        // Delete all template_modal/template_toast definitions in other languages
        foreach ($templateContents as $templateContent) {
            $templateContent->update([
                'deleted_by' => $userId
            ]);
            $templateContent->delete();
        }
        // Delete all template_text definitions in other languages
        foreach ($templateTextsOtherLanguages as $templateText) {
            $templateText->update([
                'deleted_by' => $userId
            ]);
            $templateText->delete();
        }
    }

    private function updateTemplateAndTemplateText($template, $templateText, $request, $userId) {
        $template->update([
            'type' => $request->input('type'),
            'updated_by' => $userId
        ]);
        $templateText->update([
            'name' => $request->input('name'),
            'text' => $request->input('text'),
            'updated_by' => $userId
        ]);
    }

    private function updateModalTemplate($template, $request, $userId, $userLangId) {
        $templateModal = TemplateModal::where([
            'template_id' => $template->id,
            'language_id' => $userLangId
        ])->whereNull('deleted_at')->first();
        $templateModal->update([
            'header_text' => $request->input('header'),
            'button_text' => $request->input('button'),
            'updated_by' => $userId
        ]);
    }

    private function updateToastTemplate($template, $request, $userId, $userLangId) {
        $templateToast = TemplateToast::where([
            'template_id' => $template->id,
            'language_id' => $userLangId
        ])->whereNull('deleted_at')->first();
        // If templateToast class/color has changes, update other languages' definition of this template to include same type
        if ($templateToast->class !== $request->input('class') || $templateToast->colour !== $request->input('colour')) {
            $templateDefinitionOtherLanguages = TemplateToast::where('template_id', $templateToast->template_id)
                ->where('language_id', '!=', $templateToast->language_id)->whereNull('deleted_at')->get();
            foreach($templateDefinitionOtherLanguages as $templateDefinitionOtherLanguage) {
                $templateDefinitionOtherLanguage->update([
                    'class' => $request->input('class'),
                    'colour' => $request->input('colour'),
                    'title_text' => $request->input('title'),
                    'updated_by' => $userId
                ]);
            }
        }
        // Finally, update the "original" template's information
        $templateToast->update([
            'class' => $request->input('class'),
            'colour' => $request->input('colour'),
            'title_text' => $request->input('title'),
            'updated_by' => $userId
        ]);
    }

    private function updateDocTemplate($template, $request, $userId, $userLangId) {
        $templateDoc = TemplateDoc::where([
            'template_id' => $template->id,
            'language_id' => $userLangId
        ])->whereNull('deleted_at')->first();
        // Create/Update the blade file with the template text defined by the user
        $bladeFilename = $this->createTemplateBladeFile($template->id, $request->input('text'), $userLangId);
        // Finally, update the "original" template's information
        $templateDoc->update([
            'blade_file' => $bladeFilename,
            'updated_by' => $userId
        ]);
        $templateDoc->touch();
    }

    private function createOrRestoreTemplateToast($templateId, $request, $userId, $userLangId) {
        // In case the template has been a 'template toast' in the past, but in the meantime was 'soft deleted'
        // In this case, restore it and update that old record instead of creating new one
        $hasPreviousTemplateToast = TemplateToast::onlyTrashed()->where([
            'template_id' => $templateId,
            'language_id' => $userLangId
        ])->first();
        if ($hasPreviousTemplateToast) {
            $hasPreviousTemplateToast->restore();
            $hasPreviousTemplateToast->update([
                'class' => $request->input('class'),
                'updated_by' => $userId,
                'deleted_by' => null
            ]);
            if ($hasPreviousTemplateToast->class === 'custom') {
                $hasPreviousTemplateToast->colour = $request->input('colour');
                $hasPreviousTemplateToast->title_text = $request->input('title');
            } else {
                $hasPreviousTemplateToast->colour = null;
                $hasPreviousTemplateToast->title_text = null;
            }
            $hasPreviousTemplateToast->save();
        } else {
            // A new record is created with the new template type
            $templateToast = TemplateToast::create([
                'template_id' => $templateId,
                'language_id' => $userLangId,
                'class' => $request->input('class'),
                'updated_by' => $userId
            ]);
            if ($templateToast->class === 'custom') {
                $templateToast->colour = $request->input('colour');
                $templateToast->title_text = $request->input('title');
                $templateToast->save();
            }
        }
    }

    private function createOrRestoreTemplateModal($templateId, $request, $userId, $userLangId) {
        // In case the template has been a 'template modal' in the past, but in the meantime was 'soft deleted'
        // In this case, restore it and update that old record instead of creating new one
        $hasPreviousTemplateModal = TemplateModal::onlyTrashed()->where([
            'template_id' => $templateId,
            'language_id' => $userLangId
        ])->first();
        if ($hasPreviousTemplateModal) {
            $hasPreviousTemplateModal->restore();
            $hasPreviousTemplateModal->update([
                'header_text' => $request->input('header'),
                'button_text' => $request->input('button'),
                'updated_by' => $userId,
                'deleted_by' => null
            ]);
        } else {
            // A new record is created with the new template type
            $templateModal = TemplateModal::create([
                'template_id' => $templateId,
                'language_id' => $userLangId,
                'header_text' => $request->input('header'),
                'button_text' => $request->input('button'),
                'updated_by' => $userId
            ]);
        }
    }

    private function createOrRestoreTemplateDoc($templateId, $request, $userId, $userLangId) {
        // Create/Update the blade file with the template text defined by the user
        $bladeFilename = $this->createTemplateBladeFile($templateId, $request->input('text'), $userLangId);
        // In case the template has been a 'template doc' in the past, but in the meantime was 'soft deleted'
        // In this case, restore it and update that old record instead of creating new one
        $hasPreviousTemplateDoc = TemplateDoc::onlyTrashed()->where([
            'template_id' => $templateId,
            'language_id' => $userLangId
        ])->first();
        if ($hasPreviousTemplateDoc) {
            $hasPreviousTemplateDoc->restore();
            $hasPreviousTemplateDoc->update([
                'blade_file' => $bladeFilename,
                'updated_by' => $userId,
                'deleted_by' => null
            ]);
            $hasPreviousTemplateDoc->touch();
        } else {
            $templateDoc = TemplateDoc::create([
                'template_id' => $templateId,
                'blade_file' => $bladeFilename,
                'pdf_generator' => 'dompdf',
                'language_id' => $userLangId,
                'updated_by' => $userId
            ]);
        }
    }

    private function createTemplateBladeFile($templateId, $templateText, $userLangId) {
        $userLangAbbrv = strtoupper(Language::find($userLangId)->abbrv);
        $bladeFilename = env('TEMPLATE_BLADE_FILE_PREFIX') . $templateId . '_' . $userLangAbbrv;
        // Path of the blade file created, containing the template's content
        $path = env('TEMPLATE_BLADE_PATH_PREFIX') . $bladeFilename . env('TEMPLATE_BLADE_FILE_EXTENSION');
        // Save the blade file
        Storage::put($path, $templateText);
        return $bladeFilename;
    }

    public function destroy(Request $request, $templateId)
    {
        $userId = $request->user()->id;

        $template = Template::find($templateId);
        // Check if the template is currently being used by any active Action Rules
        $usedByAR = ActionHasTemplate::whereHas('action.actionRule', function($query){
            $query->whereNull('deleted_at');
        })->where('template_id', $templateId)
            ->whereNull('deleted_at')->get();
        // If it's used in 1 or more active Action Rule, don't delete it and warn the user
        if (count($usedByAR) != 0) {
            return response()->json([
                'belongsAR' => 'true'
            ]);
        }

        // If template doesn't belong to any AR - Get all occurrences of this template in all possible tables
        // - template_text, template_modal || template_toast || template_doc
        $templateTexts = TemplateText::where('template_id', $templateId)->whereNull('deleted_at')->get();
        if ($template->type === 'modal') {
            $templateContents = TemplateModal::where('template_id', $templateId)->whereNull('deleted_at')->get();
        } else if ($template->type === 'toast') {
            $templateContents = TemplateToast::where('template_id', $templateId)->whereNull('deleted_at')->get();
        } else if ($template->type === 'doc') {
            $templateContents = TemplateDoc::where('template_id', $templateId)->whereNull('deleted_at')->get();
        }

        DB::beginTransaction();
        try {
            // Delete every instance on the templateText table
            foreach ($templateTexts as $templateTextInstance) {
                $templateTextInstance->update([
                    'deleted_by' => $userId
                ]);
                $templateTextInstance->delete();
            }
            // Delete every instance on the templateModal/templateToast/templateDoc table
            foreach ($templateContents as $templateContentInstance) {
                $templateContentInstance->update([
                    'deleted_by' => $userId
                ]);
                $templateContentInstance->delete();
            }
            // Delete the main template record
            $template->update([
                'deleted_by' => $userId
            ]);
            $template->delete();

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }
        return (string) $success;
    }

    public function translate(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        DB::beginTransaction();
        try {
            // Check if there has been a templateText for this template on the user's language that was soft_deleted
            $hasPreviousNameRecord = TemplateText::onlyTrashed()
                ->where([
                    'template_id' => $request->input('template_id'),
                    'language_id' => $userLangId
                ])->first();
            // In case there was, restore that record and update it, so that it reflects the most recent name inserted
            // [as we can't have another entry in the DB for the same template_id & language_id combo]
            if ($hasPreviousNameRecord) {
                $hasPreviousNameRecord->restore();
                $hasPreviousNameRecord->update([
                    'deleted_by' => null,
                    'name' => $request->input('name'),
                    'text' => $request->input('text'),
                    'updated_by' => $userId
                ]);
            } else {
                // If there isn't, create a new record for the inserted name
                $templateText = TemplateText::create([
                    'template_id' => $request->input('template_id'),
                    'language_id' => $userLangId,
                    'name' => $request->input('name'),
                    'text' => $request->input('text'),
                    'updated_by' => $userId
                ]);
            }

            if ($request->type === 'modal') {
                $this->createOrRestoreTemplateModal($request->input('template_id'), $request, $userId, $userLangId);
            } else if ($request->type === 'toast') {
                $this->createOrRestoreTemplateToast($request->input('template_id'), $request, $userId, $userLangId);
            } else if ($request->type === 'doc') {
                $this->createOrRestoreTemplateDoc($request->input('template_id'), $request, $userId, $userLangId);
            }

            DB::commit();
            $success = true;
            // all good
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
            // something went wrong
        }
        return (string) $success;
    }

    public function getPDFFromEDMS(Request $request, $docEDMSId)
    {
        $config = new Configuration();
        //$config->setAccessToken("Token e397ba76d4e9af17b10ad5332d225a8fb5f4cae9");
        $config->setUsername(env('EDMS_ACCOUNT'))->setPassword(env('EDMS_PASSWORD'));
        $documentsAPI = new DocumentsApi(null, $config, null, 0);

        //Check and call EDMS API
        return $documentsAPI->documentsDownloadRead($docEDMSId);
    }

}
