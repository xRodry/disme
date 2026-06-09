<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRestrictionQueryFieldTransactionTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transaction_type', function (Blueprint $table) {
            $table->unsignedInteger('restriction_query_id')->nullable()->after('own_user_access_only');
            $table->foreign('restriction_query_id')->references('id')->on('query')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('transaction_type', function (Blueprint $table) {
            $table->dropForeign(['restriction_query_id']);
            $table->dropColumn('restriction_query_id');
        });
    }
}
