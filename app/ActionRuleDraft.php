<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActionRuleDraft extends Model
{
    use SoftDeletes;

    protected $table = 'action_rule_draft';

    public $timestamps = true;

    protected $fillable = [
        'language_id',
        'name',
        'blockly_xml',
        'preview',
		'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];
    public function language() {
        return $this->belongsTo('App\Language', 'language_id', 'id');
    }
    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
