<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionTypeHasRestrictionQuery extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'transaction_type_has_restriction_query';

    public $timestamps = true;

    protected $primaryKey = ['transaction_type_id','query_id'];
    public $incrementing = false;

    protected $fillable = [
        'transaction_type_id',
        'query_id',
        'updated_by',
        'deleted_by'
    ];

    public function transactionType() {
        return $this->belongsTo('App\TransactionType','transaction_type_id','id');
    }

    public function restrictionQuery() {
        return $this->belongsTo('App\Query', 'query_id', 'id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
