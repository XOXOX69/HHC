<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// Delete all transactions that belong to individual branches (storeId != 1) or have no storeId
$deleted = DB::table('transaction')
    ->where(function($query) {
        $query->where('storeId', '!=', 1)
              ->orWhereNull('storeId');
    })
    ->delete();

echo "Deleted {$deleted} transactions from individual branches.\n";

// Check remaining
$remaining = DB::table('transaction')->count();
echo "Remaining transactions: {$remaining}\n";
