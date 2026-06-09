<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameTermHasActionPropTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // So that the foreign keys identifier names stay up to date - remove the old identifiers
        Schema::table('term_has_action_prop', function (Blueprint $table) {
            $table->dropForeign(['term_id']);
            $table->dropForeign(['action_prop_id']);
            $table->dropPrimary();
        });
        Schema::rename('term_has_action_prop','term_has_property_specification');
        // So that the foreign keys identifier names stay up to date - add the new identifiers
        Schema::table('term_has_property_specification', function (Blueprint $table) {
            $table->foreign('term_id')->references('id')->on('term')->onDelete('no action')->onUpdate('no action');
            $table->foreign('action_prop_id')->references('id')->on('action_prop')->onDelete('no action')->onUpdate('no action');
            $table->primary(['term_id', 'action_prop_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // So that the foreign keys identifier names stay up to date - remove the old identifiers
        Schema::table('term_has_property_specification', function (Blueprint $table) {
            $table->dropForeign(['term_id']);
            $table->dropForeign(['action_prop_id']);
            $table->dropPrimary();
        });
        Schema::rename('term_has_property_specification','term_has_action_prop');
        // So that the foreign keys identifier names stay up to date - add the new identifiers
        Schema::table('term_has_action_prop', function (Blueprint $table) {
            $table->foreign('term_id')->references('id')->on('term')->onDelete('no action')->onUpdate('no action');
            $table->foreign('action_prop_id')->references('id')->on('action_prop')->onDelete('no action')->onUpdate('no action');
            $table->primary(['term_id', 'action_prop_id']);
        });
    }
}
