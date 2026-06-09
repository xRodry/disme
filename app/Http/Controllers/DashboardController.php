<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\ActionProp;
use App\Delegation;
use App\Entity;
use App\EntType;
use App\Http\Resources\DashboardDelegatedTaskResource;
use App\Http\Resources\DashboardExecPendingTasksResource;
use App\Http\Resources\DashboardProcessInitResource;
use App\Http\Resources\DashboardTaskGraphResource;
use App\Http\Resources\ProcessResource;
use App\Http\Resources\TransactionTypeResource;
use App\Http\Traits\ConceptDetailsTrait;
use App\Http\Traits\GetMultilingualConceptName;
use App\InterProcDep;
use App\Process;
use App\ProcessDetails;
use App\ProcessType;
use App\RoleHasUser;
use App\RoleInitiatesTransaction;
use App\Transaction;
use App\TransactionAck;
use App\TransactionState;
use App\TransactionType;
use App\TransactionTypeHasRestrictionQuery;
use App\TransactionTypeName;
use App\UserHasAccessToProcess;
use App\WaitingLink;
use Carbon\Carbon;
use DB;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Log;

class DashboardController extends Controller
{
    use GetMultilingualConceptName, ConceptDetailsTrait;

    // Start a process and its corresponding initializing transaction_type & initial state
    public function startProcess(Request $request) {
        DB::beginTransaction();
        try {
            $userId = $request->user()->id;

            $roleInitiatesTransaction = RoleInitiatesTransaction::where([
                'role_id' => $request->input('role_id'),
                'transaction_type_id' => $request->input('transaction_type_id')
            ])
                ->whereNUll('deleted_at')->first();

            $processType = ProcessType::where('id',$request->input('process_type_id'))
                ->whereNull('deleted_at')->first();

            $process = Process::create([
                'internal_id' => $processType->last_internal_id + 1,
                'process_type_id' => $processType->id,
                'proc_state' => 'execution',
                'state' => 'active',
                'updated_by' => $userId
            ]);

            $processType->update([
                'last_internal_id' => $process->internal_id,
                'updated_by' => $userId
            ]);

            if($roleInitiatesTransaction->own_user_access_only) {
                $userHasAccessToProcess = UserHasAccessToProcess::create([
                    'user_id' => $userId,
                    'process_id' => $process->id,
                    'updated_by' => $userId
                ]);
            }

            $initializingTransaction = Transaction::create([
                'transaction_type_id' => $request->input('transaction_type_id'),
                'state' => 'active',
                'process_id' => $process->id,
                'updated_by' => $userId
            ]);

            $initialTransactionState = TransactionState::create([
                'transaction_id' => $initializingTransaction->id,
                't_state_id' => 1,
                'type' => 'act',
                'state' => 'pending',
                'updated_by' => $userId
            ]);
            DB::commit();
            $success = $initialTransactionState->id;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }
        return (string)$success;
    }

    // Initiate a task associated to an existing process
    public function initiateTaskExistingProcess(Request $request) {
      DB::beginTransaction();
      try {

        $userId = $request->user()->id;
        $transactionTypeId = $request->input('transaction_type_id');
        $processId = $request->input('process_id');

        $newTransaction = Transaction::create([
          'transaction_type_id' => $transactionTypeId,
          'state' => 'active',
          'process_id' => $processId,
          'updated_by' => $userId
        ]);

        $initialTransactionState = TransactionState::create([
          'transaction_id' => $newTransaction->id,
          't_state_id' => 1,
          'type' => 'act',
          'state' => 'pending',
          'updated_by' => $userId
        ]);

        $hasBlockingWaitingLinks = $this->checkForBlockingWaitingLinks($initialTransactionState, $transactionTypeId, $processId, $userId);

        DB::commit();
        $success = $hasBlockingWaitingLinks ? true : $initialTransactionState->id;
      } catch (\Exception $e) {
        $success = false;
        DB::rollback();
        Log::debug($e);
      }
      return (string)$success;
    }

    // -------------------------------------
    // -------- WAITING LINKS --------------
    // -------------------------------------

    private function checkForBlockingWaitingLinks($transactionState, $transactionTypeId, $processId, $userId)
    {
        $hasBlockingWaitingLink  = $this->hasBlockingWaitingLink($transactionState->t_state_id, $transactionTypeId, $processId);
        // If the task has blocking waiting links, pass it to the 'waiting' state
        // Once the blocking task is performed, this task will be back to 'pending' state so the user can execute it
        if ($hasBlockingWaitingLink) {
            $transactionState->update([
                'state' => 'waiting',
                'updated_by' => $userId
            ]);
        }
        return $hasBlockingWaitingLink;
    }

    // Check if the transaction has a 'waiting link' blocking its execution
    private function hasBlockingWaitingLink($tStateId, $transactionTypeId, $processId) {
        // Get waiting links that may block this task.
        $waitingLinks = WaitingLink::where([
            ['waiting_t',$transactionTypeId],
            ['waiting_act',$tStateId]
        ])->whereNull('deleted_at')->get();
        // Get processes that the current process depends on - they can block the current process.
        // [ex: Gross Order blocks Retail Order]
        $interProcDeps = InterProcDep::where('depending_proc', $processId)
            ->whereNull('deleted_at')->get()->pluck('depended_on_proc');
        // For each waiting link, check if the tasks that can block this task have been executed, so it can resume execution
        foreach ($waitingLinks as $waitingLink) {
            Log::debug("Found waiting link");
            Log::debug('has waiting link: '.$waitingLink->id);
            // As soon as it encounters a waitingLink that is blocking the task - returns 'true'.
            // Check if the waited task (transType/tState) has already been created and executed
            $waitedTransactionExists = TransactionState::where([
                ['t_state_id', $waitingLink->waited_act],
                ['type', 'fact']
            ])->with('transaction')->whereHas('transaction', function($query) use ($processId, $waitingLink, $interProcDeps) {
                $query->where('transaction_type_id', $waitingLink->waited_t)
                    ->where(function ($query) use ($processId, $interProcDeps) {
                        $query->where('process_id', $processId)
                            ->orWhereIn('process_id', $interProcDeps);
                    })->whereNull('deleted_at');
            })->whereNull('deleted_at')->first();
            if ($waitedTransactionExists) {
                if (!$waitedTransactionExists->state == 'performed') {
                    return true;
                }
            } else
                return true;
        }
        return false;
    }

    // Used in the tasks' counting for graph representation
    // Gets the user's delegated tasks through its role(s)
    public function getDelegatedTasks(Request $request, $roleID){
        $langId = $request->user()->language_id;

        $delegatedTasks = Delegation::where('delegates_role_id', $roleID)
            ->whereNull('deleted_at')->get();

        foreach($delegatedTasks as $delegatedTask){
            $delegatedTask->transaction_type_name = TransactionTypeName::where([
                ['transaction_type_id', $delegatedTask->transaction_type_id],
                ['language_id', $langId]
            ])->whereNull('deleted_at')->first()->t_name;
            $transactionType = TransactionType::where('id', $delegatedTask->transaction_type_id)
                ->whereNull('deleted_at')->first();
            $delegatedTask->color = ProcessType::where('id', $transactionType->process_type_id)
                ->whereNull('deleted_at')->first()->color;
        }

        return DashboardDelegatedTaskResource::collection($delegatedTasks);
    }

    // Gets the tasks completed by the logged-in user
    public function getFinishedTasks(Request $request){
        $userId = $request->user()->id;
        $langId = $request->user()->language_id;

        $transactionsFinished = TransactionState::where([
            ['updated_by', $userId],
            ['state', 'performed']
        ])->whereHas('actionLogs')
            ->whereNull('deleted_at')->get();

        foreach($transactionsFinished as $transactionFinished){
            // TODO Do we want to see stats for completed tasks that have since been deleted (the transaction type or the process)?
            $transaction = Transaction::withTrashed()->with(['transactionType' => function ($query) {
                $query->withTrashed();
            }])
                ->where('transaction.id', $transactionFinished->transaction_id)
                ->latest()->first();
            $transactionFinished->transaction_type_name = TransactionTypeName::withTrashed()->where([
                ['transaction_type_id', $transaction->transaction_type_id],
                ['language_id', $langId]
            ])->latest()->first();
            $transactionFinished->process_type = ProcessType::withTrashed()->where(
                'id', $transaction->transactionType->process_type_id
            )->latest()->first();
        }
        return DashboardTaskGraphResource::collection($transactionsFinished);
    }

    // Gets all the processes that the user can start or has been delegated to start
    // (processes from all their roles combined)
    public function getProcessesThatUserCanInitiate(Request $request) {
        return $this->auxiliaryProcesses($request, true);
    }

    // Necessary for the start of a task depending on a started process
    // Gets tasks that can be started if a certain process is active
    public function getTasksThatCanInitAfterProcess(Request $request) {
        return $this->auxiliaryProcesses($request, false);
    }

    private function auxiliaryProcesses(Request $request, bool $init_proc) {
        $userId = $request->user()->id;
        $langId = $request->user()->language_id;

        // Variable to store the resulting tasks to return to the dashboard
        $allInitiatingProcesses = new Collection();

        $userRoles = RoleHasUser::where('user_id', $userId)
            ->join('role', 'role_has_user.role_id', '=', 'role.id')
            ->whereNull(['role_has_user.deleted_at', 'role.deleted_at'])
            ->select('role_has_user.*')->get();

        foreach ($userRoles as $userRole) {
            // Gets information only from tasks that can initiate processes/initiate tasks from processes (no delegations)
            $transactionsInitiator = RoleInitiatesTransaction::where('role_id', $userRole->role_id)
                ->whereHas('transactionType', function ($query) use($init_proc) {
                    $query->where('init_proc', $init_proc)
                        ->whereNull('deleted_at')
                        ->whereHas('processType', function ($subQuery) use($init_proc) {
                            $subQuery->whereNull('deleted_at');
                        });
                })
                ->whereNull(['role_initiates_transaction.deleted_at'])
                ->get();
            $transactionsInitiatorCollection = $this->getNecessaryDataProcesses($transactionsInitiator, $userRole->role_id, $langId);

            // Gets information only from the delegated tasks that can initiate processes/initiate tasks from processes
            $delegatedTransactions = Delegation::where([
                ['delegated_role_id', $userRole->role_id],
                ['type', 'act'],
                ['t_state_id', '1']
            ])
                ->join('transaction_type', 'delegation.transaction_type_id', '=', 'transaction_type.id')
                ->whereHas('transactionType', function ($query) use($init_proc) {
                    $query->where('init_proc', $init_proc)
                    ->whereHas('processType', function ($subQuery) use($init_proc) {
                        $subQuery->whereNull('deleted_at');
                    });
                })->whereNull(['delegation.deleted_at', 'transaction_type.deleted_at'])
                ->select('delegation.*')->get();

            // Get the information needed for each task/process
            $delegatedTransactionsCollection = $this->getNecessaryDataProcesses($delegatedTransactions, $userRole->role_id, $langId);

            // Add process/task to the result's collection to be returned to the client-side
            $allInitiatingProcesses = $allInitiatingProcesses->concat($transactionsInitiatorCollection);
            $allInitiatingProcesses = $allInitiatingProcesses->concat($delegatedTransactionsCollection);
        }
        return DashboardProcessInitResource::collection($allInitiatingProcesses);
    }

    private function getNecessaryDataProcesses($transactions, $roleId, $langId) {
        foreach($transactions as $transaction){
            $transaction->role_id = $roleId;
            $transaction->transaction_type = TransactionType::where('id', $transaction->transaction_type_id)
                ->whereNull('deleted_at')->first();
            $transaction->transaction_type_name = $this->getMultilingualConceptName('transaction_type_name',
            't_name', 'transaction_type_id', $transaction->transaction_type_id, $langId);
            $transaction->process_type = ProcessType::where('id',$transaction->transaction_type->process_type_id)
                ->whereNull('deleted_at')->first();
            $transaction->process_type_name = $this->getMultilingualConceptName('process_type_name',
                'name', 'process_type_id', $transaction->transaction_type->process_type_id, $langId);
            $transaction->count = Transaction::where('transaction_type_id',$transaction->transaction_type_id)
                ->whereNull('deleted_at')->count();
        }
        return $transactions;
    }

    // Gets tasks that are pending and await execution by the user (without delegations)
    public function getPendingTasksToExecute(Request $request) {
        $userId = $request->user()->id;
        $langId = $request->user()->language_id;

        // Distinguish between initiatorStates and executorStates, according to the transaction pattern
        $initiatorStates = ['rq', 'ac', 'rj', 'qt', 'rv_rq_rq', 'rv_ac_rq', 'rv_pm_al', 'rv_pm_rf', 'rv_de_al', 'rv_de_rf'];
        $executorStates = ['pm', 'ex', 'de', 'dc', 'sp', 'rv_rq_al', 'rv_rq_rf', 'rv_ac_al', 'rv_ac_rf', 'rv_pm_rq', 'rv_de_rq'];

        // To store the result - all pending tasks (without delegations)
        $allTransactionsInProgress = new Collection();

        $userRoles = RoleHasUser::where('user_id', $userId)
            ->whereNull('deleted_at')->get();

        foreach($userRoles as $userRole){
            // Gets initiatorTasks
            // where the user is the unique initiator (only he has access to that task within the role) and where he's a common one
            $initiatorTasks = RoleInitiatesTransaction::where('role_id', $userRole->role_id)
                ->whereHas('transactionType', function ($query) {
                    $query->whereNull('deleted_at')
                        ->whereHas('processType', function ($subQuery) {
                            $subQuery->whereNull('deleted_at');
                        });
                })
                ->whereNull(['role_initiates_transaction.deleted_at'])
                ->get();
            // Gets executorTasks
            // where the user is the unique executor (only he has access to that task within the role) and where he's a common one
            $executorTasks = TransactionType::where('executer_role_id', $userRole->role_id)
                ->whereHas('processType', function ($subQuery) {
                    $subQuery->whereNull('deleted_at');
                })->whereNull('deleted_at')->get();
            // Gets all 'in Progress' initiatorTasks that are in initiatorStates - unique and common - waiting for user execution
            $transactionsInitiator = TransactionState::where('state', 'pending')
                ->whereHas('tState', function ($query) use ($initiatorStates, $executorStates) {
                    $query->where(function ($query1) use ($initiatorStates) {
                        $query1->where('type','act')->whereIn('abbrv', $initiatorStates);
                    })->orWhere(function ($query2) use ($executorStates) {
                        $query2->where('type','fact')->whereIn('abbrv', $executorStates);
                    });
                })
                ->with('transaction')
                ->whereHas('transaction', function($query) use ($initiatorTasks) {
                    $query->whereIn('transaction_type_id', $initiatorTasks->pluck('transaction_type_id'));
                })->whereNull('deleted_at')->get();
            // Gets all 'in Progress' executorTasks that are in executorStates - unique and common - waiting for user execution
            $transactionsExecutor = TransactionState::where('state', 'pending')
                ->whereHas('tState', function ($query) use ($initiatorStates, $executorStates) {
                    $query->where(function ($query1) use ($executorStates) {
                        $query1->where('type','act')->whereIn('abbrv', $executorStates);
                    })->orWhere(function ($query2) use ($initiatorStates) {
                        $query2->where('type','fact')->whereIn('abbrv', $initiatorStates);
                    });
                })
                ->with('transaction')
                ->whereHas('transaction', function($query) use ($executorTasks) {
                    $query->whereIn('transaction_type_id', $executorTasks->pluck('id'));
                })->whereNull('deleted_at')->get();

            // For transactions where there is only 1 unique initiator, check if the logged-in user has access to it
            $transactionsInitiator = $this->checkUserHasAccessToTransactions($transactionsInitiator, $userId, $initiatorTasks, $userRole->role_id);
            // For transactions where there is only 1 unique executor, check if the logged-in user has access to it
            $transactionsExecutor = $this->checkUserHasAccessToTransactions($transactionsExecutor, $userId, $executorTasks);

            // Join all the valid 'In Progress' Transactions in a single collection
            $transactionsInProgress = new Collection();
            $transactionsInProgress = $transactionsInProgress->merge($transactionsInitiator);
            $transactionsInProgress = $transactionsInProgress->merge($transactionsExecutor);

            // Check if there are any delegated tasks and remove if they shouldn't be visible to the delegator
            $transactionsInProgress = $this->checkDelegatedTasks($transactionsInProgress, $userRole->role_id);

            // Obtains the rest of the necessary data for each task
            $transactionsInProgress = $this->getNecessaryDataPendingTasks($transactionsInProgress, $userRole->role_id, $userId, $langId);

            // Join this role's 'in Progress' tasks with the rest of the user role's 'in Progress' tasks
            $allTransactionsInProgress = $allTransactionsInProgress->merge($transactionsInProgress);
        }
        return DashboardExecPendingTasksResource::collection($allTransactionsInProgress);
    }

    private function checkDelegatedTasks($transactions, $roleId) {
        // Check if there are any delegated tasks and remove if they shouldn't be visible to the delegator
        foreach ($transactions as $key => $transaction) {
            $belongsToDelegation = Delegation::where([
                't_state_id' => $transaction->t_state_id,
                'type' => $transaction->type,
                'transaction_type_id' => $transaction->transaction->transaction_type_id,
                'delegates_role_id' => $roleId
            ])
                // Only consider delegations if they are inside the 'delegation time period', i.e. > start_time and < end_time if it exists
                ->whereDate('start_time','<=',Carbon::now('UTC'))
                ->where(function ($query) {
                    $query->whereDate('end_time','>=',Carbon::now('UTC'))
                        ->orWhereNull('end_time');
                })->whereNull('deleted_at')->first();
            if($belongsToDelegation) {
                if (!$belongsToDelegation->visible_to_delegator) {
                    unset($transactions[$key]);
                }
            }
        }
        return $transactions;
    }

    // Gets tasks that are pending and waiting to be executed by the delegated user
    public function getPendingDelegatedTasksToExecute(Request $request) {
        $userId = $request->user()->id;
        $langId = $request->user()->language_id;

        // To store the final result - all delegated transactions waiting for execution
        $allDelegatedTransactionsInProgress = new Collection();

        $userRoles = RoleHasUser::where('user_id', $userId)
            ->whereNull('deleted_at')->get();

        foreach($userRoles as $userRole){
            $delegatedTransactionsInProgress = new Collection();
            $delegations = Delegation::where('delegated_role_id', $userRole->role_id)
                // Only show delegated tasks if they are inside the 'delegation time period', i.e. (> start_time) and (< end_time if it exists)
                ->whereDate('start_time','<=',Carbon::now('UTC'))
                ->where(function ($query) {
                    $query->whereDate('end_time','>=',Carbon::now('UTC'))
                        ->orWhereNull('end_time');
                })
                // If delegation was made to a specific user, present it only in that user's dashboard.
                ->where(function ($query) use ($userId) {
                    $query->where('user_id',$userId)
                        ->orWhereNull('user_id');
                })
                ->whereHas('transactionType', function ($query) {
                    $query->whereHas('processType', function ($subQuery) {
                            $subQuery->whereNull('deleted_at');
                        });
                })
                ->whereNull('deleted_at')->get();

            // Get the 'in progress' tasks (from transaction_state) waiting for execution that belong to each delegation assigned to the user
            foreach ($delegations as $delegation){
                $transaction = TransactionState::where([
                    ['state', 'pending'],
                    ['type', $delegation->type],
                    ['t_state_id', $delegation->t_state_id]
                ])->with('transaction')
                    ->whereHas('transaction', function($query) use($delegation) {
                        $query->where('transaction_type_id', $delegation->transaction_type_id);
                    })->whereNull('deleted_at')->get();
                // Join the valid delegated 'In Progress' transactions belonging to this role in a single collection
                $delegatedTransactionsInProgress = $delegatedTransactionsInProgress->merge($transaction);
            }

            // Obtains the rest of the necessary data needed for each task
            $delegatedTransactionsInProgress = $this->getNecessaryDataPendingTasks($delegatedTransactionsInProgress, $userRole->role_id, $userId, $langId);

            // Merge this role's pending tasks with the rest of the user role's pending tasks
            $allDelegatedTransactionsInProgress = $allDelegatedTransactionsInProgress->merge($delegatedTransactionsInProgress);
        }
        return DashboardExecPendingTasksResource::collection($allDelegatedTransactionsInProgress);
    }

    // For Transactions where the flag 'own_user_access_only' is active.
    // Check whether the user has access to the assigned transaction's process
    private function checkUserHasAccessToTransactions($checkingTransactions, $userId, $tasks, $roleId = null) {
        foreach ($checkingTransactions as $key => $checkingTransaction) {
            // For initiator Tasks we only check if there's a record in the 'user_has_access_to_process' table.
            if ($this->isUniqueTask($checkingTransaction, $tasks, $roleId)) {
                if ($roleId) {
                    $initiatorHasBeenAssigned = UserHasAccessToProcess::where('process_id', $checkingTransaction->transaction->process_id)
                        ->whereHas('user.role', function($query) use ($roleId) {
                            $query->where('role_id', $roleId);
                        })->whereNull('deleted_at')->first();
                    if ($initiatorHasBeenAssigned) {
                        $userHasAccessToProcess = UserHasAccessToProcess::where([
                            ['user_id', $userId],
                            ['process_id', $checkingTransaction->transaction->process_id]
                        ])->whereHas('user.role', function($query) use ($roleId, $checkingTransaction) {
                            $query->where('role_id', $roleId);
                        })->whereNull('deleted_at')->first();
                    } else {
                        $userHasAccessToProcess = true;
                    }
                } else {
                    // If it's a 'own_user_access_only' task, the executor assigned to it is the first one that claims it.
                    // So, we check if there's a user in the 'user_has_access_to_process' table with the executer_role of the current transType.
                    $transTypeExecuterRoleId = $tasks->firstWhere('id',$checkingTransaction->transaction->transaction_type_id)->executer_role_id;
                    $executerHasBeenAssigned = UserHasAccessToProcess::where('process_id', $checkingTransaction->transaction->process_id)
                        ->whereHas('user.role', function($query) use ($transTypeExecuterRoleId, $checkingTransaction) {
                            $query->where('role_id', $transTypeExecuterRoleId);
                    })->whereNull('deleted_at')->first();
                    if ($executerHasBeenAssigned) {
                        $userHasAccessToProcess = UserHasAccessToProcess::where([
                            ['user_id', $userId],
                            ['process_id', $checkingTransaction->transaction->process_id]
                        ])->whereHas('user.role', function($query) use ($transTypeExecuterRoleId, $checkingTransaction) {
                            $query->where('role_id', $transTypeExecuterRoleId);
                        })->whereNull('deleted_at')->first();
                    } else {
                        $userHasAccessToProcess = true;
                    }
                }
                // Remove the task from the dashboard's tasks list if the user doesn't have access to it.
                if (!$userHasAccessToProcess) {
                    Log::debug('USER '.$userId.' HAS NO PERMISSION TO TRANSACTION STATE: '.$checkingTransaction->id);
                    unset($checkingTransactions[$key]);
                }
            }
        }
        return $checkingTransactions;
    }

    private function isUniqueTask ($checkingTransaction, $tasks, $roleId = null) {
        $transTypeId = $checkingTransaction->transaction->transaction_type_id;
        // RoleId is only passed on InitiatorTasks because we need it to check if tasks is unique to an initiator
        if ($roleId) {
            $unique = $tasks->where('role_id', $roleId)
                ->where('transaction_type_id', $transTypeId)
                ->first()
                ->own_user_access_only;
        } else {
            // To check if task is unique to an executor, we only need the transaction_type_id
            $unique = $tasks->firstWhere('id', $transTypeId)->own_user_access_only;
        }
        return $unique;
    }

    // Obtains the rest of the necessary data needed for the display of pending tasks in the dashboard
    private function getNecessaryDataPendingTasks ($transactionsInProgress, $roleId, $userId, $langId) {
        // Obtains the rest of the necessary data
        foreach($transactionsInProgress as $transactionInProgress){
            $transactionInProgress->role_id = $roleId;
            $transactionInProgress->transaction = Transaction::where('id', $transactionInProgress->transaction_id)
                ->whereNull('deleted_at')->first();
            $transactionInProgress->transaction->process = Process::where('id', $transactionInProgress->transaction->process_id)
                ->whereNull('deleted_at')->first();
            $transactionInProgress->transaction->transaction_type = TransactionType::where('id', $transactionInProgress->transaction->transaction_type_id)
                ->whereNull('deleted_at')->first();
            $transactionInProgress->transaction->transaction_ack = TransactionAck::where([
                ['user_id',$userId],
                ['transaction_state_id',$transactionInProgress->id]
            ])->whereNull('deleted_at')->first();
            $transactionInProgress->t_state_name  = $this->getMultilingualConceptName('t_state_name',
            'name', 't_state_id', $transactionInProgress->t_state_id, $langId);
            $transactionInProgress->t_state_act_name  = $this->getMultilingualConceptName('t_state_name',
                'act_name', 't_state_id', $transactionInProgress->t_state_id, $langId);
            $transactionInProgress->transaction->transaction_type->transaction_type_name = $this->getMultilingualConceptName('transaction_type_name',
                't_name', 'transaction_type_id', $transactionInProgress->transaction->transaction_type->id, $langId);

            // Get the process type's info
            $transactionInProgress->transaction->process->process_type = ProcessType::where(
                'id', $transactionInProgress->transaction->process->process_type_id
            )->whereNull('deleted_at')->first();
            $transactionInProgress->transaction->process->process_type_name = $this->getMultilingualConceptName('process_type_name',
            'name', 'process_type_id', $transactionInProgress->transaction->process->process_type_id, $langId);
            $transactionInProgress->transaction->process->process_type_id_name = $this->getMultilingualConceptName('process_type_name',
            'id_name', 'process_type_id', $transactionInProgress->transaction->process->process_type_id, $langId);
            $transactionInProgress->transaction->process->user_detailing_process_type = EntType::whereHas('transactionType.processType', function($processType) use ($transactionInProgress) {
                $processType->where('process_type.id', $transactionInProgress->transaction->process->process_type_id);
            })->where('user_details', true)->whereNull('ent_type.deleted_at')->get()->count() ? 1 : 0;

            // Temporarily stores the values associated with the task
            $processDetails = array();

            // Obtains entities and the respective properties associated to the task's process
            $transactionInProgress->transaction->entity = Entity::whereHas('transaction.process', function($query) use ($transactionInProgress) {
                $query->where('process_id', $transactionInProgress->transaction->process_id);
            })->whereNull('deleted_at')->get();
            foreach ($transactionInProgress->transaction->entity as $entity) {
                $property_details = ProcessDetails::where('process_type_id', $transactionInProgress->transaction->process->process_type_id)
                    ->whereNull('deleted_at')->get('property_id');
                // On 'user details' entries in the 'Pending Tasks' section, always have as a 'detail' the user's name
                // which that entity belongs to.
                if ($entity->entType->user_details) {
                    $property_details->push((object)['property_id' => 'user']);
                }
                $processDetails = $this->getConceptDetailsInfo($property_details, $entity->id, $langId, $processDetails);
            }
            // Join details' values by property and commas
            $transactionInProgress->transaction->process->details = $this->joinConceptDetailsByProperty($processDetails, $langId);
        }
        return $transactionsInProgress;
    }

    // Gets tasks associated to a certain process (No delegations)
    public function getTasksByProcessTypeId(Request $request, $roleID, $processTypeID){

        $langId = $request->user()->language_id;
        $tasksIds = array();

        // Gets id's of all tasks that have permissions if they are pending
        $initiator = RoleInitiatesTransaction::where('role_id', $roleID)
            ->whereNull('deleted_at')->get();

        foreach($initiator as $init){
            array_push($tasksIds, $init->transaction_type_id);
        }

        $executor = TransactionType::where([
            ['process_type_id', $processTypeID],
            ['executer_role_id', $roleID]
        ])->whereNull('deleted_at')->get();
        foreach($executor as $exec){
            array_push($tasksIds, $exec->id);
        }

        // Remove duplicates
        $tasksIds = array_unique($tasksIds);

        $tasks =  DB::table('transaction_type')
            ->join('transaction_type_name', 'transaction_type.id', '=', 'transaction_type_name.transaction_type_id')
            ->join('language', 'language.id', '=', 'transaction_type_name.language_id')
            ->select('transaction_type.*','transaction_type_name.*')
            ->where([
                ['language.id',$langId],
                ['process_type_id',$processTypeID]
            ])
            ->whereIn('transaction_type.id',$tasksIds)
            ->whereNull('transaction_type.deleted_at')->get();

        return TransactionTypeResource::collection($tasks);
    }

    // Fim Érica - End newDashboard

    public function getProcessesAvailableToInitiateTask(Request $request, $processTypeId, $transactionTypeId) {

        $langId = $request->user()->language_id;

        // Check if the process type has 'user details' entity types and therefore is a 'user detailing' process type
        $userDetailingProcessType = EntType::whereHas('transactionType.processType', function($processType) use ($processTypeId) {
            $processType->where('process_type.id', $processTypeId);
        })->where('user_details', true)->whereNull('ent_type.deleted_at')->get()->count() ? 1 : 0;

        // Check if the task has a 'restriction query' defined to refine the processes that should appear to the user
        // If it does, execute the query and get the query's results' entities - that will be used to restrict the processes
        $entitiesFromQueryResult = $this->checkGetTransactionTypeRestrictionQueryResult($transactionTypeId, $langId);

        // Get the active processes that have entities for the passed transaction type
        $processes = Process::where([
            ['process_type_id', $processTypeId],
            ['proc_state','execution']
        ])->whereHas('transactions.entities', function ($query) use ($entitiesFromQueryResult, $transactionTypeId, $userDetailingProcessType) {
            $query->when($userDetailingProcessType, function ($userDetailEntities) use ($transactionTypeId) {
                // In case it is a 'user detailing' process type, check which 'user details' entityType this
                // transactionType refers to, through its 'user_input' action
                $userDetailingEntTypeId = ActionProp::whereHas('action.actionRule', function ($query) use ($transactionTypeId) {
                    $query->where('transaction_type_id', $transactionTypeId);
                })->first()->prop->ent_type_id;
                $userDetailEntities->where('ent_type_id', $userDetailingEntTypeId);
            });
            $query->when(is_array($entitiesFromQueryResult), function ($query) use ($entitiesFromQueryResult) {
                $query->whereIn('id', $entitiesFromQueryResult);
            });
        })->whereNull('deleted_at')->get();

        foreach ($processes as $process) {
            // Temporarily stores the values associated with the process
            $processDetails = array();
            // Obtains entities and the respective properties associated to the process
            $entities = Entity::whereHas('transaction.process', function($query) use ($process) {
                $query->where('process_id', $process->id);
            })->when($entitiesFromQueryResult, function ($entities) use ($entitiesFromQueryResult) {
                $entities->whereIn('id', $entitiesFromQueryResult);
            })->whereNull('deleted_at')->get();
            foreach ($entities as $entity) {
                $property_details = ProcessDetails::where('process_type_id', $processTypeId)
                    ->whereNull('deleted_at')->get('property_id');
                // On 'user details' entries in the 'Select a Process to Initiate the Task' modal of the 'Initiate Task
                // of Existing Process section, always have as a 'detail' the user's name which that entity belongs to.
                if ($entity->entType->user_details) {
                    $property_details->push((object)['property_id' => 'user']);
                }
                $processDetails = $this->getConceptDetailsInfo($property_details, $entity->id, $langId, $processDetails);
            }
            // Join details' values by property and commas
            $process->details = $this->joinConceptDetailsByProperty($processDetails, $langId);
        }

        return ProcessResource::collection($processes);
    }

    private function checkGetTransactionTypeRestrictionQueryResult($transactionTypeId, $userLangId) {
        // Check if the transaction type has a 'restriction query' specified
        $transactionTypeRestrictionQuery = TransactionTypeHasRestrictionQuery::where('transaction_type_id', $transactionTypeId)
            ->whereNull('deleted_at')->first();
        // If it has, execute the query and get its results' entities ids
        if ($transactionTypeRestrictionQuery) {
            // Execute the query and get its results
            $dynSearchController = new DynSearchController();
            $queryResult = $dynSearchController->getResultsFromQueryId($transactionTypeRestrictionQuery->query_id, $userLangId);
            // Return just the entities available in the 'resultRows' (no need for the individual values here)
            return count($queryResult["resultRows"]) ? array_keys($queryResult["resultRows"]) : [];
        }
        return null;
    }

    public function acknowledgeTask(Request $request) {
        $userId = $request->user()->id;
        $transStateId = $request->input('transaction_state_id');

        $transactionAck = TransactionAck::where([
            ['user_id', $userId],
            ['transaction_state_id', $transStateId]
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {
            if (!$transactionAck) {
                $transactionAck = TransactionAck::create([
                    'user_id' => $userId,
                    'ack_on' => now(),
                    'opened_on' => null,
                    'transaction_state_id' => $transStateId,
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
        return (string)$success;
    }
}
