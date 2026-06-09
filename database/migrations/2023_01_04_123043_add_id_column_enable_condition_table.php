<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIdColumnEnableConditionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('enable_condition', function (Blueprint $table) {
            $table->dropForeign(['action_prop_id']);
            $table->dropForeign(['condition_id']);
            $table->dropPrimary(['action_prop_id', 'condition_id']);
        });
        Schema::table('enable_condition', function (Blueprint $table) {
            $table->increments('id')->first();
            $table->foreign('action_prop_id')->references('id')->on('action_prop')->onDelete('no action')->onUpdate('no action');
            $table->foreign('condition_id')->references('id')->on('condition')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('enable_condition', function (Blueprint $table) {
            $table->dropPrimary();
            $table->unsignedInteger('id')->change();
            $table->dropColumn('id');
        });
        Schema::table('enable_condition', function (Blueprint $table) {
            $table->primary(array('action_prop_id', 'condition_id'));
        });
    }
}
