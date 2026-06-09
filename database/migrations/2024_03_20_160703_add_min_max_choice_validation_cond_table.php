<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMinMaxChoiceValidationCondTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Laravel doesn't support changing enums' possible values
        // This way, the table can be altered without the loss of data already present in the database
        DB::statement("ALTER TABLE validation_cond MODIFY type ENUM('required','isNumber','isInteger','equalTo','maxWordLength','lessEqual','higherEqual','higherThan','lessThan','minLength','belongsRange','maxLength','minWordLength','hasCharacter','regExpression','hasWord','isEmail','isURL','afterDate','beforeDate','customValidation','minChoice', 'maxChoice') NOT NULL");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Laravel doesn't support changing enums' possible values
        // This way, the table can be altered without the loss of data already present in the database
        DB::statement("ALTER TABLE validation_cond MODIFY type ENUM('required','isNumber','isInteger','equalTo','maxWordLength','lessEqual','higherEqual','higherThan','lessThan','minLength','belongsRange','maxLength','minWordLength','hasCharacter','regExpression','hasWord','isEmail','isURL','afterDate','beforeDate','customValidation') NOT NULL");
    }
}
