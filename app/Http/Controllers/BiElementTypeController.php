<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\BiElementTypeResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\BiElementType;
use App\BiElementTypeText;
use Log;

class BiElementTypeController extends Controller
{
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $biElementTypes = BiElementType::whereNull('deleted_at')->get();

        foreach($biElementTypes as $biElementType) {
            $this->getBiElementTypeTextInfo($biElementType, $userLangId);
        }

        return BiElementTypeResource::collection($biElementTypes);
    }

    private function getBiElementTypeTextInfo($biElementType, $userLangId) {
        list($biElementType->language_id, $biElementType->name) = $this->getMultilingualConceptName('bi_element_type_text', 'name',
            'bi_element_type_id', $biElementType->id, $userLangId, true);
        $biElementType->description = $this->getMultilingualConceptName('bi_element_type_text', 'description',
            'bi_element_type_id', $biElementType->id, $userLangId);
        $biElementType->language_abbrv = Language::find($biElementType->language_id)->abbrv;
    }

    public function show(Request $request, $biElementTypeId)
    {
        $userLangId = $request->user()->language_id;

        $biElementType = BiElementType::find($biElementTypeId);

        $this->getBiElementTypeTextInfo($biElementType, $userLangId);

        return new BiElementTypeResource($biElementType);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        DB::beginTransaction();
        try {
            $biElementType = BiElementType::create([
                'slug' => $request->input('slug'),
                'updated_by' => $userId
            ]);
            $biElementTypeText = BiElementTypeText::create([
                'bi_element_type_id' => $biElementType->id,
                'language_id' => $userLangId,
                'name' => $request->input('name'),
                'description' => $request->input('description'),
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

    public function update(Request $request, $biElementTypeId)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $biElementType = BiElementType::find($biElementTypeId);
        $biElementTypeText = BiElementTypeText::where([
            'bi_element_type_id' => $biElementTypeId,
            'language_id' => $userLangId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $biElementType->update([
                'slug' => $request->input('slug'),
                'updated_by' => $userId
            ]);
            $biElementTypeText->update([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
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

    public function destroy(Request $request, $biElementTypeId)
    {
        $userId = $request->user()->id;

        $biElementType = BiElementType::find($biElementTypeId);
        $biElementTypeTexts = BiElementTypeText::where('bi_element_type_id', $biElementTypeId)->whereNull('deleted_at')->get();

        DB::beginTransaction();
        try {

            foreach ($biElementTypeTexts as $biElementTypeText) {
                $biElementTypeText->update([
                    'deleted_by' => $userId
                ]);
                $biElementTypeText->delete();
            }

            $biElementType->update([
                'deleted_by' => $userId
            ]);
            $biElementType->delete();

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
