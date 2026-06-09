<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoleInitiatesTransaction extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'role_initiates_transaction';

    public $timestamps = true;

    protected $primaryKey = ['role_id','transaction_type_id'];
    public $incrementing = false;

    protected $fillable = [
        'role_id',
        'transaction_type_id',
        'own_user_access_only',
        'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function role() {
        return $this->belongsTo('App\Role', 'role_id', 'id');
    }

    public function transactionType() {
        return $this->belongsTo('App\TransactionType', 'transaction_type_id', 'id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
