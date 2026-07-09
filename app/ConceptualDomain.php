<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConceptualDomain extends Model
{
    use SoftDeletes;

    protected $table = 'conceptual_domain';

    public $timestamps = true;

    protected $fillable = [
        'state',
        'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function factDiagrams() {
        return $this->hasMany('App\FactDiagram', 'conceptual_domain_id', 'id');
    }

    public function language() {
        return $this->belongsToMany('App\Language', 'conceptual_domain_name', 'conceptual_domain_id', 'language_id')->withPivot('name','created_at','updated_at','deleted_at');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
