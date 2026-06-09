<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QueryHasTerm extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'query_has_term';

    public $timestamps = true;

    protected $primaryKey = ['query_id','query_term_id'];
    public $incrementing = false;

    protected $fillable = [
        'query_id',
        'query_term_id',
        'updated_by',
        'deleted_by'
    ];

    public function associatedQuery() {
        return $this->belongsTo('App\Query','query_id','id');
    }

    public function queryTerm() {
        return $this->belongsTo('App\QueryTerm','query_term_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
