<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateQueryHasTermV2Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('query_has_term', function (Blueprint $table) {
            $table->dropForeign(['term_id']);
            $table->dropForeign(['term_has_query_id']);
            $table->dropForeign(['property_id']);
            $table->dropPrimary();

            $table->dropColumn(['term_id', 'term_has_query_id', 'property_id']);
        });

        Schema::table('query_has_term', function (Blueprint $table) {
            $table->unsignedInteger('query_id')->first();
            $table->unsignedInteger('query_term_id')->after('query_id');

            $table->foreign('query_id')->references('id')->on('query')->onDelete('no action')->onUpdate('no action');
            $table->foreign('query_term_id')->references('id')->on('query_term')->onDelete('no action')->onUpdate('no action');

            $table->primary(['query_id', 'query_term_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('query_has_term', function (Blueprint $table) {
            $table->dropForeign(['query_id']);
            $table->dropForeign(['query_term_id']);
            $table->dropPrimary();

            $table->dropColumn(['query_id', 'query_term_id']);
        });

        Schema::table('query_has_term', function (Blueprint $table) {
            $table->unsignedInteger('term_id')->first();
            $table->unsignedInteger('term_has_query_id')->after('term_id');
            $table->unsignedInteger('property_id')->after('term_has_query_id');

            $table->foreign('term_id')->references('id')->on('term')->onDelete('no action')->onUpdate('no action');
            $table->foreign('term_has_query_id')->references('id')->on('term_has_query')->onDelete('no action')->onUpdate('no action');
            $table->foreign('property_id')->references('id')->on('property')->onDelete('no action')->onUpdate('no action');

            $table->primary(['term_id', 'term_has_query_id']);
        });
    }
}
