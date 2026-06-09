<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TStateName extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 't_state_name';

    public $timestamps = true;

    protected $primaryKey = ['t_state_id','language_id'];
    public $incrementing = false;

    protected $fillable = [
        't_state_id',
        'language_id',
        'name',
        'act_name',
		'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function tState() {
        return $this->belongsTo('App\TState', 't_state_id','id');
    }

    public function language() {
        return $this->belongsTo('App\Language', 'language_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
