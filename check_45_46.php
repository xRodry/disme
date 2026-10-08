<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tt45 = App\TransactionType::find(45);
$tt46 = App\TransactionType::find(46);

echo "ID 45 (op): init_proc=" . $tt45->init_proc . ", end_proc=" . $tt45->end_proc . ", interm_task=" . $tt45->interm_task . "\n";
echo "ID 46 (second): init_proc=" . $tt46->init_proc . ", end_proc=" . $tt46->end_proc . ", interm_task=" . $tt46->interm_task . "\n";
