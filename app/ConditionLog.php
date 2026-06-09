<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConditionLog extends Model
{
    use SoftDeletes;
    protected $table = 'condition_log';
    public $timestamps = true;

    protected $fillable = [
        'condition_id',
        'transaction_state_id',
        'parent_cond_log_id',
        'expression_evaluated',
        'expression_result',
        'updated_by',
        'deleted_by'
    ];

    public function condition() {
        return $this->belongsTo('App\Condition','condition_id','id');
    }

    public function transactionState() {
        return $this->belongsTo('App\TransactionState','transaction_state_id','id');
    }

    public function userEvaluatedExpressions() {
        return $this->hasMany('App\UserEvaluatedExpressionLog','condition_log_id','id');
    }

    public function compEvaluatedExpressions() {
        return $this->hasMany('App\CompEvaluatedExpressionLog','condition_log_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
