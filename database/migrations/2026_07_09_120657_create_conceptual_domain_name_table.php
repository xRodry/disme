<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConceptualDomainNameTable extends Migration
{
    public function up()
    {
        Schema::create('conceptual_domain_name', function (Blueprint $table) {
            $table->integer('conceptual_domain_id')->unsigned();
            $table->integer('language_id')->unsigned();
            $table->string('name', 255)->nullable();
            $table->integer('updated_by')->nullable()->unsigned();
            $table->integer('deleted_by')->nullable()->unsigned();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('conceptual_domain_id')->references('id')->on('conceptual_domain')->onDelete('no action')->onUpdate('no action');
            $table->primary(array('conceptual_domain_id', 'language_id'));
        });
    }

    public function down()
    {
        Schema::dropIfExists('conceptual_domain_name');
    }
}
