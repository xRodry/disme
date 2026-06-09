<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateConstantTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // As 2 different functions or it will give an error saying that column type already exists in the 2nd instructions
        Schema::table('constant', function (Blueprint $table) {
            $table->dropColumn('value_type');
        });
        Schema::table('constant', function (Blueprint $table) {
            $table->enum('value_type', ['text', 'bool', 'int', 'double', 'enum', 'date', 'time'])
                ->after('value');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // As 2 different functions or it will give an error saying that column type already exists in the 2nd instructions
        Schema::table('constant', function (Blueprint $table) {
            $table->dropColumn('value_type');
        });
        Schema::table('constant', function (Blueprint $table) {
            $table->enum('value_type', ['string', 'integer_number', 'real_number', 'boolean'])
                ->after('value');
        });
    }
}
