<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\RoleResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use App\Role;
use App\RoleName;
use DB;
use Illuminate\Http\Request;
use Log;

class RoleController extends Controller
{

    use HTTPResponseTrait;
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $roles = Role::whereNull('deleted_at')->get();

        foreach ($roles as $role) {
            $this->getRoleNames($role, $userLangId);
        }

        return RoleResource::collection($roles);
    }

    public function show(Request $request, $roleId)
    {
        $userLangId = $request->user()->language_id;

        $role = Role::find($roleId);
        $this->getRoleNames($role, $userLangId);

        return new RoleResource($role);
    }

    private function getRoleNames ($role, $userLangId) {
        list($role->language_id, $role->name) = $this->getMultilingualConceptName('role_name', 'name',
            'role_id', $role->id, $userLangId, true);
        $role->language_abbrv = Language::find($role->language_id)->abbrv;
    }

    public function store(Request $request) {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {

            $role = Role::create([
                'updated_by' => $userId
            ]);

            $roleName = RoleName::create([
                'role_id' => $role->id,
                'language_id' => $langId,
                'name' => $request->input('name'),
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

    public function update(Request $request, $roleId)
    {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        $role = Role::find($roleId);
        $roleName = RoleName::where([
            'role_id' => $role->id,
            'language_id' => $langId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $role->update([
                'updated_by' => $userId
            ]);
            $roleName->update([
                'name' => $request->input('name'),
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

    public function destroy(Request $request, $roleId)
    {
        $userId = $request->user()->id;

        $role = Role::find($roleId);
        $roleNames = RoleName::where('role_id', $roleId)->get();

        DB::beginTransaction();
        try {

            foreach($roleNames as $roleName) {
                $roleName->update([
                    'deleted_by' => $userId
                ]);
                $roleName->delete();
            }

            $role->update([
                'deleted_by' => $userId
            ]);
            $role->delete();

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

            // Check if there has been a RoleName for this role on the user's language that was soft_deleted
            $hasPreviousNameRecord = RoleName::onlyTrashed()
                ->where([
                    'role_id' => $request->input('id'),
                    'language_id' => $langId
                ])->first();
            // In case there was, restore that record and update it, so that it reflects the most recent name inserted
            // [as we can't have another entry in the DB for the same role_id & language_id combo]
            if ($hasPreviousNameRecord) {
                $hasPreviousNameRecord->restore();
                $translatedRoleName = $hasPreviousNameRecord->update([
                    'deleted_by' => null,
                    'name' => $request->input('name'),
                    'updated_by' => $userId
                ]);
            } else {
                // If there isn't, create a new record for the inserted name
                $translatedRoleName = RoleName::create([
                    'role_id' => $request->input('id'),
                    'language_id' => $langId,
                    'name' => $request->input('name'),
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
