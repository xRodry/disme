<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserEvaluatedExpressionText extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'user_evaluated_expression_text';

    public $timestamps = true;

    protected $primaryKey = ['user_evaluated_expression_id','language_id'];
    public $incrementing = false;

    protected $fillable = [
        'user_evaluated_expression_id',
        'language_id',
        'expression_name',
        'expression_text',
        'updated_by',
        'deleted_by'
    ];

    public function userEvaluatedExpression() {
        return $this->belongsTo('App\UserEvaluatedExpression','user_evaluated_expression_id','id');
    }

    public function language() {
        return $this->belongsTo('App\Language','language_id','id');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
