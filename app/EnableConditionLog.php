<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EnableConditionLog extends Model
{
    use SoftDeletes;
    use HasCompositePrimaryKeyTrait;

    protected $table = 'enable_condition_log';
    public $timestamps = true;

    protected $primaryKey = ['enable_condition_id','form_id'];
    public $incrementing = false;

    protected $fillable = [
        'enable_condition_id',
        'form_id',
        'json_logic',
        'updated_by',
        'deleted_by'
    ];

    public function enableCondition() {
        return $this->belongsTo('App\EnableCondition','enable_condition_id','id');
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
