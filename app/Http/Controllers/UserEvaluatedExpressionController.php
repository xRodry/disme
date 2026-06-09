<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\ConditionHasUserEvaluatedExpression;
use App\Http\Resources\UserEvaluatedExpressionResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use App\UserEvaluatedExpression;
use App\UserEvaluatedExpressionText;
use DB;
use Illuminate\Http\Request;
use Log;

class UserEvaluatedExpressionController extends Controller
{
    use HTTPResponseTrait;
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $userEvaluatedExpressions = UserEvaluatedExpression::whereNull('deleted_at')->get();

        foreach($userEvaluatedExpressions as $userEvaluatedExpression) {
            $this->getUserEvaluatedExpressionNameInfo($userEvaluatedExpression, $userLangId);
        }

        return UserEvaluatedExpressionResource::collection($userEvaluatedExpressions);
    }

    public function show(Request $request, $userEvaluatedExpressionId)
    {
        $userLangId = $request->user()->language_id;

        $userEvaluatedExpression = UserEvaluatedExpression::find($userEvaluatedExpressionId);
        $this->getUserEvaluatedExpressionNameInfo($userEvaluatedExpression, $userLangId);

        return new UserEvaluatedExpressionResource($userEvaluatedExpression);
    }

    private function getUserEvaluatedExpressionNameInfo($userEvaluatedExpression, $userLangId) {
        list($userEvaluatedExpression->language_id, $userEvaluatedExpression->expression_name) =
            $this->getMultilingualConceptName('user_evaluated_expression_text', 'expression_name',
            'user_evaluated_expression_id', $userEvaluatedExpression->id, $userLangId, true);
        $userEvaluatedExpression->language_abbrv = Language::find($userEvaluatedExpression->language_id)->abbrv;
        $userEvaluatedExpression->expression_text = $this->getMultilingualConceptName('user_evaluated_expression_text',
            'expression_text', 'user_evaluated_expression_id', $userEvaluatedExpression->id, $userLangId, false, true);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        DB::beginTransaction();
        try {

            $userEvaluatedExpression = UserEvaluatedExpression::create([
                'updated_by' => $userId
            ]);
            $userEvaluatedExpressionText = UserEvaluatedExpressionText::create([
                'user_evaluated_expression_id' => $userEvaluatedExpression->id,
                'expression_name' => $request->input('expression_name'),
                'expression_text' => $request->input('expression_text'),
                'language_id' => $userLangId,
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

    public function update(Request $request, $userEvaluatedExpressionId)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $userEvaluatedExpressionText = UserEvaluatedExpressionText::where([
            'user_evaluated_expression_id' => $userEvaluatedExpressionId,
            'language_id' => $userLangId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $userEvaluatedExpressionText->update([
                'expression_name' => $request->input('expression_name'),
                'expression_text' => $request->input('expression_text'),
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

    public function destroy(Request $request, $userEvaluatedExpressionId)
    {
        $userId = $request->user()->id;

        // If userEvaluatedExpression is inside an active Action Rule, don't delete it and warn the user
        $beingUsedInActionRule = ConditionHasUserEvaluatedExpression::whereHas('condition.action.actionRule', function($query){
            $query->whereNull('deleted_at');
        })->where('user_evaluated_expression_id', $userEvaluatedExpressionId)
            ->whereNull('deleted_by')->get();

        if (count($beingUsedInActionRule) != 0) {
            return response()->json([
                'belongsAR' => 'true'
            ]);
        }

        $userEvaluatedExpression = UserEvaluatedExpression::find($userEvaluatedExpressionId);
        $userEvaluatedExpressionTexts = UserEvaluatedExpressionText::where('user_evaluated_expression_id',
            $userEvaluatedExpressionId)->whereNull('deleted_at')->get();

        DB::beginTransaction();
        try {

            foreach ($userEvaluatedExpressionTexts as $userEvaluatedExpressionText) {
                $userEvaluatedExpressionText->update([
                    'deleted_by' => $userId
                ]);
                $userEvaluatedExpressionText->delete();
            }

            $userEvaluatedExpression->update([
                'deleted_by' => $userId
            ]);
            $userEvaluatedExpression->delete();

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
            // Check if there has been a UserEvaluatedExpressionText for this expression on the user's language that was soft_deleted
            $hasPreviousNameRecord = UserEvaluatedExpressionText::onlyTrashed()
                ->where([
                    'user_evaluated_expression_id' => $request->input('id'),
                    'language_id' => $userLangId
                ])->first();
            // In case there was, restore that record and update it, so that it reflects the most recent name inserted
            // [as we can't have another entry in the DB for the same user_evaluated_expression_id & language_id combo]
            if ($hasPreviousNameRecord) {
                $hasPreviousNameRecord->restore();
                $hasPreviousNameRecord->update([
                    'deleted_by' => null,
                    'expression_name' => $request->input('expression_name'),
                    'expression_text' => $request->input('expression_text'),
                    'updated_by' => $userId
                ]);
            } else {
                // If there isn't, create a new record for the inserted name
                UserEvaluatedExpressionText::create([
                    'user_evaluated_expression_id' => $request->input('id'),
                    'language_id' => $userLangId,
                    'expression_name' => $request->input('expression_name'),
                    'expression_text' => $request->input('expression_text'),
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
