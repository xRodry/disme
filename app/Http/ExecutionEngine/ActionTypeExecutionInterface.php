<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine;

use App\Http\Resources\ActionsDashboardResource;

interface ActionTypeExecutionInterface
{
    public function execute(ActionsDashboardResource $action);
}
