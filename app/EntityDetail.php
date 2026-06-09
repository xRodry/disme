<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EntityDetail extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'entity_detail';

    public $timestamps = true;

    protected $primaryKey = ['action_id','property_id'];
    public $incrementing = false;

    protected $fillable = [
        'action_id',
        'property_id',
        'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function action() {
        return $this->belongsTo('App\Action', 'action', 'id');
    }

    public function property() {
        return $this->belongsTo('App\Property', 'property_id', 'id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
