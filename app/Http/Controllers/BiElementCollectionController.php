<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\BiElementCollectionResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\BiElementCollection;
use Log;

class BiElementCollectionController extends Controller
{
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $biElementCollections = BiElementCollection::with('biElement')
            ->where('user_id', $userId)->whereNull('deleted_at')->get();

        foreach ($biElementCollections as $biElementCollection) {
            $this->getBiElementCollectionFKNames($biElementCollection, $userLangId);
        }

        return BiElementCollectionResource::collection($biElementCollections);
    }

    private function getBiElementCollectionFKNames($biElementCollection, $userLangId) {
        list($biElementCollection->language_id, $biElementCollection->biElement->name) = $this->getMultilingualConceptName(
            'bi_element_text', 'name', 'bi_element_id',
            $biElementCollection->bi_element_id, $userLangId, true);
        $biElementCollection->language_abbrv = Language::find($biElementCollection->language_id)->abbrv;
        $biElementCollection->biElement->description = $this->getMultilingualConceptName('bi_element_text',
            'description', 'bi_element_id', $biElementCollection->bi_element_id, $userLangId);
    }

    public function show(Request $request, $userId)
    {
        $userLangId = $request->user()->language_id;

        $biElementCollections = BiElementCollection::with('biElement')
            ->where('user_id', $userId)->whereNull('deleted_at')->get();

        foreach ($biElementCollections as $biElementCollection) {
            $this->getBiElementCollectionFKNames($biElementCollection, $userLangId);
        }

        return BiElementCollectionResource::collection($biElementCollections);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;

        $elementAlreadyExistsInCollection = BiElementCollection::onlyTrashed()
            ->where([
                'user_id' => $userId,
                'bi_element_id' => $request->input('bi_element_id')
            ])->first();

        DB::beginTransaction();
        try {

            if ($elementAlreadyExistsInCollection) {
                $elementAlreadyExistsInCollection->restore();
                $elementAlreadyExistsInCollection->update([
                    'deleted_by' => null,
                    'updated_by' => $userId
                ]);
            } else {
                $biElementCollection = BiElementCollection::create([
                    'bi_element_id' => $request->input('bi_element_id'),
                    'user_id' => $userId,
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

    public function destroy(Request $request, $biElementId)
    {
        $userId = $request->user()->id;

        $biElementCollection = BiElementCollection::where([
            'bi_element_id' => $biElementId,
            'user_id' => $userId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $biElementCollection->update([
                'deleted_by' => $userId
            ]);
            $biElementCollection->delete();

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
