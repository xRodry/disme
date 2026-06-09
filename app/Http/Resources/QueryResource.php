<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Log;

class QueryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Ternary operator throws an 'undefined property' when used together with the (object) casting
        if (isset($this->filterProperties)) {
            $filterProperties = (object)$this->filterProperties;
        }
        // Ternary operator throws an 'undefined property' when used together with the (object) casting
        if (isset($this->includedProperties)) {
            $includedProperties = (object)$this->includedProperties;
        }
        return [
            'id' => $this->id,
            'name' => $this->name,
            'base_ent_type_id' => $this->base_ent_type_id,
            'query_builder'=> $this->query_builder,
            'updated_by'=> $this->updated_by,
            'deleted_by'=> $this->deleted_by,
            'created_at'=> $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'filterProperties' => $filterProperties ?? null,
            'includedProperties' => $includedProperties ?? null,
            'selectedEntityTypes' => $this->selectedEntityTypes ?? null,
            'automatedName' => $this->automatedName ?? null,
            'propertyParameters' => $this->propertyParameters ?? null
        ];
    }
}
