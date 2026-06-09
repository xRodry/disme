<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTransactionTypeV3 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transaction_type', function (Blueprint $table) {
            $table->boolean('interm_task')->nullable()->after('end_proc');
            $table->boolean('external')->nullable()->after('interm_task');
            $table->enum('type', ['original', 'informational', 'documental'])->nullable()->after('external');
            $table->boolean('frontier')->nullable()->after('type');
            $table->enum('frontier_type', ['internal', 'external'])->nullable()->after('frontier');
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
            $table->dropColumn(['interm_task', 'external', 'type', 'frontier', 'frontier_type']);
        });
    }
}
