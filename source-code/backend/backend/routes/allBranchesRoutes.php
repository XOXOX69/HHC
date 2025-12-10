<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AllBranchesController;

/*
|--------------------------------------------------------------------------
| All Branches Routes
|--------------------------------------------------------------------------
|
| Routes for aggregated data across all branches (multi-tenant overview)
|
*/

// Get aggregated dashboard statistics
Route::middleware('permission:readAll-store')->get("/dashboard", [AllBranchesController::class, 'getDashboardStats']);

// Get all sales from all branches
Route::middleware('permission:readAll-saleInvoice')->get("/sales", [AllBranchesController::class, 'getAllSales']);

// Get all transactions from all branches
Route::middleware('permission:readAll-transaction')->get("/transactions", [AllBranchesController::class, 'getAllTransactions']);

// Get branch comparison report
Route::middleware('permission:readAll-store')->get("/comparison", [AllBranchesController::class, 'getBranchComparison']);
