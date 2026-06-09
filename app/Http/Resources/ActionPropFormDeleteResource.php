<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ActionPropFormDeleteResource extends JsonResource
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
            'id' => $this->action_prop_form_id,
            'action_id' => $this->action_id,
            'property_id' => $this->prop_id,
            'property_name' => $this->property_name,
            'value_type' => $this->value_type,
            'mandatory' => $this->mandatory,
            'action_prop_id' => $this->action_prop_id,
            'form_id' => $this->form_id,
            'lang_id' => $this->lang_id,
            'updated_by' => $this->updated_by,
        ];
    }
}
