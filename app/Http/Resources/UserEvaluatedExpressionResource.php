<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserEvaluatedExpressionResource extends JsonResource
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
            'user_evaluated_expression_id' => $this->user_evaluated_expression_id ?? $this->id,
            'language_id' => $this->language_id,
            'language_abbrv' => $this->language_abbrv,
            'expression_name'=> $this->expression_name,
            'expression_text'=> $this->expression_text,
            'condition_log_id' => $this->condition_log_id ?? null,
            'updated_by'=> $this->updated_by,
            'deleted_by'=> $this->deleted_by,
            'created_at'=> $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at
        ];
    }
}
