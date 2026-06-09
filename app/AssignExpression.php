<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssignExpression extends Model
{
    use SoftDeletes;

    protected $table = 'assign_expression';

    public $timestamps = true;

    protected $fillable = [
        'destination_term_id',
        'source_term_id',
        'action_id',
        'updated_by',
        'deleted_by'
    ];

    public function destinationTerm() {
        return $this->belongsTo('App\Term','destination_term_id','id');
    }

    public function sourceTerm() {
        return $this->belongsTo('App\Term','source_term_id','id');
    }

    public function action() {
        return $this->belongsTo('App\Action','action_id','id');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
