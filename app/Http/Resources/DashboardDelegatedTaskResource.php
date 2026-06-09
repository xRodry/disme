<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DashboardDelegatedTaskResource extends JsonResource
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
            "transaction_type_id" => $this->transaction_type_id,
            "transaction_type_name" => $this->transaction_type_name,
            "color" => $this->color,
        ];
    }
}
