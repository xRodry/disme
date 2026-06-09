<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;


use Illuminate\Http\Resources\Json\JsonResource;

class EntityTypeResource extends JsonResource
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
            'id'=> $this->id,
            'entity_type_id' => $this->id,
            'name' => $this->name,
            'id_name' => $this->id_name ?? null,
            'language_id' => $this->language_id,
            'language_abbrv' => $this->language_abbrv,
            'state' => $this->state,
            'transaction_type_id' => $this->transaction_type_id,
            'transaction_type_name' => $this->transaction_type_name,
            'last_internal_id' => $this->last_internal_id,
            'has_many' => $this->has_many,
            'auto_generated' => $this->auto_generated,
            'external' => $this->external,
            'user_details' => $this->user_details,
            'properties' => $this->properties ?? null,
            'updated_by'=> $this->updated_by,
            'deleted_by'=> $this->deleted_by,
            'created_at'=> $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at
        ];
    }

}
