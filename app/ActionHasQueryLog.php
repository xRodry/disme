<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActionHasQueryLog extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'action_has_query_log';

    public $timestamps = true;

    protected $primaryKey = ['query_id','transaction_state_id'];
    public $incrementing = false;

    protected $fillable = [
        'query_id',
        'transaction_state_id',
        'query_result',
        'updated_by',
        'deleted_by'
    ];

    public function associatedQuery() {
        return $this->belongsTo('App\Query','query_id','id');
    }

    public function transactinoState() {
        return $this->belongsTo('App\TransactionState','transaction_state_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
