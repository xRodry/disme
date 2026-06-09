<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserEvaluatedExpressionLog extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;
    protected $table = 'user_evaluated_expression_log';

    public $timestamps = true;

    protected $primaryKey = ['condition_log_id','user_evaluated_expression_id'];
    public $incrementing = false;

    protected $fillable = [
        'condition_log_id',
        'user_evaluated_expression_id',
        'expression_result',
        'updated_by',
        'deleted_by'
    ];

    public function conditionLog() {
        return $this->belongsTo('App\ConditionLog','condition_log_id','id');
    }

    public function userEvaluatedExpression() {
        return $this->belongsTo('App\UserEvaluatedExpression','user_evaluated_expression_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
