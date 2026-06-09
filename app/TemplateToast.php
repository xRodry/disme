<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TemplateToast extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'template_toast';

    public $timestamps = true;

    protected $primaryKey = ['template_id', 'language_id'];
    public $incrementing = false;

    protected $fillable = [
        'template_id',
        'language_id',
        'class',
        'colour',
        'title_text',
        'updated_by',
        'deleted_by'
    ];

    public function template() {
        return $this->belongsTo('App\Template', 'template_id', 'id');
    }

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
