<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\BiEngineResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\BiEngine;
use Log;

class BiEngineController extends Controller
{
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $biEngines = BiEngine::whereNull('deleted_at')->get();

        return BiEngineResource::collection($biEngines);
    }

    public function show(Request $request, $biEngineId)
    {
        $biEngine = BiEngine::find($biEngineId);

        return new BiEngineResource($biEngine);
    }

    public function getBiEngineBiElements(Request $request, $biEngineId)
    {
        $userLangId = $request->user()->language_id;

        $biEngine = BiEngine::with('biElements')->where('id', $biEngineId)->first();

        foreach ($biEngine->biElements as $biEngineElement) {
            $this->getBiElementTextInfo($biEngineElement, $userLangId);
        }

        return new BiEngineResource($biEngine);
    }

    private function getBiElementTextInfo($biElement, $userLangId) {
        list($biElement->language_id, $biElement->name) = $this->getMultilingualConceptName('bi_element_text', 'name',
            'bi_element_id', $biElement->id, $userLangId, true);
        $biElement->description = $this->getMultilingualConceptName('bi_element_text', 'description', 'bi_element_id',
            $biElement->id, $userLangId);
        $biElement->language_abbrv = Language::find($biElement->language_id)->abbrv;
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {

            $biEngine = BiEngine::create([
                'name' => $request->input('name'),
                'logo_preview' => $request->input('logo_preview'),
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

    public function update(Request $request, $biEngineId)
    {
        $userId = $request->user()->id;

        $biEngine = BiEngine::find($biEngineId);

        DB::beginTransaction();
        try {

            $biEngine->update([
                'name' => $request->input('name'),
                'logo_preview' => $request->input('logo_preview'),
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

    public function destroy(Request $request, $biEngineId)
    {
        $userId = $request->user()->id;

        $biEngine = BiEngine::find($biEngineId);

        DB::beginTransaction();
        try {

            $biEngine->update([
                'deleted_by' => $userId
            ]);
            $biEngine->delete();

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
