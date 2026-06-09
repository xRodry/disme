<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScheduleSlotResultAdditionalProperty extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'schedule_slot_result_additional_property';

    public $timestamps = true;

    protected $primaryKey = ['schedule_slot_result_id','property_id'];
    public $incrementing = false;

    protected $fillable = [
        'schedule_slot_result_id',
        'property_id',
        'term_id',
        'updated_by',
        'deleted_by'
    ];

    public function scheduleSlotResult() {
        return $this->belongsTo('App\ScheduleSlotResult','schedule_slot_result_id','id');
    }

    public function property() {
        return $this->belongsTo('App\Property','property_id','id');
    }

    public function term() {
        return $this->belongsTo('App\Term','term_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
