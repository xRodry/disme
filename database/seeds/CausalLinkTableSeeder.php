<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Database\Seeder;
use App\CausalLink;

class CausalLinkTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        CausalLink::insert([
            array('id' => '1', 'causing_action' => '1', 'caused_transaction_type_id' => '2', 'caused_t_state_id' => '1', 'min' => '1', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '2', 'causing_action' => '2', 'caused_transaction_type_id' => '17', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '3', 'causing_action' => '3', 'caused_transaction_type_id' => '3', 'caused_t_state_id' => '1', 'min' => '1', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '4', 'causing_action' => '4', 'caused_transaction_type_id' => '4', 'caused_t_state_id' => '1', 'min' => '1', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '5', 'causing_action' => '5', 'caused_transaction_type_id' => '18', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '6', 'causing_action' => '6', 'caused_transaction_type_id' => '5', 'caused_t_state_id' => '1', 'min' => '1', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '7', 'causing_action' => '7', 'caused_transaction_type_id' => '9', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '8', 'causing_action' => '8', 'caused_transaction_type_id' => '6', 'caused_t_state_id' => '1', 'min' => '1', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '9', 'causing_action' => '9', 'caused_transaction_type_id' => '8', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '10', 'causing_action' => '10', 'caused_transaction_type_id' => '11', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '11', 'causing_action' => '11', 'caused_transaction_type_id' => '9', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '12', 'causing_action' => '12', 'caused_transaction_type_id' => '10', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '13', 'causing_action' => '13', 'caused_transaction_type_id' => '2', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '14', 'causing_action' => '14', 'caused_transaction_type_id' => '12', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '15', 'causing_action' => '15', 'caused_transaction_type_id' => '13', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '16', 'causing_action' => '16', 'caused_transaction_type_id' => '8', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '17', 'causing_action' => '17', 'caused_transaction_type_id' => '14', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '18', 'causing_action' => '18', 'caused_transaction_type_id' => '15', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '19', 'causing_action' => '19', 'caused_transaction_type_id' => '16', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '20', 'causing_action' => '20', 'caused_transaction_type_id' => '19', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
            array('id' => '21', 'causing_action' => '21', 'caused_transaction_type_id' => '19', 'caused_t_state_id' => '1', 'min' => '0', 'max' => '1', 'cancel_proc' => '0', 'continue_if_same_user' => '1', 'updated_by' => NULL, 'deleted_by' => NULL, 'created_at' => NULL, 'updated_at' => NULL, 'deleted_at' => NULL),
        ]);
    }
}
