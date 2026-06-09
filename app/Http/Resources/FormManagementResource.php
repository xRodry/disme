<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FormManagementResource extends JsonResource
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
            'name' => $this->name,
            'action_id' => $this->action_id,
            'action_name' => $this->action_name,
            'transaction_type_id' => $this->transaction_type_id,
            'transaction_type_name' => $this->transaction_type_name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'language_id' => $this->language_id,
            'language_abbrv' => $this->language_abbrv,
            'action_name_user_language' => $this->action_name_user_language ?? null,
            'deleted_action_rule' => $this->deleted_action_rule ?? null,
            'needs_updating' => $this->needsUpdating ?? null,
            'being_used_in_ar_execution' => $this->beingUsedInARExecution ?? null
        ];
    }
}
