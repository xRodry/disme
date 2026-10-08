<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\FactDiagramResource;
use App\Http\Traits\HTTPResponseTrait;
use App\FactDiagram;
use DB;
use Illuminate\Http\Request;
use Log;
use App\EntType;
use App\EntTypeName;
use App\Property;
use App\PropertyName;

class FactDiagramController extends Controller
{
    use HTTPResponseTrait;

    public function index()
    {
        $factDiagrams = FactDiagram::whereNull('deleted_at')->get()->map(function($d) {
            $d->type = 'fact';
            return $d;
        });

        return response()->json($factDiagrams, 200);
    }

    public function show($factDiagramId)
    {
        $factDiagram = FactDiagram::find($factDiagramId);

        return new FactDiagramResource($factDiagram);
    }

    public function storeOrUpdate(Request $request)
    {
        DB::beginTransaction();

        try {
            // 🔥 Ler JSON corretamente
            $data = json_decode($request->getContent(), true);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'error' => 'Invalid JSON',
                    'raw' => $request->getContent()
                ], 400);
            }

            $id = $data['id'] ?? null;
            $name = $data['name'];

            $existsQuery = FactDiagram::where('name', $name);
            if ($id) {
                $existsQuery->where('id', '!=', $id);
            }

            if ($existsQuery->exists()) {
                return response()->json([
                    'success' => false,
                    'error' => 'A diagram with this name already exists.'
                ], 409);
            }

            // 🔥 Criar ou atualizar pelo ID (CORRETO)
            $diagram = FactDiagram::updateOrCreate(
                ['id' => $id],
                [
                    'conceptual_domain_id' => $data['conceptual_domain_id'] ?? null,
                    'name' => $name,
                    'description' => $data['description'] ?? '',
                    'XML' => $data['XML'],
                ]
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'id' => $diagram->id
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            Log::error($e);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function bulkSave(Request $request)
    {
        // Validação básica
        $data = $request->validate([
            'entityTypes' => ['present', 'array'],
            'properties' => ['present', 'array'],

            'entityTypes.*.diagram_id' => ['required', 'string'],
            'entityTypes.*.language_id' => ['required', 'integer'],
            'entityTypes.*.name' => ['required', 'string'],
            'entityTypes.*.id_name' => ['nullable', 'string'],
            'entityTypes.*.state' => ['required', 'string'],
            'entityTypes.*.transaction_type_id' => ['required', 'integer'],
            'entityTypes.*.last_internal_id' => ['integer'],
            'entityTypes.*.has_many' => ['required', 'integer'],
            'entityTypes.*.auto_generated' => ['nullable', 'integer'],
            'entityTypes.*.external' => ['nullable', 'integer'],
            'entityTypes.*.user_details' => ['required', 'integer'],

            'properties.*.diagram_id' => ['required', 'string'],
            'properties.*.language_id' => ['required', 'integer'],
            'properties.*.name' => ['nullable', 'string'],
            'properties.*.tooltip' => ['nullable', 'string'],
            'properties.*.ent_type_id' => ['nullable', 'string'],
            'properties.*.value_type' => ['required', 'string'],
            'properties.*.scope' => ['required', 'string'],
            'properties.*.unit_type_id' => ['nullable', 'integer'],
            'properties.*.state' => ['required', 'string'],
            'properties.*.fk_property_id' => ['nullable', 'string'],
            'properties.*.fk_entity_type_id' => ['nullable', 'integer'],
            'properties.*.part_of' => ['required', 'integer'],
            'properties.*.requires_translation' => ['required', 'integer'],
            'properties.*.editable' => ['required', 'integer'],
            'properties.*.soft_delete' => ['required', 'integer'],
            'properties.*.is_a' => ['nullable', 'integer'],
            'properties.*.is_dependent' => ['nullable', 'integer'],
            'properties.*.multiple_values' => ['required', 'integer'],
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::beginTransaction();
        try {
            $saved = ['entityTypes' => 0, 'properties' => 0];

            $entityTypeIdMap = []; // diagram_id -> real DB id
            $propertyIdMap = [];   // diagram_id -> real DB id

            $processedEntDiagramIds = [];
            $transactionTypeIdsInvolved = [];

            // --- ENTITY TYPES ---
            foreach ($data['entityTypes'] as $item) {
                $diagramId = $item['diagram_id'];
                $transactionTypeId = $item['transaction_type_id'];

                $processedEntDiagramIds[] = $diagramId;
                if (!in_array($transactionTypeId, $transactionTypeIdsInvolved)) {
                    $transactionTypeIdsInvolved[] = $transactionTypeId;
                }

                // 1. Try to find by diagram_id and transaction_type_id
                $entityType = EntType::where('transaction_type_id', $transactionTypeId)
                    ->where('diagram_id', $diagramId)
                    ->first();

                // 2. Fallback for legacy records (diagram_id is NULL)
                if (!$entityType && !empty($item['name'])) {
                    $eName = $item['name'];
                    $langId = $item['language_id'];

                    $legacyMatchId = \DB::table('ent_type_name')
                        ->where('name', $eName)
                        ->where('language_id', $langId)
                        ->whereNull('deleted_at')
                        ->pluck('ent_type_id');

                    if ($legacyMatchId->isNotEmpty()) {
                        $entityType = EntType::where('transaction_type_id', $transactionTypeId)
                            ->whereNull('diagram_id')
                            ->whereIn('id', $legacyMatchId)
                            ->first();
                    }
                }

                $attributes = [
                    'diagram_id' => $diagramId,
                    'state' => $item['state'],
                    'last_internal_id' => $item['last_internal_id'] ?? 0,
                    'has_many' => $item['has_many'],
                    'auto_generated' => $item['auto_generated'] ?? null,
                    'external' => $item['external'] ?? null,
                    'user_details' => $item['user_details']
                ];

                if ($entityType) {
                    // 3. Update existing and backfill diagram_id
                    $entityType->update($attributes);
                } else {
                    $attributes['transaction_type_id'] = $transactionTypeId;
                    $entityType = EntType::create($attributes);
                }

                EntTypeName::updateOrCreate(
                    [
                        'ent_type_id' => $entityType->id,
                        'language_id' => $item['language_id']
                    ],
                    [
                        'name' => $item['name'],
                        'id_name' => $item['id_name'] ?? null
                    ]
                );

                $entityTypeIdMap[$diagramId] = $entityType->id;
                $saved['entityTypes']++;
            }

            // --- PROPERTIES ---
            $processedPropDiagramIds = [];
            $entTypeIdsInvolved = [];

            foreach ($data['properties'] as $item) {
                $diagramId = $item['diagram_id'];
                $processedPropDiagramIds[] = $diagramId;

                // Resolve foreign keys from diagram_id to real DB id
                $entTypeId = null;
                if (!empty($item['ent_type_id'])) {
                    $entTypeId = isset($entityTypeIdMap[$item['ent_type_id']]) ? $entityTypeIdMap[$item['ent_type_id']] : null;
                }

                $fkPropertyId = null;
                if (!empty($item['fk_property_id'])) {
                    $fkPropertyId = isset($propertyIdMap[$item['fk_property_id']]) ? $propertyIdMap[$item['fk_property_id']] : null;
                }

                if ($entTypeId && !in_array($entTypeId, $entTypeIdsInvolved)) {
                    $entTypeIdsInvolved[] = $entTypeId;
                }

                // Try to find by diagram_id and ent_type_id
                $property = null;
                if ($entTypeId) {
                    $property = Property::where('ent_type_id', $entTypeId)
                        ->where('diagram_id', $diagramId)
                        ->first();
                } elseif ($fkPropertyId) {
                    $property = Property::where('fk_property_id', $fkPropertyId)
                        ->where('diagram_id', $diagramId)
                        ->first();
                }

                // Fallback for legacy properties
                if (!$property && !empty($item['name']) && $entTypeId) {
                    $pName = $item['name'];
                    $langId = $item['language_id'];

                    $legacyMatchId = \DB::table('property_name')
                        ->where('name', $pName)
                        ->where('language_id', $langId)
                        ->whereNull('deleted_at')
                        ->pluck('property_id');

                    if ($legacyMatchId->isNotEmpty()) {
                        $property = Property::where('ent_type_id', $entTypeId)
                            ->whereNull('diagram_id')
                            ->whereIn('id', $legacyMatchId)
                            ->first();
                    }
                }

                $attributes = [
                    'diagram_id' => $diagramId,
                    'value_type' => $item['value_type'],
                    'scope' => $item['scope'],
                    'unit_type_id' => $item['unit_type_id'] ?? null,
                    'state' => $item['state'],
                    'fk_entity_type_id' => $item['fk_entity_type_id'] ?? null,
                    'part_of' => $item['part_of'],
                    'requires_translation' => $item['requires_translation'],
                    'editable' => $item['editable'],
                    'soft_delete' => $item['soft_delete'],
                    'is_a' => $item['is_a'] ?? null,
                    'is_dependent' => $item['is_dependent'] ?? null,
                    'multiple_values' => $item['multiple_values']
                ];

                if ($property) {
                    $attributes['ent_type_id'] = $entTypeId;
                    $attributes['fk_property_id'] = $fkPropertyId;
                    $property->update($attributes);
                } else {
                    $attributes['ent_type_id'] = $entTypeId;
                    $attributes['fk_property_id'] = $fkPropertyId;
                    $property = Property::create($attributes);
                }

                PropertyName::updateOrCreate(
                    [
                        'property_id' => $property->id,
                        'language_id' => $item['language_id']
                    ],
                    [
                        'name' => $item['name'] ?? null,
                        'tooltip' => $item['tooltip'] ?? null
                    ]
                );

                $propertyIdMap[$diagramId] = $property->id;
                $saved['properties']++;
            }

            // Safe scoped deletion for Properties
            if (!empty($entTypeIdsInvolved)) {
                $existingProperties = Property::whereIn('ent_type_id', $entTypeIdsInvolved)->get();
                $toDeletePropIds = $existingProperties->filter(function ($item) use ($processedPropDiagramIds) {
                    return !is_null($item->diagram_id) && !in_array($item->diagram_id, $processedPropDiagramIds, true);
                })->pluck('id');

                Property::whereIn('id', $toDeletePropIds)->delete();
                PropertyName::whereIn('property_id', $toDeletePropIds)->delete();
            }

            // Safe scoped deletion for EntTypes
            if (!empty($transactionTypeIdsInvolved)) {
                $existingEntTypes = EntType::whereIn('transaction_type_id', $transactionTypeIdsInvolved)->get();
                $toDeleteEntIds = $existingEntTypes->filter(function ($item) use ($processedEntDiagramIds) {
                    return !is_null($item->diagram_id) && !in_array($item->diagram_id, $processedEntDiagramIds, true);
                })->pluck('id');

                EntType::whereIn('id', $toDeleteEntIds)->delete();
                EntTypeName::whereIn('ent_type_id', $toDeleteEntIds)->delete();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'saved' => $saved
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error($e);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
