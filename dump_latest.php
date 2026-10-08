<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $actionRules = App\ActionRule::orderBy('id', 'desc')->take(5)->get();
    echo "Latest 5 Action Rules:\n";
    foreach ($actionRules as $ar) {
        echo "- ID: {$ar->id}, TxID: {$ar->transaction_type_id}, State: {$ar->t_state_id}, Type: {$ar->type}, XML: '" . substr($ar->blockly_xml, 0, 20) . "', created: {$ar->created_at}\n";
    }

    $actions = App\Action::orderBy('id', 'desc')->take(5)->get();
    echo "\nLatest 5 Actions:\n";
    foreach ($actions as $a) {
        echo "- ID: {$a->id}, RuleID: {$a->action_rule_id}, Type: {$a->type}, created: {$a->created_at}\n";
    }

    $causalLinks = App\CausalLink::orderBy('id', 'desc')->take(5)->get();
    echo "\nLatest 5 Causal Links:\n";
    foreach ($causalLinks as $cl) {
        echo "- ID: {$cl->id}, DiagramID: {$cl->diagram_id}, CausingAction: {$cl->causing_action}, CausedTx: {$cl->caused_transaction_type_id}, created: {$cl->created_at}\n";
    }
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
