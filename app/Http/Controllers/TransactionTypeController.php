<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\TransactionTypeResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use App\RoleInitiatesTransaction;
use App\TransactionType;
use App\TransactionTypeHasRestrictionQuery;
use App\TransactionTypeName;
use DB;
use Illuminate\Http\Request;
use Log;

class TransactionTypeController extends Controller
{
    use HTTPResponseTrait, GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $transactionTypes =  TransactionType::whereNull('deleted_at')->get();

        foreach ($transactionTypes as $transactionType) {
            $this->getTransactionTypeFKNamesAndInitiatorRoles($transactionType, $userLangId);
            $this->checkAndAddRestrictionQuery($transactionType);
        }


        return TransactionTypeResource::collection($transactionTypes);
    }

    public function show(Request $request, $transactionTypeId)
    {
        $userLangId = $request->user()->language_id;

        $transactionType = TransactionType::find($transactionTypeId);
        $this->getTransactionTypeFKNamesAndInitiatorRoles($transactionType, $userLangId);
        $this->checkAndAddRestrictionQuery($transactionType);

        return new TransactionTypeResource($transactionType);
    }

    private function getTransactionTypeFKNamesAndInitiatorRoles($transactionType, $userLangId) {
        list($transactionType->language_id, $transactionType->t_name) = $this->getMultilingualConceptName('transaction_type_name', 't_name',
            'transaction_type_id', $transactionType->id, $userLangId, true);
        $transactionType->rt_name = $this->getMultilingualConceptName('transaction_type_name', 'rt_name',
            'transaction_type_id', $transactionType->id, $userLangId);
        $transactionType->executer_role_name = $this->getMultilingualConceptName('role_name', 'name',
            'role_id', $transactionType->executer_role_id, $userLangId);
        $transactionType->process_type_name = $this->getMultilingualConceptName('process_type_name', 'name',
            'process_type_id', $transactionType->process_type_id, $userLangId);

        $transactionType->language_abbrv = Language::find($transactionType->language_id)->abbrv;

        $transactionType->initiator_roles = RoleInitiatesTransaction::where('transaction_type_id', $transactionType->id)
            ->whereNull('deleted_at')->get();
        foreach ($transactionType->initiator_roles as $initiatorRole) {
            $initiatorRole->role_name = $this->getMultilingualConceptName('role_name', 'name',
                'role_id', $initiatorRole->role_id, $userLangId);
        }
    }

    private function checkAndAddRestrictionQuery($transactionType) {
        $hasRestrictionQuery = TransactionTypeHasRestrictionQuery::where('transaction_type_id', $transactionType->id)
            ->whereNull('deleted_at')->first();
        if ($hasRestrictionQuery) {
            $transactionType->restriction_query_id = $hasRestrictionQuery->query_id;
        }
    }

    public function store(Request $request) {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {

            $transactionType = TransactionType::create([
                'state' => $request->input('state'),
                'process_type_id' => $request->input('process_type_id'),
                'init_proc' => $request->input('init_proc'),
                'end_proc' => $request->input('end_proc'),
                'interm_task' => $request->input('interm_task'),
                'external' => $request->input('external'),
                'type' => $request->input('type'),
                'frontier' => $request->input('frontier'),
                'frontier_type' => $request->input('frontier_type'),
                'executer_role_id' => $request->input('executer_role_id'),
                'own_user_access_only' => $request->input('own_user_access_only'),
                'auto_activate' => $request->input('auto_activate'),
                'freq_activate' => $request->input('freq_activate'),
                'when_activate' => $request->input('when_activate'),
                'updated_by' => $userId
            ]);

            if ($request->input('restriction_query_id')) {
                TransactionTypeHasRestrictionQuery::create([
                    'transaction_type_id' => $transactionType->id,
                    'query_id' => $request->input('restriction_query_id'),
                    'updated_by' => $userId
                ]);
            }

            $transactionTypeName = TransactionTypeName::create([
                'transaction_type_id' => $transactionType->id,
                'language_id' => $langId,
                't_name' => $request->input('t_name'),
                'rt_name' => $request->input('rt_name'),
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

    public function update(Request $request, $transactionTypeId)
    {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        $transactionType = TransactionType::find($transactionTypeId);
        $transactionTypeName = TransactionTypeName::where([
            'transaction_type_id' => $transactionType->id,
            'language_id' => $langId
        ])->whereNull('deleted_at')->first();
        $currentRestrictionQuery = TransactionTypeHasRestrictionQuery::where('transaction_type_id', $transactionType->id)
            ->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $transactionType->update([
                'state' => $request->input('state'),
                'process_type_id' => $request->input('process_type_id'),
                'init_proc' => $request->input('init_proc'),
                'end_proc' => $request->input('end_proc'),
                'interm_task' => $request->input('interm_task'),
                'external' => $request->input('external'),
                'type' => $request->input('type'),
                'frontier' => $request->input('frontier'),
                'frontier_type' => $request->input('frontier_type'),
                'executer_role_id' => $request->input('executer_role_id'),
                'own_user_access_only' => $request->input('own_user_access_only'),
                'auto_activate' => $request->input('auto_activate'),
                'freq_activate' => $request->input('freq_activate'),
                'when_activate' => $request->input('when_activate'),
                'updated_by' => $userId
            ]);

            $updatedRestrictionQueryId = $request->input('restriction_query_id');
            $this->updateRestrictionQuery($transactionTypeId, $currentRestrictionQuery, $updatedRestrictionQueryId, $userId);

            $transactionTypeName->update([
                't_name' => $request->input('t_name'),
                'rt_name' => $request->input('rt_name'),
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

    private function updateRestrictionQuery($transactionTypeId, $currentRestrictionQuery, $updatedRestrictionQueryId, $userId)
    {
        // If there was already a previous restriction query for this transactionType, save it
        $currentRestrictionQueryId = $currentRestrictionQuery ? $currentRestrictionQuery->query_id : null;
        // There's really only the need to update if it has changed from the last transactionType specification
        if ($currentRestrictionQueryId !== $updatedRestrictionQueryId) {
            // If it has changed, and had a previous assignment, delete that assignment
            if ($currentRestrictionQuery) {
                $currentRestrictionQuery->update([
                    'deleted_by' => $userId
                ]);
                $currentRestrictionQuery->delete();
            }
            // If the restriction query was simply deleted, it's already done, no need to check anything more
            // If it was changes, create the new restrictionQuery link (or update an existing deleted one)
            if ($updatedRestrictionQueryId) {
                // For when we're changing the restrictionQuery attached to this transactionType, see if the new combination already
                // existed in the system and had been soft_deleted. In this case, we restore it instead of creating a new record.
                $alreadyHadThisRestrictionQueryAssigned = TransactionTypeHasRestrictionQuery::onlyTrashed()
                    ->where([
                        'transaction_type_id' => $transactionTypeId,
                        'query_id' => $updatedRestrictionQueryId
                    ])->first();

                if ($alreadyHadThisRestrictionQueryAssigned) {
                    $alreadyHadThisRestrictionQueryAssigned->restore();
                    $alreadyHadThisRestrictionQueryAssigned->update([
                        'deleted_by' => null,
                        'updated_by' => $userId
                    ]);
                } else {
                    TransactionTypeHasRestrictionQuery::create([
                        'transaction_type_id' => $transactionTypeId,
                        'query_id' => $updatedRestrictionQueryId,
                        'updated_by' => $userId
                    ]);
                }
            }
        }
    }

    public function destroy(Request $request, $transactionTypeId)
    {
        $userId = $request->user()->id;

        $transactionType = TransactionType::find($transactionTypeId);
        $transactionTypeNames = TransactionTypeName::where('transaction_type_id', $transactionTypeId)->get();
        $transactionTypeRestrictionQuery = TransactionTypeHasRestrictionQuery::where('transaction_type_id', $transactionTypeId)
            ->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            foreach($transactionTypeNames as $transactionTypeName) {
                $transactionTypeName->update([
                    'deleted_by' => $userId
                ]);
                $transactionTypeName->delete();
            }

            if ($transactionTypeRestrictionQuery) {
                $transactionTypeRestrictionQuery->update([
                    'deleted_by' => $userId
                ]);
                $transactionTypeRestrictionQuery->delete();
            }

            $transactionType->update([
                'deleted_by' => $userId
            ]);
            $transactionType->delete();

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
            // Check if there has been a TransactionTypeName for this transaction type on the user's language that was soft_deleted
            $hasPreviousNameRecord = TransactionTypeName::onlyTrashed()
                ->where([
                    'transaction_type_id' => $request->input('id'),
                    'language_id' => $langId
                ])->first();
            // In case there was, restore that record and update it, so that it reflects the most recent name inserted
            // [as we can't have another entry in the DB for the same transaction_type_id & language_id combo]
            if ($hasPreviousNameRecord) {
                $hasPreviousNameRecord->restore();
                $translateTransactionTypeName = $hasPreviousNameRecord->update([
                    'deleted_by' => null,
                    't_name' => $request->input('t_name'),
                    'rt_name' => $request->input('rt_name'),
                    'updated_by' => $userId
                ]);
            } else {
                // If there isn't, create a new record for the inserted name
                $translateTransactionTypeName = TransactionTypeName::create([
                    'transaction_type_id' => $request->input('id'),
                    'language_id' => $langId,
                    't_name' => $request->input('t_name'),
                    'rt_name' => $request->input('rt_name'),
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
