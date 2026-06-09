<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;


use Illuminate\Http\Resources\Json\JsonResource;

class BiElementResource extends JsonResource
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
            'bi_engine_id' => $this->bi_engine_id,
            'bi_element_type_id' => $this->bi_element_type_id,
            'preview' => $this->preview,
            'embed' => $this->embed,
            'name'=> $this->name,
            'description'=> $this->description,
            'type_slug' => $this->type_slug,
            'engine_name' => $this->engine_name,
            'language_id' => $this->language_id,
            'language_abbrv' => $this->language_abbrv,
            'created_at'=> $this->created_at,
            'updated_at'=> $this->updated_at,
            'updated_by'=> $this->updated_by,
            'deleted_by'=> $this->deleted_by
        ];
    }
}
