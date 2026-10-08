<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActionRuleResource;
use App\Http\Traits\HTTPResponseTrait;
use App\Http\Traits\GetMultilingualConceptName;
use App\ActionRule;
use DB;
use Illuminate\Http\Request;
use Log;

class ActionRuleController extends Controller
{
    use HTTPResponseTrait, GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;
        $actionRules = ActionRule::whereNull('deleted_at')->get();

        foreach ($actionRules as $actionRule) {
            $this->hydrateActionRuleFKNames($actionRule, $userLangId);
        }

        return ActionRuleResource::collection($actionRules);
    }

    public function show(Request $request, $actionRuleId)
    {
        $userLangId = $request->user()->language_id;
        $actionRule = ActionRule::find($actionRuleId);
        $this->hydrateActionRuleFKNames($actionRule, $userLangId);

        return new ActionRuleResource($actionRule);
    }

    public function store(Request $request) {
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {

            $actionRule = ActionRule::create([
                't_state_id' => $request->input('t_state_id'),
                'transaction_type_id' => $request->input('transaction_type_id'),
                'type' => $request->input('type'),
                'blockly_xml' => $request->input('blockly_xml'),
                'blockly_code' => $request->input('blockly_code'),
                'preview' => $request->input('preview'),
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

    public function update(Request $request, $actionRuleId)
    {
        $userId = $request->user()->id;

        $actionRule = ActionRule::find($actionRuleId);

        DB::beginTransaction();
        try {

            $actionRule->update([
                't_state_id' => $request->input('t_state_id'),
                'transaction_type_id' => $request->input('transaction_type_id'),
                'type' => $request->input('type'),
                'blockly_xml' => $request->input('blockly_xml'),
                'blockly_code' => $request->input('blockly_code'),
                'preview' => $request->input('preview'),
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

    public function destroy(Request $request, $actionRuleId)
    {
        $userId = $request->user()->id;

        $actionRule = ActionRule::find($actionRuleId);

        DB::beginTransaction();
        try {

            $actionRule->update([
                'deleted_by' => $userId
            ]);
            $actionRule->delete();

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
