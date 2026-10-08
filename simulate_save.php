<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$processTypeId = 999;
$diagramId = 'test-dup-1';

for ($i=0; $i<2; $i++) {
    echo "Save iteration: $i\n";
    $transactionType = App\TransactionType::where('process_type_id', $processTypeId)
        ->where('diagram_id', $diagramId)
        ->first();

    if ($transactionType) {
        echo "Found! Updating...\n";
        $transactionType->update(['state' => 'active']);
    } else {
        echo "Not found! Creating...\n";
        App\TransactionType::create([
            'process_type_id' => $processTypeId,
            'diagram_id' => $diagramId,
            'state' => 'active',
            'init_proc' => 0,
            'end_proc' => 0,
            'executer_role_id' => 1,
            'own_user_access_only' => 0,
            'auto_activate' => 0,
        ]);
    }
}
