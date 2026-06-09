<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\PropUnitTypeResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use App\PropUnitType;
use App\PropUnitTypeName;
use DB;
use Illuminate\Http\Request;
use Log;

class PropUnitTypeController extends Controller
{
    use HTTPResponseTrait, GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $propUnitTypes = PropUnitType::whereNull('deleted_at')->get();

        foreach($propUnitTypes as $propUnitType) {
            $this->getPropUnitTypeNames($propUnitType, $userLangId);
        }

        return PropUnitTypeResource::collection($propUnitTypes);
    }

    public function show(Request $request, $propUnitTypeId)
    {
        $userLangId = $request->user()->language_id;

        $propUnitType = PropUnitType::find($propUnitTypeId);
        $this->getPropUnitTypeNames($propUnitType, $userLangId);

        return new PropUnitTypeResource($propUnitType);
    }

    private function getPropUnitTypeNames($propUnitType, $userLangId) {
        list($propUnitType->language_id, $propUnitType->name) = $this->getMultilingualConceptName('prop_unit_type_name', 'name',
            'prop_unit_type_id', $propUnitType->id, $userLangId, true);
        $propUnitType->language_abbrv = Language::find($propUnitType->language_id)->abbrv;
    }

    public function store(Request $request) {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {

            $propUnitType = PropUnitType::create([
                'abbrv' => $request->input('abbrv'),
                'state' => $request->input('state'),
                'updated_by' => $userId
            ]);

            $propUnitTypeName = PropUnitTypeName::create([
                'prop_unit_type_id' => $propUnitType->id,
                'language_id' => $langId,
                'name' => $request->input('name'),
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

    public function update(Request $request, $propUnitTypeId)
    {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        $propUnitType = PropUnitType::find($propUnitTypeId);
        $propUnitTypeName = PropUnitTypeName::where([
            'prop_unit_type_id' => $propUnitType->id,
            'language_id' => $langId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $propUnitType->update([
                'abbrv' => $request->input('abbrv'),
                'state' => $request->input('state'),
                'updated_by' => $userId
            ]);
            $propUnitTypeName->update([
                'name' => $request->input('name'),
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

    public function destroy(Request $request, $propUnitTypeId)
    {
        $userId = $request->user()->id;

        $propUnitType = PropUnitType::find($propUnitTypeId);
        $propUnitTypeNames = PropUnitTypeName::where('prop_unit_type_id', $propUnitTypeId)->get();

        DB::beginTransaction();
        try {

            foreach($propUnitTypeNames as $propUnitTypeName) {
                $propUnitTypeName->update([
                    'deleted_by' => $userId
                ]);
                $propUnitTypeName->delete();
            }

            $propUnitType->update([
                'deleted_by' => $userId
            ]);
            $propUnitType->delete();

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string) $success;
    }

    public function translate(Request $request) {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {
            // Check if there has been a PropUnitTypeName for this prop unit type on the user's language that was soft_deleted
            $hasPreviousNameRecord = PropUnitTypeName::onlyTrashed()
                ->where([
                    'prop_unit_type_id' => $request->input('id'),
                    'language_id' => $langId
                ])->first();
            // In case there was, restore that record and update it, so that it reflects the most recent name inserted
            // [as we can't have another entry in the DB for the same prop_unit_type_id & language_id combo]
            if ($hasPreviousNameRecord) {
                $hasPreviousNameRecord->restore();
                $translatedPropUnitTypeName = $hasPreviousNameRecord->update([
                    'deleted_by' => null,
                    'name' => $request->input('name'),
                    'updated_by' => $userId
                ]);
            } else {
                // If there isn't, create a new record for the inserted name
                $translatedPropUnitTypeName = PropUnitTypeName::create([
                    'prop_unit_type_id' => $request->input('id'),
                    'language_id' => $langId,
                    'name' => $request->input('name'),
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
