<?php
/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\ExecutionEngine;

use App\Entity;
use App\EntType;
use App\Http\ExecutionEngine\Helpers\TermsExecutionHelper;
use App\Http\Resources\ActionsDashboardResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Property;
use App\ScheduleSlotOrigin;
use App\ScheduleSlotResult;
use App\ScheduleSlotResultAdditionalProperty;
use App\Value;
use DateTime;
use stdClass;

class CreateScheduleSlotsExecution implements ActionTypeExecutionInterface
{
    use GetMultilingualConceptName;

    protected $termsExecutionHelper;
    private $globalVariables;

    private $agendaEntityId;

    public function __construct(TermsExecutionHelper $termsExecutionHelper)
    {
        $this->termsExecutionHelper = $termsExecutionHelper;
        $this->globalVariables = app(EECGlobalVariables::class);
    }

    public function execute(ActionsDashboardResource $action)
    {
        // Get the agenda block entity details from where slots will be created
        $agendaDetails = $this->getAgendaBlockEntityDetails($action->id);
        // Get the slots' essential properties that will be saved during its creation
        $slotResultProperties = $this->getSlotResultProperties($action->id);
        // Create the slots based on the agenda block details
        $this->createScheduleSlots($agendaDetails, $slotResultProperties);

        return null;
    }

    private function getAgendaBlockEntityDetails($actionId)
    {
        // Get the properties that reference the essential details of the agenda block from which slots will be created
        $scheduleSlotOrigin = ScheduleSlotOrigin::where('action_id', $actionId)
            ->whereNull('deleted_at')->first();
        $this->agendaEntityId = $this->getAgendaEntity($scheduleSlotOrigin)->id;

        // Get the agenda block essential properties' values (ex start date and time) that are needed to create the slots
        $agendaDetails = new StdClass();
        $agendaDetails->responsibleUser = $this->getAgendaBlockPropertyValue($scheduleSlotOrigin->responsible_user);
        $agendaDetails->startDate = $this->getAgendaBlockPropertyValue($scheduleSlotOrigin->start_date);
        $agendaDetails->startTime = $this->getAgendaBlockPropertyValue($scheduleSlotOrigin->start_time);
        $agendaDetails->startDateTime = new DateTime($agendaDetails->startDate . ' ' . $agendaDetails->startTime);
        $agendaDetails->endDate = $this->getAgendaBlockPropertyValue($scheduleSlotOrigin->end_date);
        $agendaDetails->endTime = $this->getAgendaBlockPropertyValue($scheduleSlotOrigin->end_time);
        $agendaDetails->endDateTime = new DateTime($agendaDetails->endDate . ' ' . $agendaDetails->endTime);
        $agendaDetails->duration = $this->getAgendaBlockPropertyValue($scheduleSlotOrigin->duration);
        $agendaDetails->weekday = $this->getWeekdayNumericRepresentation($this->getAgendaBlockPropertyValue($scheduleSlotOrigin->weekdays));
        $agendaDetails->slotCountPropertyId = $scheduleSlotOrigin->slot_count;

        return $agendaDetails;
    }

    private function getAgendaEntity($scheduleSlotOrigin)
    {
        return Entity::where([
            'ent_type_id' => $scheduleSlotOrigin->startDate->ent_type_id,
        ])->whereHas('transaction', function ($transaction) {
            $transaction->where('process_id', $this->globalVariables->processId);
        })->whereNull('deleted_at')->first();
    }

    private function getAgendaBlockPropertyValue($propertyId)
    {
        $valueRecord = Value::where([
            'entity_id' => $this->agendaEntityId,
            'property_id' => $propertyId
        ])->whereNull('deleted_at')->first();

        $propertyInfo = Property::find($propertyId);

        // If the property has an 'enum' value type, get that propAllowedValueName - for the "Weekdays" property
        return $propertyInfo->value_type === 'enum' ? $this->getMultilingualConceptName('prop_allowed_value_name',
            'name', 'p_a_v_id', $valueRecord->value, $this->globalVariables->langId) : $valueRecord->value;
    }

    private function getSlotResultProperties($actionId)
    {
        return ScheduleSlotResult::where('action_id', $actionId)
            ->whereNull('deleted_at')->first();
    }

    private function getWeekdayNumericRepresentation($weekday)
    {
        switch ($weekday) {
            case 'Monday':
            case 'Segunda-feira':
                return 'Monday';
            case 'Tuesday':
            case 'Terça-feira':
                return 'Tuesday';
            case 'Wednesday':
            case 'Quarta-feira':
                return 'Wednesday';
            case 'Thursday':
            case 'Quinta-feira':
                return 'Thursday';
            case 'Friday':
            case 'Sexta-feira':
                return 'Friday';
            case 'Saturday':
            case 'Sábado':
                return 'Saturday';
            case 'Sunday':
            case 'Domingo':
                return 'Sunday';
            default:
                return null;
        }
    }

    private function createScheduleSlots($agendaDetails, $slotResultProperties)
    {
        // To keep count of how many slots are being created for this agenda block
        $agendaSlotCount = 0;

        while ($agendaDetails->startDateTime <= $agendaDetails->endDateTime) {

            // Check if the current weekday of startDateTime is the same as the 'weekday' where we want to create slots
            // Is used for the first interaction of this cycle, as the startDate may be, for example, on a Monday and we want slots for Tuesday.
            if ($agendaDetails->startDateTime->format('l') === $agendaDetails->weekday) {

                // The start and end dateTime for this specific days in which we're creating slots
                $dailyStartDateTime = clone $agendaDetails->startDateTime;
                $dailyEndDateTime = (clone $agendaDetails->startDateTime)->modify($agendaDetails->endTime);
                // To keep track of the daily slot number (which will be saved on the 'slot' entity)
                $dailySlotNumber = 1;

                // Create slots within this day until the end time is reached
                while ($dailyStartDateTime < $dailyEndDateTime) {
                    // The start and end (start + duration) dateTime for the specific slot being created
                    $slotStartDateTime = clone $dailyStartDateTime;
                    $slotEndDateTime = (clone $slotStartDateTime)->modify("+{$agendaDetails->duration} minutes");

                    // If by adding the duration of the slot, we surpassed the dailyEndDateTime, don't create a slot
                    if ($slotEndDateTime > $dailyEndDateTime) {
                        break;
                    }

                    // Create a slot for this agenda block based on the slot's startDateTime, endDateTime and slotNumber
                    $this->createSlot($slotResultProperties, $slotStartDateTime, $slotEndDateTime, $dailySlotNumber);

                    // Move to the next slot
                    $dailyStartDateTime = $slotEndDateTime;
                    ++$dailySlotNumber;
                    ++$agendaSlotCount;
                }

            }

            // Passing to the next day available of the agenda block's weekday specified (ex: next Tuesday)
            $agendaDetails->startDateTime = $agendaDetails->startDateTime->modify('next ' . $agendaDetails->weekday);
            $agendaDetails->startDateTime = $agendaDetails->startDateTime->modify($agendaDetails->startTime);
        }

        // Save the agenda block's total slotCount
        $this->createValueRecord($this->agendaEntityId, $agendaDetails->slotCountPropertyId, $agendaSlotCount);
    }

    private function createSlot($slotResult, $slotStart, $slotEnd, $dailySlotNumber)
    {
        // Creates a slot entity int this transaction to store all the slot's property values
        $slotEntityId = $this->createSlotEntity($slotResult->scheduleReference->ent_type_id)->id;

        // Create the property value of the slot's agenda block reference
        // (checks if this property in the slot entity refers an agenda block specific property or the overall entity)
        $this->createSlotScheduleReferenceProperty($slotEntityId, $slotResult->scheduleReference, $this->agendaEntityId);
        // Create the propertyValues for the day, startTime, endTime and dailySlotNumber properties
        $this->createValueRecord($slotEntityId, $slotResult->slot_number, $dailySlotNumber);
        $this->createValueRecord($slotEntityId, $slotResult->day, $slotStart->format('Y/m/d'));
        $this->createValueRecord($slotEntityId, $slotResult->start_time, $slotStart->format('H:i'));
        $this->createValueRecord($slotEntityId, $slotResult->end_time, $slotEnd->format('H:i'));

        // If there are additional properties specified for this slots' creation, also save their assigned value
        $slotAdditionalProperties = ScheduleSlotResultAdditionalProperty::where('schedule_slot_result_id', $slotResult->id)
            ->whereNull('deleted_at')->get();
        foreach ($slotAdditionalProperties as $slotAdditionalProperty) {
            $this->createValueRecord($slotEntityId, $slotAdditionalProperty->property_id,
                $this->termsExecutionHelper->analyzeTerm($slotAdditionalProperty->term_id));
        }
    }

    private function createSlotEntity($entTypeId)
    {
        // Get the entType, so we know the value of the 'last_internal_id'
        $entType = EntType::where('id', $entTypeId)
            ->whereNull('deleted_at')->first();
        // Create the entity that will be associated to the property
        $entity = Entity::create([
            'internal_id' => $entType->last_internal_id + 1,
            'ent_type_id' => $entType->id,
            'state' => 'active',
            'transaction_id' => $this->globalVariables->transactionId,
            'updated_by' => $this->globalVariables->userId
        ]);
        // Update the last_internal_id of the corresponding entType
        $entType->update([
            'last_internal_id' => $entity->internal_id,
            'updated_by' => $this->globalVariables->userId
        ]);
        return $entity;
    }

    private function createValueRecord($entityId, $propertyId, $value)
    {
        Value::create([
            'entity_id' => $entityId,
            'property_id' => $propertyId,
            'value' => $value,
            'state' => 'active',
            'updated_by' => $this->globalVariables->userId
        ]);
    }

    private function createSlotScheduleReferenceProperty($slotEntityId, $scheduleReferenceProperty, $scheduleReferenceEntityId)
    {
        // Check if the schedule reference property in the slot entity refers a specific property or the overall entity
        if ($scheduleReferenceProperty->fk_property_id) {
            $value = Value::where([
                'entity_id' => $scheduleReferenceEntityId,
                'property_id' => $scheduleReferenceProperty->fk_property_id
            ])->whereNull('deleted_at')->first()->id;
        } else {
            $value = $scheduleReferenceEntityId;
        }
        // Saves the slot's schedule reference property value
        $this->createValueRecord($slotEntityId, $scheduleReferenceProperty->id, $value);
    }
}
