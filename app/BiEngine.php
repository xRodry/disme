<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BiEngine extends Model
{
    use SoftDeletes;

    protected $table = 'bi_engine';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'logo_preview',
        'updated_by',
        'deleted_by'
    ];

    public function biElements() {
        return $this->hasMany('App\BiElement', 'bi_engine_id', 'id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
