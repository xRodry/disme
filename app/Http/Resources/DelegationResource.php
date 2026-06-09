<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DelegationResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'delegates_role_id' => $this->delegates_role_id,
            'delegates_role_name' => $this->delegates_role_name,
            'delegated_role_id' => $this->delegated_role_id,
            'user_id' => $this->user_id,
            'user_name' => $this->user_name ?: null,
            'delegated_role_name' => $this->delegated_role_name,
            't_state_id' => $this->t_state_id,
            't_state_name' => $this->t_state_name,
            't_state_act_name' => $this->t_state_act_name,
            'type' => $this->type,
            'transaction_type_id' => $this->transaction_type_id,
            'transaction_type_name' => $this->transaction_type_name,
            'visible_to_delegator' => $this->visible_to_delegator,
            'delegated_user_can_delegate' => $this->delegated_user_can_delegate,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'updated_at' => $this->updated_at,
            'created_at' => $this->created_at
        ];
    }
}
