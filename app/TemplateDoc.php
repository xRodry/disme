<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TemplateDoc extends Model
{
    use SoftDeletes;

    protected $table = 'template_doc';

    public $timestamps = true;

    protected $fillable = [
        'template_id',
        'language_id',
        'blade_file',
        'pdf_generator',
        'updated_by',
        'deleted_by'
    ];

    public function template() {
        return $this->belongsTo('App\Template','template_id','id');
    }

    public function language() {
        return $this->belongsTo('App\Language','language_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
