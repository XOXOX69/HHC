<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, create a default store if none exists
        $defaultStoreId = DB::table('store')->insertGetId([
            'name' => 'Main Store',
            'code' => 'MAIN',
            'isMainStore' => true,
            'status' => 'true',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Add storeId to users table
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('storeId')->nullable()->after('roleId');
            $table->foreign('storeId')->references('id')->on('store')->onDelete('set null');
        });

        // Add storeId to product table
        Schema::table('product', function (Blueprint $table) {
            $table->unsignedBigInteger('storeId')->nullable()->after('id');
            $table->foreign('storeId')->references('id')->on('store')->onDelete('set null');
        });

        // Add storeId to saleInvoice table
        Schema::table('saleInvoice', function (Blueprint $table) {
            $table->unsignedBigInteger('storeId')->nullable()->after('id');
            $table->foreign('storeId')->references('id')->on('store')->onDelete('set null');
        });

        // Add storeId to purchaseInvoice table
        Schema::table('purchaseInvoice', function (Blueprint $table) {
            $table->unsignedBigInteger('storeId')->nullable()->after('id');
            $table->foreign('storeId')->references('id')->on('store')->onDelete('set null');
        });

        // Add storeId to customer table
        Schema::table('customer', function (Blueprint $table) {
            $table->unsignedBigInteger('storeId')->nullable()->after('id');
            $table->foreign('storeId')->references('id')->on('store')->onDelete('set null');
        });

        // Add storeId to supplier table
        Schema::table('supplier', function (Blueprint $table) {
            $table->unsignedBigInteger('storeId')->nullable()->after('id');
            $table->foreign('storeId')->references('id')->on('store')->onDelete('set null');
        });

        // Add storeId to adjustInvoice table
        Schema::table('adjustInvoice', function (Blueprint $table) {
            $table->unsignedBigInteger('storeId')->nullable()->after('id');
            $table->foreign('storeId')->references('id')->on('store')->onDelete('set null');
        });

        // Add storeId to transaction table
        Schema::table('transaction', function (Blueprint $table) {
            $table->unsignedBigInteger('storeId')->nullable()->after('id');
            $table->foreign('storeId')->references('id')->on('store')->onDelete('set null');
        });

        // Add storeId to returnSaleInvoice table
        Schema::table('returnSaleInvoice', function (Blueprint $table) {
            $table->unsignedBigInteger('storeId')->nullable()->after('id');
            $table->foreign('storeId')->references('id')->on('store')->onDelete('set null');
        });

        // Add storeId to returnPurchaseInvoice table
        Schema::table('returnPurchaseInvoice', function (Blueprint $table) {
            $table->unsignedBigInteger('storeId')->nullable()->after('id');
            $table->foreign('storeId')->references('id')->on('store')->onDelete('set null');
        });

        // Add storeId to quote table
        Schema::table('quote', function (Blueprint $table) {
            $table->unsignedBigInteger('storeId')->nullable()->after('id');
            $table->foreign('storeId')->references('id')->on('store')->onDelete('set null');
        });

        // Update all existing records to use the default store
        DB::table('users')->whereNull('storeId')->update(['storeId' => $defaultStoreId]);
        DB::table('product')->whereNull('storeId')->update(['storeId' => $defaultStoreId]);
        DB::table('saleInvoice')->whereNull('storeId')->update(['storeId' => $defaultStoreId]);
        DB::table('purchaseInvoice')->whereNull('storeId')->update(['storeId' => $defaultStoreId]);
        DB::table('customer')->whereNull('storeId')->update(['storeId' => $defaultStoreId]);
        DB::table('supplier')->whereNull('storeId')->update(['storeId' => $defaultStoreId]);
        DB::table('adjustInvoice')->whereNull('storeId')->update(['storeId' => $defaultStoreId]);
        DB::table('transaction')->whereNull('storeId')->update(['storeId' => $defaultStoreId]);
        DB::table('returnSaleInvoice')->whereNull('storeId')->update(['storeId' => $defaultStoreId]);
        DB::table('returnPurchaseInvoice')->whereNull('storeId')->update(['storeId' => $defaultStoreId]);
        DB::table('quote')->whereNull('storeId')->update(['storeId' => $defaultStoreId]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove foreign keys and columns in reverse order
        Schema::table('quote', function (Blueprint $table) {
            $table->dropForeign(['storeId']);
            $table->dropColumn('storeId');
        });

        Schema::table('returnPurchaseInvoice', function (Blueprint $table) {
            $table->dropForeign(['storeId']);
            $table->dropColumn('storeId');
        });

        Schema::table('returnSaleInvoice', function (Blueprint $table) {
            $table->dropForeign(['storeId']);
            $table->dropColumn('storeId');
        });

        Schema::table('transaction', function (Blueprint $table) {
            $table->dropForeign(['storeId']);
            $table->dropColumn('storeId');
        });

        Schema::table('adjustInvoice', function (Blueprint $table) {
            $table->dropForeign(['storeId']);
            $table->dropColumn('storeId');
        });

        Schema::table('supplier', function (Blueprint $table) {
            $table->dropForeign(['storeId']);
            $table->dropColumn('storeId');
        });

        Schema::table('customer', function (Blueprint $table) {
            $table->dropForeign(['storeId']);
            $table->dropColumn('storeId');
        });

        Schema::table('purchaseInvoice', function (Blueprint $table) {
            $table->dropForeign(['storeId']);
            $table->dropColumn('storeId');
        });

        Schema::table('saleInvoice', function (Blueprint $table) {
            $table->dropForeign(['storeId']);
            $table->dropColumn('storeId');
        });

        Schema::table('product', function (Blueprint $table) {
            $table->dropForeign(['storeId']);
            $table->dropColumn('storeId');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['storeId']);
            $table->dropColumn('storeId');
        });

        // Delete the default store created during migration
        DB::table('store')->where('code', 'MAIN')->delete();
    }
};
