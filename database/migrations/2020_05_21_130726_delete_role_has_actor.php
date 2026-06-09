<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DeleteRoleHasActor extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::drop('role_has_actor');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      (new CreateRoleHasActorTable)->up();
      Schema::table('role_has_actor', function(Blueprint $table) {
        $table->foreign('role_id')->references('id')->on('role')->onDelete('no action')->onUpdate('no action');
        $table->foreign('actor_id')->references('id')->on('actor')->onDelete('no action')->onUpdate('no action');
        $table->primary(array('role_id', 'actor_id'));
        $table->foreign('updated_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
        $table->foreign('deleted_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
      });
    }
}
