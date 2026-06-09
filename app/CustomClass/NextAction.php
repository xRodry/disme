<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\CustomClass;


class NextAction
{
    var $cur_t_state;
    var $transaction_id;
    var $process_id;

    var $next_action;
    var $cur_action;
    var $next_t_state;

    var $tstates;
    var $actions;

    function __construct($edible, $color="green")
    {
        $this->edible = $edible;
        $this->color = $color;
    }

    private function getActionsForTState($t_state)
    {
        //obter actions para aquele t_state
        return $this->edible;
    }

    private function checkPermissionsForTState()
    {
        return $this->color;
    }

    private function getCurTState()
    {
        //obter o t state seguinte
    }

    private function getCurAction()
    {
        //obter a action actual
    }

    private function getNextAction()
    {
        //obter a action seguinte
    }

    private function getNextTState()
    {

    }

}
