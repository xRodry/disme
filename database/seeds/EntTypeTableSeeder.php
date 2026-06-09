<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Database\Seeder;
use App\EntType;
use App\EntTypeName;

class EntTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        EntType::insert([
            array('id' => '1', 'state' => 'active', 'transaction_type_id' => '1', 'last_internal_id' => '0', 'has_many' => '0', 'auto_generated' => '0', 'external' => '1', 'user_details' => '0', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '2', 'state' => 'active', 'transaction_type_id' => '1', 'last_internal_id' => '0', 'has_many' => '0', 'auto_generated' => '0', 'external' => '1', 'user_details' => '0', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '3', 'state' => 'active', 'transaction_type_id' => '1', 'last_internal_id' => '0', 'has_many' => '0', 'auto_generated' => '0', 'external' => '0', 'user_details' => '0', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '4', 'state' => 'active', 'transaction_type_id' => '1', 'last_internal_id' => '0', 'has_many' => '0', 'auto_generated' => '0', 'external' => '0', 'user_details' => '0', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '5', 'state' => 'active', 'transaction_type_id' => '1', 'last_internal_id' => '0', 'has_many' => '0', 'auto_generated' => '0', 'external' => '0', 'user_details' => '0', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '6', 'state' => 'active', 'transaction_type_id' => '1', 'last_internal_id' => '0', 'has_many' => '0', 'auto_generated' => '0', 'external' => '0', 'user_details' => '0', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '7', 'state' => 'active', 'transaction_type_id' => '1', 'last_internal_id' => '0', 'has_many' => '0', 'auto_generated' => '1', 'external' => '0', 'user_details' => '0', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '8', 'state' => 'active', 'transaction_type_id' => '1', 'last_internal_id' => '0', 'has_many' => '0', 'auto_generated' => '0', 'external' => '0', 'user_details' => '0', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
        ]);

        EntTypeName::insert([
            array('ent_type_id' => '1', 'language_id' => '1', 'name' => 'Municipe', 'id_name' => 'Municipe', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '1', 'language_id' => '2', 'name' => 'Citizen', 'id_name' => 'Citizen', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '2', 'language_id' => '1', 'name' => 'Funcionário', 'id_name' => 'Funcionário', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '2', 'language_id' => '2', 'name' => 'Employee', 'id_name' => 'Employee', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '3', 'language_id' => '1', 'name' => 'Reagendamento', 'id_name' => 'Reagendamento', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '3', 'language_id' => '2', 'name' => 'Rescheduling', 'id_name' => 'Rescheduling', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '4', 'language_id' => '1', 'name' => 'Oficial de Audiência', 'id_name' => 'Oficial de Audiência', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '4', 'language_id' => '2', 'name' => 'Hearing Officer', 'id_name' => 'Hearing Officer', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '5', 'language_id' => '1', 'name' => 'Pedido de Audiência', 'id_name' => 'Pedido de Audiência', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '5', 'language_id' => '2', 'name' => 'Hearing Request', 'id_name' => 'Hearing Request', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '6', 'language_id' => '1', 'name' => 'Audiência', 'id_name' => 'Audiência', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '6', 'language_id' => '2', 'name' => 'Hearing', 'id_name' => 'Hearing', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '7', 'language_id' => '1', 'name' => 'Slot de Audiência', 'id_name' => 'Slot de Audiência', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '7', 'language_id' => '2', 'name' => 'Hearing Slot', 'id_name' => 'Hearing Slot', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '8', 'language_id' => '1', 'name' => 'Bloco de Agenda', 'id_name' => 'Bloco de Agenda', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('ent_type_id' => '8', 'language_id' => '2', 'name' => 'Schedule Block', 'id_name' => 'Schedule Block', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
        ]);
    }
}
