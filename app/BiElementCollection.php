<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BiElementCollection extends Model
{
    use SoftDeletes, HasCompositePrimaryKeyTrait;

    protected $table = 'bi_element_collection';

    public $timestamps = true;

    protected $primaryKey = ['user_id','bi_element_id'];
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'bi_element_id',
        'updated_by',
        'deleted_by'
    ];

    public function user() {
        return $this->belongsTo('App\Users', 'user_id', 'id');
    }

    public function biElement() {
        return $this->belongsTo('App\BiElement', 'bi_element_id', 'id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
