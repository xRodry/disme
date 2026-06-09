<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Constant;
use App\ConstantName;
use App\Http\Resources\ConstantResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use DB;
use Illuminate\Http\Request;
use Log;

class ConstantController extends Controller
{
    use HTTPResponseTrait;
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $constants = Constant::whereNull('deleted_at')->get();

        foreach($constants as $constant) {
            $this->getConstantNameInfo($constant, $userLangId);
        }

        return ConstantResource::collection($constants);
    }

    public function show(Request $request, $constantId)
    {
        $userLangId = $request->user()->language_id;

        $constant = Constant::find($constantId);
        $this->getConstantNameInfo($constant, $userLangId);

        return new ConstantResource($constant);
    }

    private function getConstantNameInfo($constant, $userLangId) {
        list($constant->language_id, $constant->name) =
            $this->getMultilingualConceptName('constant_name', 'name', 'constant_id',
                $constant->id, $userLangId, true);
        $constant->language_abbrv = Language::find($constant->language_id)->abbrv;
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        DB::beginTransaction();
        try {

            $constant = Constant::create([
                'value' => $request->input('value'),
                'value_type' => $request->input('value_type'),
                'updated_by' => $userId
            ]);
            $constantName = ConstantName::create([
                'constant_id' => $constant->id,
                'language_id' => $userLangId,
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

    public function update(Request $request, $constantId)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $constant = Constant::find($constantId);
        $constantName = ConstantName::where([
            'constant_id' => $constantId,
            'language_id' => $userLangId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $constant->update([
                'value' => $request->input('value'),
                'value_type' => $request->input('value_type'),
                'updated_by' => $userId
            ]);
            $constantName->update([
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

    public function destroy(Request $request, $constantId)
    {
        $userId = $request->user()->id;

        $constant = Constant::find($constantId);
        $constantNames = ConstantName::where('constant_id', $constantId)->whereNull('deleted_at')->get();

        DB::beginTransaction();
        try {

            foreach ($constantNames as $constantName) {
                $constantName->update([
                    'deleted_by' => $userId
                ]);
                $constantName->delete();
            }

            $constant->update([
                'deleted_by' => $userId
            ]);
            $constant->delete();

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
            // Check if there has been a name for this constant on the user's language that was soft_deleted
            $hasPreviousNameRecord = ConstantName::onlyTrashed()
                ->where([
                    'constant_id' => $request->input('id'),
                    'language_id' => $userLangId
                ])->first();
            // In case there was, restore that record and update it, so that it reflects the most recent name inserted
            // [as we can't have another entry in the DB for the same constant_id & language_id combo]
            if ($hasPreviousNameRecord) {
                $hasPreviousNameRecord->restore();
                $hasPreviousNameRecord->update([
                    'name' => $request->input('name'),
                    'updated_by' => $userId,
                    'deleted_by' => null,
                ]);
            } else {
                // If there isn't, create a new record for the inserted name
                ConstantName::create([
                    'constant_id' => $request->input('id'),
                    'language_id' => $userLangId,
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
