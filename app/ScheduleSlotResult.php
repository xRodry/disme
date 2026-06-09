<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScheduleSlotResult extends Model
{
    use SoftDeletes;

    protected $table = 'schedule_slot_result';

    public $timestamps = true;

    protected $fillable = [
        'action_id',
        'schedule_reference',
        'slot_number',
        'day',
        'start_time',
        'end_time',
        'updated_by',
        'deleted_by'
    ];

    public function action() {
        return $this->belongsTo('App\Action','action_id','id');
    }

    public function scheduleReference() {
        return $this->belongsTo('App\Property','schedule_reference','id');
    }

    public function slotNumber() {
        return $this->belongsTo('App\Property','slot_number','id');
    }

    public function day() {
        return $this->belongsTo('App\Property','day','id');
    }

    public function startTime() {
        return $this->belongsTo('App\Property','start_time','id');
    }

    public function endTime() {
        return $this->belongsTo('App\Property','end_time','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
