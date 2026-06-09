<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Template extends Model
{
    use SoftDeletes;

    protected $table = 'template';

    public $timestamps = true;

    protected $fillable = [
        'type',
		'updated_by',
        'deleted_by'
    ];

    public function language() {
        return $this->belongsToMany('App\Language', 'template_text', 'template_id', 'language_id')->withPivot('text','created_at','updated_at','deleted_at');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
