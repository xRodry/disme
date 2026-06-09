<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Delegation extends Model
{
    use SoftDeletes;

    protected $table = 'delegation';

    public $timestamps = true;

    protected $fillable = [
        'delegates_role_id',
        'delegated_role_id',
        'user_id',
        'delegated_user_can_delegate',
        't_state_id',
        'type',
        'transaction_type_id',
        'visible_to_delegator',
        'start_time',
        'end_time',
        'state',
		'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function delegates_role()
    {
        return $this->belongsTo('App\Role', 'delegates_role_id', 'id');
    }

    public function delegated_role()
    {
        return $this->belongsTo('App\Role', 'delegated_role_id', 'id');
    }

    public function delegatedUser()
    {
        return $this->belongsTo('App\User', 'user_id', 'id');
    }

    public function t_state()
    {
        return $this->belongsTo('App\TState', 't_state_id', 'id');
    }

    public function transactionType()
    {
        return $this->belongsTo('App\TransactionType', 'transaction_type_id', 'id');
    }

    public function updatedBy()
    {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy()
    {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
