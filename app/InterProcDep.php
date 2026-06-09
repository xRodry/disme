<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InterProcDep extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'inter_proc_dep';

    public $timestamps = true;

    protected $primaryKey = ['depending_proc','depended_on_proc'];
    public $incrementing = false;

    protected $fillable = [
        'depending_proc',
        'depended_on_proc',
        'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function dependingProc() {
        return $this->belongsTo('App\Process','depending_proc','id');
    }

   public function dependedOnProc() {
        return $this->belongsTo('App\Process','depended_on_proc','id');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
