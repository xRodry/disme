<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\User::first();
Auth::login($user);

// Initial State
$initialActionRulesCount = App\ActionRule::count();
$initialActionsCount = App\Action::count();

echo "Initial ActionRules count: " . $initialActionRulesCount . "\n";
echo "Initial Actions count: " . $initialActionsCount . "\n";

// TEST 1: Create first causal link
echo "\n--- TEST 1: First Causal Link ---\n";
$request1 = Illuminate\Http\Request::create('/api/processDiagram/bulkSave', 'POST', [
    'processDiagramId' => 999,
    'processTypeId' => 999,
    'transactionTypes' => [
        [
            'diagram_id' => 'txA',
            'language_id' => 1,
            't_name' => 'Tx A',
            'state' => 'active',
            'process_type_id' => 999,
            'init_proc' => 1,
            'end_proc' => 0,
            'executer_role_id' => 1,
            'own_user_access_only' => 0,
            'auto_activate' => 0
        ],
        [
            'diagram_id' => 'txB',
            'language_id' => 1,
            't_name' => 'Tx B',
            'state' => 'active',
            'process_type_id' => 999,
            'init_proc' => 0,
            'end_proc' => 1,
            'executer_role_id' => 1,
            'own_user_access_only' => 0,
            'auto_activate' => 0
        ]
    ],
    'waitingLinks' => [],
    'actionRules' => [],
    'actions' => [],
    'causalLinks' => [
        [
            'diagram_id' => 'cl1',
            'causing_transaction_type_id' => 'txA',
            'caused_transaction_type_id' => 'txB',
            'caused_t_state_id' => 1,
            'min' => '1',
            'max' => '1',
            'cancel_proc' => 0,
            'continue_if_same_user' => 0
        ]
    ]
]);

$controller = new App\Http\Controllers\ProcessDiagramController();
$response1 = $controller->bulkSave($request1);

echo "Response 1 Status: " . $response1->getStatusCode() . "\n";
echo "Response 1 Content:\n";
echo $response1->getContent() . "\n";

$middleActionRulesCount = App\ActionRule::count();
$middleActionsCount = App\Action::count();
echo "ActionRules increment: " . ($middleActionRulesCount - $initialActionRulesCount) . "\n";
echo "Actions increment: " . ($middleActionsCount - $initialActionsCount) . "\n";

// TEST 2: Create second causal link from the same causing transaction type
echo "\n--- TEST 2: Second Causal Link ---\n";
$request2 = Illuminate\Http\Request::create('/api/processDiagram/bulkSave', 'POST', [
    'processDiagramId' => 999,
    'processTypeId' => 999,
    'transactionTypes' => [
        [
            'diagram_id' => 'txA',
            'language_id' => 1,
            't_name' => 'Tx A',
            'state' => 'active',
            'process_type_id' => 999,
            'init_proc' => 1,
            'end_proc' => 0,
            'executer_role_id' => 1,
            'own_user_access_only' => 0,
            'auto_activate' => 0
        ],
        [
            'diagram_id' => 'txB',
            'language_id' => 1,
            't_name' => 'Tx B',
            'state' => 'active',
            'process_type_id' => 999,
            'init_proc' => 0,
            'end_proc' => 1,
            'executer_role_id' => 1,
            'own_user_access_only' => 0,
            'auto_activate' => 0
        ],
        [
            'diagram_id' => 'txC',
            'language_id' => 1,
            't_name' => 'Tx C',
            'state' => 'active',
            'process_type_id' => 999,
            'init_proc' => 0,
            'end_proc' => 1,
            'executer_role_id' => 1,
            'own_user_access_only' => 0,
            'auto_activate' => 0
        ]
    ],
    'waitingLinks' => [],
    'actionRules' => [],
    'actions' => [],
    'causalLinks' => [
        [
            'diagram_id' => 'cl1',
            'causing_transaction_type_id' => 'txA',
            'caused_transaction_type_id' => 'txB',
            'caused_t_state_id' => 1,
            'min' => '1',
            'max' => '1',
            'cancel_proc' => 0,
            'continue_if_same_user' => 0
        ],
        [
            'diagram_id' => 'cl2',
            'causing_transaction_type_id' => 'txA',
            'caused_transaction_type_id' => 'txC',
            'caused_t_state_id' => 1,
            'min' => '1',
            'max' => '1',
            'cancel_proc' => 0,
            'continue_if_same_user' => 0
        ]
    ]
]);

$response2 = $controller->bulkSave($request2);

echo "Response 2 Status: " . $response2->getStatusCode() . "\n";
echo "Response 2 Content:\n";
echo $response2->getContent() . "\n";

$finalActionRulesCount = App\ActionRule::count();
$finalActionsCount = App\Action::count();
echo "ActionRules increment from Test 2: " . ($finalActionRulesCount - $middleActionRulesCount) . "\n";
echo "Actions increment from Test 2: " . ($finalActionsCount - $middleActionsCount) . "\n";

// TEST 3: Check Blockly Controller output
echo "\n--- TEST 3: Check Blockly Controller Output ---\n";
$blocklyController = new App\Http\Controllers\BlocklyController();
$requestBlockly = Illuminate\Http\Request::create('/api/blockly/get_action_rules', 'GET');
$requestBlockly->setUserResolver(function () use ($user) {
    return $user;
});
$blocklyResponse = $blocklyController->getActionRules($requestBlockly);

$blocklyRules = json_decode($blocklyResponse->toJson(), true);
$foundEmptyXml = false;
foreach ($blocklyRules as $rule) {
    if ($rule['blockly_xml'] === null || $rule['blockly_xml'] === '') {
        $foundEmptyXml = true;
        break;
    }
}
echo "Found ActionRule with empty/null XML in Blockly list: " . ($foundEmptyXml ? "YES" : "NO") . "\n";

// Dump latest actions to verify they belong to same rule
$txA = App\TransactionType::where('diagram_id', 'txA')->first();
$ar = App\ActionRule::where('transaction_type_id', $txA->id)->first();
echo "\nLatest ActionRule for Tx A: ID=" . $ar->id . "\n";
$acts = App\Action::where('action_rule_id', $ar->id)->get();
echo "Actions for this ActionRule:\n";
foreach ($acts as $act) {
    echo "- Action ID: " . $act->id . ", Type: " . $act->type . ", Diagram ID: " . $act->diagram_id . "\n";
}
