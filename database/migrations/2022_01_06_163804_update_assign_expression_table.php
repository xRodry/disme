<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateAssignExpressionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('assign_expression', function (Blueprint $table) {
            $table->dropForeign(['property_id']);
            $table->dropForeign(['term_id']);
            $table->dropPrimary('ae_primary_keys');
        });
        Schema::table('assign_expression', function (Blueprint $table) {
            $table->increments('id')->first();
            $table->foreign('property_id')->references('id')->on('property')->onDelete('no action')->onUpdate('no action');
            $table->foreign('term_id')->references('id')->on('term')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('assign_expression', function (Blueprint $table) {
            $table->integer('id')->change();
            $table->dropPrimary('id');

            $table->dropColumn('id');

            $table->primary(['property_id','term_id'], 'ae_primary_keys');
        });
    }
}
