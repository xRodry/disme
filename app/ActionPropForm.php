<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActionPropForm extends Model
{
    use SoftDeletes;

    public $timestamps = true;

    protected $table = 'action_prop_form';

    protected $fillable = [
        'action_prop_id',
        'form_id',
        'form_field_type',
        'lang_id',
        'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function actionProp() {
        return $this->belongsTo('App\ActionProp','action_prop_id','id');
    }

    public function form() {
        return $this->belongsTo('App\Form','form_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }

}
