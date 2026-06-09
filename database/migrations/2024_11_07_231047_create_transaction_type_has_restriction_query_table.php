<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionTypeHasRestrictionQueryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transaction_type_has_restriction_query', function (Blueprint $table) {
            $table->unsignedInteger('transaction_type_id');
            $table->unsignedInteger('query_id');
            $table->unsignedInteger('updated_by')->nullable();
            $table->unsignedInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            // Specified names for relationships due to the table name's length (raises error on automatic identifiers being too long)
            $table->foreign('transaction_type_id', 'tthrq_transaction_type_id_foreign')->references('id')->on('transaction_type')->onDelete('no action')->onUpdate('no action');
            $table->foreign('query_id', 'tthrq_query_id_foreign')->references('id')->on('query')->onDelete('no action')->onUpdate('no action');
            $table->foreign('updated_by', 'tthrq_updated_by_foreign')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
            $table->foreign('deleted_by', 'tthrq_deleted_by_foreign')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
            $table->primary(['transaction_type_id', 'query_id'], 'tthrq_primary_key');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('transaction_type_has_restriction_query');
    }
}
