<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TransactionStateResource extends JsonResource
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
            't_state_id' => $this->id,
            'language_id' => $this->language_id,
            'language_abbrv' => $this->language_abbrv,
            'abbrv' => $this->abbrv,
            'name' => $this->name,
            'act_name' => $this->act_name,
            'updated_by' => $this->updated_by,
            'deleted_by' => $this->deleted_by
        ];
    }
}
