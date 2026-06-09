<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CausalLinkResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'causing_action' => $this->causing_action,
            'caused_transaction_type_id' => $this->caused_transaction_type_id,
            'caused_t_state_id' => $this->caused_t_state_id,
            'min' => $this->min,
            'max' => $this->max,
            'cancel_proc' => $this->cancel_proc,
            'continue_if_same_user' => $this->continue_if_same_user,
            'created_at'=> $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at
        ];
    }

}
