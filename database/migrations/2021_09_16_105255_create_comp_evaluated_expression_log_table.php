<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompEvaluatedExpressionLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comp_evaluated_expression_log', function (Blueprint $table) {
            $table->unsignedInteger('condition_log_id');
            $table->unsignedInteger('comp_evaluated_expression_id');
            $table->string('expression_evaluated',512);
            $table->boolean('expression_result');
            $table->unsignedInteger('updated_by')->nullable();
            $table->unsignedInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('condition_log_id')->references('id')->on('condition_log')->onDelete('no action')->onUpdate('no action');
            $table->foreign('comp_evaluated_expression_id','ceel_comp_evaluated_expression_foreign')->references('id')->on('comp_evaluated_expression')->onDelete('no action')->onUpdate('no action');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
            $table->foreign('deleted_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');

            $table->primary(['condition_log_id','comp_evaluated_expression_id'],'ceel_primary_keys');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('comp_evaluated_expression_log');
    }
}
