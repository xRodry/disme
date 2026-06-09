<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserInputLog extends Model
{
    use SoftDeletes;
    protected $table = 'user_input_log';
    public $timestamps = true;

    protected $fillable = [
        'transaction_state_id',
        'action_id',
        'updated_by',
        'deleted_by'
    ];

    public function transactionState() {
        return $this->belongsTo('App\TransactionState','transaction_state_id','id');
    }

    public function action() {
        return $this->belongsTo('App\Action','action_id','id');
    }

    public function values() {
        return $this->hasMany('App\UserInputLogHasValue','user_input_log_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
