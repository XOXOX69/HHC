<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Starting to delete all sales data...\n\n";

// Disable foreign key checks temporarily
DB::statement('SET FOREIGN_KEY_CHECKS=0');

// 1. Delete return sale invoice products
$returnSaleInvoiceProducts = DB::table('returnSaleInvoiceProduct')->count();
DB::table('returnSaleInvoiceProduct')->delete();
echo "Deleted {$returnSaleInvoiceProducts} return sale invoice products.\n";

// 2. Delete return sale invoices
$returnSaleInvoices = DB::table('returnSaleInvoice')->count();
DB::table('returnSaleInvoice')->delete();
echo "Deleted {$returnSaleInvoices} return sale invoices.\n";

// 3. Delete sale invoice VAT
$saleInvoiceVat = DB::table('saleInvoiceVat')->count();
DB::table('saleInvoiceVat')->delete();
echo "Deleted {$saleInvoiceVat} sale invoice VAT records.\n";

// 4. Delete sale invoice products
$saleInvoiceProducts = DB::table('saleInvoiceProduct')->count();
DB::table('saleInvoiceProduct')->delete();
echo "Deleted {$saleInvoiceProducts} sale invoice products.\n";

// 5. Delete sale invoices
$saleInvoices = DB::table('saleInvoice')->count();
DB::table('saleInvoice')->delete();
echo "Deleted {$saleInvoices} sale invoices.\n";

// 6. Delete sale-related transactions
$saleTransactions = DB::table('transaction')->where('type', 'sale')->count();
DB::table('transaction')->where('type', 'sale')->delete();
echo "Deleted {$saleTransactions} sale transactions.\n";

// Re-enable foreign key checks
DB::statement('SET FOREIGN_KEY_CHECKS=1');

echo "\n=== Summary ===\n";
echo "All sales data has been deleted successfully!\n";

// Verify remaining counts
echo "\nVerification - Remaining records:\n";
echo "saleInvoice: " . DB::table('saleInvoice')->count() . "\n";
echo "saleInvoiceProduct: " . DB::table('saleInvoiceProduct')->count() . "\n";
echo "saleInvoiceVat: " . DB::table('saleInvoiceVat')->count() . "\n";
echo "returnSaleInvoice: " . DB::table('returnSaleInvoice')->count() . "\n";
echo "returnSaleInvoiceProduct: " . DB::table('returnSaleInvoiceProduct')->count() . "\n";
echo "Sale transactions: " . DB::table('transaction')->where('type', 'sale')->count() . "\n";
