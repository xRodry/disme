<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCausalLinkTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('causal_link', function (Blueprint $table) {
            $table->boolean('cancel_proc')->after('max');
            $table->boolean('continue_if_same_user')->after('cancel_proc');
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
            $table->dropColumn('cancel_proc');
            $table->dropColumn('continue_if_same_user');
        });
    }
}
