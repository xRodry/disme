<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ValidationCondLog extends Model
{
    use SoftDeletes;
    protected $table = 'validation_cond_log';
    public $timestamps = true;

    protected $fillable = [
        'transaction_state_id',
        'validation_cond_id',
        'form_id',
        'expression_evaluated',
        'expression_result',
        'updated_by',
        'deleted_by'
    ];

    public function transactionState() {
        return $this->belongsTo('App\TransactionState','transaction_state_id','id');
    }

    public function validationCond() {
        return $this->belongsTo('App\ValidationCond','validation_cond_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
