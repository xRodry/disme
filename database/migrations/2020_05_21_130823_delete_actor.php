<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DeleteActor extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::drop('actor');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      (new CreateActorTable)->up();
      Schema::table('actor', function(Blueprint $table) {
        $table->foreign('updated_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
        $table->foreign('deleted_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
      });
    }
}
