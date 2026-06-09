<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCreateScheduleSlotsTypeActionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Laravel doesn't support changing enums' possible values
        // This way, the table can be altered without the loss of data already present in the database
        DB::statement("ALTER TABLE action MODIFY type ENUM('causal_link','assign_expression','user_input','user_output','produce_doc','if','then','else','while','foreach','read_value','external_call','edit_entity_instance', 'create_schedule_slots') NOT NULL");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Laravel doesn't support changing enums' possible values
        // This way, the table can be altered without the loss of data already present in the database
        DB::statement("ALTER TABLE action MODIFY type ENUM('causal_link','assign_expression','user_input','user_output','produce_doc','if','then','else','while','foreach','read_value','external_call','edit_entity_instance') NOT NULL");
    }
}
