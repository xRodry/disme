<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeSlugFieldsNameFromTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Laravel: "Renaming any column in a table that also has a column of type enum is not currently supported'
        Schema::getConnection()->getDoctrineSchemaManager()->getDatabasePlatform()->registerDoctrineTypeMapping('enum', 'string');
        DB::statement("ALTER TABLE t_state CHANGE slug abbrv ENUM('rq','pm','ex','de','ac','dc','rj','rv_rq_rq','rv_rq_al','rv_rq_rf','rv_pm_rq','rv_pm_al','rv_pm_rf','rv_de_rq','rv_de_al','rv_de_rf','rv_ac_rq','rv_ac_al','rv_ac_rf','qt','sp') NOT NULL");

        Schema::table('language', function (Blueprint $table) {
            $table->renameColumn('slug','abbrv');
        });

        Schema::table('prop_unit_type', function (Blueprint $table) {
            $table->string('abbrv', 5)->after('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Laravel: "Renaming any column in a table that also has a column of type enum is not currently supported'
        Schema::getConnection()->getDoctrineSchemaManager()->getDatabasePlatform()->registerDoctrineTypeMapping('enum', 'string');
        DB::statement("ALTER TABLE t_state CHANGE abbrv slug ENUM('rq','pm','ex','de','ac','dc','rj','rv_rq_rq','rv_rq_al','rv_rq_rf','rv_pm_rq','rv_pm_al','rv_pm_rf','rv_de_rq','rv_de_al','rv_de_rf','rv_ac_rq','rv_ac_al','rv_ac_rf','qt','sp') NOT NULL");

        Schema::table('language', function (Blueprint $table) {
            $table->renameColumn('abbrv','slug');
        });

        Schema::table('prop_unit_type', function (Blueprint $table) {
            $table->dropColumn('abbrv');
        });
    }
}
