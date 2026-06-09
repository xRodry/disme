<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTermHasPropertyHasSpecificEntityTermTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('term_has_property_has_specific_entity_term', function (Blueprint $table) {
            $table->unsignedInteger('term_has_property_term_id');
            $table->unsignedInteger('term_id');
            $table->unsignedInteger('updated_by')->nullable();
            $table->unsignedInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('term_has_property_term_id', 'thphset_term_has_property_term_id_foreign')->references('id')->on('term')->onDelete('no action')->onUpdate('no action');
            $table->foreign('term_id', 'thphset_term_id_foreign')->references('id')->on('term')->onDelete('no action')->onUpdate('no action');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
            $table->foreign('deleted_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
            $table->primary(['term_has_property_term_id', 'term_id'], 'thphset_primary_key');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('term_has_property_has_specific_entity_term');
    }
}
