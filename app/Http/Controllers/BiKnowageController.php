<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\BiKnowageResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\BiKnowage;
use App\BiKnowageText;
use Log;

class BiKnowageController extends Controller
{
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $allBiKnowage = BiKnowage::whereNull('deleted_at')->get();

        foreach ($allBiKnowage as $biKnowage) {
            $this->getBiKnowageTextInfo($biKnowage, $userLangId);
        }

        return BiKnowageResource::collection($allBiKnowage);
    }

    private function getBiKnowageTextInfo($biKnowage, $userLangId) {
        list($biKnowage->language_id, $biKnowage->name) = $this->getMultilingualConceptName('bi_knowage_text',
            'name', 'bi_knowage_id', $biKnowage->id, $userLangId, true);
        $biKnowage->description = $this->getMultilingualConceptName('bi_knowage_text',
            'description', 'bi_knowage_id', $biKnowage->id, $userLangId);
        $biKnowage->language_abbrv = Language::find($biKnowage->language_id)->abbrv;
    }

    public function show(Request $request, $biKnowageId)
    {
        $userLangId = $request->user()->language_id;

        $biKnowage = BiKnowage::find($biKnowageId);

        $this->getBiKnowageTextInfo($biKnowage, $userLangId);

        return new BiKnowageResource($biKnowage);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        DB::beginTransaction();
        try {

            $biKnowage = BiKnowage::create([
                'label' => $request->input('label'),
                'preview' => $request->input('preview'),
                'type' => $request->input('type'),
                'role' => $request->input('role'),
                'dataset_label' => $request->input('dataset_label'),
                'display_toolbar' => $request->input('display_toolbar'),
                'display_sliders' => $request->input('display_sliders'),
                'reset_parameters' => $request->input('reset_parameters'),
                'updated_by' => $userId
            ]);

            $biKnowageText = BiKnowageText::create([
                'bi_knowage_id' => $biKnowage->id,
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

    public function update(Request $request, $biKnowageId) {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $biKnowage = BiKnowage::find($biKnowageId);
        $biKnowageText = BiKnowageText::where([
            'bi_knowage_id' => $biKnowageId,
            'language_id' => $userLangId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $biKnowage->update([
                'label' => $request->input('label'),
                'preview' => $request->input('preview'),
                'type' => $request->input('type'),
                'role' => $request->input('role'),
                'dataset_label' => $request->input('dataset_label'),
                'display_toolbar' => $request->input('display_toolbar'),
                'display_sliders' => $request->input('display_sliders'),
                'reset_parameters' => $request->input('reset_parameters'),
                'updated_by' => $userId
            ]);
            $biKnowageText->update([
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

    public function destroy(Request $request, $biKnowageId)
    {
        $userId = $request->user()->id;

        $biKnowage = BiKnowage::find($biKnowageId);
        $biKnowageTexts = BiKnowageText::where('bi_knowage_id', $biKnowageId)->whereNull('deleted_at')->get();

        DB::beginTransaction();
        try {

            foreach ($biKnowageTexts as $biKnowageText) {
                $biKnowageText->update([
                    'deleted_by' => $userId
                ]);
                $biKnowageText->delete();
            }

            $biKnowage->update([
                'deleted_by' => $userId
            ]);
            $biKnowage->delete();

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
