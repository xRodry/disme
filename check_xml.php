<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$diagram = App\ProcessDiagram::where('process_type_id', 11)->first();
echo $diagram->XML;
