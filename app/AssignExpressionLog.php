<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssignExpressionLog extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'assign_expression_log';
    public $timestamps = true;

    protected $primaryKey = ['assign_expression_id','transaction_state_id'];
    public $incrementing = false;

    protected $fillable = [
        'assign_expression_id',
        'transaction_state_id',
        'value_id',
        'updated_by',
        'deleted_by'
    ];

    public function assignExpression() {
        return $this->belongsTo('App\AssignExpression','assign_expression_log','id');
    }

    public function transactionState() {
        return $this->belongsTo('App\TransactionState','transaction_state_id','id');
    }

    public function value() {
        return $this->belongsTo('App\Value','value_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
