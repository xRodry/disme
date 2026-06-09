<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\RoleHasUserResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\RoleHasUser;
use DB;
use Illuminate\Http\Request;
use Log;

class RoleHasUserController extends Controller
{
    use HTTPResponseTrait, GetMultilingualConceptName;

    public function index(Request $request) {
        $userLangId = $request->user()->language_id;

        $roleHasUsers = DB::table('role_has_user')
            ->join('users', 'role_has_user.user_id', '=', 'users.id')
            ->join('role', 'role_has_user.role_id', '=', 'role.id')
            ->select('role_has_user.*')
            ->whereNull(['role_has_user.deleted_at', 'role.deleted_at', 'users.deleted_at'])
            ->get();

        foreach ($roleHasUsers as $roleHasUser) {
            $this->getRoleHasUserFKNames($roleHasUser, $userLangId);
        }

        return RoleHasUserResource::collection($roleHasUsers);
    }

    public function show(Request $request, $roleId, $userId)
    {
        $userLangId = $request->user()->language_id;

        $roleHasUser = DB::table('role_has_user')
            ->where([
                'role_has_user.role_id' => $roleId,
                'role_has_user.user_id' => $userId
            ])->whereNull('deleted_at')->first();
        $this->getRoleHasUserFKNames($roleHasUser, $userLangId);

        return new RoleHasUserResource($roleHasUser);
    }

    private function getRoleHasUserFKNames ($roleHasUser, $userLangId) {
        $roleHasUser->role_name = $this->getMultilingualConceptName('role_name', 'name',
            'role_id', $roleHasUser->role_id, $userLangId);
        $roleHasUser->user_name = $this->getMultilingualConceptName('users', 'name',
            'id', $roleHasUser->user_id, $userLangId);
    }

    public function store(Request $request) {
        $updatingUserId = $request->user()->id;

        DB::beginTransaction();
        try {

            // Check if there has been a previous RoleHasUser for this role and user that was soft_deleted
            $hasPreviousAttributionRecord = RoleHasUser::onlyTrashed()
                ->where([
                    'role_id' => $request->input('role_id'),
                    'user_id' => $request->input('user_id')
                ])->first();
            // In case there was, restore that record and update it, so that it is enabled again
            // [as we can't have another entry in the DB for the same role_id & user_id combo]
            if ($hasPreviousAttributionRecord) {
                $hasPreviousAttributionRecord->restore();
                $roleHasUser = $hasPreviousAttributionRecord->update([
                    'deleted_by' => null,
                    'updated_by' => $updatingUserId
                ]);
            } else {
                // If there isn't, create a new record for the new user role
                $roleHasUser = RoleHasUser::create([
                    'role_id' => $request->input('role_id'),
                    'user_id' => $request->input('user_id'),
                    'updated_by' => $updatingUserId
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

    public function update(Request $request, $roleId, $userId)
    {
        $updatingUserId = $request->user()->id;
        $previousRoleId = $request->input('previous_role_id');

        $alreadyHadNewUserRoleRecord = null;

        // For when we're changing the roleId attached to this user, see if the new combination already
        // existed in the system and had been soft_deleted. In this case, we restore it instead of creating a new record.
        if ((int)$roleId !== (int)$previousRoleId) {
            $alreadyHadNewUserRoleRecord = RoleHasUser::onlyTrashed()
                ->where([
                    'role_id' => $roleId,
                    'user_id' => $userId
                ])->first();
        }

        // The current record that needs deleting (if the roleId has been changed)
        $roleHasUserRecord = RoleHasUser::where([
            'role_id' => $previousRoleId,
            'user_id' => $userId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {
            // In case user has changed the role of the combination when editing it
            if ((int)$roleId !== (int)$previousRoleId) {
                // Delete the current combination of role + user before the role was changed
                $roleHasUserRecord->update([
                    'deleted_by' => $updatingUserId
                ]);
                $roleHasUserRecord->delete();
                // If the new combination of role + user had already been in the system and was after soft_deleted
                // Restore it. If there was no record of this new combination on the database, create it.
                if ($alreadyHadNewUserRoleRecord) {
                    $alreadyHadNewUserRoleRecord->restore();
                    $alreadyHadNewUserRoleRecord->update([
                        'deleted_by' => null,
                        'updated_by' => $userId
                    ]);
                } else {
                    RoleHasUser::create([
                        'role_id' => $roleId,
                        'user_id' => $userId,
                        'updated_by' => $updatingUserId
                    ]);
                }
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

    public function destroy(Request $request, $roleId, $userId)
    {
        $updatingUserId = $request->user()->id;

        $roleHasUser = RoleHasUser::where([
            'role_id' => $roleId,
            'user_id' => $userId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $roleHasUser->update([
                'deleted_by' => $updatingUserId
            ]);
            $roleHasUser->delete();

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string) $success;
    }

    // Get all roles associated to the logged user
    public function getUserRoles(Request $request){
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $userRoles = DB::table('role_has_user')
            ->join('users', 'role_has_user.user_id', '=', 'users.id')
            ->join('role', 'role_has_user.role_id', '=', 'role.id')
            ->select('role_has_user.*')
            ->where('role_has_user.user_id', $userId)
            ->whereNull(['role_has_user.deleted_at', 'users.deleted_at', 'role.deleted_at'])
            ->get();

        foreach ($userRoles as $userRole) {
            $this->getRoleHasUserFKNames($userRole, $userLangId);
        }

        return RoleHasUserResource::collection($userRoles);
    }

}
