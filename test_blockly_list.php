<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$user = App\User::first();
Auth::login($user);
$req = Illuminate\Http\Request::create('/api/blockly/get_action_rules', 'GET');
$req->setUserResolver(function() use ($user) { return $user; });
$ctrl = new App\Http\Controllers\BlocklyController();
try {
    $res = $ctrl->getActionRules($req);
    // Since getActionRules returns an AnonymousResourceCollection, we can just json encode it
    echo json_encode($res);
    echo "\nSUCCESS\n";
} catch (\Throwable $e) {
    echo "ERROR:\n";
    echo $e->getMessage() . "\n" . $e->getTraceAsString();
}
