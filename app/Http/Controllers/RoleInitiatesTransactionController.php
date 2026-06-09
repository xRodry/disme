<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\RoleInitiatesTransactionResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\RoleInitiatesTransaction;
use DB;
use Illuminate\Http\Request;
use Log;

class RoleInitiatesTransactionController extends Controller
{
    use HTTPResponseTrait, GetMultilingualConceptName;

    public function index(Request $request) {
        $userLangId = $request->user()->language_id;
        $roleInitiatesTransactions = DB::table('role_initiates_transaction')
            ->join('role', 'role_initiates_transaction.role_id', '=', 'role.id')
            ->join('transaction_type', 'role_initiates_transaction.transaction_type_id', '=', 'transaction_type.id')
            ->select('role_initiates_transaction.*')
            ->whereNull(['role_initiates_transaction.deleted_at', 'transaction_type.deleted_at', 'role.deleted_at'])
            ->get();

        foreach ($roleInitiatesTransactions as $roleInitiatesTransaction) {
            $this->getRoleInitiatesTransactionFKNames($roleInitiatesTransaction, $userLangId);
        }

        return RoleInitiatesTransactionResource::collection($roleInitiatesTransactions);
    }

    public function show(Request $request, $roleId, $transactionTypeId)
    {
        $userLangId = $request->user()->language_id;

        $roleInitiatesTransaction = DB::table('role_initiates_transaction')
            ->join('role', 'role_initiates_transaction.role_id', '=', 'role.id')
            ->join('transaction_type', 'role_initiates_transaction.transaction_type_id', '=', 'transaction_type.id')
            ->select('role_initiates_transaction.*')
            ->where([
                'role_initiates_transaction.role_id' => $roleId,
                'role_initiates_transaction.transaction_type_id' => $transactionTypeId
            ])
            ->whereNull(['role_initiates_transaction.deleted_at', 'transaction_type.deleted_at', 'role.deleted_at'])
            ->first();

        $this->getRoleInitiatesTransactionFKNames($roleInitiatesTransaction, $userLangId);

        return new RoleInitiatesTransactionResource($roleInitiatesTransaction);
    }

    private function getRoleInitiatesTransactionFKNames($roleInitiatesTransaction, $userLangId) {
        $roleInitiatesTransaction->transaction_type_name = $this->getMultilingualConceptName('transaction_type_name',
            't_name', 'transaction_type_id', $roleInitiatesTransaction->transaction_type_id, $userLangId);
        $roleInitiatesTransaction->role_name = $this->getMultilingualConceptName('role_name', 'name',
            'role_id', $roleInitiatesTransaction->role_id, $userLangId);
    }

    public function store(Request $request) {
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {

            // Check if there has been a previous RoleInitiatesTransaction for this role and transaction_type that was soft_deleted
            $hasPreviousAttributionRecord = RoleInitiatesTransaction::onlyTrashed()
                ->where([
                    'role_id' => $request->input('role_id'),
                    'transaction_type_id' => $request->input('transaction_type_id')
                ])->first();
            // In case there was, restore that record and update it, so that it is enabled again
            // [as we can't have another entry in the DB for the same role_id & transaction_type_id combo]
            if ($hasPreviousAttributionRecord) {
                $hasPreviousAttributionRecord->restore();
                $roleInitiatesTransaction = $hasPreviousAttributionRecord->update([
                    'deleted_by' => null,
                    'own_user_access_only' => $request->input('own_user_access_only'),
                    'updated_by' => $userId
                ]);
            } else {
                // If there isn't, create a new record for the new user role
                $roleInitiatesTransaction = RoleInitiatesTransaction::create([
                    'role_id' => $request->input('role_id'),
                    'transaction_type_id' => $request->input('transaction_type_id'),
                    'own_user_access_only' => $request->input('own_user_access_only'),
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

    public function update(Request $request, $roleId, $transactionTypeId)
    {
        $userId = $request->user()->id;
        $previousRoleId = $request->input('previous_role_id');

        $alreadyHadNewRoleInitiatesTransactionRecord = null;

        // For when we're changing the roleId attached to this transactionType, see if the new combination already
        // existed in the system and had been soft_deleted. In this case, we restore it instead of creating a new record.
        if ((int)$roleId !== (int)$previousRoleId) {
            $alreadyHadNewRoleInitiatesTransactionRecord = RoleInitiatesTransaction::onlyTrashed()
            ->where([
                'role_id' => $roleId,
                'transaction_type_id' => $transactionTypeId
            ])->first();
        }

        // The current record that needs updating/deleting (if the roleId has been changed)
        $roleInitiatesTransactionRecord = RoleInitiatesTransaction::where([
            'role_id' => $previousRoleId,
            'transaction_type_id' => $transactionTypeId
        ])->first();

        DB::beginTransaction();
        try {
            // In case user has changed the role of the combination when editing it
            if ((int)$roleId !== (int)$previousRoleId) {
                // Delete the current combination of role + transactionType before the role was changed
                $roleInitiatesTransactionRecord->update([
                    'updated_by' => $userId
                ]);
                $roleInitiatesTransactionRecord->delete();
                // If the new combination of role + transactionType had already been in the system and was after soft_deleted
                // Restore it. If there was no record of this new combination on the database, create it.
                if ($alreadyHadNewRoleInitiatesTransactionRecord) {
                    $alreadyHadNewRoleInitiatesTransactionRecord->restore();
                    $alreadyHadNewRoleInitiatesTransactionRecord->update([
                        'own_user_access_only' => $request->input('own_user_access_only'),
                        'deleted_by' => null,
                        'updated_by' => $userId
                    ]);
                } else {
                    RoleInitiatesTransaction::create([
                        'role_id' => $roleId,
                        'transaction_type_id' => $transactionTypeId,
                        'own_user_access_only' => $request->input('own_user_access_only'),
                        'updated_by' => $userId
                    ]);
                }
            } else {
                // In case the role assigned to this transactionType hasn't changed, and we're just updating the
                // 'own user access only' flag
                $roleInitiatesTransactionRecord->update([
                    'own_user_access_only' => $request->input('own_user_access_only'),
                    'updated_by' => $userId
                ]);
            }

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string) $success;
    }

    public function destroy(Request $request, $roleId, $transactionTypeId)
    {
        $userId = $request->user()->id;

        $roleInitiatesTransaction = RoleInitiatesTransaction::where([
            'role_id' => $roleId,
            'transaction_type_id' => $transactionTypeId
        ])->first();

        DB::beginTransaction();
        try {

            $roleInitiatesTransaction->update([
                'deleted_by' => $userId
            ]);
            $roleInitiatesTransaction->delete();

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
