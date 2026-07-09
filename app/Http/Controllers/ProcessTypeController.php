<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\ProcessTypeResource;
use App\Http\Resources\QueryResource;
use App\Http\Traits\GetMultilingualConceptName;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use App\ProcessType;
use App\ProcessTypeName;
use App\Query;
use DB;
use Illuminate\Http\Request;
use Log;

class ProcessTypeController extends Controller
{
    use HTTPResponseTrait;
    use GetMultilingualConceptName;

    public function index(Request $request)
    {
        $userLangId = $request->user()->language_id;

        $processTypes = ProcessType::whereNull('deleted_at')->get();

        foreach($processTypes as $processType) {
            $this->getProcessTypeFKNames($processType, $userLangId);
        }

        return ProcessTypeResource::collection($processTypes);
    }

    public function show(Request $request, $processTypeId)
    {
        $userLangId = $request->user()->language_id;

        $processType = ProcessType::find($processTypeId);
        $this->getProcessTypeFKNames($processType, $userLangId);

      return new ProcessTypeResource($processType);
    }

    private function getProcessTypeFKNames($processType, $userLangId) {
        list($processType->language_id, $processType->name) = $this->getMultilingualConceptName('process_type_name', 'name',
            'process_type_id', $processType->id, $userLangId, true);
        $processType->language_abbrv = Language::find($processType->language_id)->abbrv;
        $processType->id_name = $this->getMultilingualConceptName('process_type_name', 'id_name',
            'process_type_id', $processType->id, $userLangId);
    }

    public function store(Request $request) {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {
            $this->createProcessTypeRecord(
                $request->input('name'),
                $request->input('state'),
                $request->input('color'),
                $langId,
                $userId
            );
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

    public function update(Request $request, $processTypeId)
    {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        $processType = ProcessType::find($processTypeId);

        DB::beginTransaction();
        try {

          $processType->update([
            'state' => $request->input('state'),
            'color' => $request->input('color'),
            'updated_by' => $userId
          ]);

          $query = ['process_type_id' => $processType->id, 'language_id' => $langId];
          $processTypeName = ProcessTypeName::where($query)
              ->whereNull('deleted_at')->first();
          Log::debug($processTypeName);
          if ($processTypeName != null) {
            $processTypeName->update([
                'name' => $request->input('name'),
                'updated_by' => $userId
            ]);
          } else {
              $processTypeName = ProcessTypeName::create([
                  'process_type_id' => $processType->id,
                  'language_id' => $langId,
                  'name' => $request->input('name'),
                  'updated_by' => $userId
              ]);
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

    public function destroy(Request $request, $processTypeId)
    {
        $userId = $request->user()->id;

        $processType = ProcessType::find($processTypeId);

        DB::beginTransaction();
        try {
            $processType->update([
              'deleted_by' => $userId
            ]);
            $processType->delete();

            $processTypeNames = ProcessTypeName::where([
                ['process_type_id',$processType->id]
            ])->whereNull('deleted_at')->get();

            foreach($processTypeNames as $processTypeName) {
                $processTypeName->update([
                    'deleted_by' => $userId
                ]);
                $processTypeName->delete();
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

    public function translate(Request $request) {
        $langId = $request->user()->language_id;
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {
            // Check if there has been a ProcessTypeName for this process type on the user's language that was soft_deleted
            $hasPreviousNameRecord = ProcessTypeName::onlyTrashed()
                ->where([
                    'process_type_id' => $request->input('id'),
                    'language_id' => $langId
                ])->first();
            // In case there was, restore that record and update it, so that it reflects the most recent name inserted
            // [as we can't have another entry in the DB for the same process_type_id & language_id combo]
            if ($hasPreviousNameRecord) {
                $hasPreviousNameRecord->restore();
                $translatedProcessTypeName = $hasPreviousNameRecord->update([
                    'deleted_by' => null,
                    'name' => $request->input('name'),
                    'updated_by' => $userId
                ]);
            } else {
                // If there isn't, create a new record for the inserted name
                $translatedProcessTypeName = ProcessTypeName::create([
                    'process_type_id' => $request->input('id'),
                    'language_id' => $langId,
                    'name' => $request->input('name'),
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

    public function getQueriesOfProcessType(Request $request, $processTypeId)
    {
        $userLangId = $request->user()->language_id;

        // Only get queries that are in the supplied processTypeId and that have no parameters
        $queries = Query::whereHas('baseEntType.transactionType', function($baseEntType) use ($processTypeId) {
            $baseEntType->where('process_type_id', $processTypeId);
        })->whereDoesntHave('queryParams')->whereNull('deleted_at')->get();

        foreach ($queries as $query) {
            $query->name = $this->getMultilingualConceptName('query_name', 'name', 'query_id',
                $query->id, $userLangId);
        }

        return QueryResource::collection($queries);
    }

    public function editorIndex(Request $request)
    {
        $lang = $request->get('lang', 'pt');
        $langMap = ['pt' => 1, 'en' => 2];
        $langId = $langMap[$lang] ?? 1;

        $processTypes = \DB::table('process_type')
            ->join('process_type_name', 'process_type.id', '=', 'process_type_name.process_type_id')
            ->whereNull('process_type.deleted_at')
            ->whereNull('process_type_name.deleted_at')
            ->where('process_type_name.language_id', $langId)
            ->select('process_type.id', 'process_type_name.name')
            ->orderBy('process_type_name.name', 'asc')
            ->get();

        return response()->json($processTypes);
    }

    private function createProcessTypeRecord($name, $state, $color, $langId, $userId)
    {
        if (empty($color)) {
            $color = '#466d52';
        }

        $processType = ProcessType::create([
            'state' => $state,
            'color' => $color,
            'updated_by' => $userId
        ]);

        ProcessTypeName::create([
            'process_type_id' => $processType->id,
            'language_id' => $langId,
            'name' => $name,
            'updated_by' => $userId
        ]);

        return $processType;
    }

    public function editorStore(Request $request)
    {
        try {
            $name = trim($request->input('name'));
            if (!$name) {
                return response()->json(['error' => 'Name is required'], 422);
            }

            $lang = $request->get('lang', 'pt');
            $langMap = ['pt' => 1, 'en' => 2];
            $langId = $langMap[$lang] ?? 1;

            // Check if name already exists
            $existing = \DB::table('process_type_name')
                ->where('name', $name)
                ->where('language_id', $langId)
                ->whereNull('deleted_at')
                ->first();

            if ($existing) {
                return response()->json(['error' => 'nameAlreadyExists'], 409);
            }

            \DB::beginTransaction();

            $userId = $request->user() ? $request->user()->id : 1;

            $processType = $this->createProcessTypeRecord(
                $name,
                $request->input('state', 'inactive'),
                $request->input('color'),
                $langId,
                $userId
            );

            \DB::commit();

            return response()->json([
                'id' => $processType->id,
                'name' => $name
            ]);
        } catch (\Exception $e) {
            \DB::rollback();
            Log::error($e);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'trace' => app()->environment('local') ? $e->getTraceAsString() : null
            ], 500);
        }
    }
}
