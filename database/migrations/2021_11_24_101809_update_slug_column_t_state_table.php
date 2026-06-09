<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSlugColumnTStateTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('t_state', function (Blueprint $table) {
            // As laravel doesn't support changing enums, we need to drop the column and create a new one
            $table->dropColumn('slug');
        });
        Schema::table('t_state', function (Blueprint $table) {
            $table->enum('slug', ['rq','pm','ex','de','ac','dc','rj','rv_rq_rq','rv_rq_al','rv_rq_rf','rv_pm_rq','rv_pm_al','rv_pm_rf','rv_de_rq','rv_de_al','rv_de_rf','rv_ac_rq','rv_ac_al','rv_ac_rf','qt','sp'])
                ->after('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('t_state', function (Blueprint $table) {
            // As laravel doesn't support changing enums, we need to drop the column and create a new one
            $table->dropColumn('slug');
        });
        Schema::table('t_state', function (Blueprint $table) {
            $table->enum('slug', ['rq','pm','ex','de','ac','dc','rj','rv_rq_rq','rv_rq_al','rv_rq_rf','rv_pm_rq','rv_pm_al','rv_pm_rf','rv_de_rq','rv_de_al','rv_de_rf','rv_ac_rq','rv_ac_al','rv_ac_rf'])
                ->after('id');
        });
    }
}
