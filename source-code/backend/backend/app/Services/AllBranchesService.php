<?php

namespace App\Services;

use App\Models\Store;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class AllBranchesService
{
    /**
     * Get aggregated dashboard statistics from all branches
     */
    public static function getDashboardStats(): array
    {
        $stores = Store::where('status', 'true')
            ->where('database_created', true)
            ->get();

        $totalSales = 0;
        $totalPurchases = 0;
        $totalProducts = 0;
        $totalCustomers = 0;
        $totalTransactions = 0;
        $branchStats = [];

        // Add main branch stats
        $mainStats = self::getMainBranchStats();
        $totalSales += $mainStats['sales'];
        $totalPurchases += $mainStats['purchases'];
        $totalProducts += $mainStats['products'];
        $totalCustomers += $mainStats['customers'];
        $totalTransactions += $mainStats['transactions'];
        
        $branchStats[] = [
            'branch' => 'Main Branch',
            'branchId' => 'main',
            'sales' => $mainStats['sales'],
            'purchases' => $mainStats['purchases'],
            'products' => $mainStats['products'],
            'customers' => $mainStats['customers'],
            'transactions' => $mainStats['transactions'],
        ];

        // Get stats from each tenant branch
        foreach ($stores as $store) {
            if ($store->database_name && !$store->isMainStore) {
                try {
                    $stats = self::getTenantBranchStats($store);
                    $totalSales += $stats['sales'];
                    $totalPurchases += $stats['purchases'];
                    $totalProducts += $stats['products'];
                    $totalCustomers += $stats['customers'];
                    $totalTransactions += $stats['transactions'];
                    
                    $branchStats[] = [
                        'branch' => $store->name,
                        'branchId' => $store->id,
                        'sales' => $stats['sales'],
                        'purchases' => $stats['purchases'],
                        'products' => $stats['products'],
                        'customers' => $stats['customers'],
                        'transactions' => $stats['transactions'],
                    ];
                } catch (\Exception $e) {
                    \Log::warning("Could not get stats for branch {$store->name}: " . $e->getMessage());
                }
            }
        }

        return [
            'totalSales' => $totalSales,
            'totalPurchases' => $totalPurchases,
            'totalProducts' => $totalProducts,
            'totalCustomers' => $totalCustomers,
            'totalTransactions' => $totalTransactions,
            'branchCount' => count($branchStats),
            'branchStats' => $branchStats,
        ];
    }

    /**
     * Get stats from main branch (current database)
     */
    protected static function getMainBranchStats(): array
    {
        return [
            'sales' => DB::table('saleInvoice')->sum('totalAmount') ?? 0,
            'purchases' => DB::table('purchaseInvoice')->sum('totalAmount') ?? 0,
            'products' => DB::table('product')->where('status', 'true')->count(),
            'customers' => DB::table('customer')->where('status', 'true')->count(),
            'transactions' => DB::table('transaction')->count(),
        ];
    }

    /**
     * Get stats from a tenant branch database
     */
    protected static function getTenantBranchStats(Store $store): array
    {
        // Configure temporary connection
        Config::set('database.connections.tenant_temp', [
            'driver' => 'mysql',
            'host' => $store->database_host ?? env('DB_HOST', '127.0.0.1'),
            'port' => $store->database_port ?? env('DB_PORT', '3306'),
            'database' => $store->database_name,
            'username' => $store->database_username ?? env('DB_USERNAME'),
            'password' => $store->database_password ?? env('DB_PASSWORD'),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
        ]);

        DB::purge('tenant_temp');

        $stats = [
            'sales' => DB::connection('tenant_temp')->table('saleInvoice')->sum('totalAmount') ?? 0,
            'purchases' => DB::connection('tenant_temp')->table('purchaseInvoice')->sum('totalAmount') ?? 0,
            'products' => DB::connection('tenant_temp')->table('product')->where('status', 'true')->count(),
            'customers' => DB::connection('tenant_temp')->table('customer')->where('status', 'true')->count(),
            'transactions' => DB::connection('tenant_temp')->table('transaction')->count(),
        ];

        DB::purge('tenant_temp');

        return $stats;
    }

    /**
     * Get aggregated sales from all branches
     */
    public static function getAllBranchesSales($startDate = null, $endDate = null): array
    {
        $stores = Store::where('status', 'true')
            ->where('database_created', true)
            ->get();

        $allSales = [];

        // Get main branch sales
        $mainSales = self::getMainBranchSales($startDate, $endDate);
        foreach ($mainSales as $sale) {
            $sale->branch = 'Main Branch';
            $sale->branchId = 'main';
            $allSales[] = $sale;
        }

        // Get sales from each tenant branch
        foreach ($stores as $store) {
            if ($store->database_name && !$store->isMainStore) {
                try {
                    $branchSales = self::getTenantBranchSales($store, $startDate, $endDate);
                    foreach ($branchSales as $sale) {
                        $sale->branch = $store->name;
                        $sale->branchId = $store->id;
                        $allSales[] = $sale;
                    }
                } catch (\Exception $e) {
                    \Log::warning("Could not get sales for branch {$store->name}: " . $e->getMessage());
                }
            }
        }

        // Sort by date descending
        usort($allSales, function ($a, $b) {
            return strtotime($b->date) - strtotime($a->date);
        });

        return $allSales;
    }

    /**
     * Get sales from main branch
     */
    protected static function getMainBranchSales($startDate, $endDate): array
    {
        $query = DB::table('saleInvoice')
            ->select('id', 'date', 'totalAmount', 'paidAmount', 'dueAmount', 'created_at');

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        return $query->orderBy('date', 'desc')->limit(100)->get()->toArray();
    }

    /**
     * Get sales from a tenant branch
     */
    protected static function getTenantBranchSales(Store $store, $startDate, $endDate): array
    {
        Config::set('database.connections.tenant_temp', [
            'driver' => 'mysql',
            'host' => $store->database_host ?? env('DB_HOST', '127.0.0.1'),
            'port' => $store->database_port ?? env('DB_PORT', '3306'),
            'database' => $store->database_name,
            'username' => $store->database_username ?? env('DB_USERNAME'),
            'password' => $store->database_password ?? env('DB_PASSWORD'),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
        ]);

        DB::purge('tenant_temp');

        $query = DB::connection('tenant_temp')->table('saleInvoice')
            ->select('id', 'date', 'totalAmount', 'paidAmount', 'dueAmount', 'created_at');

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        $result = $query->orderBy('date', 'desc')->limit(100)->get()->toArray();
        
        DB::purge('tenant_temp');

        return $result;
    }

    /**
     * Get aggregated transactions from all branches
     */
    public static function getAllBranchesTransactions($startDate = null, $endDate = null): array
    {
        $stores = Store::where('status', 'true')
            ->where('database_created', true)
            ->get();

        $allTransactions = [];

        // Get main branch transactions
        $mainTransactions = self::getMainBranchTransactions($startDate, $endDate);
        foreach ($mainTransactions as $transaction) {
            $transaction->branch = 'Main Branch';
            $transaction->branchId = 'main';
            $allTransactions[] = $transaction;
        }

        // Get transactions from each tenant branch
        foreach ($stores as $store) {
            if ($store->database_name && !$store->isMainStore) {
                try {
                    $branchTransactions = self::getTenantBranchTransactions($store, $startDate, $endDate);
                    foreach ($branchTransactions as $transaction) {
                        $transaction->branch = $store->name;
                        $transaction->branchId = $store->id;
                        $allTransactions[] = $transaction;
                    }
                } catch (\Exception $e) {
                    \Log::warning("Could not get transactions for branch {$store->name}: " . $e->getMessage());
                }
            }
        }

        // Sort by date descending
        usort($allTransactions, function ($a, $b) {
            return strtotime($b->date) - strtotime($a->date);
        });

        return $allTransactions;
    }

    /**
     * Get transactions from main branch
     */
    protected static function getMainBranchTransactions($startDate, $endDate): array
    {
        $query = DB::table('transaction')
            ->select('id', 'date', 'amount', 'type', 'particulars', 'created_at');

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        return $query->orderBy('date', 'desc')->limit(100)->get()->toArray();
    }

    /**
     * Get transactions from a tenant branch
     */
    protected static function getTenantBranchTransactions(Store $store, $startDate, $endDate): array
    {
        Config::set('database.connections.tenant_temp', [
            'driver' => 'mysql',
            'host' => $store->database_host ?? env('DB_HOST', '127.0.0.1'),
            'port' => $store->database_port ?? env('DB_PORT', '3306'),
            'database' => $store->database_name,
            'username' => $store->database_username ?? env('DB_USERNAME'),
            'password' => $store->database_password ?? env('DB_PASSWORD'),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
        ]);

        DB::purge('tenant_temp');

        $query = DB::connection('tenant_temp')->table('transaction')
            ->select('id', 'date', 'amount', 'type', 'particulars', 'created_at');

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        $result = $query->orderBy('date', 'desc')->limit(100)->get()->toArray();
        
        DB::purge('tenant_temp');

        return $result;
    }
}
