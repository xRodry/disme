<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ValueText extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'value_text';

    public $timestamps = true;

    protected $primaryKey = ['value_id','language_id'];
    public $incrementing = false;

    protected $fillable = [
        'value_id',
        'language_id',
        'text',
		'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function value() {
        return $this->belongsTo('App\Value', 'value_id', 'id');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
