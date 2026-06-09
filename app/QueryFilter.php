<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QueryFilter extends Model
{
    use SoftDeletes;

    protected $table = 'query_filter';

    public $timestamps = true;

    protected $fillable = [
        'query_term_id',
        'property_id',
        'operator',
        'value',
        'is_parameter',
        'updated_by',
        'deleted_by'
    ];

    public function queryTerm() {
        return $this->belongsTo('App\QueryTerm','query_term_id','id');
    }

    public function property() {
        return $this->belongsTo('App\Property','property_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
