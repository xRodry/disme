<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */
use Illuminate\Http\Request;

Route::any('/dynamic/{function}/{test}', 'GeneralController@redirect');

Route::get('/login', function () {
    return response()->file(public_path('/drawioweb/login.html'));
});

//Editor
Route::get('/editor',function() {return response() ->file(public_path('/drawioweb/index.html'));
});
Route::get('/open',function() {return response() ->file(public_path('/drawioweb/open.html'));
});
Route::apiResource('editorDiagram', 'EditorDiagramController');
Route::post('/editorDiagramSave', 'EditorDiagramController@storeOrUpdate');
Route::post('/processDiagram/save', 'ProcessDiagramController@storeOrUpdate');
Route::post('/processDiagram/bulk-save', 'ProcessDiagramController@bulkSave');
Route::get('/processDiagram', 'ProcessDiagramController@index');
Route::post('/factDiagram/save', 'FactDiagramController@storeOrUpdate');
Route::post('/factDiagram/bulk-save', 'FactDiagramController@bulkSave');
Route::get('/factDiagram', 'FactDiagramController@index');
Route::get('/editor/process-types', 'ProcessTypeController@editorIndex');
Route::post('/editor/process-types', 'ProcessTypeController@editorStore');

Route::get('/editor/conceptual-domains', 'ConceptualDomainController@editorIndex');
Route::post('/editor/conceptual-domains', 'ConceptualDomainController@editorStore');

Route::get('/editor/roles', function (Request $request) {

    $lang = $request->get('lang', 'pt');

    $langMap = [
        'pt' => 1,
        'en' => 2
    ];

    $langId = $langMap[$lang] ?? 1;

    return response()->json(
        \DB::table('role')
            ->join('role_name', 'role.id', '=', 'role_name.role_id')
            ->where('role_name.language_id', $langId)
            ->select('role.id', 'role_name.name')
            ->get()
    );
});
Route::post('/editor/roles', function (Request $request) {
    $name = trim($request->input('name'));
    if (!$name) {
        return response()->json(['error' => 'Name is required'], 422);
    }
    
    $lang = $request->get('lang', 'pt');
    $langMap = ['pt' => 1, 'en' => 2];
    $langId = $langMap[$lang] ?? 1;

    // Check if role name already exists
    $existing = \DB::table('role_name')
        ->where('name', $name)
        ->where('language_id', $langId)
        ->first();
        
    if ($existing) {
        return response()->json(['error' => 'roleAlreadyExists'], 409);
    }

    \DB::beginTransaction();
    try {
        $userId = $request->user() ? $request->user()->id : 1;
        
        $roleId = \DB::table('role')->insertGetId([
            'updated_by' => $userId,
            'created_at' => \Carbon\Carbon::now(),
            'updated_at' => \Carbon\Carbon::now()
        ]);
        
        \DB::table('role_name')->insert([
            'role_id' => $roleId,
            'language_id' => $langId,
            'name' => $name,
            'updated_by' => $userId,
            'created_at' => \Carbon\Carbon::now(),
            'updated_at' => \Carbon\Carbon::now()
        ]);
        
        // Associate role with the current user
        \DB::table('role_has_user')->insert([
            'role_id' => $roleId,
            'user_id' => $userId,
            'updated_by' => $userId,
            'created_at' => \Carbon\Carbon::now(),
            'updated_at' => \Carbon\Carbon::now()
        ]);

        // Default role/transaction association
        \DB::table('role_initiates_transaction')->insert([
            'role_id' => $roleId,
            'transaction_type_id' => 1,
            'own_user_access_only' => 0,
            'updated_by' => $userId,
            'created_at' => \Carbon\Carbon::now(),
            'updated_at' => \Carbon\Carbon::now()
        ]);
        
        \DB::commit();
        
        return response()->json([
            'id' => $roleId,
            'name' => $name
        ], 201);
    } catch (\Exception $e) {
        \DB::rollback();
        \Log::error('Error creating role: ' . $e->getMessage());
        return response()->json(['error' => 'errorCreatingRole'], 500);
    }
});
Route::get('/editor/transaction-types', function (Request $request) {

    $lang = $request->get('lang', 'pt');

    $langMap = [
        'pt' => 1,
        'en' => 2
    ];

    $langId = $langMap[$lang] ?? 1;

    $hasLang = \DB::table('transaction_type_name')
        ->where('language_id', $langId)
        ->exists();

    $finalLangId = $hasLang ? $langId : 1;

    return response()->json(
        \DB::table('transaction_type')
            ->join(
                'transaction_type_name',
                'transaction_type.id',
                '=',
                'transaction_type_name.transaction_type_id'
            )
            ->whereNull('transaction_type.deleted_at')
            ->whereNull('transaction_type_name.deleted_at')
            ->where('transaction_type_name.language_id', $finalLangId)
            ->select(
                'transaction_type.id',
                'transaction_type_name.t_name as name'
            )
            ->orderBy('transaction_type_name.t_name', 'asc')
            ->get()
    );
});
Route::get('/editor/entity-types', function (Request $request) {

    $lang = $request->get('lang', 'pt');

    $langMap = [
        'pt' => 1,
        'en' => 2
    ];

    $langId = $langMap[$lang] ?? 1;

    return response()->json(
        \DB::table('ent_type')
            ->join(
                'ent_type_name',
                'ent_type.id',
                '=',
                'ent_type_name.ent_type_id'
            )
            ->whereNull('ent_type.deleted_at')
            ->whereNull('ent_type_name.deleted_at')
            ->where('ent_type_name.language_id', $langId)
            ->select(
                'ent_type.id',
                'ent_type_name.name'
            )
            ->orderBy('ent_type_name.name', 'asc')
            ->get()
    );
});
Route::get('/editor/t-states', function (Request $request) {

    $lang = $request->get('lang', 'pt');

    $langMap = [
        'pt' => 1,
        'en' => 2
    ];

    $langId = $langMap[$lang] ?? 1;

    return response()->json(
        \DB::table('t_state')
            ->join(
                't_state_name',
                't_state.id',
                '=',
                't_state_name.t_state_id'
            )
            ->whereNull('t_state.deleted_at')
            ->whereNull('t_state_name.deleted_at')
            ->where('t_state_name.language_id', $langId)
            ->select(
                't_state.id',
                't_state_name.name'
            )
            ->orderBy('t_state_name.name', 'asc')
            ->get()
    );
});
Route::get('/editor/process-types', function (Request $request) {

    $lang = $request->get('lang', 'pt');

    $langMap = [
        'pt' => 1,
        'en' => 2
    ];

    $langId = $langMap[$lang] ?? 1;

    return response()->json(
        \DB::table('process_type')
            ->join(
                'process_type_name',
                'process_type.id',
                '=',
                'process_type_name.process_type_id'
            )
            ->whereNull('process_type.deleted_at')
            ->whereNull('process_type_name.deleted_at')
            ->where('process_type_name.language_id', $langId)
            ->select(
                'process_type.id',
                'process_type_name.name'
            )
            ->orderBy('process_type_name.name', 'asc')
            ->get()
    );
});


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//
//Route::apiResource('languages', 'LanguageController');
//Route::apiResource('language_states', 'LanguageStateController');

