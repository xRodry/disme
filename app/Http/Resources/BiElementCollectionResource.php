<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;


use Illuminate\Http\Resources\Json\JsonResource;

class BiElementCollectionResource extends JsonResource
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
            'user_id' => $this->user_id,
            'bi_element_id' => $this->bi_element_id,
            'preview' => $this->biElement->preview,
            'embed' => $this->biElement->embed,
            'name'=> $this->biElement->name,
            'description'=> $this->biElement->description,
            'language_id' => $this->language_id,
            'language_abbrv' => $this->language_abbrv,
            'created_at'=> $this->created_at,
            'updated_at'=> $this->updated_at,
            'updated_by'=> $this->updated_by,
            'deleted_by'=> $this->deleted_by
        ];
    }
}
