<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

/**
 * Created by PhpStorm.
 * User: ASUS
 * Date: 03/07/2018
 * Time: 15:42
 */

namespace App\Http\Traits;

trait OutputTypeResponseTrait
{
    public function outputDataType($typeOutput = 'default', $data) {
        switch ($typeOutput) {
            case 'JSON': //output por defeito
                //return $data->toJson();
                return response()->json($data);
                break;
            default:
                return $data;
                break;
        }
    }
}
