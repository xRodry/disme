<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserInputLogHasValue extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'user_input_log_has_value';
    public $timestamps = true;

    protected $primaryKey = ['user_input_log_id','value_id'];
    public $incrementing = false;

    protected $fillable = [
        'user_input_log_id',
        'value_id',
        'updated_by',
        'deleted_by'
    ];

    public function userInputLog() {
        return $this->belongsTo('App\UserInputLog','user_input_log_id','id');
    }

    public function value() {
        return $this->belongsTo('App\Value','value_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
