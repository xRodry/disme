<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\EntType;
use App\Http\Resources\ProcessDetailsResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\ProcessDetails;
use App\Property;
use App\TransactionType;
use DB;
use Illuminate\Http\Request;
use Log;

class ProcessDetailsController extends Controller
{
    use HTTPResponseTrait, GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $processDetails = DB::table('process_details')
            ->join('process_type', 'process_details.process_type_id', '=', 'process_type.id')
            ->join('property', 'process_details.property_id', '=', 'property.id')
            ->whereNull(['process_details.deleted_at', 'process_type.deleted_at', 'property.deleted_at'])
            ->select('process_details.*', 'property.ent_type_id as ent_type_id')
            ->get();

        // Get its FK names that aren't specified in the user's language, but have it specified in the system's fallback language
        foreach ($processDetails as $processDetail) {
           $this->getProcessDetailsFKNames($processDetail, $userLangId);
        }

        return ProcessDetailsResource::collection($processDetails);
    }

    public function show(Request $request, $processTypeId, $propertyId)
    {
        $userLangId = $request->user()->language_id;

        $processDetail = DB::table('process_details')
            ->join('process_type', 'process_details.process_type_id', '=', 'process_type.id')
            ->join('property', 'process_details.property_id', '=', 'property.id')
            ->where([
                ['process_details.process_type_id', $processTypeId],
                ['process_details.property_id', $propertyId]
            ])
            ->whereNull(['process_details.deleted_at', 'process_type.deleted_at', 'property.deleted_at'])
            ->select('process_details.*', 'property.ent_type_id as ent_type_id')
            ->first();

        // Get its FK names that aren't specified in the user's language, but have it specified in the system's fallback language
        $this->getProcessDetailsFKNames($processDetail, $userLangId);

        return new ProcessDetailsResource($processDetail);
    }

    private function getProcessDetailsFKNames($processDetail, $userLangId) {
        $processDetail->process_type_name = $this->getMultilingualConceptName('process_type_name', 'name',
            'process_type_id', $processDetail->process_type_id, $userLangId);
        $processDetail->property_name = $this->getMultilingualConceptName('property_name', 'name',
            'property_id', $processDetail->property_id, $userLangId);
        $processDetail->entity_type_name = $this->getMultilingualConceptName('ent_type_name', 'name',
            'ent_type_id', $processDetail->ent_type_id, $userLangId);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;

        $hasPreviousProcessDetailRecord = ProcessDetails::onlyTrashed()->where([
            ['process_type_id', $request->input('process_type_id')],
            ['property_id', $request->input('property_id')]
        ])->first();

        DB::beginTransaction();
        try {

            if ($hasPreviousProcessDetailRecord) {
                $hasPreviousProcessDetailRecord->restore();
                $hasPreviousProcessDetailRecord->update([
                    'deleted_by' => null,
                    'updated_by' => $userId
                ]);
            } else {
                $processDetail = ProcessDetails::create([
                    'process_type_id' => $request->input('process_type_id'),
                    'property_id' => $request->input('property_id'),
                    'updated_by' => $userId
                ]);
            }

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

    public function update(Request $request, $processTypeId, $propertyId)
    {
        $userId = $request->user()->id;
        $previousPropertyId = $request->input('previous_property_id');

        $alreadyHadNewProcessDetailRecord = null;

        // For when we're changing the propertyId attached to this processType, see if the new combination already
        // existed in the system and had been soft_deleted. In this case, we restore it instead of creating a new record.
        if ((int)$propertyId !== (int)$previousPropertyId) {
            $alreadyHadNewProcessDetailRecord = ProcessDetails::onlyTrashed()
                ->where([
                    'process_type_id' => $processTypeId,
                    'property_id' => $propertyId
                ])->first();
        }

        // The current record that needs deleting (if the propertyId has been changed)
        $processDetailRecord = ProcessDetails::where([
            'process_type_id' => $processTypeId,
            'property_id' => $previousPropertyId
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {
            // In case user has changed the property of the combination when editing it
            if ((int)$propertyId !== (int)$previousPropertyId) {
                // Delete the current combination of processType + property before the property was changed
                $processDetailRecord->update([
                    'deleted_by' => $userId
                ]);
                $processDetailRecord->delete();
                // If the new combination of processType + property had already been in the system and was after soft_deleted
                // Restore it. If there was no record of this new combination on the database, create it.
                if ($alreadyHadNewProcessDetailRecord) {
                    $alreadyHadNewProcessDetailRecord->restore();
                    $alreadyHadNewProcessDetailRecord->update([
                        'deleted_by' => null,
                        'updated_by' => $userId
                    ]);
                } else {
                    ProcessDetails::create([
                        'process_type_id' => $processTypeId,
                        'property_id' => $propertyId,
                        'updated_by' => $userId
                    ]);
                }
            }

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }
        return (string) $success;
    }

    public function destroy(Request $request, $processTypeId, $propertyId)
    {
        $userId = $request->user()->id;

        $processDetail = ProcessDetails::where([
            ['process_type_id', $processTypeId],
            ['property_id', $propertyId]
        ])->whereNull('deleted_at')->first();

        DB::beginTransaction();
        try {
            $processDetail->update([
                'deleted_by' => $userId
            ]);
            $processDetail->delete();
            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }
        return (string) $success;
    }

    public function getAllPropertiesOfProcessType(Request $request, $processTypeId)
    {
        $propertiesProcessType = [];
        $userLangId = $request->user()->language_id;

        $transaction_types = TransactionType::where('process_type_id', $processTypeId)
            ->whereNull('deleted_at')->get();

        foreach($transaction_types as $transaction_type){
            $transaction_type->ent_type = EntType::where('transaction_type_id', $transaction_type->id)
                ->whereNull('deleted_at')->get();
            foreach($transaction_type->ent_type as $ent_type){
                $ent_type->property = Property::where('ent_type_id', $ent_type->id)
                    ->whereNull('deleted_at')->get();
                foreach ($ent_type->property as $property) {
                    $property->name = $this->getMultilingualConceptName('property_name', 'name',
                    'property_id', $property->id, $userLangId);
                    $propertiesProcessType[] = [
                        'property_id' => $property->id,
                        'property_name' => $property->name
                    ];
                }
            }
        }
        return $propertiesProcessType;
    }
}
