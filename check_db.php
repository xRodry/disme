<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$tts = App\TransactionType::orderBy('id', 'desc')->take(10)->get();
foreach($tts as $t) {
    echo "ID: {$t->id}, Process: {$t->process_type_id}, diagram_id: {$t->diagram_id}\n";
}
