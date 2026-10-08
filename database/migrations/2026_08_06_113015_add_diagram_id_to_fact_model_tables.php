<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDiagramIdToFactModelTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ent_type', function (Blueprint $table) {
            $table->string('diagram_id', 255)->nullable()->after('id');
        });

        Schema::table('property', function (Blueprint $table) {
            $table->string('diagram_id', 255)->nullable()->after('id');
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
            $table->dropColumn('diagram_id');
        });

        Schema::table('property', function (Blueprint $table) {
            $table->dropColumn('diagram_id');
        });
    }
}
