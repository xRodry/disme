<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BiElement extends Model
{
    use SoftDeletes;

    protected $table = 'bi_element';

    public $timestamps = true;

    protected $fillable = [
        'bi_engine_id',
        'bi_element_type_id',
        'preview',
        'embed',
        'updated_by',
        'deleted_by'
    ];

    public function biEngine() {
        return $this->belongsTo('App\BiEngine', 'bi_engine_id', 'id');
    }

    public function biElementType() {
        return $this->belongsTo('App\BiElementType', 'bi_element_type_id', 'id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
