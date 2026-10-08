<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$names = \DB::table('transaction_type_name')->whereIn('transaction_type_id', [24,25,45,46])->get();
foreach($names as $n) {
    echo "TT_ID: {$n->transaction_type_id}, Lang: {$n->language_id}, t_name: '{$n->t_name}'\n";
}
