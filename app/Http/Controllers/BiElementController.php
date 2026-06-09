<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\BiElementCollection;
use App\BiEngine;
use App\BiKnowage;
use App\Http\Resources\BiElementResource;
use App\Http\Resources\BiWidgetCountResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\BiElement;
use App\BiElementText;
use App\BiElementType;
use Log;
use stdClass;

class BiElementController extends Controller
{
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $biElements = BiElement::whereNull('deleted_at')->get();

        foreach($biElements as $biElement) {
            $this->getBiElementTextInfo($biElement, $userLangId);
        }

        return BiElementResource::collection($biElements);
    }

    private function getBiElementTextInfo($biElement, $userLangId) {
        list($biElement->language_id, $biElement->name) = $this->getMultilingualConceptName('bi_element_text', 'name',
            'bi_element_id', $biElement->id, $userLangId, true);
        $biElement->description = $this->getMultilingualConceptName('bi_element_text', 'description', 'bi_element_id',
            $biElement->id, $userLangId);
        $biElement->language_abbrv = Language::find($biElement->language_id)->abbrv;
        $this->getBiElementFkNames($biElement);
    }

    private function getBiElementFkNames($biElement) {
        $biElement->type_slug = BiElementType::find($biElement->bi_element_type_id)->slug;
        $biElement->engine_name = BiEngine::find($biElement->bi_engine_id)->name;
    }

    public function show(Request $request, $biElementId)
    {
        $userLangId = $request->user()->language_id;

        $biElement = BiElement::find($biElementId);

        $this->getBiElementTextInfo($biElement, $userLangId);

        return new BiElementResource($biElement);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        DB::beginTransaction();
        try {
            $biElement = BiElement::create([
                'bi_engine_id' => $request->input('bi_engine_id'),
                'bi_element_type_id' => $request->input('bi_element_type_id'),
                'preview' => $request->input('preview'),
                'embed' => $request->input('embed'),
                'updated_by' => $userId
            ]);
            $biElementText = BiElementText::create([
                'bi_element_id' => $biElement->id,
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

    public function update(Request $request, $biElementId)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $biElement = BiElement::find($biElementId);
        $biElementText = BiElementText::where([
            'bi_element_id' => $biElement->id,
            'language_id' => $userLangId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $biElement->update([
                'bi_engine_id' => $request->input('bi_engine_id'),
                'bi_element_type_id' => $request->input('bi_element_type_id'),
                'preview' => $request->input('preview'),
                'embed' => $request->input('embed'),
                'updated_by' => $userId
            ]);
            $biElementText->update([
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

    public function destroy(Request $request, $biElementId)
    {
        $userId = $request->user()->id;

        $biElement = BiElement::find($biElementId);
        $biElementTexts = BiElementText::where('bi_element_id', $biElementId)->whereNull('deleted_at')->get();
        $biElementCollections = BiElementCollection::where('bi_element_id', $biElementId)->whereNull('deleted_at')->get();

        DB::beginTransaction();
        try {

            foreach ($biElementCollections as $biElementCollection) {
                $biElementCollection->update([
                    'deleted_by' => $userId
                ]);
                $biElementCollection->delete();
            }

            foreach ($biElementTexts as $biElementText) {
                $biElementText->update([
                    'deleted_by' => $userId
                ]);
                $biElementText->delete();
            }

            $biElement->update([
                'deleted_by' => $userId
            ]);
            $biElement->delete();

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

    public function getBiWidgetCounts(Request $request)
    {
        $biWidgetCounter = new StdClass();
        $biWidgetCounter->biElementsCount = BiElement::whereNull('deleted_at')->count();
        $biWidgetCounter->biElementTypeCount = BiElementType::whereNull('deleted_at')->count();
        $biWidgetCounter->biKnowageCount = BiKnowage::whereNull('deleted_at')->count();
        $biWidgetCounter->biEngineCount = BiEngine::whereNull('deleted_at')->count();

        return new BiWidgetCountResource($biWidgetCounter);
    }
}
