<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddHiddenToFormFieldTypeEnumActionPropFormTable extends Migration
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
        DB::statement("ALTER TABLE action_prop_form MODIFY form_field_type ENUM('textfield','textarea','email','address','password','radio','select','number','currency','datetime','day','time','file', 'hidden') NOT NULL");
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
        DB::statement("ALTER TABLE action_prop_form MODIFY form_field_type ENUM('textfield','textarea','email','address','password','radio','select','number','currency','datetime','day','time','file') NOT NULL");
    }
}
