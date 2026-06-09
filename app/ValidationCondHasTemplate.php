<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ValidationCondHasTemplate extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'validation_cond_has_template';

    public $timestamps = true;

    protected $primaryKey = ['template_id','validation_cond_id'];
    public $incrementing = false;

    protected $fillable = [
        'template_id',
        'validation_cond_id',
        'updated_by',
        'deleted_by'
    ];

    public function template() {
        return $this->belongsTo('App\Template','template_id','id');
    }

    public function validationCond() {
        return $this->belongsTo('App\ValidationCond','validation_cond_id','id');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
