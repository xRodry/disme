<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateEntTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ent_type', function (Blueprint $table) {
            $table->boolean('auto_generated')->nullable()->after('has_many');
            $table->boolean('external')->nullable()->after('auto_generated');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ent_type', function (Blueprint $table) {
            $table->dropColumn(['auto_generated', 'external']);
        });
    }
}
