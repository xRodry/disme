<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function redirect(Request $request, $function, $test)
    {
        switch ($function) {
            case "query":
                $dynSearchController = new DynSearchController();
                return $dynSearchController->executeQuery($request);
            default:
                // file_put_contents( app_path('..\routes\api.php'), "xxxxxxxxxxxxx", FILE_APPEND );
                echo "Endpoint not configured.";
        }
    }
}
