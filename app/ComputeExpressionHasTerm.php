<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComputeExpressionHasTerm extends Model
{
    use SoftDeletes;
    use HasCompositePrimaryKeyTrait;

    protected $table = 'compute_expression_has_term';

    public $timestamps = true;

    protected $primaryKey = ['compute_expression_id','term_id'];
    public $incrementing = false;

    protected $fillable = [
        'compute_expression_id',
        'term_id',
        'order',
        'updated_by',
        'deleted_by'
    ];

    public function computeExpression() {
        return $this->belongsTo('App\ComputeExpression','compute_expression_id','id');
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
