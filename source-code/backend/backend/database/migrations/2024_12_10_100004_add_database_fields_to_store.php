<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add database connection fields for multi-tenant architecture
     */
    public function up(): void
    {
        Schema::table('store', function (Blueprint $table) {
            $table->string('database_name')->nullable()->after('currency');
            $table->string('database_host')->default('127.0.0.1')->after('database_name');
            $table->string('database_port')->default('3306')->after('database_host');
            $table->string('database_username')->nullable()->after('database_port');
            $table->string('database_password')->nullable()->after('database_username');
            $table->boolean('database_created')->default(false)->after('database_password');
        });

        // Update main store to use current database
        $mainStore = DB::table('store')->where('isMainStore', true)->first();
        if ($mainStore) {
            DB::table('store')->where('id', $mainStore->id)->update([
                'database_name' => env('DB_DATABASE'),
                'database_host' => env('DB_HOST', '127.0.0.1'),
                'database_port' => env('DB_PORT', '3306'),
                'database_username' => env('DB_USERNAME'),
                'database_password' => env('DB_PASSWORD'),
                'database_created' => true,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store', function (Blueprint $table) {
            $table->dropColumn([
                'database_name',
                'database_host',
                'database_port',
                'database_username',
                'database_password',
                'database_created',
            ]);
        });
    }
};
