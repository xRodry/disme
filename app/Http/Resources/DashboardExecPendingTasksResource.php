<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DashboardExecPendingTasksResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $ack_on = $this->transaction->transaction_ack ? $this->transaction->transaction_ack->ack_on : null;
        return [
            "role_id" => $this->role_id,
            "id_name" => $this->transaction->process->process_type_id_name,
            "internal_id" => $this->transaction->process->internal_id,
            "process_type_id" => $this->transaction->process->process_type_id,
            "process_type_name" => $this->transaction->process->process_type_name,
            "user_detailing_process_type" => $this->transaction->process->user_detailing_process_type,
            "process_id" => $this->transaction->process->id,
            "color" => $this->transaction->process->process_type->color,
            "task_name" => $this->transaction->transaction_type->transaction_type_name,
            "t_state_name" => $this->t_state_name,
            "details" => $this->transaction->process->details,
            "created_at" => $this->created_at,
            "trans_type_id" => $this->transaction->transaction_type_id,
            "transaction_id" => $this->transaction->id,
            "t_state_id" => $this->t_state_id,
            "transaction_state_id" => $this->id,
            "ack_on" => $ack_on,
            "action_rule_type" => $this->type,
            "t_state_act_name" => $this->t_state_act_name
        ];
    }
}
