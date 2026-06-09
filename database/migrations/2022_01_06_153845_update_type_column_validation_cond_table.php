<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTypeColumnValidationCondTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // As laravel doesn't support changing enums, we need to drop the column and create a new one
        Schema::table('validation_cond', function (Blueprint $table) {
            $table->dropColumn('type');
        });
        Schema::table('validation_cond', function (Blueprint $table) {
            $table->enum('type', ['isNumber','isInteger','equalTo','maxWordLength','lessEqual','higherEqual','higherThan','lessThan','minLength','belongsRange','maxLength','minWordLength','hasCharacter','regExpression','hasWord','isEmail','isURL','customValidation'])
                ->after('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // As laravel doesn't support changing enums, we need to drop the column and create a new one
        Schema::table('validation_cond', function (Blueprint $table) {
            $table->dropColumn('type');
        });
        Schema::table('validation_cond', function (Blueprint $table) {
            $table->enum('type', ['required','isNumber','isInteger','equalTo','maxWordLength','lessEqual','higherEqual','higherThan','lessThan','minLength','belongsRange','maxLength','minWordLength','hasCharacter','regExpression','hasWord','isEmail','isURL','customValidation'])
                ->after('id');
        });
    }
}
