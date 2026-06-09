<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFormFieldTypeColumnActionPropFormTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('action_prop_form', function (Blueprint $table) {
            $table->enum('form_field_type',['textfield','textarea','email','address','password','radio','select','number','currency','datetime','day','time','file'])->after('form_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('action_prop_form', function (Blueprint $table) {
            $table->dropColumn('form_field_type');
        });
    }
}
