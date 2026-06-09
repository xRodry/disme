<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SplitCausedArFieldCausalLinkTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('causal_link', function (Blueprint $table) {
            $table->dropForeign(['caused_action_rule']);
            $table->dropColumn('caused_action_rule');
            $table->unsignedInteger('caused_transaction_type_id')->after('causing_action');
            $table->unsignedInteger('caused_t_state_id')->after('caused_transaction_type_id');

            $table->foreign('caused_transaction_type_id')->references('id')->on('transaction_type')->onDelete('no action')->onUpdate('no action');
            $table->foreign('caused_t_state_id')->references('id')->on('t_state')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('causal_link', function (Blueprint $table) {
            $table->dropForeign(['caused_transaction_type_id']);
            $table->dropForeign(['caused_t_state_id']);
            $table->dropColumn('caused_transaction_type_id');
            $table->dropColumn('caused_t_state_id');
            $table->unsignedInteger('caused_action_rule')->after('causing_action');

            $table->foreign('caused_action_rule')->references('id')->on('action_rule')->onDelete('no action')->onUpdate('no action');
        });
    }
}
