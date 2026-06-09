<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTransactionStateTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transaction_state', function (Blueprint $table) {
            // Note: Renaming columns in a table with an enum column is not currently supported.
            // As transaction_state table has enum column 'state', we have to delete column and add another one
            $table->dropForeign(['action_id']);
            $table->dropColumn('action_id');

            $table->unsignedInteger('act_action_id')->nullable()->after('t_state_id');
            $table->unsignedInteger('fact_action_id')->nullable()->after('act_action_id');
            $table->foreign('act_action_id')->references('id')->on('action')->onDelete('no action')->onUpdate('no action');
            $table->foreign('fact_action_id')->references('id')->on('action')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('transaction_state', function (Blueprint $table) {
            // As transaction_state table has enum column 'state', we have to delete column and add another one
            $table->dropForeign(['act_action_id']);
            $table->dropForeign(['fact_action_id']);

            $table->dropColumn('act_action_id');
            $table->dropColumn('fact_action_id');

            $table->unsignedInteger('action_id')->nullable()->after('t_state_id');
            $table->foreign('action_id')->references('id')->on('action')->onDelete('no action')->onUpdate('no action');
        });
    }
}
