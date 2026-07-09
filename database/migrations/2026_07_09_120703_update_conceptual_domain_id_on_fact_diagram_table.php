<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateConceptualDomainIdOnFactDiagramTable extends Migration
{
    public function up()
    {
        Schema::table('fact_diagram', function (Blueprint $table) {
            $table->dropColumn('conceptual_domain_id');
        });

        Schema::table('fact_diagram', function (Blueprint $table) {
            $table->integer('conceptual_domain_id')->unsigned()->nullable()->after('id');
            $table->foreign('conceptual_domain_id')->references('id')->on('conceptual_domain')->onDelete('no action')->onUpdate('no action');
        });
    }

    public function down()
    {
        Schema::table('fact_diagram', function (Blueprint $table) {
            $table->dropForeign(['conceptual_domain_id']);
            $table->dropColumn('conceptual_domain_id');
        });

        Schema::table('fact_diagram', function (Blueprint $table) {
            $table->unsignedBigInteger('conceptual_domain_id')->nullable()->after('id');
        });
    }
}
