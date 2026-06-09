<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameRoleInitiatesTransactionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Drop foreign keys so that its name is updated when the table is renamed
        Schema::table('role_inititates_transaction', function (Blueprint $table) {
            $table->dropForeign(['updated_by']);
            $table->dropForeign(['deleted_by']);
            $table->dropForeign(['role_id']);
            $table->dropForeign(['transaction_type_id']);
            $table->dropPrimary();
        });
        Schema::rename('role_inititates_transaction','role_initiates_transaction');
        // Update the foreign keys' name with the new table name
        Schema::table('role_initiates_transaction', function (Blueprint $table) {
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
            $table->foreign('deleted_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
            $table->foreign('role_id')->references('id')->on('role')->onDelete('no action')->onUpdate('no action');
            $table->foreign('transaction_type_id')->references('id')->on('transaction_type')->onDelete('no action')->onUpdate('no action');
            $table->primary(array('role_id', 'transaction_type_id'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('role_initiates_transaction', function (Blueprint $table) {
            $table->dropForeign(['updated_by']);
            $table->dropForeign(['deleted_by']);
            $table->dropForeign(['role_id']);
            $table->dropForeign(['transaction_type_id']);
            $table->dropPrimary();
        });
        Schema::rename('role_initiates_transaction','role_inititates_transaction');
        Schema::table('role_inititates_transaction', function (Blueprint $table) {
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
            $table->foreign('deleted_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
            $table->foreign('role_id')->references('id')->on('role')->onDelete('no action')->onUpdate('no action');
            $table->foreign('transaction_type_id')->references('id')->on('transaction_type')->onDelete('no action')->onUpdate('no action');
            $table->primary(array('role_id', 'transaction_type_id'));
        });
    }
}
