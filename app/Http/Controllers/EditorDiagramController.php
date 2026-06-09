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
        return response()->json(
            EditorDiagram::whereNull('deleted_at')->get(),
            200
        );
    }

    public function show($id)
    {
        $diagram = EditorDiagram::findOrFail($id);

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
