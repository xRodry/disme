<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DashboardProcessInitResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        if(isset($this->delegates_role_id)){
            return [
                "count" => $this->count,
                "role_id" => $this->role_id,
                "id" => $this->id,
                "delegates_role_id" => $this->delegates_role_id,
                "start_time" => $this->start_time,
                "end_time" => $this->end_time,
                "transaction_type_id" => $this->transaction_type_id,
                "process_type_id" =>  $this->transaction_type->process_type_id,
                "transaction_type_state" => $this->transaction_type->state,
                "executer_role_id" => $this->transaction_type->executer_role_id,
                "transaction_type_name" => $this->transaction_type_name,
                "color" => $this->process_type->color,
                "process_type_state" => $this->process_type->state,
                "process_type_name" => $this->process_type_name,
                "init_proc" => $this->transaction_type->init_proc,
            ];
        }else {
            return [
                "count" => $this->count,
                "role_id" => $this->role_id,
                "transaction_type_id" => $this->transaction_type_id,
                "process_type_id" =>  $this->transaction_type->process_type_id,
                "transaction_type_state" => $this->transaction_type->state,
                "executer_role_id" => $this->transaction_type->executer_role_id,
                "transaction_type_name" => $this->transaction_type_name,
                "color" => $this->process_type->color,
                "process_type_state" => $this->process_type->state,
                "process_type_name" => $this->process_type_name,
                "init_proc" => $this->transaction_type->init_proc,
            ];
        }
    }
}
