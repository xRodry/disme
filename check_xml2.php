<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$tt45 = App\TransactionType::find(45);
echo "Process Type ID: " . $tt45->process_type_id . "\n";
$diagram = App\ProcessDiagram::where('process_type_id', $tt45->process_type_id)->first();
echo "Diagram ID: " . $diagram->id . "\n";
echo "XML:\n" . $diagram->XML . "\n";
