<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;


use Illuminate\Http\Resources\Json\JsonResource;

class WaitingLinkResource extends JsonResource
{

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'waited_t' => $this->waited_t,
            'waited_t_name' => $this->waited_t_name,
            'waited_act' => $this->waited_act,
            'waited_act_name' => $this->waited_act_name,
            'waiting_t' => $this->waiting_t,
            'waiting_t_name' => $this->waiting_t_name,
            'waiting_act' => $this->waiting_act,
            'waiting_act_name' => $this->waiting_act_name,
            'min' => $this->min,
            'max' => $this->max,
            'created_at'=> $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at
        ];
    }

}
