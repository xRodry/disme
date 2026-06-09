<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class EditorDiagram extends Model
{
    use SoftDeletes;

    protected $table = 'editor_diagram';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'description',
        'XML',
    ];

    protected $guarded = [];
}
