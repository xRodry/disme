<?php

namespace App\Http\Controllers;

use App\ConceptualDomain;
use App\ConceptualDomainName;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ConceptualDomainController extends Controller
{
    public function editorIndex(Request $request)
    {
        $lang = $request->get('lang', 'pt');
        $langMap = ['pt' => 1, 'en' => 2];
        $langId = $langMap[$lang] ?? 1;

        $conceptualDomains = DB::table('conceptual_domain')
            ->join('conceptual_domain_name', 'conceptual_domain.id', '=', 'conceptual_domain_name.conceptual_domain_id')
            ->where('conceptual_domain_name.language_id', $langId)
            ->whereNull('conceptual_domain.deleted_at')
            ->select('conceptual_domain.id', 'conceptual_domain_name.name')
            ->orderBy('conceptual_domain_name.name', 'asc')
            ->get();

        return response()->json($conceptualDomains);
    }

    private function createConceptualDomainRecord($name, $state, $langId, $userId)
    {
        $conceptualDomain = ConceptualDomain::create([
            'state' => $state,
            'updated_by' => $userId
        ]);

        ConceptualDomainName::create([
            'conceptual_domain_id' => $conceptualDomain->id,
            'language_id' => $langId,
            'name' => $name,
            'updated_by' => $userId
        ]);

        return $conceptualDomain;
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

            $existing = DB::table('conceptual_domain_name')
                ->where('name', $name)
                ->where('language_id', $langId)
                ->whereNull('deleted_at')
                ->first();

            if ($existing) {
                return response()->json(['error' => 'nameAlreadyExists'], 409);
            }

            DB::beginTransaction();

            $userId = $request->user() ? $request->user()->id : 1;

            $conceptualDomain = $this->createConceptualDomainRecord(
                $name,
                $request->input('state', 'inactive'),
                $langId,
                $userId
            );

            DB::commit();

            return response()->json([
                'id' => $conceptualDomain->id,
                'name' => $name
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error($e);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'trace' => app()->environment('local') ? $e->getTraceAsString() : null
            ], 500);
        }
    }
}
