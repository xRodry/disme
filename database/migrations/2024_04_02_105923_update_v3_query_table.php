<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateV3QueryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('query', function(Blueprint $table) {
            $table->dropColumn('first_step');
            $table->dropColumn('properties');
            $table->dropColumn('fields');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('query', function (Blueprint $table) {
            $table->longText('first_step')->after('query_builder');
            $table->longText('properties')->after('first_step');
            $table->longText('fields')->after('properties');
        });
    }
}
