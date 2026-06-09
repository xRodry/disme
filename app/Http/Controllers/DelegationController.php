<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Delegation;
use App\Http\Resources\DelegatedUserResource;
use App\Http\Resources\DelegationResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\TasksToDelegateResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Role;
use App\RoleHasUser;
use App\RoleInitiatesTransaction;
use App\TransactionType;
use App\TState;
use App\User;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Log;

class DelegationController extends Controller
{
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $userRoles = RoleHasUser::where('user_id', $userId)
            ->whereNull('deleted_at')->get()->pluck('role_id');

        $delegations = Delegation::whereIn('delegates_role_id',$userRoles)
            ->whereNull('deleted_at')->get();

        foreach($delegations as $delegation) {
            $this->getDelegationParamsNames($delegation, $userLangId);
        }

        return DelegationResource::collection($delegations);
    }

    public function show(Request $request, $delegationId)
    {
        $userLangId = $request->user()->language_id;

        $delegation = Delegation::where('id', $delegationId)
            ->whereNull('deleted_at')->first();

        $this->getDelegationParamsNames($delegation, $userLangId);

        return new DelegationResource($delegation);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {
            $delegation = Delegation::create([
                'delegates_role_id' => $request->input('delegates_role_id'),
                'delegated_role_id' => $request->input('delegated_role_id'),
                'user_id' => $request->input('user_id'),
                't_state_id' => $request->input('t_state_id'),
                'type' => $request->input('type'),
                'transaction_type_id' => $request->input('transaction_type_id'),
                'visible_to_delegator' => $request->input('visible_to_delegator'),
                'delegated_user_can_delegate' => $request->input('delegated_user_can_delegate'),
                'start_time' => $request->input('start_time'),
                'end_time' => $request->input('end_time'),
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

    public function update(Request $request, $delegationId)
    {
        $userId = $request->user()->id;

        $delegation = Delegation::where('id', $delegationId)
            ->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {
            $delegation->update([
                'delegates_role_id' => $request->input('delegates_role_id'),
                'delegated_role_id' => $request->input('delegated_role_id'),
                'user_id' => $request->input('user_id'),
                't_state_id' => $request->input('t_state_id'),
                'type' => $request->input('type'),
                'transaction_type_id' => $request->input('transaction_type_id'),
                'visible_to_delegator' => $request->input('visible_to_delegator'),
                'delegated_user_can_delegate' => $request->input('delegated_user_can_delegate'),
                'start_time' => $request->input('start_time'),
                'end_time' => $request->input('end_time'),
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

    public function destroy(Request $request, $delegationId)
    {
        $userId = $request->user()->id;

        $delegation = Delegation::where('id', $delegationId)
            ->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {
            $delegation->update([
                'deleted_by' => $userId
            ]);
            $delegation->delete();
            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }
        return (string) $success;
    }

    private function getDelegationParamsNames($delegation, $userLangId) {
        $delegation->delegates_role_name = $this->getMultilingualConceptName('role_name',
            'name', 'role_id', $delegation->delegates_role_id, $userLangId);
        $delegation->delegated_role_name = $this->getMultilingualConceptName('role_name',
            'name', 'role_id', $delegation->delegated_role_id, $userLangId);
        $delegation->t_state_name = $this->getMultilingualConceptName('t_state_name',
            'name', 't_state_id', $delegation->t_state_id, $userLangId);
        $delegation->t_state_act_name = $this->getMultilingualConceptName('t_state_name',
            'act_name', 't_state_id', $delegation->t_state_id, $userLangId);
        $delegation->transaction_type_name = $this->getMultilingualConceptName('transaction_type_name',
            't_name', 'transaction_type_id', $delegation->transaction_type_id, $userLangId);
        if ($delegation->user_id) {
            $delegation->user_name = User::where('id', $delegation->user_id)
                ->whereNull('deleted_at')->first()->user_name;
        }
    }

    public function getTasksToDelegate(Request $request) {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $initiatorTasks = [];
        $executorTasks = [];
        $delegatedTasks = [];
        // Get the user's roles, so we can see which tasks he can delegate
        $userRoles = RoleHasUser::where('user_id', $userId)
            ->whereNull('deleted_at')->get();

        foreach($userRoles as $userRole) {
            // Gets tasks where the user is the initiator with this role
            $roleInitiatorTasks = RoleInitiatesTransaction::where('role_id', $userRole->role_id)
                ->join('transaction_type', 'transaction_type.id', '=', 'role_initiates_transaction.transaction_type_id')
                ->whereNull(['role_initiates_transaction.deleted_at', 'transaction_type.deleted_at'])
                ->select('transaction_type_id', 'role_id')
                ->get();
            // Join them to the overall initiatorTasks array in the form of [transaction_type_id, role_id]
            $initiatorTasks = array_merge($initiatorTasks, $roleInitiatorTasks->toArray());

            // Gets tasks where the user is the executor with this role
            $roleExecutorTasks = TransactionType::where('executer_role_id', $userRole->role_id)
                ->select('id as transaction_type_id', 'executer_role_id as role_id')
                ->whereNull('deleted_at')->get();
            // Join them to the overall executorTasks array in the form of [transaction_type_id, role_id]
            $executorTasks = array_merge($executorTasks, $roleExecutorTasks->toArray());

            // Gets delegated tasks that the user can sub-delegate with this role
            $delegatedTasksToDelegate = $this->getDelegatedTasksThatUserCanDelegate($userRole, $userId);
            // Join them to the overall delegatedTasks array in the form of [transaction_type_id, role_id, type,
            //  t_state_id, end_time] so we have all data needed
            $delegatedTasks = array_merge($delegatedTasks, $delegatedTasksToDelegate->toArray());
        }

        // Get all the possible states and rest of information for each task/role combo
        $transactionsToDelegate = $this->getInvolvedTasksInformation($initiatorTasks, $executorTasks, $delegatedTasks, $userLangId);

        return TasksToDelegateResource::collection($transactionsToDelegate);
    }

    private function getInvolvedTasksInformation($initiatorTasks, $executorTasks, $delegatedTasks, $userLangId)
    {
        // Distinguish between initiatorStates and executorStates, according to the transaction pattern
        $initiatorStates = ['rq', 'ac', 'rj', 'qt', 'rv_rq_rq', 'rv_ac_rq', 'rv_pm_al', 'rv_pm_rf', 'rv_de_al', 'rv_de_rf'];
        $initiatorStatesId = TState::whereIn('abbrv', $initiatorStates)->whereNull('deleted_at')->get()->pluck('id')->toArray();
        $executorStates = ['pm', 'ex', 'de', 'dc', 'sp', 'rv_rq_al', 'rv_rq_rf', 'rv_ac_al', 'rv_ac_rf', 'rv_pm_rq', 'rv_de_rq'];
        $executorStatesId = TState::whereIn('abbrv', $executorStates)->whereNull('deleted_at')->get()->pluck('id')->toArray();

        // Get all tasks id, unique, involved with this user
        // Unique because 1 task can be in the initiatorTasks & executorTasks or delegatedTasks at the same time
        $allTasksIdInvolved = $this->getAllUniqueDelegatedTasksInvolved($initiatorTasks, $executorTasks, $delegatedTasks);
        $transactionTypes = TransactionType::whereIn('id', $allTasksIdInvolved)->select('id', 'id as transaction_type_id')->get();

        foreach($transactionTypes as $transactionType) {
            // Get the task's name
            $transactionType->transaction_type_name = $this->getMultilingualConceptName('transaction_type_name',
                't_name', 'transaction_type_id', $transactionType->id, $userLangId);

            // Get the roles (for this user) that are involved in this task
            $allRolesIdInvolved = $this->getAllUniqueRolesInvolved($transactionType->id,
                $initiatorTasks, $executorTasks, $delegatedTasks);
            $transactionType->roles = Role::whereIn('id', $allRolesIdInvolved)->select('id', 'id as role_id')->get();

            foreach($transactionType->roles as $role) {
                // So that we can keep track of which initiator tStates [task IS state] to get the final info later
                $tasksStatesIs = [];
                // So that we can keep track of which executor tStates [task HAS BEEN state] to get the final info later
                $tasksStatesHasBeen = [];

                // Get the role's name
                $role->role_name = $this->getMultilingualConceptName('role_name', 'name',
                    'role_id', $role->id, $userLangId);

                // If this task/role combo is in the initiatorTasks array, add the user's corresponding tStates
                //   As the user has the initiatorRole, we add both tasksStates for IS (ex:rq) and HAS-BEEN(ex:pm)
                if ($this->existsInTasksArray($initiatorTasks, $transactionType, $role)){
                    $tasksStatesIs = $initiatorStatesId;
                    $tasksStatesHasBeen = $executorStatesId;
                }

                // If this task/role combo is in the executorTasks array, add the user's corresponding tStates
                //   As the user has the executorRole, we add both tasksStates for IS (ex:pm) and HAS-BEEN(ex:rq)
                if ($this->existsInTasksArray($executorTasks, $transactionType, $role)) {
                    $tasksStatesIs = array_unique(array_merge($tasksStatesIs, $executorStatesId));
                    $tasksStatesHasBeen = array_unique(array_merge($tasksStatesHasBeen, $initiatorStatesId));
                }

                // Associate the analysed initiatorStates to the transactionType->Role->possible_states_act collection
                //    to be returned in the form of [t_state_id, t_state_name]
                $this->getInitiatorTaskInfo($role, $tasksStatesIs, $userLangId);
                // Associate the analysed executorStates to the transactionType->Role->possible_states_fact collection
                //    to be returned in the form of [t_state_id, t_state_name]
                $this->getExecutorTaskInfo($role, $tasksStatesHasBeen, $userLangId);

                // Check if this task/role combo has occurrences in the delegatedTasks array
                if ($this->existsInTasksArray($delegatedTasks, $transactionType, $role)) {
                    // If it does, get the specific delegatedTasks so we can get additional information for the resulting array
                    $delegatedTasksToCheck = array_filter($delegatedTasks, function($item) use ($role, $transactionType) {
                        return $item['transaction_type_id'] === $transactionType->id &&
                            $item['role_id'] === $role->id;
                    });
                    // For the corresponding delegatedTasks, insert the delegated tasks information in the returning array
                    //    depending on the delegated task type (act - initiatorState/fact - executorState)
                    foreach ($delegatedTasksToCheck as $delegation) {
                        if ($delegation['type'] === 'act') {
                            // Check if the initiatorTState is already in this task->role combination. If not, add it.
                            $this->insertDelegatedTStateIfNotPresent($delegation, $tasksStatesIs, $role, $userLangId);
                        } else {
                            // Check if the executorTState is already in this task->role combination. If not, add it
                            $this->insertDelegatedTStateIfNotPresent($delegation, $tasksStatesHasBeen, $role, $userLangId);
                        }
                    }
                }

            }
        }
        return $transactionTypes;
    }

    private function getAllUniqueDelegatedTasksInvolved($initiatorTasks, $executorTasks, $delegatedTasks) {
        // Get an array for each one with just transactionTypeIds and then merge them into one array without duplicates
        $initiatorTasksIds = array_column($initiatorTasks, 'transaction_type_id');
        $executorTasksIds = array_column($executorTasks, 'transaction_type_id');
        $delegatedTasksIds = array_column($delegatedTasks, 'transaction_type_id');
        return array_unique(array_merge($initiatorTasksIds, $executorTasksIds, $delegatedTasksIds));
    }

    private function getAllUniqueRolesInvolved($taskId, $initiatorTasks, $executorTasks, $delegatedTasks) {
        // For each taskArray, get only the records that are correspondent to the $taskId passed, and then get those
        // records' role_id param to then be merged into one array without duplicates
        $initiatorRolesIds = array_column(array_filter($initiatorTasks, function ($taskBeingChecked) use ($taskId) {
            return $taskBeingChecked['transaction_type_id'] === $taskId;
        }), 'role_id');
        $executorRolesIds = array_column(array_filter($executorTasks, function ($taskBeingChecked) use ($taskId) {
            return $taskBeingChecked['transaction_type_id'] === $taskId;
        }), 'role_id');
        $delegatedRolesIds = array_column(array_filter($delegatedTasks, function ($taskBeingChecked) use ($taskId) {
            return $taskBeingChecked['transaction_type_id'] === $taskId;
        }), 'role_id');
        return array_unique(array_merge($initiatorRolesIds, $executorRolesIds, $delegatedRolesIds));
    }

    private function existsInTasksArray($tasks, $transactionType,  $role) {
        // Check if this task/role combo is inside the passed $tasks array (initiator, executor or delegated tasks)
        return !!array_filter($tasks, function ($item) use ($transactionType, $role) {
            return $item['role_id'] === $role->id && $item['transaction_type_id'] === $transactionType->id;
        });
    }

    private function getInitiatorTaskInfo($role, $initiatorStatesId, $userLangId) {
        // Return the initiator tStates as a collection in the resulting array, joining their name to their id.
        $role->possible_states_act = TState::whereIn('id', $initiatorStatesId)->select('id', 'id as t_state_id')->get();
        foreach ($role->possible_states_act as $possibleStateAct) {
            $possibleStateAct->name = $this->getMultilingualConceptName('t_state_name',
                'name', 't_state_id', $possibleStateAct->id, $userLangId);
        }
    }

    private function getExecutorTaskInfo($role, $executorStatesId, $userLangId) {
        // Return the executor tStates as a collection in the resulting array, joining their name to their id.
        $role->possible_states_fact = TState::whereIn('id', $executorStatesId)->select('id', 'id as t_state_id')->get();
        foreach ($role->possible_states_fact as $possibleStateFact) {
            $possibleStateFact->name = $this->getMultilingualConceptName('t_state_name',
                'name', 't_state_id', $possibleStateFact->id, $userLangId);
        }
    }

    private function getDelegatedTasksThatUserCanDelegate($userRole, $userId) {
        // Only get delegations that the delegated user can delegate
        return Delegation::where([
            'delegated_role_id' => $userRole->role_id,
            'delegated_user_can_delegate' => true
        ])->join('transaction_type', 'transaction_type.id', '=', 'delegation.transaction_type_id')
            // Only counts delegated tasks if they are inside the 'delegation time period', i.e. (> start_time) and (< end_time if it exists)
            ->whereDate('start_time','<=',Carbon::now('UTC'))
            ->where(function ($query) {
                $query->whereDate('end_time','>=',Carbon::now('UTC'))
                    ->orWhereNull('end_time');
            })
            // If delegation was made to a specific user, only count it if it's the assigned user.
            ->where(function ($query) use ($userId) {
                $query->where('user_id',$userId)
                    ->orWhereNull('user_id');
            })->select('transaction_type_id', 'delegated_role_id as role_id', 'type', 't_state_id', 'end_time')
            ->whereNull(['delegation.deleted_at', 'transaction_type.deleted_at'])->get();
    }

    private function insertDelegatedTStateIfNotPresent($delegation, $taskAllowedStates, $role, $userLangId) {
        // Check if the delegatedState has been inserted before due to user being initiator or executor of this task
        $alreadyPresent = array_filter($taskAllowedStates, function($item) use ($delegation) {
            return $item === $delegation['t_state_id'];
        });
        // If it hasn't been added, add it to the initiator or executor states with the needed information
        if (!$alreadyPresent) {
            // In order to insert the tState as a collectionRecord in the resulting array, with id, name and end_time
            $delegationTState = TState::where('id', $delegation['t_state_id'])->select('id', 'id as t_state_id')->first();
            $delegationTState->name = $this->getMultilingualConceptName('t_state_name',
                'name', 't_state_id', $delegationTState['t_state_id'], $userLangId);
            $delegationTState->end_time = $delegation['end_time'];
            // Depending on the delegation's type, add it to the possibleInitiatorStates or possibleExecutorStates
            if ($delegation['type'] === 'act') {
                $role->possible_states_act[] = $delegationTState;
            } else {
                $role->possible_states_fact[] = $delegationTState;
            }
        }
    }

    public function getUserRoles(Request $request) {

        $userLangId = $request->user()->language_id;

        $roles = Role::whereNull('deleted_at')->get();

        foreach ($roles as $role) {
            $role->name = $this->getMultilingualConceptName('role_name',
                'name', 'role_id', $role->id, $userLangId);
        }

        return RoleResource::collection($roles);
    }

    public function getUsersFromRole(Request $request, $roleId) {
        $users = RoleHasUser::where('role_id', $roleId)
            ->with('user')
            ->whereNull('deleted_at')->get();

        return DelegatedUserResource::collection($users);
    }
}
