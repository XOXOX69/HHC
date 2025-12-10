<?php

use App\Http\Controllers\GcashPaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| GCash Payment API Routes
|--------------------------------------------------------------------------
*/

// Customer routes
Route::post('/initialize', [GcashPaymentController::class, 'initializePayment']);
Route::put('/verify/{id}', [GcashPaymentController::class, 'verifyPayment']);
Route::get('/customer/{customerId}', [GcashPaymentController::class, 'getCustomerTransactions']);

// Admin routes
Route::middleware('permission:readAll-manualPayment')->get('/', [GcashPaymentController::class, 'getAllTransactions']);
Route::middleware('permission:readSingle-manualPayment')->get('/{id}', [GcashPaymentController::class, 'getSingleTransaction']);
Route::middleware('permission:update-manualPayment')->put('/confirm/{id}', [GcashPaymentController::class, 'confirmPayment']);
