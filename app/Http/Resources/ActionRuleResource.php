<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ActionRuleResource extends JsonResource
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
            't_state_id' => $this->t_state_id,
            'type' => $this->type,
            't_state_name'=> $this->t_state_name,
            't_state_act_name' => $this->t_state_act_name,
            'transaction_type_id' => $this->transaction_type_id,
            'transaction_type_name'=> $this->transaction_type_name,
            'blockly_xml' => $this->blockly_xml,
            'blockly_code' => $this->blockly_code,
            'preview' => $this->preview,
            'updated_by' => $this->updated_by,
            'deleted_by' => $this->deleted_by
        ];
    }
}
