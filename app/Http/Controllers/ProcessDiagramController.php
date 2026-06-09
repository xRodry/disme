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
use DB;
use Illuminate\Http\Request;
use Log;

class ProcessDiagramController extends Controller
{
    use HTTPResponseTrait;

    public function index()
    {
        $processDiagrams =  ProcessDiagram::whereNull('deleted_at')->get();

        return ProcessDiagramResource::collection($processDiagrams);
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
            ProcessDiagram::updateOrCreate(
                // Critérios para saber se atualiza ou cria
                ['name' => $request->input('name')],
                // Dados para atualizar ou criar
                [
                    'process_type_id' => $request->input('process_type_id'),
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
            'transactionTypes' => ['required', 'array'],
            'waitingLinks' => ['array'],
            'actionRules' => ['array'],
            'actions' => ['array'],
            'causalLinks' => ['array'],

            'transactionTypes.*.id' => ['integer'],
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

            'waitingLinks.*.id' => ['integer'],
            'waitingLinks.*.waited_t' => ['required', 'integer'],
            'waitingLinks.*.waited_act' => ['required', 'integer'],
            'waitingLinks.*.waiting_act' => ['required', 'integer'],
            'waitingLinks.*.waiting_t' => ['required', 'integer'],
            'waitingLinks.*.min' => ['required', 'string'],
            'waitingLinks.*.max' => ['required', 'string'],

            'actionRules.*.id' => ['integer'],
            'actionRules.*.type' => ['required', 'string'],
            'actionRules.*.t_state_id' => ['required', 'integer'],
            'actionRules.*.transaction_type_id' => ['required', 'integer'],
            'actionRules.*.blockly_xml' => ['nullable', 'string'],
            'actionRules.*.blockly_code' => ['nullable', 'string'],
            'actionRules.*.preview' => ['required', 'string'],

            'actions.*.id' => ['integer'],
            'actions.*.action_rule_id' => ['required', 'integer'],
            'actions.*.type' => ['required', 'string'],
            'actions.*.prev_action_id' => ['nullable', 'integer'],
            'actions.*.next_action_id' => ['nullable', 'integer'],
            'actions.*.par_action_id' => ['nullable', 'integer'],

            'causalLinks.*.id' => ['integer'],
            'causalLinks.*.causing_action' => ['required', 'integer'],
            'causalLinks.*.caused_transaction_type_id' => ['required', 'integer'],
            'causalLinks.*.caused_t_state_id' => ['required', 'integer'],
            'causalLinks.*.min' => ['required', 'string'],
            'causalLinks.*.max' => ['required', 'string'],
            'causalLinks.*.cancel_proc' => ['required', 'integer'],
            'causalLinks.*.continue_if_same_user' => ['required', 'integer'],
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::beginTransaction();
        try {
            $saved = ['transactionTypes' => 0, 'waitingLinks' => 0, 'actionRules' => 0, 'actions' => 0, 'causalLinks' => 0];

            // mapas e listas usados durante a execução
            $transactionTypeIdMap   = []; // map: original_id (ou 'new_X') => real DB id
            $createdTransactionTypeIds = []; // lista de DB ids criados/ocupados nesta execução

            $createdWaitingLinkIds = []; // lista de DB ids criados/ocupados nesta execução

            $actionRuleIdMap   = []; // map: original_actionRule_id (ou 'new_X') => real DB id
            $createdActionRuleIds = []; // lista de DB ids criados/ocupados nesta execução

            $actionIdMap   = []; // map: original_action_id (ou 'new_X') => real DB id
            $createdActionIds = []; // lista de DB ids criados/ocupados nesta execução

            $createdCausalLinkIds = []; // lista de DB ids criados/ocupados nesta execução

            // --- TRANSACTION TYPES ---
            foreach ($data['transactionTypes'] as $item) {
                $origId = (int)$item['id'];

                // Se o origId já corresponde a um DB id criado nesta execução, queremos CRIAR um novo transaction_type (não actualizar o registo com esse id)
                $forceCreate = in_array($origId, $createdTransactionTypeIds, true);

                if ($forceCreate) {
                    // Criar novo (não tentamos usar o id do payload)
                    $transactionType = TransactionType::create([
                        'state' => $item['state'],
                        'process_type_id' => $item['process_type_id'],
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
                    ]);
                } else {
                    $transactionType = TransactionType::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'state' => $item['state'],
                            'process_type_id' => $item['process_type_id'],
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
                        ]
                    );
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

                // mapear original -> real
                $transactionTypeIdMap[$origId] = $transactionType->id;

                // registar DB id como ocupado nesta execução
                $createdTransactionTypeIds[] = $transactionType->id;

                $saved['transactionTypes']++;
            }
            // apagar TransactionTypes que já não existem
            TransactionType::whereNotIn('id', $createdTransactionTypeIds)->delete();
            TransactionTypeName::whereNotIn('transaction_type_id', $createdTransactionTypeIds)->delete();

            // --- WAITING LINKS ---
            foreach ($data['waitingLinks'] as $item) {
                // mapear waited_t / waiting_t
                if (isset($transactionTypeIdMap[$item['waited_t']])) {
                    $item['waited_t'] = $transactionTypeIdMap[$item['waited_t']];
                }
                if (isset($transactionTypeIdMap[$item['waiting_t']])) {
                    $item['waiting_t'] = $transactionTypeIdMap[$item['waiting_t']];
                }

                $origId = (int)$item['id'];
                $forceCreate = in_array($origId, $createdWaitingLinkIds, true);

                if ($forceCreate) {
                    $waitingLink = WaitingLink::create([
                        'waited_t' => $item['waited_t'],
                        'waited_act' => $item['waited_act'],
                        'waiting_act' => $item['waiting_act'],
                        'waiting_t' => $item['waiting_t'],
                        'min' => $item['min'],
                        'max' => $item['max']
                    ]);
                } else {
                    $waitingLink = WaitingLink::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'waited_t' => $item['waited_t'],
                            'waited_act' => $item['waited_act'],
                            'waiting_act' => $item['waiting_act'],
                            'waiting_t' => $item['waiting_t'],
                            'min' => $item['min'],
                            'max' => $item['max']
                        ]
                    );
                }

                $createdWaitingLinkIds[] = $waitingLink->id;
                $saved['waitingLinks']++;
            }
            // apagar WaitingLinks que já não existem
            if (!empty($createdWaitingLinkIds)) {
                WaitingLink::whereNotIn('id', $createdWaitingLinkIds)->delete();
            } else {
                // se a lista estiver vazia, significa que não deveria existir nenhum WaitingLink
                WaitingLink::truncate();
            }

            // --- ACTION RULES ---
            foreach ($data['actionRules'] as $item) {
                if (isset($transactionTypeIdMap[$item['transaction_type_id']])) {
                    $item['transaction_type_id'] = $transactionTypeIdMap[$item['transaction_type_id']];
                }

                $origId = (int)$item['id'];
                $forceCreate = in_array($origId, $createdActionRuleIds, true);

                if ($forceCreate) {
                    $actionRule = ActionRule::create([
                        'type' => $item['type'],
                        't_state_id' => $item['t_state_id'],
                        'transaction_type_id' => $item['transaction_type_id'],
                        'blockly_xml' => $item['blockly_xml'] ?? null,
                        'blockly_code' => $item['blockly_code'] ?? null,
                        'preview' => $item['preview']
                    ]);
                } else {
                    $actionRule = ActionRule::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'type' => $item['type'],
                            't_state_id' => $item['t_state_id'],
                            'transaction_type_id' => $item['transaction_type_id'],
                            'blockly_xml' => $item['blockly_xml'] ?? null,
                            'blockly_code' => $item['blockly_code'] ?? null,
                            'preview' => $item['preview']
                        ]
                    );
                }

                // mapear original -> real
                $actionRuleIdMap[$origId] = $actionRule->id;

                $createdActionRuleIds[] = $actionRule->id;
                $saved['actionRules']++;
            }
            // apagar ActionRules que já não existem
            if (!empty($createdActionRuleIds)) {
                ActionRule::whereNotIn('id', $createdActionRuleIds)->delete();
            } else {
                // se a lista estiver vazia, significa que não deveria existir nenhum ActionRule
                ActionRule::truncate();
            }

            // --- ACTIONS ---
            foreach ($data['actions'] as $item) {
                if (isset($actionRuleIdMap[$item['action_rule_id']])) {
                    $item['action_rule_id'] = $actionRuleIdMap[$item['action_rule_id']];
                }

                // mapear prev_action_id / next_action_id / par_action_id
                if (isset($actionIdMap[$item['prev_action_id']])) {
                    $item['prev_action_id'] = $actionIdMap[$item['prev_action_id']];
                }
                if (isset($actionIdMap[$item['next_action_id']])) {
                    $item['next_action_id'] = $actionIdMap[$item['next_action_id']];
                }
                if (isset($actionIdMap[$item['par_action_id']])) {
                    $item['par_action_id'] = $actionIdMap[$item['par_action_id']];
                }

                $origId = (int)$item['id'];
                $forceCreate = in_array($origId, $createdActionIds, true);

                if ($forceCreate) {
                    $action = Action::create([
                        'action_rule_id' => $item['action_rule_id'],
                        'type' => $item['type'],
                        'prev_action_id' => $item['prev_action_id'] ?? null,
                        'next_action_id' => $item['next_action_id'] ?? null,
                        'par_action_id' => $item['par_action_id'] ?? null
                    ]);
                } else {
                    $action = Action::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'action_rule_id' => $item['action_rule_id'],
                            'type' => $item['type'],
                            'prev_action_id' => $item['prev_action_id'] ?? null,
                            'next_action_id' => $item['next_action_id'] ?? null,
                            'par_action_id' => $item['par_action_id'] ?? null
                        ]
                    );
                }

                // mapear original -> real
                $actionIdMap[$origId] = $action->id;

                $createdActionIds[] = $action->id;
                $saved['actions']++;
            }
            // apagar Actions que já não existem
            if (!empty($createdActionIds)) {
                Action::whereNotIn('id', $createdActionIds)->delete();
            } else {
                // se a lista estiver vazia, significa que não deveria existir nenhuma Action
                Action::truncate();
            }

            // --- CAUSAL LINKS ---
            foreach ($data['causalLinks'] as $item) {
                if (isset($actionIdMap[$item['causing_action']])) {
                    $item['causing_action'] = $actionIdMap[$item['causing_action']];
                }
                if (isset($transactionTypeIdMap[$item['caused_transaction_type_id']])) {
                    $item['caused_transaction_type_id'] = $transactionTypeIdMap[$item['caused_transaction_type_id']];
                }

                $origId = (int)$item['id'];
                $forceCreate = in_array($origId, $createdCausalLinkIds, true);

                if ($forceCreate) {
                    $causalLink = CausalLink::create([
                        'causing_action' => $item['causing_action'],
                        'caused_transaction_type_id' => $item['caused_transaction_type_id'],
                        'caused_t_state_id' => $item['caused_t_state_id'],
                        'min' => $item['min'],
                        'max' => $item['max'],
                        'cancel_proc' => $item['cancel_proc'],
                        'continue_if_same_user' => $item['continue_if_same_user']
                    ]);
                } else {
                    $causalLink = CausalLink::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'causing_action' => $item['causing_action'],
                            'caused_transaction_type_id' => $item['caused_transaction_type_id'],
                            'caused_t_state_id' => $item['caused_t_state_id'],
                            'min' => $item['min'],
                            'max' => $item['max'],
                            'cancel_proc' => $item['cancel_proc'],
                            'continue_if_same_user' => $item['continue_if_same_user']
                        ]
                    );
                }

                $createdCausalLinkIds[] = $causalLink->id;
                $saved['causalLinks']++;
            }
            // apagar CausalLinks que já não existem
            if (!empty($createdCausalLinkIds)) {
                CausalLink::whereNotIn('id', $createdCausalLinkIds)->delete();
            } else {
                // se a lista estiver vazia, significa que não deveria existir nenhum CausalLink
                CausalLink::truncate();
            }

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
