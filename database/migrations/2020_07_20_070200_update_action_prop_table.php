<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateActionPropTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('action_prop', function (Blueprint $table) {
            $table->boolean('mandatory')->after('prop_id');
            $table->integer('order')->unsigned()->after('mandatory');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('action_prop', function (Blueprint $table) {
            $table->dropColumn('mandatory');
            $table->dropColumn('order');
        });
    }
}
