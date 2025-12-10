<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// List all stores
echo "=== All Stores ===\n";
$stores = DB::table('store')->get();
foreach ($stores as $store) {
    echo "ID: {$store->id}, Name: {$store->name}, isMainStore: {$store->isMainStore}\n";
}

// Check transactions with type='sale' and creditId=4 (the ₱2,001)
echo "\n=== Sale Transactions (creditId=4) ===\n";
$transactions = DB::table('transaction')
    ->where('type', 'sale')
    ->where('creditId', 4)
    ->get();

foreach ($transactions as $t) {
    echo "ID: {$t->id}, Amount: {$t->amount}, storeId: " . ($t->storeId ?? 'NULL') . "\n";
}

$total = DB::table('transaction')
    ->where('type', 'sale')
    ->where('creditId', 4)
    ->sum('amount');
echo "\nTotal: {$total}\n";

// Ask for confirmation
echo "\n=== DELETE these transactions? (y/n): ===\n";
