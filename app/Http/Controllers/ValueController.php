<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Entity;
use App\Form;
use App\Http\Traits\FormUpdatingTrait;
use App\Http\Traits\GetMultilingualConceptName;
use App\Process;
use App\Property;
use App\Transaction;
use App\TransactionState;
use App\Value;
use App\ValueText;
use Illuminate\Http\Request;
use DB;
use Log;
class ValueController extends Controller
{
    use GetMultilingualConceptName, FormUpdatingTrait;

    public function update(Request $request, $valueId)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $value = Value::find($valueId);

        DB::beginTransaction();
        try {

            if ($value->property->requires_translation) {
                $value->update([
                    'state' => $request->input('state'),
                    'updated_by' => $userId
                ]);
                $valueText = ValueText::where([
                    'value_id' => $valueId,
                    'language_id' => $userLangId
                ])->whereNull('deleted_at')->first();
                $valueText->update([
                    'text' => $request->input('value'),
                    'updated_by' => $userId
                ]);
            } else {
                $value->update([
                    'value' => $request->input('value'),
                    'state' => $request->input('state'),
                    'updated_by' => $userId
                ]);
            }

            // Update the 'select'/'radio' components' options of forms containing this property
            $this->updateFormsUsingThisObject('propertyValues', $value->property, $userId, $userLangId);

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string)$success;
    }

    public function destroy(Request $request, $valueId)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $value = Value::find($valueId);

        DB::beginTransaction();
        try {

            if ($value->property->requires_translation) {
                $valueTexts = ValueText::where('value_id', $valueId)->whereNull('deleted_at')->get();
                foreach ($valueTexts as $valueText) {
                    $valueText->update([
                        'deleted_by' => $userId
                    ]);
                    $valueText->delete();
                }
            }

            $value->update([
                'deleted_by' => $userId
            ]);
            $value->delete();

            // Update the 'select'/'radio' components' options of forms containing this property
            $this->updateFormsUsingThisObject('propertyValues', $value->property, $userId, $userLangId);

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string)$success;
    }

    public function translate(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $value = Value::find($request->input('id'));

        DB::beginTransaction();
        try {
            if ($value->property->requires_translation) {
                ValueText::create([
                    'value_id' => $value->id,
                    'language_id' => $userLangId,
                    'text' => $request->input('value'),
                    'updated_by' => $userId
                ]);
            }

            // Update the 'select'/'radio' components' options of forms containing this property
            $this->updateFormsUsingThisObject('propertyValues', $value->property, $userId, $userLangId);

            DB::commit();
            $success = true;
            // all good
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
            // something went wrong
        }
        return (string)$success;
    }

    public function deleteAllTestData(Request $request)
    {
        $userId = $request->user()->id;
        $userLangId = $request->user()->language_id;

        $values = Value::get();
        $entities = Entity::get();
        $transactionStates = TransactionState::get();
        $transactions = Transaction::get();
        $processes = Process::get();

        DB::beginTransaction();
        try {

            $this->deleteFactData($values, $userId);
            $this->deleteFactData($entities, $userId);
            $this->deleteFactData($transactionStates, $userId);
            $this->deleteFactData($transactions, $userId);
            $this->deleteFactData($processes, $userId);

            $this->updateFormPropRefValues($userId, $userLangId);

            DB::commit();
            $success = true;
            // all good
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
            // something went wrong
        }
        return (string)$success;
    }

    private function deleteFactData($factData, $userId) {
        foreach ($factData as $factIndividualRecord) {
            $factIndividualRecord->update([
                'deleted_by' => $userId
            ]);
            $factIndividualRecord->delete();
        }
    }

    private function updateFormPropRefValues($userId, $userLangId) {
        $formsWithPropRefProperties = Form::with('action.actionProps.prop')
            ->whereHas('action.actionProps.prop', function($actionProps) {
                $actionProps->where('value_type', 'prop_ref');
            })->whereNull('deleted_at')->get();

        $propertiesToUpdate = [];

        foreach ($formsWithPropRefProperties as $formWithPropRefProperties) {
            foreach ($formWithPropRefProperties->action->actionProps as $actionProp) {
                if ($actionProp->prop->value_type == 'prop_ref') {
                    $propertiesToUpdate[] = $actionProp->prop->fk_property_id;
                }
            }
        }

        $propertiesToUpdate = array_unique(array_filter($propertiesToUpdate));

        foreach ($propertiesToUpdate as $propertyId) {
            $property = Property::find($propertyId);
            $this->updateFormsUsingThisObject('propertyValues', $property, $userId, $userLangId);
        }
    }
}
