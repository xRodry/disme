<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PropUnitType extends Model
{
    use SoftDeletes;

    protected $table = 'prop_unit_type';

    public $timestamps = true;

    protected $fillable = [
        'abbrv',
        'state',
		'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function properties() {
        return $this->hasMany('App\Property', 'unit_type_id', 'id');
    }

    public function language() {
        return $this->belongsToMany('App\Language', 'prop_unit_type_name', 'prop_unit_type_id', 'language_id')->withPivot('name','created_at','updated_at','deleted_at');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }

}
