<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreController;

/*
|--------------------------------------------------------------------------
| Store Routes
|--------------------------------------------------------------------------
|
| Here is where you can register store routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "store" middleware group.
|
*/

// Create store
Route::middleware('permission:create-store')->post("/", [StoreController::class, 'createSingleStore']);

// Get all stores
Route::middleware('permission:readAll-store')->get("/", [StoreController::class, 'getAllStores']);

// Get paginated stores
Route::middleware('permission:readAll-store')->get("/paginated", [StoreController::class, 'getAllStoresPaginated']);

// Get main store
Route::middleware('permission:readSingle-store')->get("/main", [StoreController::class, 'getMainStore']);

// Get single store
Route::middleware('permission:readSingle-store')->get("/{id}", [StoreController::class, 'getSingleStore']);

// Get store statistics
Route::middleware('permission:readSingle-store')->get("/{id}/statistics", [StoreController::class, 'getStoreStatistics']);

// Update store
Route::middleware('permission:update-store')->put("/{id}", [StoreController::class, 'updateSingleStore']);

// Upload store logo
Route::middleware(['permission:update-store', 'fileUploader:5'])->post("/{id}/logo", [StoreController::class, 'uploadStoreLogo']);

// Delete store
Route::middleware('permission:delete-store')->patch("/{id}", [StoreController::class, 'deleteSingleStore']);

// Assign user to store
Route::middleware('permission:update-store')->post("/assign-user", [StoreController::class, 'assignUserToStore']);

// Create database for store/branch
Route::middleware('permission:update-store')->post("/{id}/create-database", [StoreController::class, 'createBranchDatabase']);
