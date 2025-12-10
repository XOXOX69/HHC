<?php

namespace App\Services;

use App\Models\Store;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;

class TenantService
{
    protected static $currentStore = null;

    /**
     * Set the current tenant/store and configure database connection
     */
    public static function setTenant(Store $store): void
    {
        self::$currentStore = $store;

        if ($store->database_name && $store->database_created) {
            self::configureTenantConnection($store);
        }
    }

    /**
     * Get the current tenant/store
     */
    public static function getTenant(): ?Store
    {
        return self::$currentStore;
    }

    /**
     * Configure the tenant database connection
     */
    public static function configureTenantConnection(Store $store): void
    {
        Config::set('database.connections.tenant', [
            'driver' => 'mysql',
            'host' => $store->database_host ?? env('DB_HOST', '127.0.0.1'),
            'port' => $store->database_port ?? env('DB_PORT', '3306'),
            'database' => $store->database_name,
            'username' => $store->database_username ?? env('DB_USERNAME'),
            'password' => $store->database_password ?? env('DB_PASSWORD'),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
        ]);

        // Purge and reconnect
        DB::purge('tenant');
        DB::reconnect('tenant');

        // Set tenant as default connection for models
        DB::setDefaultConnection('tenant');
    }

    /**
     * Reset to main database connection
     */
    public static function resetToMain(): void
    {
        self::$currentStore = null;
        DB::setDefaultConnection('mysql');
        DB::purge('tenant');
    }

    /**
     * Check if the database user has CREATE DATABASE privilege
     */
    public static function canCreateDatabase(): bool
    {
        try {
            // Use pos_branch_ prefix so it matches our GRANT pattern
            $testDbName = 'pos_branch_test_' . time();
            DB::statement("CREATE DATABASE IF NOT EXISTS `{$testDbName}`");
            DB::statement("DROP DATABASE IF EXISTS `{$testDbName}`");
            return true;
        } catch (\Exception $e) {
            \Log::warning('canCreateDatabase check failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Create a new database for a store/branch
     */
    public static function createTenantDatabase(Store $store): bool
    {
        try {
            $databaseName = 'pos_branch_' . strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', $store->code ?? $store->id));
            
            // Check if database already exists
            $existingDb = DB::select("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?", [$databaseName]);
            
            if (empty($existingDb)) {
                // Create database using main connection
                DB::statement("CREATE DATABASE IF NOT EXISTS `{$databaseName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            }

            // Update store with database info
            $store->update([
                'database_name' => $databaseName,
                'database_host' => env('DB_HOST', '127.0.0.1'),
                'database_port' => env('DB_PORT', '3306'),
                'database_username' => env('DB_USERNAME'),
                'database_password' => env('DB_PASSWORD'),
                'database_created' => true,
            ]);

            // Run migrations on the new database
            self::configureTenantConnection($store->fresh());
            
            // Run migrations with seeding
            Artisan::call('migrate', [
                '--database' => 'tenant',
                '--path' => 'database/migrations',
                '--seed' => true,
                '--force' => true,
            ]);

            // Update the store record in tenant database with branch info
            self::updateTenantStoreInfo($store);

            // Reset back to main connection
            self::resetToMain();

            return true;
        } catch (\Exception $e) {
            self::resetToMain();
            \Log::error('Failed to create tenant database: ' . $e->getMessage());
            throw $e; // Re-throw to get better error messages
        }
    }

    /**
     * Update the tenant store info after seeding
     */
    protected static function updateTenantStoreInfo(Store $store): void
    {
        // Update the store record in tenant database with branch-specific info
        DB::connection('tenant')->table('store')
            ->where('isMainStore', true)
            ->update([
                'name' => $store->name,
                'code' => $store->code,
                'email' => $store->email,
                'phone' => $store->phone,
                'address' => $store->address,
                'city' => $store->city,
                'state' => $store->state,
                'zipCode' => $store->zipCode,
                'country' => $store->country,
                'updated_at' => now(),
            ]);

        // Update appSetting with branch info
        DB::connection('tenant')->table('appSetting')
            ->update([
                'companyName' => $store->name,
                'tagLine' => 'Branch of POS System',
                'address' => $store->address,
                'phone' => $store->phone,
                'email' => $store->email,
                'updated_at' => now(),
            ]);
    }

    /**
     * Delete a tenant database
     */
    public static function deleteTenantDatabase(Store $store): bool
    {
        try {
            if ($store->database_name && !$store->isMainStore) {
                DB::statement("DROP DATABASE IF EXISTS `{$store->database_name}`");
            }
            return true;
        } catch (\Exception $e) {
            \Log::error('Failed to delete tenant database: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Check if currently using tenant connection
     */
    public static function isUsingTenant(): bool
    {
        return DB::getDefaultConnection() === 'tenant';
    }
}
