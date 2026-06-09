<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Traits;

use App\ActionDerivedProp;
use App\Http\ExecutionEngine\EECGlobalVariables;
use App\Http\ExecutionEngine\Helpers\TermsExecutionHelper;

trait StoreActionDerivedPropsTrait
{
    // We don't do "use StoreFormInputTrait;" because that generates a collision error when this trait on Controllers
    // We do need to make sure though that we do both "use StoreActionDerivedPropsTrait, StoreFormInputTrait;" when using this trait

    private function storeDerivedPropertiesIfPresent($actionId, $entityId, TermsExecutionHelper $termsExecutionHelper, EECGlobalVariables $globalVariables) {
        $actionDerivedProps = ActionDerivedProp::where('action_id', $actionId)
            ->whereNull('deleted_at')->get();

        if ($actionDerivedProps->count()) {
            $this->storeActionDerivedProps($actionDerivedProps, $entityId, $termsExecutionHelper, $globalVariables);
        }
    }

    private function storeActionDerivedProps($actionDerivedProps, $entityId, TermsExecutionHelper $termsExecutionHelper, EECGlobalVariables $globalVariables)
    {
        $userInputLog = $this->getOrCreateUserInputLog($actionDerivedProps->first()->action_id, $globalVariables->transactionStateId,
            $globalVariables->userId);

        foreach ($actionDerivedProps as $actionDerivedProp) {
            // Get the derivedProperty's value depending on its term type and check if it needs transformation
            $termValue = $termsExecutionHelper->getTermValueAndCheckIfNeedsTransformation($actionDerivedProp->term_id, $actionDerivedProp->property_id);
            // Save the derivedProperty's value in the database
            $this->savePropertyValue($actionDerivedProp->property_id, $termValue, $entityId, $globalVariables->transactionId,
                $userInputLog->id, $globalVariables->userId, $globalVariables->langId);
        }
    }
}
