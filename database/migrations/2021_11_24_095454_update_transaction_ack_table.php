<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTransactionAckTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transaction_ack', function (Blueprint $table) {
            $table->timestamp('opened_on')->nullable()->after('viewed_on');
            $table->renameColumn('viewed_on','ack_on');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('transaction_ack', function (Blueprint $table) {
            $table->dropColumn('opened_on');
            $table->renameColumn('ack_on','viewed_on');
        });
    }
}
