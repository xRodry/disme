<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;
use Request;
use Response;
use DB;

class EnumController extends Controller
{

    public function indexEnumValues(Request $request, string $table = null, string $column = null){

        if(!\Schema::hasTable($table) && !in_array($column, \Schema::getColumnListing($table)))
            return Response::json('The selected table & column does not exist', 500);

        //Now we can use the query parameters even though they were hackishly being passed around as form data in IndexEnumValuesRequest
        $ret = $this->getPossibleEnumValues($table, $column);

        return Response::json($ret, 200);

    }

    public function getPossibleEnumValues($table, $column) {

        // Pulls column string from DB
        $enumStr = DB::select(DB::raw('SHOW COLUMNS FROM ' . $table . ' WHERE Field = "' . $column . '"'))[0]->Type;

        // Parse string
        preg_match_all("/'([^']+)'/", $enumStr, $matches);

        // Return matches
        return isset($matches[1]) ? $matches[1] : [];
    }

}
