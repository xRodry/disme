<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS
    |--------------------------------------------------------------------------
    |
    | allowedOrigins, allowedHeaders and allowedMethods can be set to array('*')
    | to accept any value.
    |
    */

    'supportsCredentials' => false,
    'allowedOrigins' => ['*'],
    'allowedOriginsPatterns' => [],
    'allowedHeaders' => ['*'],
    'allowedMethods' => ['*'],
    'exposedHeaders' => [],
    'maxAge' => 0,

//    'supportsCredentials' => false,
//    'allowedOrigins' => ['*'],
//    'allowedHeaders' => ['Content-Type', 'X-Requested-With'],
//    'allowedMethods' => ['*'], // ex: ['GET', 'POST', 'PUT',  'DELETE']
//    'exposedHeaders' => [],
//    'maxAge' => 0,

];
