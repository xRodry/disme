<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUserInputLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_input_log', function (Blueprint $table) {
            $table->dropForeign(['transaction_id']);

            $table->dropColumn('transaction_id');

            $table->unsignedInteger('transaction_state_id')->after('id');

            $table->foreign('transaction_state_id')->references('id')->on('transaction_state')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_input_log', function (Blueprint $table) {
            $table->dropForeign(['transaction_state_id']);

            $table->dropColumn('transaction_state_id');

            $table->unsignedInteger('transaction_id')->after('id');

            $table->foreign('transaction_id')->references('id')->on('transaction')->onDelete('no action')->onUpdate('no action');
        });
    }
}
