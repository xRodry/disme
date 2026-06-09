<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserIsOwnerOfTransaction extends Model
{
    use SoftDeletes;

    protected $table = 'user_is_owner_of_transaction';

    public $timestamps = true;

    protected $fillable = [
        'transaction_id',
        'users_id',
		'updated_by',
        'deleted_by'
    ];

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
