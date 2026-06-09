<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\CausalLinkResource;
use App\Http\Traits\HTTPResponseTrait;
use App\CausalLink;
use DB;
use Illuminate\Http\Request;
use Log;

class CausalLinkController extends Controller
{
    use HTTPResponseTrait;

    public function index()
    {
        $causalLinks = CausalLink::whereNull('deleted_at')->get();

        return CausalLinkResource::collection($causalLinks);
    }

    public function show($causalLinkId)
    {
        $causalLink = CausalLink::find($causalLinkId);

        return new CausalLinkResource($causalLink);
    }

    public function store(Request $request) {
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {
            $causalLink = CausalLink::create([
                'causing_action' => $request->input('causing_action'),
                'caused_transaction_type_id' => $request->input('caused_transaction_type_id'),
                'caused_t_state_id' => $request->input('caused_t_state_id'),
                'min' => $request->input('min'),
                'max' => $request->input('max'),
                'cancel_proc' => $request->input('cancel_proc'),
                'continue_if_same_user' => $request->input('continue_if_same_user'),
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

    public function update(Request $request, $causalLinkId)
    {
        $userId = $request->user()->id;

        $causalLink = CausalLink::find($causalLinkId);

        DB::beginTransaction();
        try {
            $causalLink->update([
                'causing_action' => $request->input('causing_action'),
                'caused_transaction_type_id' => $request->input('caused_transaction_type_id'),
                'caused_t_state_id' => $request->input('caused_t_state_id'),
                'min' => $request->input('min'),
                'max' => $request->input('max'),
                'cancel_proc' => $request->input('cancel_proc'),
                'continue_if_same_user' => $request->input('continue_if_same_user'),
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

    public function destroy(Request $request, $causalLinkId)
    {
        $userId = $request->user()->id;

        $causalLink = CausalLink::find($causalLinkId);

        DB::beginTransaction();
        try {
            $causalLink->update([
                'deleted_by' => $userId
            ]);
            $causalLink->delete();

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
