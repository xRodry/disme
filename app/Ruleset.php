<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ruleset extends Model
{
    use SoftDeletes;

    protected $table = 'ruleset';

    public $timestamps = true;

    protected $fillable = [
        'type',
        'query_term_id',
        'updated_by',
        'deleted_by'
    ];

    public function queryTerm() {
        return $this->belongsTo('App\QueryTerm', 'query_term_id', 'id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
