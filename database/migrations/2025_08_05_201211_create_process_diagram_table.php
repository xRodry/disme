<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProcessDiagramTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('process_diagram', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('process_type_id');
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->longText('XML');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('process_type_id')->references('id')->on('process_type')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('process_diagram');
    }
}
