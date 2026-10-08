<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = Illuminate\Http\Request::create('/api/processDiagram/bulkSave', 'POST', [
    'processDiagramId' => 1,
    'processTypeId' => 1,
    'transactionTypes' => [
        [
            'diagram_id' => 'tx1',
            'language_id' => 1,
            't_name' => 'T1',
            'state' => 'active',
            'process_type_id' => 1,
            'init_proc' => 1,
            'end_proc' => 0,
            'executer_role_id' => 1,
            'own_user_access_only' => 0,
            'auto_activate' => 0
        ],
        [
            'diagram_id' => 'tx2',
            'language_id' => 1,
            't_name' => 'T2',
            'state' => 'active',
            'process_type_id' => 1,
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
            'diagram_id' => 'cl1_test2',
            'causing_transaction_type_id' => 'tx1',
            'caused_transaction_type_id' => 'tx2',
            'caused_t_state_id' => 0, // <--- The culprit
            'min' => '1',
            'max' => '1',
            'cancel_proc' => 0,
            'continue_if_same_user' => 0
        ]
    ]
]);

$controller = new App\Http\Controllers\ProcessDiagramController();
$response = $controller->bulkSave($request);

echo "Response Status: " . $response->getStatusCode() . "\n";
echo "Response Content:\n";
echo $response->getContent();
echo "\n";
