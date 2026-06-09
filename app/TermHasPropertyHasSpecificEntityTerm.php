<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TermHasPropertyHasSpecificEntityTerm extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'term_has_property_has_specific_entity_term';

    public $timestamps = true;

    protected $primaryKey = ['term_has_property_term_id','term_id'];
    public $incrementing = false;

    protected $fillable = [
        'term_has_property_term_id',
        'term_id',
        'updated_by',
        'deleted_by'
    ];

    public function termHasPropertyTerm() {
        return $this->belongsTo('App\Term','term_has_property_term_id','id');
    }

    public function term() {
        return $this->belongsTo('App\Term','term_id','id');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }

}
