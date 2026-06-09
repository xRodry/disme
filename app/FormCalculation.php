<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormCalculation extends Model
{
    use SoftDeletes;

    protected $table = 'form_calculation';

    public $timestamps = true;

    protected $fillable = [
        'action_prop_id',
        'compute_expression_id',
        'updated_by',
        'deleted_by'
    ];

    public function actionProp() {
        return $this->belongsTo('App\ActionProp','action_prop_id','id');
    }

    public function computeExpression() {
        return $this->belongsTo('App\ComputeExpression','compute_expression_id','id');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
