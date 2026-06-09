<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\ContextVariable;
use App\ContextVariableText;
use App\Http\Resources\ContextVariableResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use DB;
use Illuminate\Http\Request;
use Log;

class ContextVariableController extends Controller
{
    use HTTPResponseTrait;
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $contextVariables = ContextVariable::whereNull('deleted_at')->get();

        foreach($contextVariables as $contextVariable) {
            $this->getContextVariableNameInfo($contextVariable, $userLangId);
        }

        return ContextVariableResource::collection($contextVariables);
    }

    public function show(Request $request, $contextVariableId)
    {
        $userLangId = $request->user()->language_id;

        $contextVariable = ContextVariable::find($contextVariableId);
        $this->getContextVariableNameInfo($contextVariable, $userLangId);

        return new ContextVariableResource($contextVariable);
    }

    private function getContextVariableNameInfo($contextVariable, $userLangId) {
        list($contextVariable->language_id, $contextVariable->text) = $this->getMultilingualConceptName('context_variable_text',
            'text', 'context_variable_id', $contextVariable->id, $userLangId, true);
        $contextVariable->language_abbrv = Language::find($contextVariable->language_id)->abbrv;
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        DB::beginTransaction();
        try {

            $contextVariable = ContextVariable::create([
                'updated_by' => $userId
            ]);
            $contextVariableText = ContextVariableText::create([
                'context_variable_id' => $contextVariable->id,
                'language_id' => $userLangId,
                'text' => $request->input('text'),
                'updated_by' => $userId
            ]);

            DB::commit();
            $success = true;
            // all good
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
            // something went wrong
        }
        return (string)$success;
    }

    public function update(Request $request, $contextVariableId)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $contextVariable = ContextVariable::find($contextVariableId);
        $contextVariableText = ContextVariableText::where([
            'context_variable_id' => $contextVariableId,
            'language_id' => $userLangId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $contextVariable->update([
                'updated_by' => $userId
            ]);
            $contextVariableText->update([
                'text' => $request->input('text'),
                'updated_by' => $userId
            ]);

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string) $success;
    }

    public function destroy(Request $request, $contextVariableId)
    {
        $userId = $request->user()->id;

        $contextVariable = ContextVariable::find($contextVariableId);
        $contextVariableTexts = ContextVariableText::where('context_variable_id', $contextVariableId)->whereNull('deleted_at')->get();

        DB::beginTransaction();
        try {

            foreach ($contextVariableTexts as $contextVariableText) {
                $contextVariableText->update([
                    'deleted_by' => $userId
                ]);
                $contextVariableText->delete();
            }

            $contextVariable->update([
                'deleted_by' => $userId
            ]);
            $contextVariable->delete();

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
            // Check if there has been a name for this contextVariable on the user's language that was soft_deleted
            $hasPreviousTextRecord = ContextVariableText::onlyTrashed()
                ->where([
                    'context_variable_id' => $request->input('id'),
                    'language_id' => $userLangId
                ])->first();
            // In case there was, restore that record and update it, so that it reflects the most recent name inserted
            // [as we can't have another entry in the DB for the same context_variable_id & language_id combo]
            if ($hasPreviousTextRecord) {
                $hasPreviousTextRecord->restore();
                $hasPreviousTextRecord->update([
                    'text' => $request->input('text'),
                    'updated_by' => $userId,
                    'deleted_by' => null,
                ]);
            } else {
                // If there isn't, create a new record for the inserted name
                ContextVariableText::create([
                    'context_variable_id' => $request->input('id'),
                    'language_id' => $userLangId,
                    'text' => $request->input('text'),
                    'updated_by' => $userId
                ]);
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
        return (string)$success;
    }
}
