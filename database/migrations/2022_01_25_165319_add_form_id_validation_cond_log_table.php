<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFormIdValidationCondLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('validation_cond_log', function (Blueprint $table) {
            $table->unsignedInteger('form_id')->after('validation_cond_id');
            $table->foreign('form_id')->references('id')->on('form')->onDelete('no action')->onUpdate('no action');
            $table->string('expression_evaluated', 512)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('validation_cond_log', function (Blueprint $table) {
            $table->dropForeign(['form_id']);
            $table->dropColumn('form_id');
            $table->string('expression_evaluated', 512)->nullable(false)->change();
        });
    }
}
