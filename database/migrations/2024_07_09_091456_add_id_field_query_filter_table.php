<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIdFieldQueryFilterTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('query_filter', function (Blueprint $table) {
            $table->dropForeign(['query_term_id']);
            $table->dropForeign(['property_id']);
            $table->dropPrimary(['query_term_id', 'property_id']);
        });
        Schema::table('query_filter', function (Blueprint $table) {
            $table->increments('id')->first();
            $table->foreign('query_term_id')->references('id')->on('query_term')->onDelete('no action')->onUpdate('no action');
            $table->foreign('property_id')->references('id')->on('property')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Need to take 'auto increment' off the id field before removing primary key. Also, laravel has a bug that
        // doesn't allow changing columns on a table that has an 'enum' field, so we need to use SQL to do this step.
        DB::statement('ALTER TABLE query_filter MODIFY id int(10) unsigned NOT NULL');
        Schema::table('query_filter', function (Blueprint $table) {
            $table->dropPrimary();
            $table->dropColumn('id');
        });
        Schema::table('query_filter', function (Blueprint $table) {
            $table->primary(array('query_term_id', 'property_id'));
        });
    }
}
