<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
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
            'id' => $this->id,
            'property_id' => $this->id,
            'language_id' => $this->language_id,
            'language_abbrv' => $this->language_abbrv,
            'name' => $this->name,
            'state' => $this->state,
            'scope' => $this->scope,
            'ent_type_id' => $this->ent_type_id,
            'ent_type_name' => $this->ent_type_name ?? null,
            'value_type' => $this->value_type,
            'fk_property_id' => $this->fk_property_id,
            'fk_entity_type_id' => $this->fk_entity_type_id,
            'part_of' => $this->part_of,
            'requires_translation' => $this->requires_translation,
            'editable' => $this->editable,
            'soft_delete' => $this->soft_delete,
            'is_a' => $this->is_a,
            'is_dependent' => $this->is_dependent,
            'multiple_values' => $this->multiple_values,
            'property_values' => $this->propertyValues ?? null,
            'current_value' => $this->currentValues ?? null,
            'updated_by'=> $this->updated_by,
            'deleted_by'=> $this->deleted_by,
            'created_at'=> $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'cant_change_value_type_fk_ent_type' => $this->cantChangeValueTypeFkEntType ?? null,
            'fk_entity_type_properties' => $this->fkEntityTypeProperties ?? null
        ];
    }
}
