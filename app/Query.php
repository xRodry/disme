<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Query extends Model
{
    use SoftDeletes;

    protected $table = 'query';

    public $timestamps = true;

    protected $fillable = [
        'base_ent_type_id',
        'query_builder',
        'updated_by',
        'deleted_by'
    ];

    public function baseEntType() {
        return $this->belongsTo('App\EntType', 'base_ent_type_id', 'id');
    }

    public function queryParams() {
        return $this->hasMany('App\QueryParameter', 'query_id', 'id');
    }

    public function queryResult() {
        return $this->hasMany('App\QueryHasResult', 'query_id', 'id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
