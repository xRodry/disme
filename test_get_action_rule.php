<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$controller = new \App\Http\Controllers\BlocklyController();
$request = Illuminate\Http\Request::create('/api/blockly/get_action_rule/8', 'GET');
$user = App\User::first();
$request->setUserResolver(function() use ($user) { return $user; });

try {
    $res = $controller->getActionRule($request, 8);
    echo json_encode($res);
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
