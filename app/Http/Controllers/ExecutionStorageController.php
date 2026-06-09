<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Action;
use App\ActionLog;
use App\Http\ExecutionEngine\AssignExpressionExecution;
use App\Http\ExecutionEngine\EECGlobalVariables;
use App\Http\ExecutionEngine\Helpers\TermsExecutionHelper;
use App\Http\Resources\ActionsDashboardResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\StoreActionDerivedPropsTrait;
use App\Http\Traits\StoreFormInputTrait;
use App\Property;
use App\UserEvaluatedExpressionLog;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Log;

class ExecutionStorageController extends Controller
{
    use GetMultilingualConceptName, StoreFormInputTrait, StoreActionDerivedPropsTrait;
    private $termsExecutionHelper;
    private $globalVariables;

    public function __construct()
    {
        $this->termsExecutionHelper = new TermsExecutionHelper();
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    public function storeActionLog(Request $request)
    {
        DB::beginTransaction();
        try {
            $actionLog = ActionLog::create([
                'state' => $request->input('state'),
                'action_id' => $request->input('action_id'),
                'transaction_state_id' => $request->input('transaction_state_id'),
                'updated_by' => $request->user()->id
            ]);
            Log::debug('ACTION LOG SAVED state: '.$actionLog->state.' id:'.$actionLog->id);
            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
        }
        return (string) $success;
    }

    public function storeUserEvaluatedExpressionLog (Request $request)
    {
        $this->globalVariables->setUser($request);
        $this->globalVariables->setStorageParameters($request->all());

        DB::beginTransaction();
        try {

            // Save the user's evaluation of this userEvaluatedExpression
            $userEvaluatedExpressionLog = UserEvaluatedExpressionLog::create([
                'condition_log_id' => $request->input('condition_log_id'),
                'user_evaluated_expression_id' => $request->input('user_evaluated_expression_id'),
                'expression_result' => $request->input('expression_result'),
                'updated_by' => $request->user()->id
            ]);
            Log::debug('UEELog saved cond_log_id: '.$userEvaluatedExpressionLog->condition_log_id);
            // As the action was executed, save the corresponding actionLog record
            $this->storeExecutedActionLog($request->input('actionId'));

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            Log::debug($e);
            $success = false;
            DB::rollback();
        }
        return (string) $success;
    }

    private $serverSideValidationLogging;

    public function storeFormSubmittedData(Request $request)
    {
        $this->globalVariables->setUser($request);
        $this->globalVariables->setStorageParameters($request->all());

        $formId = $request->input('formId');
        $formSubmittedValues = $request->input('submittedValues');

        // Server-side Validation
        $validationErrors = $this->runServerSideValidation($formId, $formSubmittedValues);
        // If server side validation failed, return immediately the errors to the client-side to display to user.
        if ($validationErrors) {
            return $validationErrors;
        }
        Log::debug('Passed Server-Side Validation');

        DB::beginTransaction();
        try {

            // Log all evaluated validation conditions in the respective log table as successful validations
            $this->storeValidationCondLogSuccess($formId, $this->globalVariables->transactionStateId, $this->globalVariables->userId);
            // Create user_input_log, so we can then link all created values on this form to it
            $userInputLog = $this->getOrCreateUserInputLog($request->input('actionId'), $this->globalVariables->transactionStateId,
                $this->globalVariables->userId);

            // Check if the form submission if part of a 'user detailing' process
            if ($request->input('detailingUserId')) {
                // If it is, save the submitted values and update the user's associated entity if necessary
                $this->saveUserDetailingEntity($request->input('detailingUserId'), $request->input('entityId'),
                    $formSubmittedValues, $userInputLog->id);
            } else {
                // Save the form submission's property values
                $this->savePropertyValuesFromSubmission($formSubmittedValues, $request->input('entityId'), $userInputLog->id);
            }

            // Save the action's derivedProperties if they exist
            $this->storeDerivedPropertiesIfPresent($request->input('actionId'), $request->input('entityId'), $this->termsExecutionHelper, $this->globalVariables);

            // As the action was executed, save the corresponding actionLog record
            $this->storeExecutedActionLog($request->input('actionId'));

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            Log::debug($e);
            $success = false;
            DB::rollback();
        }
        return (string) $success;

    }

    public function storeEEIWithDerivedPropertiesOnly(Request $request)
    {
        $this->globalVariables->setUser($request);
        $this->globalVariables->setStorageParameters($request->all());

        DB::beginTransaction();
        try {

            // Save the action's derivedProperties
            $this->storeDerivedPropertiesIfPresent($request->input('actionId'), $request->input('selectedEntity'), $this->termsExecutionHelper, $this->globalVariables);

            // As the action was executed, save the corresponding actionLog record
            $this->storeExecutedActionLog($request->input('actionId'));

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            Log::debug($e);
            $success = false;
            DB::rollback();
        }
        return (string) $success;
    }



    public function storeFactSpecificationAssignExpressionData(Request $request)
    {
        $this->globalVariables->setUser($request);
        $this->globalVariables->setStorageParameters($request->all());

        $formId = $request->input('formId');
        $formSubmittedValues = $request->input('submittedValues');

        // Server-side Validation
        $validationErrors = $this->runServerSideValidation($formId, $formSubmittedValues);
        // If server side validation failed, return immediately the errors to the client-side to display to user.
        if ($validationErrors) {
            return $validationErrors;
        }
        Log::debug('Passed Server-Side Validation');

        DB::beginTransaction();
        try {

            // Get the assign expression's information and the value submitted in the form by the user. As it's only
            // 1 actionProp/entitySpecification, its value will always be in the same spot in the submittedValues array.
            $action = Action::find($request->input('actionId'));
            $action->factSpecificationTermValueAssigned = $request->input('submittedValues')[0][1];
            // Transform the $action object into the expected parameter type of AssignExpressionExecution's execute function
            $actionResource = new ActionsDashboardResource($action);

            // We will be using the assignExpressionExecution class to store the submitted value
            $assignExpressionExecution = new AssignExpressionExecution($this->termsExecutionHelper);
            $assignExpressionExecution->execute($actionResource);

            // As the action was executed, save the corresponding actionLog record
            $this->storeExecutedActionLog($request->input('actionId'));

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            Log::debug($e);
            $success = false;
            DB::rollback();
        }
        return (string) $success;

    }

    private function storeExecutedActionLog ($actionId)
    {
        $actionLog = ActionLog::create([
            'state' => 'executed',
            'action_id' => $actionId,
            'transaction_state_id' => $this->globalVariables->transactionStateId,
            'updated_by' => $this->globalVariables->userId
        ]);
        Log::debug('ACTION LOG SAVED state: executed, id:'.$actionLog->id);
    }

    private function runServerSideValidation($formId, $formSubmittedValues) {
        // Get the info needed for server-side validation of the form's submitted values
        $valuesForValidation = $this->getInfoForServerSideValidation($formSubmittedValues);
        // Log::debug('Values For Validation', $valuesForValidation->toArray());
        // Log::debug('Validation Rules', $this->getFormValidationRules($form_id,$langId));
        try {
            $valuesForValidation->validate($this->getFormValidationRules($formId, $this->globalVariables->langId));
        } catch (ValidationException $e) {
            // Log all evaluated validation conditions in the respective log table, the ones that raised an error and the ones that didn't.
            Log::error('Server-Side Validation Errors', $e->errors());
            $this->storeValidationCondLogAfterError($e->errors(), $formId, $this->globalVariables->transactionStateId,
                $this->globalVariables->userId);
            // Replace property id's (ex: p25) with its respective name so that errors presented to the user are easily identifiable.
            return $this->replacePropertyNamesValidationErrors($e->errors(), $this->globalVariables->langId);
        }
        return null;
    }

    private function saveUserDetailingEntity($detailingUserId, $userEntityId, $formSubmittedValues, $userInputLogId){
        // Get the first property submitted on the form, so we can get its entTypeId if we need to create a new entity
        // $formSubmittedValues[0][0] refers to the first submitted property's id.
        $firstDetailingProperty = Property::find($formSubmittedValues[0][0]);
        // Check if the submitted 'user details' form entity type is the same as the user's previous entity's entity type [if the user had one]
        $changedEntityType = $this->changedUserDetailsEntityType($firstDetailingProperty, $detailingUserId);
        $entityId = $changedEntityType ? $this->createEntity($firstDetailingProperty, $this->globalVariables->transactionId,
            $this->globalVariables->userId)->id : $userEntityId;
        // Save the form submission's property values
        $this->savePropertyValuesFromSubmission($formSubmittedValues, $entityId, $userInputLogId);
        // Assign the entity [of the properties just inserted in the DB] to the detailingUser
        $this->saveUserEntity($detailingUserId, $entityId, $this->globalVariables->userId);
    }

    private function savePropertyValuesFromSubmission($formSubmittedValues, $entityId, $userInputLogId) {
        // For each property filled in the form
        foreach ($formSubmittedValues as $formSubmittedValue) {
            // Get the field's label that was filled by the user [propertyId, 'entType'+entTypeId or submit]
            $valueLabel = $formSubmittedValue[0];
            // Get the value (property) or values ('has many' entity types) inserted by the user
            $valueInput = $formSubmittedValue[1];
            if (str_contains($valueLabel, 'entType')) {
                // In case value submitted is part of an 'has many' entity type, represented in the forms through a dataGrid.
                $this->saveEntityValues($valueLabel, $valueInput, $this->globalVariables->processId, $userInputLogId,
                    $this->globalVariables->userId, $this->globalVariables->langId);
            } else {
                // In case value submitted is part of a solo property: get the property's info
                // When we're on a 'edit entity instance' action, we already have the entityId from the client-side
                $this->savePropertyValue($valueLabel, $valueInput, $entityId, $this->globalVariables->transactionId,
                    $userInputLogId, $this->globalVariables->userId, $this->globalVariables->langId);
            }
        }
    }
}
