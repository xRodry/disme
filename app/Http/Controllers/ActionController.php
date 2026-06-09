<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Action;
use App\Http\Resources\ActionResource;
use App\Http\Traits\GetMultilingualConceptName;
use Illuminate\Http\Request;

class ActionController extends Controller
{
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $actions = Action::whereNull('deleted_at')->get();

        foreach ($actions as $action) {
            $action->name = $this->getMultilingualConceptName('action_text', 'name', 'action_id',
                $action->id, $userLangId);
        }

        return ActionResource::collection($actions);
    }

    public function getActionsWithFormFacts(Request $request, $deletedActionRule)
    {
        $userLangId = $request->user()->language_id;

        $queryStart = $deletedActionRule ? Action::withTrashed() : Action::withoutTrashed();
        // Get actions with property/entity specifications (that require forms)
        $actions = $queryStart->where(function ($relations) {
            $relations->whereHas('actionProps')->orWhereHas('entitySpecifications');
        })->get();

        foreach ($actions as $action) {
            $action->isEntitySpecificationAction = $action->entitySpecifications()->exists();
            $action->name = $this->getMultilingualConceptName('action_text', 'name', 'action_id', $action->id, $userLangId);
        }

        return ActionResource::collection($actions);
    }
}
