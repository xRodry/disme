<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BiKnowageText extends Model
{
    use SoftDeletes, HasCompositePrimaryKeyTrait;

    protected $table = 'bi_knowage_text';

    public $timestamps = true;

    protected $primaryKey = ['bi_knowage_id','language_id'];
    public $incrementing = false;

    protected $fillable = [
        'bi_knowage_id',
        'language_id',
        'name',
        'description',
        'updated_by',
        'deleted_by'
    ];

    public function biKnowage() {
        return $this->belongsTo('App\BiKnowage', 'bi_knowage_id', 'id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
