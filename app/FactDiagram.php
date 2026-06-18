<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FactDiagram extends Model
{
    use SoftDeletes;

    protected $table = 'fact_diagram';

    public $timestamps = true;

    protected $fillable = [
        'conceptual_domain_id',
        'name',
        'description',
        'XML',
    ];

    protected $guarded = [];
}
