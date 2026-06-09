<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateComputeExpressionLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('compute_expression_log', function (Blueprint $table) {
            $table->integer('id')->change();
            $table->dropPrimary('id');
            $table->dropForeign(['transaction_id']);

            $table->dropColumn('transaction_id');
            $table->dropColumn('id');

            $table->unsignedInteger('transaction_state_id')->after('compute_expression_id');

            $table->foreign('transaction_state_id')->references('id')->on('transaction_state')->onDelete('no action')->onUpdate('no action');
            $table->primary(['compute_expression_id','transaction_state_id'], 'cel_primary_key');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('compute_expression_log', function (Blueprint $table) {
            $table->dropForeign(['compute_expression_id']);
            $table->dropForeign(['transaction_state_id']);
            $table->dropPrimary();
            $table->dropColumn('transaction_state_id');
        });
        Schema::table('compute_expression_log', function (Blueprint $table) {
            $table->increments('id')->first();
            $table->unsignedInteger('transaction_id')->after('compute_expression_id');
            $table->foreign('transaction_id')->references('id')->on('transaction')->onDelete('no action')->onUpdate('no action');
        });
    }
}
