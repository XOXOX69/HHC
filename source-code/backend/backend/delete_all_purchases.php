<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Starting to delete all purchase data (total purchase and purchase due)...\n\n";

// Disable foreign key checks temporarily
DB::statement('SET FOREIGN_KEY_CHECKS=0');

// 1. Delete return purchase invoice products
$returnPurchaseInvoiceProducts = DB::table('returnPurchaseInvoiceProduct')->count();
DB::table('returnPurchaseInvoiceProduct')->delete();
echo "Deleted {$returnPurchaseInvoiceProducts} return purchase invoice products.\n";

// 2. Delete return purchase invoices
$returnPurchaseInvoices = DB::table('returnPurchaseInvoice')->count();
DB::table('returnPurchaseInvoice')->delete();
echo "Deleted {$returnPurchaseInvoices} return purchase invoices.\n";

// 3. Delete purchase invoice products
$purchaseInvoiceProducts = DB::table('purchaseInvoiceProduct')->count();
DB::table('purchaseInvoiceProduct')->delete();
echo "Deleted {$purchaseInvoiceProducts} purchase invoice products.\n";

// 4. Delete purchase invoices
$purchaseInvoices = DB::table('purchaseInvoice')->count();
DB::table('purchaseInvoice')->delete();
echo "Deleted {$purchaseInvoices} purchase invoices.\n";

// 5. Delete purchase reorder invoices (if exists)
try {
    $purchaseReorderInvoices = DB::table('purchaseReorderInvoice')->count();
    DB::table('purchaseReorderInvoice')->delete();
    echo "Deleted {$purchaseReorderInvoices} purchase reorder invoices.\n";
} catch (Exception $e) {
    echo "No purchase reorder invoices table found or already empty.\n";
}

// 6. Delete purchase-related transactions
$purchaseTransactions = DB::table('transaction')->where('type', 'purchase')->count();
DB::table('transaction')->where('type', 'purchase')->delete();
echo "Deleted {$purchaseTransactions} purchase transactions.\n";

// Re-enable foreign key checks
DB::statement('SET FOREIGN_KEY_CHECKS=1');

echo "\n=== Summary ===\n";
echo "All purchase data (total purchase and purchase due) has been deleted successfully!\n";

// Verify remaining counts
echo "\nVerification - Remaining records:\n";
echo "purchaseInvoice: " . DB::table('purchaseInvoice')->count() . "\n";
echo "purchaseInvoiceProduct: " . DB::table('purchaseInvoiceProduct')->count() . "\n";
echo "returnPurchaseInvoice: " . DB::table('returnPurchaseInvoice')->count() . "\n";
echo "returnPurchaseInvoiceProduct: " . DB::table('returnPurchaseInvoiceProduct')->count() . "\n";
echo "Purchase transactions: " . DB::table('transaction')->where('type', 'purchase')->count() . "\n";
