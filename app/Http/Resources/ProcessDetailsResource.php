<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProcessDetailsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'process_type_id' => $this->process_type_id,
            'process_type_name' => $this->process_type_name,
            'property_id' => $this->property_id,
            'property_name' => $this->property_name,
            'entity_type' => $this->entity_type_name,
            'updated_by'=> $this->updated_by,
            'deleted_by'=> $this->deleted_by,
            'created_at'=> $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at
        ];
    }
}
