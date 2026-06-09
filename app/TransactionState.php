<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionState extends Model
{
    use SoftDeletes;

    protected $table = 'transaction_state';

    public $timestamps = true;

    protected $fillable = [
        'transaction_id',
        't_state_id',
        'type',
        'act_action_id',
        'fact_action_id',
        'state',
		'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function transaction() {
        return $this->belongsTo('App\Transaction', 'transaction_id', 'id');
    }

    public function tState() {
        return $this->belongsTo('App\TState', 't_state_id', 'id');
    }

    public function agent() {
        return $this->belongsTo('App\Agent', 'agent_id', 'id');
    }

    public function transactionAck() {
        return $this->hasMany('App\TransactionAck', 'transaction_state_id', 'id');
    }

    public function actionLogs() {
        return $this->hasMany('App\ActionLog', 'transaction_state_id', 'id');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
