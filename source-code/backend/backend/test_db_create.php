<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Testing database creation...\n";

try {
    $testDbName = 'pos_test_create_' . time();
    DB::statement("CREATE DATABASE IF NOT EXISTS `{$testDbName}`");
    echo "SUCCESS: Created database {$testDbName}\n";
    
    DB::statement("DROP DATABASE IF EXISTS `{$testDbName}`");
    echo "SUCCESS: Dropped database {$testDbName}\n";
    
    echo "\n✓ Database user CAN create databases!\n";
} catch (\Exception $e) {
    echo "FAILED: " . $e->getMessage() . "\n";
}
