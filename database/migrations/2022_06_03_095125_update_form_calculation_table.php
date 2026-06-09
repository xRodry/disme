<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateFormCalculationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::rename('form_compute','form_calculation');
        Schema::table('form_calculation', function (Blueprint $table) {
            $table->dropColumn('json_logic');
            $table->integer('compute_expression_id')->unsigned()->after('action_prop_id');

            $table->foreign('compute_expression_id')->references('id')->on('compute_expression')->onDelete('no action')->onUpdate('no action');
        });
        Schema::table('form_calculation_log', function (Blueprint $table) {
            $table->dropForeign(['form_compute_id']);
            $table->dropForeign(['transaction_state_id']);
            $table->dropPrimary('fcl_primary_key');
            $table->renameColumn('form_compute_id', 'form_calculation_id');
            $table->foreign('form_calculation_id')->references('id')->on('form_calculation')->onDelete('no action')->onUpdate('no action');
            $table->foreign('transaction_state_id')->references('id')->on('transaction_state')->onDelete('no action')->onUpdate('no action');
            $table->primary(['form_calculation_id','transaction_state_id'], 'fcl_primary_key');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('form_calculation', function (Blueprint $table) {
            $table->dropForeign(['compute_expression_id']);
            $table->dropColumn('compute_expression_id');
            $table->string('json_logic', 512)->after('action_prop_id');
        });
        Schema::rename('form_calculation','form_compute');
        Schema::table('form_calculation_log', function (Blueprint $table) {
            $table->dropForeign(['form_calculation_id']);
            $table->dropForeign(['transaction_state_id']);
            $table->dropPrimary('fcl_primary_key');
            $table->renameColumn('form_calculation_id', 'form_compute_id');
            $table->foreign('form_compute_id')->references('id')->on('form_compute')->onDelete('no action')->onUpdate('no action');
            $table->foreign('transaction_state_id')->references('id')->on('transaction_state')->onDelete('no action')->onUpdate('no action');
            $table->primary(['form_compute_id','transaction_state_id'], 'fcl_primary_key');
        });
    }
}
