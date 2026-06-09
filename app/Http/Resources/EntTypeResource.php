<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EntTypeResource extends JsonResource
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
            'ent_type_id' => $this->ent_type_id,
            'language_id' => $this->language_id,
            'name' => $this->name,
            'has_many' => $this->has_many,
            'user_details' => $this->user_details,
            'updated_by' => $this->updated_by,
            'deleted_by' => $this->deleted_by,
            'transaction_type_id' => $this->transaction_type_id,
            'id' => $this->id
        ];
    }
}
