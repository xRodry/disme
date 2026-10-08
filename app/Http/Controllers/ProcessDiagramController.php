<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Action;
use App\ActionRule;
use App\CausalLink;
use App\Http\Resources\ProcessDiagramResource;
use App\Http\Traits\HTTPResponseTrait;
use App\ProcessDiagram;
use App\TransactionType;
use App\TransactionTypeName;
use App\WaitingLink;
use App\TState;
use DB;
use Illuminate\Http\Request;
use Log;

class ProcessDiagramController extends Controller
{
    use HTTPResponseTrait;

    public function index()
    {
        $processDiagrams = ProcessDiagram::whereNull('deleted_at')->get()->map(function($d) {
            $d->type = 'process';
            return $d;
        });

        return response()->json($processDiagrams, 200);
    }

    public function show($processDiagramId)
    {
        $processDiagram = ProcessDiagram::find($processDiagramId);

        return new ProcessDiagramResource($processDiagram);
    }

    public function storeOrUpdate(Request $request)
    {
        DB::beginTransaction();

        try {
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

            $existsQuery = ProcessDiagram::where('name', $name);
            if ($id) {
                $existsQuery->where('id', '!=', $id);
            }

            if ($existsQuery->exists()) {
                return response()->json([
                    'success' => false,
                    'error' => 'A diagram with this name already exists.'
                ], 409);
            }

            $diagram = ProcessDiagram::updateOrCreate(
                ['id' => $id],
                [
                    'process_type_id' => $data['process_type_id'] ?? null,
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
        // Normalize caused_t_state_id for causalLinks (convert abbreviations to IDs)
        $causalLinks = $request->input('causalLinks');
        if (is_array($causalLinks)) {
            foreach ($causalLinks as &$cl) {
                if (isset($cl['caused_t_state_id'])) {
                    $val = $cl['caused_t_state_id'];
                    // If it's a non-numeric string, try to resolve it via TState
                    if (is_string($val) && !is_numeric($val)) {
                        $tState = \App\TState::where('abbrv', $val)->first();
                        if ($tState) {
                            $cl['caused_t_state_id'] = $tState->id;
                        }
                    }
                }
            }
            $request->merge(['causalLinks' => $causalLinks]);
        }

        // Validação básica
        $data = $request->validate([
            'processDiagramId' => ['required', 'integer'],
            'processTypeId' => ['required', 'integer'],
            'transactionTypes' => ['present', 'array'],
            'waitingLinks' => ['array'],
            'actionRules' => ['array'],
            'actions' => ['array'],
            'causalLinks' => ['array'],

            'transactionTypes.*.diagram_id' => ['required', 'string'],
            'transactionTypes.*.language_id' => ['required', 'integer'],
            'transactionTypes.*.t_name' => ['nullable', 'string'],
            'transactionTypes.*.rt_name' => ['nullable', 'string'],
            'transactionTypes.*.state' => ['required', 'string'],
            'transactionTypes.*.process_type_id' => ['required', 'integer'],
            'transactionTypes.*.init_proc' => ['required', 'integer'],
            'transactionTypes.*.end_proc' => ['required', 'integer'],
            'transactionTypes.*.interm_task' => ['nullable', 'integer'],
            'transactionTypes.*.external' => ['nullable', 'integer'],
            'transactionTypes.*.type' => ['nullable', 'string'],
            'transactionTypes.*.frontier' => ['nullable', 'integer'],
            'transactionTypes.*.frontier_type' => ['nullable', 'string'],
            'transactionTypes.*.executer_role_id' => ['required', 'integer'],
            'transactionTypes.*.own_user_access_only' => ['required', 'integer'],
            'transactionTypes.*.auto_activate' => ['required', 'integer'],
            'transactionTypes.*.freq_activate' => ['nullable', 'string'],
            'transactionTypes.*.when_activate' => ['nullable', 'string'],

            'waitingLinks.*.diagram_id' => ['required', 'string'],
            'waitingLinks.*.waited_t' => ['required', 'string'],
            'waitingLinks.*.waited_act' => ['required', 'integer'],
            'waitingLinks.*.waiting_act' => ['required', 'integer'],
            'waitingLinks.*.waiting_t' => ['required', 'string'],
            'waitingLinks.*.min' => ['required', 'string'],
            'waitingLinks.*.max' => ['required', 'string'],



            'causalLinks.*.diagram_id' => ['required', 'string'],
            'causalLinks.*.causing_transaction_type_id' => ['required', 'string'],
            'causalLinks.*.caused_transaction_type_id' => ['required', 'string'],
            'causalLinks.*.caused_t_state_id' => ['required', 'integer', 'exists:t_state,id'],
            'causalLinks.*.min' => ['required', 'string'],
            'causalLinks.*.max' => ['required', 'string'],
            'causalLinks.*.cancel_proc' => ['required', 'integer'],
            'causalLinks.*.continue_if_same_user' => ['required', 'integer'],
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::beginTransaction();
        try {
            $saved = ['transactionTypes' => 0, 'waitingLinks' => 0, 'actionRules' => 0, 'actions' => 0, 'causalLinks' => 0];

            // Maps: diagram_id -> DB id
            $transactionTypeIdMap = [];
            $createdTransactionTypeIds = [];
            $claimedLegacyIds = [];

            $processTypeId = $data['processTypeId'];

            // --- TRANSACTION TYPES ---
            // 1. Read existing elements for the current Process Type
            $existingTransactionTypes = TransactionType::where('process_type_id', $processTypeId)->get();
            $processedDiagramIds = [];
            foreach ($data['transactionTypes'] as $item) {
                $diagramId = $item['diagram_id'];
                $processedDiagramIds[] = $diagramId;

                // 1. Try to find by diagram_id
                $transactionType = TransactionType::where('process_type_id', $processTypeId)
                    ->where('diagram_id', $diagramId)
                    ->first();

                // 2. Fallback for legacy records (diagram_id is NULL)
                if (!$transactionType && !empty($item['t_name'])) {
                    $tName = $item['t_name'];
                    $langId = $item['language_id'];

                    $legacyMatchId = \DB::table('transaction_type_name')
                        ->where('t_name', $tName)
                        ->where('language_id', $langId)
                        ->whereNull('deleted_at')
                        ->pluck('transaction_type_id');

                    if ($legacyMatchId->isNotEmpty()) {
                        $transactionType = TransactionType::where('process_type_id', $processTypeId)
                            ->whereNull('diagram_id')
                            ->whereIn('id', $legacyMatchId)
                            ->whereNotIn('id', $claimedLegacyIds)
                            ->first();
                    }
                }

                $attributes = [
                    'diagram_id' => $diagramId,
                    'state' => $item['state'],
                    'init_proc' => $item['init_proc'],
                    'end_proc' => $item['end_proc'],
                    'interm_task' => $item['interm_task'] ?? null,
                    'external' => $item['external'] ?? null,
                    'type' => $item['type'] ?? null,
                    'frontier' => $item['frontier'] ?? null,
                    'frontier_type' => $item['frontier_type'] ?? null,
                    'executer_role_id' => $item['executer_role_id'],
                    'own_user_access_only' => $item['own_user_access_only'],
                    'auto_activate' => $item['auto_activate'],
                    'freq_activate' => $item['freq_activate'] ?? null,
                    'when_activate' => $item['when_activate'] ?? null,
                ];

                if ($transactionType) {
                    if (is_null($transactionType->diagram_id)) {
                        $claimedLegacyIds[] = $transactionType->id;
                    }
                    // 3. Update existing and backfill diagram_id
                    $transactionType->update($attributes);
                } else {
                    $attributes['process_type_id'] = $processTypeId;
                    $transactionType = TransactionType::create($attributes);
                }

                TransactionTypeName::updateOrCreate(
                    [
                        'transaction_type_id' => $transactionType->id,
                        'language_id' => $item['language_id']
                    ],
                    [
                        't_name' => $item['t_name'] ?? null,
                        'rt_name' => $item['rt_name'] ?? null
                    ]
                );

                // mapear original (diagram_id) -> real
                $transactionTypeIdMap[$diagramId] = $transactionType->id;
                $createdTransactionTypeIds[] = $transactionType->id;

                $saved['transactionTypes']++;
            }
            
            // Delete only graphical elements for the Process Type whose diagram_id is NOT in the processed list
            $toDeleteIds = $existingTransactionTypes->filter(function ($item) use ($processedDiagramIds) {
                return !is_null($item->diagram_id) && !in_array($item->diagram_id, $processedDiagramIds, true);
            })->pluck('id');
            TransactionType::whereIn('id', $toDeleteIds)->delete();
            TransactionTypeName::whereIn('transaction_type_id', $toDeleteIds)->delete();

            // --- WAITING LINKS ---
            $processedWlDiagramIds = [];

            foreach ($data['waitingLinks'] as $item) {
                $diagramId = $item['diagram_id'];
                $processedWlDiagramIds[] = $diagramId;

                // Resolve diagram cell IDs to DB IDs
                $waitedT = isset($transactionTypeIdMap[$item['waited_t']]) ? $transactionTypeIdMap[$item['waited_t']] : $item['waited_t'];
                $waitingT = isset($transactionTypeIdMap[$item['waiting_t']]) ? $transactionTypeIdMap[$item['waiting_t']] : $item['waiting_t'];

                // Manual lookup to avoid duplicates when connections change
                $wl = WaitingLink::where('diagram_id', $diagramId)
                    ->whereHas('waitingT', function ($q) use ($processTypeId) {
                        $q->where('process_type_id', $processTypeId);
                    })->first();

                if ($wl) {
                    $wl->update([
                        'waited_t' => $waitedT,
                        'waited_act' => $item['waited_act'],
                        'waiting_act' => $item['waiting_act'],
                        'waiting_t' => $waitingT,
                        'min' => $item['min'],
                        'max' => $item['max']
                    ]);
                } else {
                    WaitingLink::create([
                        'diagram_id' => $diagramId,
                        'waited_t' => $waitedT,
                        'waited_act' => $item['waited_act'],
                        'waiting_act' => $item['waiting_act'],
                        'waiting_t' => $waitingT,
                        'min' => $item['min'],
                        'max' => $item['max']
                    ]);
                }

                $saved['waitingLinks']++;
            }

            // Delete only graphical elements whose diagram_id is no longer in the payload
            WaitingLink::whereNotNull('diagram_id')
                ->whereNotIn('diagram_id', $processedWlDiagramIds)
                ->whereHas('waitingT', function ($q) use ($processTypeId) {
                    $q->where('process_type_id', $processTypeId);
                })->delete();



            // --- CAUSAL LINKS & ACTIONS ---
            $processedClDiagramIds = [];
            $processedActionIds = []; // For cleanup

            // Resolve the Executed TState ID dynamically
            $tStateExecuted = TState::where('abbrv', 'ex')->first();
            $tStateExecutedId = $tStateExecuted ? $tStateExecuted->id : 3;

            foreach ($data['causalLinks'] as $item) {
                $diagramId = $item['diagram_id'];
                $processedClDiagramIds[] = $diagramId;

                // Resolve caused_transaction_type_id from diagram cell ID
                $causedTxTypeId = isset($transactionTypeIdMap[$item['caused_transaction_type_id']]) ? $transactionTypeIdMap[$item['caused_transaction_type_id']] : $item['caused_transaction_type_id'];

                // Resolve causing_transaction_type_id from diagram cell ID
                $causingTxTypeId = isset($transactionTypeIdMap[$item['causing_transaction_type_id']]) ? $transactionTypeIdMap[$item['causing_transaction_type_id']] : $item['causing_transaction_type_id'];

                // 1. Generate or Find ActionRule
                $actionRule = ActionRule::firstOrCreate(
                    [
                        'transaction_type_id' => $causingTxTypeId,
                        't_state_id' => $tStateExecutedId,
                        'type' => 'act'
                    ],
                    [
                        'blockly_xml' => '',
                        'blockly_code' => '',
                        'preview' => ''
                    ]
                );

                if ($actionRule->wasRecentlyCreated) {
                    $saved['actionRules']++;
                }

                // 2. Generate or Find Action for this Causal Link
                $action = Action::firstOrCreate(
                    [
                        'diagram_id' => $diagramId,
                        'type' => 'causal_link',
                        'action_rule_id' => $actionRule->id
                    ],
                    []
                );

                if ($action->wasRecentlyCreated) {
                    $saved['actions']++;
                }

                $processedActionIds[] = $action->id;

                $cl = CausalLink::where('diagram_id', $diagramId)
                    ->whereHas('causedTransactionType', function ($q) use ($processTypeId) {
                        $q->where('process_type_id', $processTypeId);
                    })->first();

                if ($cl) {
                    $cl->update([
                        'causing_action' => $action->id,
                        'caused_transaction_type_id' => $causedTxTypeId,
                        'caused_t_state_id' => $item['caused_t_state_id'],
                        'min' => $item['min'],
                        'max' => $item['max'],
                        'cancel_proc' => $item['cancel_proc'],
                        'continue_if_same_user' => $item['continue_if_same_user']
                    ]);
                } else {
                    CausalLink::create([
                        'diagram_id' => $diagramId,
                        'causing_action' => $action->id,
                        'caused_transaction_type_id' => $causedTxTypeId,
                        'caused_t_state_id' => $item['caused_t_state_id'],
                        'min' => $item['min'],
                        'max' => $item['max'],
                        'cancel_proc' => $item['cancel_proc'],
                        'continue_if_same_user' => $item['continue_if_same_user']
                    ]);
                }

                $saved['causalLinks']++;
            }

            CausalLink::whereNotNull('diagram_id')
                ->whereNotIn('diagram_id', $processedClDiagramIds)
                ->whereHas('causedTransactionType', function ($q) use ($processTypeId) {
                    $q->where('process_type_id', $processTypeId);
                })->delete();

            // Orphan Cleanup for Auto-Generated Actions
            Action::where('type', 'causal_link')
                ->whereNotIn('id', $processedActionIds)
                ->whereHas('actionRule.transactionType', function ($q) use ($processTypeId) {
                    $q->where('process_type_id', $processTypeId);
                })->delete();

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
