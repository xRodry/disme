<?php

namespace App;

use App\Http\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConceptualDomainName extends Model
{
    use HasCompositePrimaryKeyTrait;
    use SoftDeletes;

    protected $table = 'conceptual_domain_name';

    public $timestamps = true;

    protected $primaryKey = ['conceptual_domain_id','language_id'];
    public $incrementing = false;

    protected $fillable = [
        'conceptual_domain_id',
        'language_id',
        'name',
        'updated_by',
        'deleted_by'
    ];

    protected $guarded = [];

    public function conceptualDomain() {
        return $this->belongsTo('App\ConceptualDomain', 'conceptual_domain_id','id');
    }

    public function language() {
        return $this->belongsTo('App\Language', 'language_id','id');
    }

    public function updatedBy() {
        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {
        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
