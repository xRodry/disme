<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProcessDiagram extends Model
{
    use SoftDeletes;

    protected $table = 'process_diagram';

    public $timestamps = true;

    protected $fillable = [
        'process_type_id',
        'name',
        'description',
        'XML',
    ];

    protected $guarded = [];

    public function processType() {
        return $this->belongsTo('App\ProcessType', 'process_type_id', 'id');
    }
}
