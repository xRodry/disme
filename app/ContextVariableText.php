<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContextVariableText extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'context_variable_text';

    public $timestamps = true;

    protected $primaryKey = ['context_variable_id','language_id'];
    public $incrementing = false;

    protected $fillable = [
        'context_variable_id',
        'language_id',
        'text',
        'updated_by',
        'deleted_by'
    ];

    public function contextVariable() {
        return $this->belongsTo('App\ContextVariable','context_variable_id','id');
    }

    public function language() {
        return $this->belongsTo('App\Language','language_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
