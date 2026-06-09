<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Resources;


use Illuminate\Http\Resources\Json\JsonResource;

class RoleInitiatesTransactionResource extends JsonResource
{

    public function toArray($request)
    {
        return [
            'role_id' => $this->role_id,
            'role_name' => $this->role_name,
            'transaction_type_id' => $this->transaction_type_id,
            'transaction_type_name' => $this->transaction_type_name,
            'own_user_access_only' => $this->own_user_access_only,
            'updated_by'=> $this->updated_by,
            'deleted_by'=> $this->deleted_by,
            'created_at'=> $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at
        ];
    }

}
