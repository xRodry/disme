<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIdColumnValueTextTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('value_text', function (Blueprint $table) {
            $table->dropForeign('value_name_value_id_foreign');
            $table->dropForeign('value_name_language_id_foreign');
            $table->dropPrimary(['value_id', 'language_id']);
        });
        Schema::table('value_text', function (Blueprint $table) {
            $table->increments('id')->first();
            $table->foreign('value_id')->references('id')->on('value')->onDelete('no action')->onUpdate('no action');
            $table->foreign('language_id')->references('id')->on('language')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('value_text', function (Blueprint $table) {
            $table->dropPrimary();
            $table->unsignedInteger('id')->change();
            $table->dropColumn('id');

            $table->dropForeign('value_text_value_id_foreign');
            $table->dropForeign('value_text_language_id_foreign');
            $table->foreign('value_id', 'value_name_value_id_foreign')->references('id')->on('value')->onDelete('no action')->onUpdate('no action');
            $table->foreign('language_id', 'value_name_language_id_foreign')->references('id')->on('language')->onDelete('no action')->onUpdate('no action');
        });
        Schema::table('value_text', function (Blueprint $table) {
            $table->primary(array('value_id', 'language_id'));
        });
    }
}
