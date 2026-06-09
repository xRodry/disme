<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Form extends Model{

    use SoftDeletes;

    protected $table = 'form';
    protected $fillable = [
        'action_id',
        'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function action() {
        return $this->belongsTo('App\Action', 'action_id', 'id');
    }

    public function actionPropForms() {
        return $this->hasMany('App\ActionPropForm', 'form_id', 'id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }

}
