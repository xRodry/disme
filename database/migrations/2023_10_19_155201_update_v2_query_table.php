<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateV2QueryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('query', function (Blueprint $table) {
            $table->dropColumn('value_type');

            $table->unsignedInteger('base_ent_type_id')->after('id');
            $table->longText('query_builder')->after('base_ent_type_id');
            $table->longText('first_step')->after('query_builder');
            $table->longText('properties')->after('first_step');
            $table->longText('fields')->after('properties');

            $table->foreign('base_ent_type_id')->references('id')->on('ent_type')->onDelete('no action')->onUpdate('no action');
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
            $table->dropForeign(['base_ent_type_id']);

            $table->dropColumn('base_ent_type_id');
            $table->dropColumn('query_builder');
            $table->dropColumn('first_step');
            $table->dropColumn('properties');
            $table->dropColumn('fields');

            $table->enum('value_type',['string','integer_number','real_number','boolean'])
                ->after('id');
        });
    }
}
