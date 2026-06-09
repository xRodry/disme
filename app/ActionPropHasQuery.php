<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActionPropHasQuery extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'action_prop_has_query';

    public $timestamps = true;

    protected $primaryKey = ['action_prop_id','query_id'];
    public $incrementing = false;

    protected $fillable = [
        'action_prop_id',
        'query_id',
        'updated_by',
        'deleted_by'
    ];

    public function actionProp() {
        return $this->belongsTo('App\ActionProp','action_prop_id','id');
    }

    public function associatedQuery() {
        return $this->belongsTo('App\Query','query_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
