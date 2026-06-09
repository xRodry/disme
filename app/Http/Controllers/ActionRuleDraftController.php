<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\ActionRuleDraft;
use App\Http\Resources\ActionRuleDraftResource;
use App\Http\Traits\HTTPResponseTrait;
use DB;
use Illuminate\Http\Request;
use Log;

class ActionRuleDraftController extends Controller
{
    use HTTPResponseTrait;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $actionRuleDrafts = ActionRuleDraft::where('language_id', $userLangId)->whereNull('deleted_at')->get();

        return ActionRuleDraftResource::collection($actionRuleDrafts);
    }

    public function show(Request $request, $actionRuleDraftId)
    {
        $actionRuleDraft = ActionRuleDraft::find($actionRuleDraftId);

        return new ActionRuleDraftResource($actionRuleDraft);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        DB::beginTransaction();
        try {

            $actionRuleDraft = ActionRuleDraft::create([
                'language_id' => $userLangId,
                'name' => $request->input('name'),
                'blockly_xml' => $request->input('blockly_xml'),
                'preview' => $request->input('preview'),
                'updated_by' => $userId
            ]);

            DB::commit();
            return new ActionRuleDraftResource($actionRuleDraft);
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
            // something went wrong
        }
        return (string)$success;
    }

    public function update(Request $request, $actionRuleDraftId)
    {
        $userId = $request->user()->id;

        $actionRuleDraft = ActionRuleDraft::find($actionRuleDraftId);

        DB::beginTransaction();
        try {

            $actionRuleDraft->update([
                'name' => $request->input('name'),
                'blockly_xml' => $request->input('blockly_xml'),
                'preview' => $request->input('preview'),
                'updated_by' => $userId
            ]);

            DB::commit();
            return new ActionRuleDraftResource($actionRuleDraft);
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string) $success;
    }

    public function destroy(Request $request, $actionRuleDraftId)
    {
        $userId = $request->user()->id;

        $actionRuleDraft = ActionRuleDraft::find($actionRuleDraftId);

        DB::beginTransaction();
        try {

            $actionRuleDraft->update([
                'deleted_by' => $userId
            ]);
            $actionRuleDraft->delete();

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
