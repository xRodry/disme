<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTransactionType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transaction_type', function (Blueprint $table) {
            $table->dropForeign('transaction_type_executer_foreign');
            $table->dropColumn('executer');
            $table->integer('executer_role_id')->unsigned()->after('init_proc');
            $table->foreign('executer_role_id')->references('id')->on('role')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('transaction_type', function (Blueprint $table) {
            $table->dropForeign('transaction_type_executer_role_id_foreign');
            $table->dropColumn('executer_role_id');
            $table->integer('executer')->unsigned()->after('init_proc');
            $table->foreign('executer')->references('id')->on('actor')->onDelete('no action')->onUpdate('no action');
        });
    }
}
