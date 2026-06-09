<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ActionsDashboardResource extends JsonResource
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
            'action_rule_id' => $this->action_rule_id,
            'type' => $this->type,
            'prev_action_id' => $this->prev_action_id,
            'next_action_id' => $this->next_action_id,
            'par_action_id'=> $this->par_action_id,
            'updated_by'=> $this->updated_by,
            'deleted_by'=> $this->deleted_by,
            'created_at'=> $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'form_id' => $this->formId ?? null,
            'form_details' => $this->formDetails ?? null,
            'template' => $this->template ?? null,
            'user_evaluated_expression' => $this->user_evaluated_expression ?? null,
            'detailing_user_id' => $this->detailingUserId ?? null,
            'entity_instances' => $this->entityInstances ?? null,
            'action_log_id' => $this->action_log_id ?? null,
            'action_rule' => $this->action_rule ?? null,
            'factSpecificationTermValueAssigned' => $this->factSpecificationTermValueAssigned ?? null
        ];
    }
}
