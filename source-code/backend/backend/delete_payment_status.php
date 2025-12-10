<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Starting to delete all payment status records from all branches...\n";

// Get count before deletion
$totalBefore = DB::table('manualPayment')->count();
echo "Total manual payment records before deletion: {$totalBefore}\n";

// Delete all manual payment records (from all branches - main and individual)
$deleted = DB::table('manualPayment')->delete();

echo "Deleted {$deleted} payment status records from all branches (main and individual).\n";

// Verify deletion
$remaining = DB::table('manualPayment')->count();
echo "Remaining payment status records: {$remaining}\n";

echo "\nPayment status deletion completed successfully!\n";
