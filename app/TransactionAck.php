<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionAck extends Model
{
    use SoftDeletes;

    protected $table = 'transaction_ack';

    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'ack_on',
        'opened_on',
        'transaction_state_id',
		'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function transactionState() {
        return $this->belongsTo('App\TransactionState', 'transaction_state_id', 'id');
    }

    public function user() {
        return $this->belongsTo('App\Users', 'user_id', 'id');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }

}
