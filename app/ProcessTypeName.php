<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProcessTypeName extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'process_type_name';

    public $timestamps = true;

    protected $primaryKey = ['process_type_id','language_id'];
    public $incrementing = false;

    protected $fillable = [
        'process_type_id',
        'language_id',
        'name',
        'id_name',
        'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function processType() {
        return $this->belongsTo('App\ProcessType', 'process_type_id','id');
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
