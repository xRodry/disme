<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\TransactionStateResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use App\TState;
use App\TStateName;
use DB;
use Illuminate\Http\Request;
use Log;


class TStatesController extends Controller
{

    use HTTPResponseTrait, GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $tStates = TState::whereNull('deleted_at')->get();

        foreach ($tStates as $tState) {
            $this->getTStateNames($tState, $userLangId);
        }

        return TransactionStateResource::collection($tStates);
    }

    public function show(Request $request, $tStateId) {
        $userLangId = $request->user()->language_id;

        $tState = TState::find($tStateId);
        $this->getTStateNames($tState, $userLangId);

        return new TransactionStateResource($tState);
    }

    private function getTStateNames($tState, $userLangId) {
        list($tState->language_id, $tState->name) = $this->getMultilingualConceptName('t_state_name', 'name',
            't_state_id', $tState->id, $userLangId, true);
        $tState->language_abbrv = Language::find($tState->language_id)->abbrv;
        $tState->act_name = $this->getMultilingualConceptName('t_state_name', 'act_name',
            't_state_id', $tState->id, $userLangId);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        DB::beginTransaction();
        try {

            $tState = TState::create([
                'abbrv' => $request->input('abbrv'),
                'updated_by' => $userId
            ]);
            $tStateName = TStateName::create([
                't_state_id' => $tState->id,
                'language_id' => $userLangId,
                'name' => $request->input('name'),
                'act_name' => $request->input('act_name'),
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

    public function update(Request $request, $tStateId)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $tState = TState::find($tStateId);
        $tStateName = TStateName::where([
            't_state_id' => $tStateId,
            'language_id' => $userLangId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $tState->update([
                'abbrv' => $request->input('abbrv'),
                'updated_by' => $userId
            ]);
            $tStateName->update([
                'name' => $request->input('name'),
                'act_name' => $request->input('act_name'),
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

    public function destroy(Request $request, $tStateId)
    {
        $userId = $request->user()->id;

        $tState = TState::find($tStateId);
        $tStateNames = TStateName::where('t_state_id', $tStateId)->whereNull('deleted_at')->get();

        DB::beginTransaction();
        try {

            foreach ($tStateNames as $tStateName) {
                $tStateName->update([
                    'deleted_by' => $userId
                ]);
                $tStateName->delete();
            }

            $tState->update([
                'deleted_by' => $userId
            ]);
            $tState->delete();

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string) $success;
    }

}
