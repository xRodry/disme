<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\EntType;
use App\EntTypeName;
use App\Http\Resources\EntityTypeResource;
use App\Http\Traits\FormUpdatingTrait;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use DB;
use Illuminate\Http\Request;
use Log;

class EntityTypeController extends Controller
{
    use HTTPResponseTrait, FormUpdatingTrait, GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $entityTypes = EntType::whereNull('deleted_at')->get();

        foreach ($entityTypes as $entityType) {
            $this->getEntityTypeNames($entityType, $userLangId);
        }

        return EntityTypeResource::collection($entityTypes);
    }

    public function show(Request $request, $entTypeId)
    {
        $userLangId = $request->user()->language_id;

        $entityType = EntType::find($entTypeId);
        $this->getEntityTypeNames($entityType, $userLangId);

        return new EntityTypeResource($entityType);
    }

    private function getEntityTypeNames($entityType, $userLangId) {
        list($entityType->language_id, $entityType->name) = $this->getMultilingualConceptName('ent_type_name', 'name',
            'ent_type_id', $entityType->id, $userLangId, true);
        $entityType->id_name = $this->getMultilingualConceptName('ent_type_name', 'name',
            'ent_type_id', $entityType->id, $userLangId);
        $entityType->transaction_type_name = $this->getMultilingualConceptName('transaction_type_name', 't_name',
            'transaction_type_id', $entityType->transaction_type_id, $userLangId);

        $entityType->language_abbrv = Language::find($entityType->language_id)->abbrv;
    }

    public function store(Request $request) {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {

            $entityType = EntType::create([
                'state' => $request->input('state'),
                'transaction_type_id' => $request->input('transaction_type_id'),
                'last_internal_id' => 0,
                'has_many' => $request->input('has_many'),
                'auto_generated' => $request->input('auto_generated') ?? null,
                'external' => $request->input('external') ?? null,
                'user_details' => $request->input('user_details'),
                'updated_by' => $userId
            ]);

            $entityTypeName = EntTypeName::create([
                'ent_type_id' => $entityType->id,
                'language_id' => $langId,
                'name' => $request->input('name'),
                'id_name' => $request->input('id_name'),
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

    public function update(Request $request, $entityTypeId)
    {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        $entityType = EntType::find($entityTypeId);
        $entityTypeName = EntTypeName::where([
            'ent_type_id' => $entityType->id,
            'language_id' => $langId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {

            $entityType->update([
                'state' => $request->input('state'),
                'transaction_type_id' => $request->input('transaction_type_id'),
                'has_many' => $request->input('has_many'),
                'auto_generated' => $request->input('auto_generated') ?? null,
                'external' => $request->input('external') ?? null,
                'user_details' => $request->input('user_details'),
                'updated_by' => $userId
            ]);
            $entityTypeName->update([
                'name' => $request->input('name'),
                'id_name' => $request->input('id_name'),
                'updated_by' => $userId
            ]);

            // Update the dataGrid box components of forms containing this entity type, in case it's a 'has many' entity type.
            if ($entityType->has_many) {
                $this->updateFormsUsingThisObject('entityTypeLabel', $entityType, $userId, $langId);
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

    public function destroy(Request $request, $entityTypeId)
    {
        $userId = $request->user()->id;

        $entityType = EntType::find($entityTypeId);
        $entityTypeNames = EntTypeName::where('ent_type_id', $entityTypeId)->get();

        DB::beginTransaction();
        try {

            foreach($entityTypeNames as $entityTypeName) {
                $entityTypeName->update([
                    'deleted_by' => $userId
                ]);
                $entityTypeName->delete();
            }

            $entityType->update([
                'deleted_by' => $userId
            ]);
            $entityType->delete();

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
            $entityType = EntType::find($request->input('id'));
            // Check if there has been an EntityTypeName for this entity type on the user's language that was soft_deleted
            $hasPreviousNameRecord = EntTypeName::onlyTrashed()
                ->where([
                    'ent_type_id' => $entityType->id,
                    'language_id' => $langId
                ])->first();
            // In case there was, restore that record and update it, so that it reflects the most recent name inserted
            // [as we can't have another entry in the DB for the same ent_type_id & language_id combo]
            if ($hasPreviousNameRecord) {
                $hasPreviousNameRecord->restore();
                $translatedEntityTypeName = $hasPreviousNameRecord->update([
                    'deleted_by' => null,
                    'name' => $request->input('name'),
                    'id_name' => $request->input('id_name'),
                    'updated_by' => $userId
                ]);
            } else {
                // If there isn't, create a new record for the inserted name
                $translatedEntityTypeName = EntTypeName::create([
                    'ent_type_id' => $entityType->id,
                    'language_id' => $langId,
                    'name' => $request->input('name'),
                    'id_name' => $request->input('id_name'),
                    'updated_by' => $userId
                ]);
            }

            // Update the dataGrid box components of forms containing this entity type, in case it's a 'has many' entity type.
            if ($entityType->has_many) {
                $this->updateFormsUsingThisObject('entityTypeLabel', $entityType, $userId, $langId);
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

    public function getEntTypesWithProperties(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $entTypes = EntType::with(['properties.associatedProperties'])
            ->whereHas('properties')
            ->whereNull('deleted_at')->get();

        foreach ($entTypes as $entType) {
            $this->getEntityTypeNames($entType, $userLangId);
            $this->getEntTypePropertiesInfo($entType, $userLangId);
        }

        return EntityTypeResource::collection($entTypes);
    }

    private function getEntTypePropertiesInfo($entType, $userLangId) {
        // Get each property's name and in case it's a prop_ref/enum property, get its respective values
        foreach  ($entType->properties as $property) {
            $property->name = $this->getMultilingualConceptName('property_name', 'name',
                'property_id', $property->id, $userLangId);
            if ($property->value_type === 'enum') {
                $property->values = $this->getEnumPropertyValues($property, $userLangId, false);
            } else if ($property->value_type === 'prop_ref') {
                $property->values = $this->getPropRefPropertyValues($property, $userLangId, false);
            }
        }
        return $entType;
    }

    public function getUserDetailsEntTypes(Request $request) {
        $userLangId = $request->user()->language_id;

        // Get all entity types with flag 'user details' to be used in the user's management 'specify user details' entity type select box
        $userDetailsEntTypes = DB::table('ent_type')
            ->where('user_details', true)
            ->whereNull('deleted_at')
            ->get();

        foreach ($userDetailsEntTypes as $userDetailsEntType) {
            $this->getEntityTypeNames($userDetailsEntType, $userLangId);
        }

        return EntityTypeResource::collection($userDetailsEntTypes);
    }
}
