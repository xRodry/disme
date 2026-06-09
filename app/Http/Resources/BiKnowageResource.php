<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;


use Illuminate\Http\Resources\Json\JsonResource;

class BiKnowageResource extends JsonResource
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
            'label' => $this->label,
            'preview' => $this->preview,
            'type' => $this->type,
            'role' => $this->role,
            'dataset_label' => $this->dataset_label,
            'display_toolbar' => $this->display_toolbar,
            'display_sliders' => $this->display_sliders,
            'reset_parameters' => $this->reset_parameters,
            'name' => $this->name,
            'description' => $this->description,
            'language_id' => $this->language_id,
            'language_abbrv' => $this->language_abbrv,
            'created_at'=> $this->created_at,
            'updated_at'=> $this->updated_at,
            'updated_by'=> $this->updated_by,
            'deleted_by'=> $this->deleted_by
        ];
    }
}
