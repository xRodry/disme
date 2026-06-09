<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Entity;
use App\EntType;
use App\Http\Resources\EntityResource;
use App\Http\Traits\GetMultilingualConceptName;
use DB;
use Illuminate\Http\Request;

class EntityController extends Controller
{
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $entities = Entity::whereNull('deleted_at')->get();

        foreach ($entities as $entity) {
            $entity->entity_type_name = $this->getMultilingualConceptName('ent_type_name', 'name',
                'ent_type_id', $entity->ent_type_id, $userLangId);
        }

        return EntityResource::collection($entities);
    }


    public function show(Request $request, $id)
    {
        $userLangId = $request->user()->language_id;

        $entity = Entity::where('id',$id)->whereNull('entity.deleted_at')->first();

        $entity->entity_type_name = $this->getMultilingualConceptName('ent_type_name', 'name',
            'ent_type_id', $entity->ent_type_id, $userLangId);

        return new EntityResource($entity);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {
            $entType = EntType::where('id', $request->input('ent_type_id'))
                ->whereNull('deleted_at')->first();
            $entity = Entity::create([
                'internal_id' => $entType->last_internal_id + 1,
                'ent_type_id' => $entType->id,
                'state' => $request->input('state'),
                'transaction_id' => $request->input('transaction_id'),
                'updated_by' => $userId
            ]);
            $entType->update([
                'last_internal_id' => $entity->internal_id,
                'updated_by' => $userId
            ]);
            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }
        return (string)$success;
    }

    public function update(Request $request, $id)
    {
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {
            $entity = Entity::find($id);
            $entity->update([
                'ent_type_id' => $request->input('ent_type_id'),
                'state' => $request->input('state'),
                'transaction_id' => $request->input('transaction_id'),
                'updated_by' => $userId
            ]);
            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }
        return (string)$success;
    }

    public function destroy(Request $request, $id)
    {
        $userId = $request->user()->id;

        $entity = Entity::where('id', $id)
            ->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {
            $entity->update([
                'deleted_by' => $userId
            ]);
            $entity->delete();
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
