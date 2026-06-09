<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Database\Seeder;
use App\TState;
use App\TStateName;

class TStateTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TState::insert([
            array('id' => '1', 'abbrv' => 'rq', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '2', 'abbrv' => 'pm', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '3', 'abbrv' => 'ex', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '4', 'abbrv' => 'de', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '5', 'abbrv' => 'ac', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '6', 'abbrv' => 'dc', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '7', 'abbrv' => 'rj', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '8', 'abbrv' => 'rv_rq_rq', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '9', 'abbrv' => 'rv_rq_al', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '10', 'abbrv' => 'rv_rq_rf', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '11', 'abbrv' => 'rv_pm_rq', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '12', 'abbrv' => 'rv_pm_al', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '13', 'abbrv' => 'rv_pm_rf', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '14', 'abbrv' => 'rv_de_rq', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '15', 'abbrv' => 'rv_de_al', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '16', 'abbrv' => 'rv_de_rf', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '17', 'abbrv' => 'rv_ac_rq', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '18', 'abbrv' => 'rv_ac_al', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '19', 'abbrv' => 'rv_ac_rf', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '20', 'abbrv' => 'qt', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('id' => '21', 'abbrv' => 'sp', 'updated_by' => NULL, 'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
        ]);

        TStateName::insert([
            array('t_state_id' => '1','language_id' => '1','name' => 'pedido','act_name' => 'pedido', 'updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '1','language_id' => '2','name' => 'requested','act_name' => 'request','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '2','language_id' => '1','name' => 'prometido','act_name' => 'promessa','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '2','language_id' => '2','name' => 'promised','act_name' => 'promise','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '3','language_id' => '1','name' => 'executado','act_name' => 'execução','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '3','language_id' => '2','name' => 'executed','act_name' => 'execute','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '4','language_id' => '1','name' => 'declarado','act_name' => 'declaração','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '4','language_id' => '2','name' => 'declared','act_name' => 'declare','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '5','language_id' => '1','name' => 'aceite','act_name' => 'aceitação','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '5','language_id' => '2','name' => 'accepted','act_name' => 'accept','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '6','language_id' => '1','name' => 'recusado','act_name' => 'recusa','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '6','language_id' => '2','name' => 'declined','act_name' => 'decline','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '7','language_id' => '1','name' => 'rejeitado','act_name' => 'rejeição','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '7','language_id' => '2','name' => 'rejected','act_name' => 'reject','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '8','language_id' => '1','name' => 'revogação de pedido pedida','act_name' => 'revogação de pedido pedida','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '8','language_id' => '2','name' => 'revoke request requested','act_name' => 'revoke request request','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '9','language_id' => '1','name' => 'revogação de pedido permitida','act_name' => 'revogação de pedido permitida','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '9','language_id' => '2','name' => 'revoke request allowed','act_name' => 'revoke request allow','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '10','language_id' => '1','name' => 'revogação de pedido recusada','act_name' => 'revogação de pedido recusada','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '10','language_id' => '2','name' => 'revoke request refused','act_name' => 'revoke request refuse','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '11','language_id' => '1','name' => 'revogação de promessa pedida','act_name' => 'revogação de promessa pedida','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '11','language_id' => '2','name' => 'revoke promise requested','act_name' => 'revoke promise request','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '12','language_id' => '1','name' => 'revogação de promessa permitida','act_name' => 'revogação de promessa permitida','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '12','language_id' => '2','name' => 'revoke promise allowed','act_name' => 'revoke promise allow','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '13','language_id' => '1','name' => 'revogação de promessa recusada','act_name' => 'revogação de promessa recusada','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '13','language_id' => '2','name' => 'revoke promise refused','act_name' => 'revoke promise refuse','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '14','language_id' => '1','name' => 'revogação de declaração pedida','act_name' => 'revogação de declaração pedida','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '14','language_id' => '2','name' => 'revoke declare requested','act_name' => 'revoke declare request','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '15','language_id' => '1','name' => 'revogação de declaração permitida','act_name' => 'revogação de declaração permitida','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '15','language_id' => '2','name' => 'revoke declare allowed','act_name' => 'revoke declare allow','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '16','language_id' => '1','name' => 'revogação de declaração recusada','act_name' => 'revogação de declaração recusada','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '16','language_id' => '2','name' => 'revoke declare refused','act_name' => 'revoke declare refuse','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '17','language_id' => '1','name' => 'revogação de aceitação pedida','act_name' => 'revogação de aceitação pedida','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '17','language_id' => '2','name' => 'revoke acceptance requested','act_name' => 'revoke accept request','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '18','language_id' => '1','name' => 'revogação de aceitação permitida','act_name' => 'revogação de aceitação permitida','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '18','language_id' => '2','name' => 'revoke acceptance allowed','act_name' => 'revoke accept allow','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '19','language_id' => '1','name' => 'revogação de aceitação recusada','act_name' => 'revogação de aceitação recusada','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '19','language_id' => '2','name' => 'revoke acceptance refused','act_name' => 'revoke accept refuse','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '20','language_id' => '1','name' => 'desistido','act_name' => 'desiste','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '20','language_id' => '2','name' => 'quitted','act_name' => 'quit','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '21','language_id' => '1','name' => 'parado','act_name' => 'pára','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL),
            array('t_state_id' => '21','language_id' => '2','name' => 'stopped','act_name' => 'stop','updated_by' => NULL,'deleted_by' => NULL,'created_at' => '2023-03-14 11:00:00','updated_at' => '2023-03-14 11:00:00','deleted_at' => NULL)
        ]);
    }
}
