<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$user = App\User::first();
Auth::login($user);
$req = Illuminate\Http\Request::create('/api/blockly/get_action_rules', 'GET');
$req->setUserResolver(function() use ($user) { return $user; });
try {
    $res = $kernel->handle($req);
    echo $res->getContent();
} catch (\Throwable $e) {
    echo $e->getMessage() . "\n" . $e->getTraceAsString();
}
