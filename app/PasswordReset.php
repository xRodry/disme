<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class PasswordReset
 */
class PasswordReset extends Model
{
    protected $table = 'password_resets';

    public $timestamps = true;

    protected $fillable = [
        'email',
        'token'
    ];

    protected $guarded = [];


}
