<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAttrParentCondConditionLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('condition_log', function (Blueprint $table) {
            $table->unsignedInteger('parent_cond_log_id')->nullable()->after('transaction_id');
            $table->foreign('parent_cond_log_id')->references('id')->on('condition_log')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('condition_log', function (Blueprint $table) {
            $table->dropForeign(['parent_cond_log_id']);
            $table->dropColumn('parent_cond_log_id');
        });
    }
}
