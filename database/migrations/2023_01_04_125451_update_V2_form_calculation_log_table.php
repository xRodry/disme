<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateV2FormCalculationLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('form_calculation_log', function (Blueprint $table) {
            $table->dropForeign(['form_calculation_id']);
            $table->dropForeign(['transaction_state_id']);
            $table->dropPrimary(['form_calculation_id', 'transaction_state_id']);
        });

        Schema::table('form_calculation_log', function (Blueprint $table) {
            $table->dropColumn('transaction_state_id');
            $table->dropColumn('expression_computed');
            $table->dropColumn('expression_result');

            $table->unsignedInteger('form_id')->after('form_calculation_id');
            $table->string('json_logic', 512)->after('form_id');

            $table->foreign('form_calculation_id')->references('id')->on('form_calculation')->onDelete('no action')->onUpdate('no action');
            $table->foreign('form_id')->references('id')->on('form')->onDelete('no action')->onUpdate('no action');
            $table->primary(['form_calculation_id','form_id'], 'fcl_primary_key');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('form_calculation_log', function (Blueprint $table) {
            $table->dropForeign(['form_calculation_id']);
            $table->dropForeign(['form_id']);
            $table->dropPrimary(['form_calculation_id', 'form_id']);
        });

        Schema::table('form_calculation_log', function (Blueprint $table) {
            $table->dropColumn('form_id');
            $table->dropColumn('json_logic');

            $table->unsignedInteger('transaction_state_id')->after('form_calculation_id');
            $table->string('expression_computed', 512)->after('transaction_state_id');
            $table->string('expression_result', 512)->after('expression_computed');

            $table->foreign('form_calculation_id')->references('id')->on('form_calculation')->onDelete('no action')->onUpdate('no action');
            $table->foreign('transaction_state_id')->references('id')->on('transaction_state')->onDelete('no action')->onUpdate('no action');
            $table->primary(['form_calculation_id', 'transaction_state_id'], 'fcl_primary_key');
        });
    }
}
