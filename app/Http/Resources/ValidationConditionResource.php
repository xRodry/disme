<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ValidationConditionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        $error_text = $this->error_text ?? null;
        return [
            'id' => $this->id,
            'type' => $this->type,
            'action_prop_id' => $this->action_prop_id,
            'param_1'=>$this->param_1,
            'param_2' => $this->param_2,
            'custom_validation'=> $this->custom_validation,
            'neg' => $this->negative,
            'error_text' => $error_text
        ];
    }
}
