<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserEvaluatedExpression extends Model
{
    use SoftDeletes;

    protected $table = 'user_evaluated_expression';

    public $timestamps = true;

    protected $fillable = [
		'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function userEvaluatedExpressionTexts() {
        return $this->hasMany('App\UserEvaluatedExpressionText','user_evaluated_expression_id','id');
    }

    public function conditionHasUserEvaluatedExpressions() {
        return $this->hasMany('App\ConditionHasUserEvaluatedExpression','user_evaluated_expression_id','id');
    }

    /*public function arCondition() {

        return $this->belongsTo('App\ArCondition','ar_condition_id', 'id');
    }

    public function action() {

        return $this->belongsTo('App\Action','action_id', 'id');
    }*/

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
