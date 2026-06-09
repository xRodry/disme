<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TemplateDocLog extends Model
{
    use SoftDeletes;

    protected $table = 'template_doc_log';

    public $timestamps = true;

    protected $fillable = [
        'template_doc_id',
        'transaction_state_id',
        'edms_id',
        'updated_by',
        'deleted_by'
    ];

    public function template() {
        return $this->belongsTo('App\TemplateDoc','template_doc_id','id');
    }

    public function transactionState() {
        return $this->belongsTo('App\TransactionState','transaction_state_id','id');
    }

    public function updatedBy() {

        return $this->belongsTo('App\Users', 'updated_by', 'id');
    }

    public function deletedBy() {

        return $this->belongsTo('App\Users', 'deleted_by', 'id');
    }
}
