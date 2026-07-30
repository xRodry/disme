<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use DB;

class Action extends Model
{
    use SoftDeletes;

    protected $table = 'action';

    public $timestamps = true;

    protected $fillable = [
        'diagram_id',
        'action_rule_id',
        'type',
        'name',
        'par_action_id',
        'prev_action_id',
        'next_action_id',
		'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function actionRule() {
        return $this->belongsTo('App\ActionRule','action_rule_id', 'id');
    }

    public function parAction() {
        return $this->belongsTo('App\Action','par_action_id', 'id');
    }

    public function conditions() {
        return $this->hasMany('App\Condition', 'action_id', 'id');
    }

    public function causalLink() {
        return $this->hasMany('App\CausalLink','causing_action', 'id');
    }

    public function actionProps() {
        return $this->hasMany('App\ActionProp','action_id', 'id');
    }

    public function entitySpecifications() {
        return $this->hasMany('App\TermHasEntitySpecification','action_id', 'id');
    }

    public function userEvaluatedExpressions() {
        return $this->hasMany('App\UserEvaluatedExpression','action_id', 'id');
    }

    public function language() {
        return $this->belongsToMany('App\Language', 'action_text', 'action_id', 'language_id')->withPivot('name','description','created_at','updated_at','deleted_at');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }

    /**
     * Retrieves the acceptable enum fields for a column
     *
     * @param string $column Column name
     *
     * @return array
     */
    public static function getPossibleEnumValues ($column) {
        // Create an instance of the model to be able to get the table name
        $instance = new static;

        // Pulls column string from DB
        $enumStr = DB::select(DB::raw('SHOW COLUMNS FROM '.$instance->getTable().' WHERE Field = "'.$column.'"'))[0]->Type;

        // Parse string
        preg_match_all("/'([^']+)'/", $enumStr, $matches);

        // Return matches
        return isset($matches[1]) ? $matches[1] : [];
    }
}
