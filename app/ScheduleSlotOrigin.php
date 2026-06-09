<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScheduleSlotOrigin extends Model
{
    use SoftDeletes;

    protected $table = 'schedule_slot_origin';

    public $timestamps = true;

    protected $fillable = [
        'action_id',
        'responsible_user',
        'start_date',
        'start_time',
        'end_date',
        'end_time',
        'weekdays',
        'duration',
        'slot_count',
        'updated_by',
        'deleted_by'
    ];

    public function action() {
        return $this->belongsTo('App\Action','action_id','id');
    }

    public function responsibleUser() {
        return $this->belongsTo('App\Property','responsible_user','id');
    }

    public function startDate() {
        return $this->belongsTo('App\Property','start_date','id');
    }

    public function startTime() {
        return $this->belongsTo('App\Property','start_time','id');
    }

    public function endDate() {
        return $this->belongsTo('App\Property','end_date','id');
    }

    public function endTime() {
        return $this->belongsTo('App\Property','end_time','id');
    }

    public function weekdays() {
        return $this->belongsTo('App\Property','weekdays','id');
    }

    public function duration() {
        return $this->belongsTo('App\Property','duration','id');
    }

    public function slotCount() {
        return $this->belongsTo('App\Property','slot_count','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
