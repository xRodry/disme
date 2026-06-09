<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QueryParameter extends Model
{
    use SoftDeletes;

    protected $table = 'query_parameter';

    public $timestamps = true;

    protected $fillable = [
        'query_id',
        'query_filter_id',
        'term_id',
        'updated_by',
        'deleted_by'
    ];

    public function associatedQuery() {
        return $this->belongsTo('App\Query','query_id','id');
    }

    public function queryFilter() {
        return $this->belongsTo('App\QueryFilter','query_filter_id','id');
    }

    public function term() {
        return $this->belongsTo('App\Term','term_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
