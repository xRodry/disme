<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ActionPropResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        $validationConditions = $this->validation_conditions ? ValidationConditionResource::collection($this->validation_conditions) : null;
        $currentValue = $this->current_value ?? null;
        return [
            'action_prop_id' => $this->action_prop_id ?? 0,
            'property_id' => $this->property_id,
            'order' => $this->order,
            'part_of' => $this->part_of,
            'value_type' => $this->value_type,
            'property_name' => $this->property_name,
            'possible_values' => $this->possible_values ?? null,
            'validation_conditions' => $validationConditions,
            'enable_condition' => $this->enable_condition,
            'form_calculation' => $this->form_calculation,
            'current_value' => $currentValue,
            'multiple_values' => $this->multiple_values,
            'ent_type_id' => $this->ent_type_id,
            'ent_type_name' => $this->ent_type_name,
            'ent_type_has_many' => $this->has_many,
            'unchangeable' => $this->unchangeable ?? 0,
            'has_query_options' => $this->has_query_options
        ];
    }
}
