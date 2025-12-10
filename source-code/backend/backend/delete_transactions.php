<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// Delete all sale transactions with creditId=4
$deleted = DB::table('transaction')
    ->where('type', 'sale')
    ->where('creditId', 4)
    ->delete();

echo "Deleted {$deleted} sale payment transactions.\n";

// Verify
$remaining = DB::table('transaction')
    ->where('type', 'sale')
    ->where('creditId', 4)
    ->sum('amount');
echo "Remaining total: {$remaining}\n";
