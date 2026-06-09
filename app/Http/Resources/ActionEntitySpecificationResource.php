<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ActionEntitySpecificationResource extends JsonResource
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
            'entitySpecificationTerm' => $this->term_id,
            'action_id' => $this->action_id,
            'ent_type_id' => $this->ent_type_id,
            'ent_type_name' => $this->ent_type_name,
        ];
    }
}
