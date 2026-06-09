<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateProcStateColumnProcessTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // As laravel doesn't support changing enums, we need to drop the column and create a new one
        Schema::table('process', function (Blueprint $table) {
            $table->dropColumn('proc_state');
        });
        Schema::table('process', function (Blueprint $table) {
            $table->enum('proc_state', ['execution', 'cancelled', 'finished'])
                ->after('process_type_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // As laravel doesn't support changing enums, we need to drop the column and create a new one
        Schema::table('process', function (Blueprint $table) {
            $table->dropColumn('proc_state');
        });
        Schema::table('process', function (Blueprint $table) {
            $table->enum('proc_state', ['execution', 'finished'])
                ->after('process_type_id');
        });
    }
}
