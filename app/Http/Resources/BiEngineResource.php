<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;


use Illuminate\Http\Resources\Json\JsonResource;

class BiEngineResource extends JsonResource
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
            'name' => $this->name,
            'logo_preview' => $this->logo_preview,
            'biElements' => $this->biElements ?? null,
            'created_at'=> $this->created_at,
            'updated_at'=> $this->updated_at,
            'updated_by'=> $this->updated_by,
            'deleted_by'=> $this->deleted_by
        ];
    }
}
