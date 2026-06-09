<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TransactionTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'state' => $this->state,
            'process_type_id' => $this->process_type_id,
            'process_type_name' => $this->process_type_name ?? null,
            'init_proc' => $this->init_proc,
            'end_proc' => $this->end_proc,
            'interm_task' => $this->interm_task,
            'external' => $this->external,
            'type' => $this->type,
            'frontier' => $this->frontier,
            'frontier_type' => $this->frontier_type,
            'executer_role_id' => $this->executer_role_id,
            'executer_role_name' => $this->executer_role_name ?? null,
            'initiator_roles' => $this->initiator_roles ?? null,
            'own_user_access_only' => $this->own_user_access_only,
            'restriction_query_id' => $this->restriction_query_id ?? null,
            'auto_activate' => $this->auto_activate,
            'freq_activate' => $this->freq_activate,
            'when_activate' => $this->when_activate,
            'transaction_type_id' => $this->id,
            'language_id' => $this->language_id,
            'language_abbrv' => $this->language_abbrv,
            't_name'=> $this->t_name,
            'rt_name'=> $this->rt_name,
            'updated_by'=> $this->updated_by,
            'deleted_by'=> $this->deleted_by,
            'created_at'=> $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at
        ];
    }
}
