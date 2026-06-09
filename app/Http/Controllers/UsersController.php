<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Entity;
use App\EntType;
use App\Http\Resources\UserResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Http\Traits\StoreFormInputTrait;
use App\Process;
use App\ProcessType;
use App\Transaction;
use App\User;
use App\Users;
use DB;
use Illuminate\Http\Request;
use Log;

class UsersController extends Controller
{
    use HTTPResponseTrait, GetMultilingualConceptName, StoreFormInputTrait;

    public function index(Request $request)
    {
        $users = Users::join('language', 'users.language_id', '=', 'language.id')
            ->leftJoin('entity', 'users.entity_id', '=', 'entity.id')
            ->select('users.*', 'language.abbrv as language_abbrv', 'entity.ent_type_id as ent_type_id')
            ->whereNull('users.deleted_at')->get();

        return UserResource::collection($users);
    }

    public function show(Request $request, $userId)
    {
        $user = Users::join('language', 'users.language_id', '=', 'language.id')
            ->leftJoin('entity', 'users.entity_id', '=', 'entity.id')
            ->select('users.*', 'language.abbrv as language_abbrv', 'entity.ent_type_id as ent_type_id')
            ->where('users.id', $userId)
            ->whereNull('users.deleted_at')->first();

        return new UserResource($user);
    }

    public function store(Request $request) {

        $updatingUserId = $request->user()->id;
        $langId = $request->user()->language_id;

        DB::beginTransaction();
        try {

            $user = User::create([
                'name' => $request->input('name'),
                'nif' => $request->input('nif'),
                'email' => $request->input('email'),
                'password' => bcrypt($request->input('password')),
                'user_name' => $request->input('user_name'),
                'language_id' => $request->input('language_id'),
                'user_type'=> "internal",
            ]);

            if ($request->input('user_details')) {
                // Create an entity for the selected 'user details' entity type, so we can store the specified user details in it
                $entity = $this->createUserEntity($request->input('ent_type_id'), $updatingUserId);
                $userDetailsProperties = $request->input('user_details');
                // Save each 'user details' property's value
                foreach ($userDetailsProperties as $propertyId => $propertyValue) {
                    $this->savePropertyValue($propertyId, $propertyValue, $entity->id, null, null, $updatingUserId, $langId);
                }

                $user->update([
                    'entity_id' => $entity->id,
                    'updated_by' => $updatingUserId
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

    public function update(Request $request, $userId)
    {

        $updatingUserId = $request->user()->id;
        $langId = $request->user()->language_id;

        $user = Users::find($userId);

        DB::beginTransaction();
        try {

            $user->update([
                'name' => $request->input('name'),
                'nif' => $request->input('nif'),
                'email' => $request->input('email'),
                'password' => bcrypt($request->input('password')),
                'user_name' => $request->input('user_name'),
                'language_id' => $request->input('language_id'),
                'user_type'=> "internal",
                'updated_by' => $updatingUserId
            ]);

            // Update/Create the user's 'user details' entity, in case one has been specified
            if ($request->input('user_details')) {
                $entity = $request->input('entity_id') ? Entity::find($request->input('entity_id')) : $this->createUserEntity($request->input('ent_type_id'), $updatingUserId);
                // If the user's entity_type/entity is the same, update the 'user details' properties values
                $userDetailsProperties = $request->input('user_details');
                foreach ($userDetailsProperties as $propertyId => $propertyValue) {
                    $this->savePropertyValue($propertyId, $propertyValue, $entity->id, null, null, $updatingUserId, $langId);
                }
            }

            // Save the updated userDetails entity in the user table, or remove it if the user had one and no longer has
            $updatedEntityId = isset($entity) ? $entity->id : null;
            $this->saveUserEntity($user->id, $updatedEntityId, $updatingUserId);

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string) $success;
    }

    public function destroy(Request $request, $userId)
    {

        $updatingUserId = $request->user()->id;

        $user = Users::find($userId);

        DB::beginTransaction();
        try {

            $this->deleteUserDetailsEntity($user->entity_id, $updatingUserId);
            $user->delete();

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string) $success;
    }

    private function createUserEntity($entTypeId, $updatingUserId) {

        $entityType = EntType::find($entTypeId);
        $process = $this->createProcess($entityType->transactionType->processType->id, $updatingUserId);
        $transaction = $this->createTransaction($process->id, $entityType->transactionType->id, $updatingUserId);

        $entity = Entity::create([
            'internal_id' => $entityType->last_internal_id + 1,
            'ent_type_id' => $entTypeId,
            'state' => 'active',
            'transaction_id' => $transaction->id,
            'updated_by' => $updatingUserId
        ]);
        $entityType->update([
            'last_internal_id' => $entity->internal_id,
            'updated_by' => $updatingUserId
        ]);

        return $entity;
    }

    private function createProcess($processTypeId, $updatingUserId) {
        $processType = ProcessType::find($processTypeId);

        $process = Process::create([
            'internal_id' => $processType->last_internal_id + 1,
            'process_type_id' => $processType->id,
            'proc_state' => 'finished',
            'state' => 'active',
            'updated_by' => $updatingUserId
        ]);

        $processType->update([
            'last_internal_id' => $process->internal_id,
            'updated_by' => $updatingUserId
        ]);
        return $process;
    }

    private function createTransaction($processId, $transactionTypeId, $updatingUserId) {
        return Transaction::create([
            'transaction_type_id' => $transactionTypeId,
            'state' => 'active',
            'process_id' => $processId,
            'updated_by' => $updatingUserId
        ]);
    }
}
