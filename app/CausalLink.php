<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CausalLink extends Model
{
    use SoftDeletes;

    protected $table = 'causal_link';

    public $timestamps = true;

    protected $fillable = [
        'diagram_id',
        'causing_action',
        'caused_transaction_type_id',
        'caused_t_state_id',
        'min',
        'max',
        'cancel_proc',
        'continue_if_same_user',
		'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function causedTransactionType() {
        return $this->belongsTo('App\TransactionType', 'caused_transaction_type_id', 'id');
    }

    public function causedTState() {
        return $this->belongsTo('App\TState', 'caused_t_state_id', 'id');
    }

    public function causingAction() {
        return $this->belongsTo('App\Action', 'causing_action', 'id');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
