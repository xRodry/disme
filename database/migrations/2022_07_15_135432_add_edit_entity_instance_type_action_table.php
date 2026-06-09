<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Database\Migrations\Migration;

class AddEditEntityInstanceTypeActionTable extends Migration
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
        DB::statement("ALTER TABLE action MODIFY type ENUM('causal_link','assign_expression','user_input','user_output','produce_doc','if','then','else','while','foreach','read_value','external_call','edit_entity_instance') NOT NULL");
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
        DB::statement("ALTER TABLE action MODIFY type ENUM('causal_link','assign_expression','user_input','user_output','produce_doc','if','then','else','while','foreach','read_value','external_call') NOT NULL");

    }
}
