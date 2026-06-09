<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;


use Illuminate\Http\Resources\Json\JsonResource;

class BiWidgetCountResource extends JsonResource
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
            'biElementsCount' => $this->biElementsCount,
            'biElementTypeCount' => $this->biElementTypeCount,
            'biKnowageCount' => $this->biKnowageCount,
            'biEngineCount' => $this->biEngineCount,
        ];
    }
}
