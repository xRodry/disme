<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $tStateExecuted = App\TState::where('abbrv', 'ex')->first();
    $tStateExecutedId = $tStateExecuted ? $tStateExecuted->id : 3;
    echo "TState ID: " . $tStateExecutedId . "\n";

    $causingTxTypeId = 1; // Assuming 1 exists

    $actionRule = App\ActionRule::firstOrCreate(
        [
            'transaction_type_id' => $causingTxTypeId,
            't_state_id' => $tStateExecutedId,
            'type' => 'act'
        ],
        [
            'blockly_xml' => '',
            'blockly_code' => '',
            'preview' => ''
        ]
    );

    echo "ActionRule ID: " . $actionRule->id . "\n";
    
    $action = App\Action::firstOrCreate(
        [
            'diagram_id' => 'test_cl_123',
            'type' => 'causal_link',
            'action_rule_id' => $actionRule->id
        ],
        []
    );

    echo "Action ID: " . $action->id . "\n";
    
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
