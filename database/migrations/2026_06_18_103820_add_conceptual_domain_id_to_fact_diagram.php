<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddConceptualDomainIdToFactDiagram extends Migration
{
    public function up()
    {
        Schema::table('fact_diagram', function (Blueprint $table) {
            $table->unsignedBigInteger('conceptual_domain_id')
                ->nullable()
                ->after('id');
        });
    }

    public function down()
    {
        Schema::table('fact_diagram', function (Blueprint $table) {
            $table->dropColumn('conceptual_domain_id');
        });
    }

}
