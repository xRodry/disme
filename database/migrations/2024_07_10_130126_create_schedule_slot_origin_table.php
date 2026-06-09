<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateScheduleSlotOriginTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedule_slot_origin', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('action_id');
            $table->unsignedInteger('responsible_user');
            $table->unsignedInteger('start_date');
            $table->unsignedInteger('start_time');
            $table->unsignedInteger('end_date');
            $table->unsignedInteger('end_time');
            $table->unsignedInteger('weekdays');
            $table->unsignedInteger('duration');
            $table->unsignedInteger('slot_count');
            $table->unsignedInteger('updated_by')->nullable();
            $table->unsignedInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('action_id')->references('id')->on('action')->onDelete('no action')->onUpdate('no action');
            $table->foreign('responsible_user')->references('id')->on('property')->onDelete('no action')->onUpdate('no action');
            $table->foreign('start_date')->references('id')->on('property')->onDelete('no action')->onUpdate('no action');
            $table->foreign('start_time')->references('id')->on('property')->onDelete('no action')->onUpdate('no action');
            $table->foreign('end_date')->references('id')->on('property')->onDelete('no action')->onUpdate('no action');
            $table->foreign('end_time')->references('id')->on('property')->onDelete('no action')->onUpdate('no action');
            $table->foreign('weekdays')->references('id')->on('property')->onDelete('no action')->onUpdate('no action');
            $table->foreign('duration')->references('id')->on('property')->onDelete('no action')->onUpdate('no action');
            $table->foreign('slot_count')->references('id')->on('property')->onDelete('no action')->onUpdate('no action');

            $table->foreign('updated_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
            $table->foreign('deleted_by')->references('id')->on('users')->onDelete('no action')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('schedule_slot_origin');
    }
}
