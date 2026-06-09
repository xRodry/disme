<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine;

use App\Form;
use App\Http\ExecutionEngine\Helpers\FormDetailsHelper;
use App\Http\Resources\ActionsDashboardResource;

class UserInputExecution implements ActionTypeExecutionInterface
{
    protected $formDetailsHelper;
    private $globalVariables;

    public function __construct(FormDetailsHelper $formDetailsHelper)
    {
        $this->formDetailsHelper = $formDetailsHelper;
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    public function execute(ActionsDashboardResource $action)
    {
        $userDetailingProcessType = $action->userDetailingProcessType;
        $userDetailingUserId = $action->userDetailingUserId;

        if (!$userDetailingProcessType || $userDetailingUserId) {
            $action->formId = Form::where('action_id', $action->id)->latest()->first()->id;
            $action->detailingUserId = $userDetailingUserId ?: null;
            $action->formDetails = $this->formDetailsHelper->getFormDetails($action->formId);
        }

        return $action;
    }


}
