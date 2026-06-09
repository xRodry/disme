<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\WaitingLinkResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\WaitingLink;
use DB;
use Illuminate\Http\Request;
use Log;

class WaitingLinkController extends Controller
{
    use HTTPResponseTrait;
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        // TODO See what to do when one of the tasks is deleted
        $waitingLinks = WaitingLink::whereNull('deleted_at')->get();

        foreach($waitingLinks as $waitingLink) {
            $this->getWaitingLinkFKNames($waitingLink, $userLangId);
        }

        return WaitingLinkResource::collection($waitingLinks);
    }

    public function show(Request $request, $waitingLinkId)
    {
        $userLangId = $request->user()->language_id;

        $waitingLink = WaitingLink::find($waitingLinkId);
        $this->getWaitingLinkFKNames($waitingLink, $userLangId);

        return new WaitingLinkResource($waitingLink);
    }

    private function getWaitingLinkFKNames($waitingLink, $userLangId) {
        $waitingLink->waited_t_name = $this->getMultilingualConceptName('transaction_type_name', 't_name',
            'transaction_type_id', $waitingLink->waited_t, $userLangId);
        $waitingLink->waited_act_name = $this->getMultilingualConceptName('t_state_name', 'name',
            't_state_id', $waitingLink->waited_act, $userLangId);
        $waitingLink->waiting_t_name = $this->getMultilingualConceptName('transaction_type_name', 't_name',
            'transaction_type_id', $waitingLink->waiting_t, $userLangId);
        $waitingLink->waiting_act_name = $this->getMultilingualConceptName('t_state_name', 'name',
            't_state_id', $waitingLink->waiting_act, $userLangId);
    }

    public function store(Request $request) {
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {

            $waitingLink = WaitingLink::create([
                'waited_t' => $request->input('waited_t'),
                'waited_act' => $request->input('waited_act'),
                'waiting_t' => $request->input('waiting_t'),
                'waiting_act' => $request->input('waiting_act'),
                'min' => $request->input('min'),
                'max' => $request->input('max'),
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

    public function update(Request $request, $waitingLinkId)
    {
        $userId = $request->user()->id;

        $waitingLink = WaitingLink::find($waitingLinkId);

        DB::beginTransaction();
        try {

            $waitingLink->update([
                'waited_t' => $request->input('waited_t'),
                'waited_act' => $request->input('waited_act'),
                'waiting_t' => $request->input('waiting_t'),
                'waiting_act' => $request->input('waiting_act'),
                'min' => $request->input('min'),
                'max' => $request->input('max'),
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

    public function destroy(Request $request, $waitingLinkId)
    {
        $userId = $request->user()->id;

        $waitingLink = WaitingLink::find($waitingLinkId);

        DB::beginTransaction();
        try {

            $waitingLink->update([
                'deleted_by' => $userId
            ]);
            $waitingLink->delete();

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
