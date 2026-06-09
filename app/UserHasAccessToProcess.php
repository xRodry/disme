<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserHasAccessToProcess extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'user_has_access_to_process';

    public $timestamps = true;

    protected $primaryKey = ['user_id','process_id'];
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'process_id',
        'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function user() {
        return $this->belongsTo('App\Users', 'user_id', 'id');
    }

    public function process() {
        return $this->belongsTo('App\Process', 'process_id', 'id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
