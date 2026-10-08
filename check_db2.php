<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$tts = App\TransactionType::orderBy('id', 'desc')->take(10)->get();
foreach($tts as $t) {
    $type = gettype($t->diagram_id);
    echo "ID: {$t->id}, diagram_id type: {$type}, value: '{$t->diagram_id}'\n";
}
