<?php

namespace App\Http\Controllers;

use App\EditorDiagram;
use App\Http\Traits\HTTPResponseTrait;
use Illuminate\Http\Request;
use App\Http\Resources\EditorDiagramResource;
use DB;
use Log;
class EditorDiagramController extends Controller
{
    use HTTPResponseTrait;

    public function index()
    {
        $editors = \App\EditorDiagram::whereNull('deleted_at')->get()->map(function($d) {
            $d->type = 'editor';
            return $d;
        });

        $facts = \App\FactDiagram::whereNull('deleted_at')->get()->map(function($d) {
            $d->type = 'fact';
            return $d;
        });

        $processes = \App\ProcessDiagram::whereNull('deleted_at')->get()->map(function($d) {
            $d->type = 'process';
            return $d;
        });

        $merged = $editors->concat($facts)->concat($processes);

        return response()->json($merged, 200);
    }

    public function show(Request $request, $id)
    {
        $type = $request->get('type', 'editor');

        if ($type === 'fact') {
            $diagram = \App\FactDiagram::findOrFail($id);
        } else if ($type === 'process') {
            $diagram = \App\ProcessDiagram::findOrFail($id);
        } else {
            $diagram = \App\EditorDiagram::findOrFail($id);
        }

        $diagram->type = $type;

        return response()->json($diagram, 200);
    }

    public function storeOrUpdate(Request $request)
    {
        if ($request->isJson()) {
            $data = $request->json()->all();
        } else {
            $data = json_decode($request->getContent(), true) ?? [];
        }

        if (!empty($data)) {
            $request->merge($data);
        }

        DB::beginTransaction();

        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'XML'  => 'required|string',
                'id'   => 'nullable|integer|exists:editor_diagram,id', // Add validation for ID
            ]);

            $id = $request->input('id');
            $name = $request->input('name');

            $existsQuery = EditorDiagram::where('name', $name);
            if ($id) {
                $existsQuery->where('id', '!=', $id);
            }

            if ($existsQuery->exists()) {
                return response()->json([
                    'success' => false,
                    'error' => 'A diagram with this name already exists.'
                ], 409);
            }

            // Use ID for updates if provided, otherwise create new
            if ($request->has('id') && $request->input('id')) {
                // Update existing diagram
                $diagram = EditorDiagram::find($request->input('id'));
                if ($diagram) {
                    $diagram->update([
                        'name' => $request->input('name'),
                        'description' => $request->input('description'),
                        'XML' => $request->input('XML'),
                    ]);
                } else {
                    // Fallback: create new if ID not found
                    $diagram = EditorDiagram::create([
                        'name' => $request->input('name'),
                        'description' => $request->input('description'),
                        'XML' => $request->input('XML'),
                    ]);
                }
            } else {
                // Create new diagram
                $diagram = EditorDiagram::create([
                    'name' => $request->input('name'),
                    'description' => $request->input('description'),
                    'XML' => $request->input('XML'),
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'id' => $diagram->id,
                'message' => 'Saved successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error($e);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

}
