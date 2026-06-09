<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BiElementText extends Model
{
    use SoftDeletes, HasCompositePrimaryKeyTrait;

    protected $table = 'bi_element_text';

    public $timestamps = true;

    protected $primaryKey = ['bi_element_id','language_id'];
    public $incrementing = false;

    protected $fillable = [
        'bi_element_id',
        'language_id',
        'name',
        'description',
        'updated_by',
        'deleted_by'
    ];

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
