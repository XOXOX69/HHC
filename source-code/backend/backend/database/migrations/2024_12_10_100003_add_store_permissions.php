<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add store permissions (only if they don't exist)
        $storePermissions = [
            'create-store',
            'readAll-store',
            'readSingle-store',
            'update-store',
            'delete-store',
        ];

        foreach ($storePermissions as $permName) {
            $exists = DB::table('permission')->where('name', $permName)->exists();
            if (!$exists) {
                DB::table('permission')->insert([
                    'name' => $permName,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Get admin role (usually role ID 1)
        $adminRole = DB::table('role')->where('name', 'admin')->first();
        
        if ($adminRole) {
            // Get newly inserted permission IDs
            $permissionIds = DB::table('permission')
                ->whereIn('name', ['create-store', 'readAll-store', 'readSingle-store', 'update-store', 'delete-store'])
                ->pluck('id');

            // Assign all store permissions to admin role (if not already assigned)
            foreach ($permissionIds as $permissionId) {
                $exists = DB::table('rolePermission')
                    ->where('roleId', $adminRole->id)
                    ->where('permissionId', $permissionId)
                    ->exists();
                    
                if (!$exists) {
                    DB::table('rolePermission')->insert([
                        'roleId' => $adminRole->id,
                        'permissionId' => $permissionId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Get permission IDs
        $permissionIds = DB::table('permission')
            ->whereIn('name', ['create-store', 'readAll-store', 'readSingle-store', 'update-store', 'delete-store'])
            ->pluck('id');

        // Delete role permissions
        DB::table('rolePermission')->whereIn('permissionId', $permissionIds)->delete();

        // Delete permissions
        DB::table('permission')->whereIn('id', $permissionIds)->delete();
    }
};
