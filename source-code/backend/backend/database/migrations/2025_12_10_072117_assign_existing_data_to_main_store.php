<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This assigns all existing data to the main store (storeId = 1)
     * so that individual branches start with zero data.
     */
    public function up(): void
    {
        // Get the main store ID (the one with isMainStore = true)
        $mainStore = DB::table('store')->where('isMainStore', true)->first();
        $mainStoreId = $mainStore ? $mainStore->id : 1;

        // Assign all existing products to main store
        DB::table('product')->whereNull('storeId')->update(['storeId' => $mainStoreId]);
        
        // Assign all existing customers to main store
        DB::table('customer')->whereNull('storeId')->update(['storeId' => $mainStoreId]);
        
        // Assign all existing suppliers to main store
        DB::table('supplier')->whereNull('storeId')->update(['storeId' => $mainStoreId]);
        
        // Assign all existing sale invoices to main store
        DB::table('saleInvoice')->whereNull('storeId')->update(['storeId' => $mainStoreId]);
        
        // Assign all existing purchase invoices to main store
        DB::table('purchaseInvoice')->whereNull('storeId')->update(['storeId' => $mainStoreId]);
        
        // Assign all existing transactions to main store
        DB::table('transaction')->whereNull('storeId')->update(['storeId' => $mainStoreId]);
        
        // Assign all existing return sale invoices to main store
        if (Schema::hasColumn('returnSaleInvoice', 'storeId')) {
            DB::table('returnSaleInvoice')->whereNull('storeId')->update(['storeId' => $mainStoreId]);
        }
        
        // Assign all existing return purchase invoices to main store
        if (Schema::hasColumn('returnPurchaseInvoice', 'storeId')) {
            DB::table('returnPurchaseInvoice')->whereNull('storeId')->update(['storeId' => $mainStoreId]);
        }
        
        // Assign all existing adjust invoices to main store
        if (Schema::hasColumn('adjustInvoice', 'storeId')) {
            DB::table('adjustInvoice')->whereNull('storeId')->update(['storeId' => $mainStoreId]);
        }
        
        // Assign all existing quotes to main store
        if (Schema::hasColumn('quote', 'storeId')) {
            DB::table('quote')->whereNull('storeId')->update(['storeId' => $mainStoreId]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse - data would remain assigned to main store
    }
};
