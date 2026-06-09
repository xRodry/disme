<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Traits;

use DB;

trait EnumField
{
    /**
     * Retrieves the acceptable enum fields for a column
     *
     * @param string $table Table name
     *
     * @param string $column Column name
     *
     * @return array
     */
    public static function getPossibleEnumValues ($table, $column): array
    {
        $arr = DB::select(DB::raw('SHOW COLUMNS FROM '.$table.' WHERE Field = "'.$column.'"'));
        if (count($arr) == 0){
            return array();
        }
        // Pulls column string from DB
        $enumStr = $arr[0]->Type;

        // Parse string
        preg_match_all("/'([^']+)'/", $enumStr, $matches);

        // Return matches
        return $matches[1] ?? [];
    }
}
