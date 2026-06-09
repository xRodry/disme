<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateFieldsAssignExpressionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('assign_expression', function (Blueprint $table) {
            $table->dropForeign(['property_id']);
            $table->dropForeign(['term_id']);

            $table->renameColumn('property_id', 'destination_term_id');
            $table->renameColumn('term_id', 'source_term_id');

            $table->foreign('destination_term_id')->references('id')->on('term')->onDelete('no action')->onUpdate('no action');
            $table->foreign('source_term_id')->references('id')->on('term')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('assign_expression', function (Blueprint $table) {
            $table->dropForeign(['destination_term_id']);
            $table->dropForeign(['source_term_id']);

            $table->renameColumn('destination_term_id', 'property_id');
            $table->renameColumn('source_term_id', 'term_id');

            $table->foreign('property_id')->references('id')->on('property')->onDelete('no action')->onUpdate('no action');
            $table->foreign('term_id')->references('id')->on('term')->onDelete('no action')->onUpdate('no action');
        });
    }
}
