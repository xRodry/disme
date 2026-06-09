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
        $factDiagrams =  FactDiagram::whereNull('deleted_at')->get();

        return FactDiagramResource::collection($factDiagrams);
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
            FactDiagram::updateOrCreate(
                // Critérios para saber se atualiza ou cria
                ['name' => $request->input('name')],
                // Dados para atualizar ou criar
                [
                    'name' => $request->input('name'),
                    'description' => $request->input('description'),
                    'XML' => $request->input('XML'),
                ]
            );

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

    public function bulkSave(Request $request)
    {
        // Validação básica
        $data = $request->validate([
            'entityTypes' => ['required', 'array'],
            'properties' => ['required', 'array'],

            'entityTypes.*.id' => ['integer'],
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

            'properties.*.id' => ['integer'],
            'properties.*.language_id' => ['required', 'integer'],
            'properties.*.name' => ['nullable', 'string'],
            'properties.*.tooltip' => ['required', 'string'],
            'properties.*.ent_type_id' => ['nullable', 'integer'],
            'properties.*.value_type' => ['required', 'string'],
            'properties.*.scope' => ['required', 'string'],
            'properties.*.unit_type_id' => ['nullable', 'integer'],
            'properties.*.state' => ['required', 'string'],
            'properties.*.fk_property_id' => ['nullable', 'integer'],
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

            // mapas e listas usados durante a execução
            $entityTypeIdMap   = []; // map: original_id (ou 'new_X') => real DB id
            $createdEntityTypeIds = []; // lista de DB ids criados/ocupados nesta execução

            $propertyIdMap     = []; // map: original_prop_id (ou 'new_X') => real DB id
            $createdPropertyIds = []; // lista de DB ids criados/ocupados nesta execução

            // --- ENTITY TYPES ---
            foreach ($data['entityTypes'] as $item) {
                $origId = (int)$item['id'];

                // Se o origId já corresponde a um DB id criado nesta execução, queremos CRIAR um novo ent_type (não actualizar o registo com esse id)
                $forceCreate = in_array($origId, $createdEntityTypeIds, true);

                if ($forceCreate) {
                    // Criar novo (não tentamos usar o id do payload)
                    $entityType = EntType::create([
                        'state'               => $item['state'],
                        'transaction_type_id' => $item['transaction_type_id'],
                        'last_internal_id'    => $item['last_internal_id'] ?? 0,
                        'has_many'            => $item['has_many'],
                        'auto_generated'      => $item['auto_generated'] ?? null,
                        'external'            => $item['external'] ?? null,
                        'user_details'        => $item['user_details']
                    ]);
                } else {
                    $entityType = EntType::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'state' => $item['state'],
                            'transaction_type_id' => $item['transaction_type_id'],
                            'last_internal_id' => $item['last_internal_id'] ?? 0,
                            'has_many' => $item['has_many'],
                            'auto_generated' => $item['auto_generated'] ?? null,
                            'external' => $item['external'] ?? null,
                            'user_details' => $item['user_details']
                        ]
                    );
                }

                EntTypeName::updateOrCreate(
                    [
                        'ent_type_id' => $entityType->id,
                        'language_id' => $item['language_id']
                    ],
                    [
                        'name'       => $item['name'],
                        'id_name'    => $item['id_name'] ?? null
                    ]
                );

                // mapear original -> real
                $entityTypeIdMap[$origId] = $entityType->id;

                // registar DB id como ocupado nesta execução
                $createdEntityTypeIds[] = $entityType->id;

                $saved['entityTypes']++;
            }
            //apagar EntTypes que já não existem
            EntType::whereNotIn('id', $createdEntityTypeIds)->delete();
            EntTypeName::whereNotIn('ent_type_id', $createdEntityTypeIds)->delete();


            // --- PROPERTIES ---
            foreach ($data['properties'] as $item) {
                // ajustar FK de ent_type se referia a um original mapeado
                if (isset($entityTypeIdMap[$item['ent_type_id']])) {
                    $item['ent_type_id'] = $entityTypeIdMap[$item['ent_type_id']];
                }

                // ajustar FK de fk_entity_type_id se referia a um original mapeado
                if (isset($entityTypeIdMap[$item['fk_entity_type_id']])) {
                    $item['fk_entity_type_id'] = $entityTypeIdMap[$item['fk_entity_type_id']];
                }

                // ajustar fk_property_id se referia a uma property mapeada anteriormente
                if (isset($propertyIdMap[$item['fk_property_id']])) {
                    $item['fk_property_id'] = $propertyIdMap[$item['fk_property_id']];
                }

                $origPid = (int)$item['id'];
                $forceCreate = in_array($origPid, $createdPropertyIds, true);

                if ($forceCreate) {
                    $property = Property::create([
                        'ent_type_id'          => $item['ent_type_id'] ?? null,
                        'value_type'           => $item['value_type'],
                        'scope'                => $item['scope'],
                        'unit_type_id'         => $item['unit_type_id'] ?? null,
                        'state'                => $item['state'],
                        'fk_property_id'       => $item['fk_property_id'] ?? null,
                        'fk_entity_type_id'    => $item['fk_entity_type_id'] ?? null,
                        'part_of'              => $item['part_of'],
                        'requires_translation' => $item['requires_translation'],
                        'editable'             => $item['editable'],
                        'soft_delete'          => $item['soft_delete'],
                        'is_a'                 => $item['is_a'] ?? null,
                        'is_dependent'         => $item['is_dependent'] ?? null,
                        'multiple_values'      => $item['multiple_values']
                    ]);
                } else {
                    $property = Property::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'ent_type_id' => $item['ent_type_id'] ?? null,
                            'value_type' => $item['value_type'],
                            'scope' => $item['scope'],
                            'unit_type_id' => $item['unit_type_id'] ?? null,
                            'state' => $item['state'],
                            'fk_property_id' => $item['fk_property_id'] ?? null,
                            'fk_entity_type_id' => $item['fk_entity_type_id'] ?? null,
                            'part_of' => $item['part_of'],
                            'requires_translation' => $item['requires_translation'],
                            'editable' => $item['editable'],
                            'soft_delete' => $item['soft_delete'],
                            'is_a' => $item['is_a'] ?? null,
                            'is_dependent' => $item['is_dependent'] ?? null,
                            'multiple_values' => $item['multiple_values']
                        ]
                    );
                }

                PropertyName::updateOrCreate(
                    [
                        'property_id' => $property->id,
                        'language_id' => $item['language_id']
                    ],
                    [
                        'name'       => $item['name'] ?? null,
                        'tooltip'    => $item['tooltip']
                    ]
                );

                // mapear property original -> real
                $propertyIdMap[$origPid] = $property->id;

                $createdPropertyIds[] = $property->id;
                $saved['properties']++;
            }
            //apagar Properties que já não existem
            Property::whereNotIn('id', $createdPropertyIds)->delete();
            PropertyName::whereNotIn('property_id', $createdPropertyIds)->delete();

            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            DB::commit();
            return response()->json(['success' => true, 'saved' => $saved], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e);
            return response()->json([
                'success' => false,
                'message' => 'Falha ao guardar em bulk.',
                'error'   => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
