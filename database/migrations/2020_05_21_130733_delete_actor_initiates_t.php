<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DeleteActorInitiatesT extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::drop('actor_iniciates_t');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      (new CreateActorIniciatesTTable)->up();
      Schema::table('actor_iniciates_t', function(Blueprint $table) {
        $table->foreign('transaction_type_id')->references('id')->on('transaction_type')->onDelete('no action')->onUpdate('no action');
        $table->foreign('actor_id')->references('id')->on('actor')->onDelete('no action')->onUpdate('no action');
        $table->primary(array('transaction_type_id', 'actor_id'));
        $table->foreign('updated_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
        $table->foreign('deleted_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
      });
    }
}
