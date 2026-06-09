<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use App\Http\Resources\LanguageResource;
use App\Http\Traits\HTTPResponseTrait;
use App\Language;
use DB;
use Illuminate\Http\Request;
use Log;


class LanguageController extends Controller
{
    use HTTPResponseTrait;

    public function index(Request $request)
    {
        $languages = Language::whereNull('deleted_at')->get();

        return LanguageResource::collection($languages);
    }

    public function show(Request $request, $languageId)
    {
        $language = Language::find($languageId);

        return new LanguageResource($language);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {
            $language = Language::create([
                'name' => $request->input('name'),
                'abbrv' => $request->input('abbrv'),
                'state' => $request->input('state'),
                'updated_by' => $userId
            ]);
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

    public function update(Request $request, $languageId)
    {
        $userId = $request->user()->id;
        $language = Language::find($languageId);

        DB::beginTransaction();
        try {
            $language->update([
                'name' => $request->input('name'),
                'abbrv' => $request->input('abbrv'),
                'state' => $request->input('state'),
                'updated_by' => $userId
            ]);
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

    public function destroy(Request $request, $languageId)
    {
        $userId = $request->user()->id;

        $language = Language::find($languageId);

        DB::beginTransaction();
        try {
            $language->update([
                'deleted_by' => $userId
            ]);
            $language->delete();

            DB::commit();
            $success = true;
        } catch (\Exception $e) {
            $success = false;
            DB::rollback();
            Log::debug($e);
        }

        return (string) $success;
    }
}
