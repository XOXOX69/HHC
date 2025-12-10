<?php

namespace App\Console\Commands;

use App\Models\Store;
use App\Services\TenantService;
use Illuminate\Console\Command;

class CreateBranchDatabases extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'branches:create-databases {--force : Force recreation of databases even if they exist}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create separate databases for all branches that do not have one';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting branch database creation...');
        
        $force = $this->option('force');

        // Check if user has CREATE DATABASE privilege
        if (!TenantService::canCreateDatabase()) {
            $this->error('ERROR: Database user does not have CREATE DATABASE privilege!');
            $this->newLine();
            $this->warn('Please run the following SQL as MySQL admin to grant permissions:');
            $this->line('  GRANT CREATE ON *.* TO \'' . env('DB_USERNAME') . '\'@\'%\';');
            $this->line('  GRANT ALL PRIVILEGES ON `pos_branch_%`.* TO \'' . env('DB_USERNAME') . '\'@\'%\';');
            $this->line('  FLUSH PRIVILEGES;');
            $this->newLine();
            $this->info('Or run the grant_create_database.sql script located in the backend folder.');
            return Command::FAILURE;
        }

        // Get all non-main stores
        $branches = Store::where('isMainStore', false)
            ->where('status', 'true')
            ->get();

        if ($branches->isEmpty()) {
            $this->warn('No branches found.');
            return Command::SUCCESS;
        }

        $this->info("Found {$branches->count()} branch(es).");

        $created = 0;
        $skipped = 0;
        $failed = 0;

        foreach ($branches as $branch) {
            $this->line("Processing branch: {$branch->name} (ID: {$branch->id})");

            // Check if database already exists
            if ($branch->database_created && $branch->database_name && !$force) {
                $this->info("  - Database already exists: {$branch->database_name}. Skipping.");
                $skipped++;
                continue;
            }

            // If force option is set and database exists, drop it first
            if ($force && $branch->database_name) {
                $this->warn("  - Force option set. Dropping existing database: {$branch->database_name}");
                TenantService::deleteTenantDatabase($branch);
                $branch->update([
                    'database_name' => null,
                    'database_created' => false,
                ]);
            }

            // Create the database
            $this->line("  - Creating database for branch: {$branch->name}");
            
            try {
                $success = TenantService::createTenantDatabase($branch);
                
                if ($success) {
                    $branch->refresh();
                    $this->info("  - SUCCESS: Database '{$branch->database_name}' created.");
                    $created++;
                } else {
                    $this->error("  - FAILED: Could not create database for {$branch->name}");
                    $failed++;
                }
            } catch (\Exception $e) {
                $this->error("  - ERROR: {$e->getMessage()}");
                $failed++;
            }
        }

        // Update main store to use main database if not already set
        $mainStore = Store::where('isMainStore', true)->first();
        if ($mainStore && !$mainStore->database_name) {
            $mainStore->update([
                'database_name' => env('DB_DATABASE'),
                'database_host' => env('DB_HOST', '127.0.0.1'),
                'database_port' => env('DB_PORT', '3306'),
                'database_username' => env('DB_USERNAME'),
                'database_password' => env('DB_PASSWORD'),
                'database_created' => true,
            ]);
            $this->info("Updated main store to use main database: " . env('DB_DATABASE'));
        }

        $this->newLine();
        $this->info('Summary:');
        $this->info("  - Created: {$created}");
        $this->info("  - Skipped (already exists): {$skipped}");
        $this->info("  - Failed: {$failed}");

        return $failed > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}
