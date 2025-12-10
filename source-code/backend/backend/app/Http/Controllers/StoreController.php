<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Store;
use App\Models\Users;
use App\Services\TenantService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    /**
     * Create a new store
     */
    public function createSingleStore(Request $request): JsonResponse
    {
        try {
            $validator = validator($request->all(), [
                'name' => 'required|string|unique:store,name',
                'code' => 'nullable|string|unique:store,code',
                'email' => 'nullable|email',
                'phone' => 'nullable|string',
                'address' => 'nullable|string',
                'city' => 'nullable|string',
                'state' => 'nullable|string',
                'zipCode' => 'nullable|string',
                'country' => 'nullable|string',
                'taxNumber' => 'nullable|string',
                'currency' => 'nullable|string',
                'isMainStore' => 'nullable|boolean',
                'createDatabase' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()->first()], 400);
            }

            // If this store is set as main store, unset any existing main store
            if ($request->input('isMainStore')) {
                Store::where('isMainStore', true)->update(['isMainStore' => false]);
            }

            // Generate store code if not provided
            $storeCode = $request->input('code') ?? 'BRANCH_' . strtoupper(substr(md5(time()), 0, 6));

            $store = Store::create([
                'name' => $request->input('name'),
                'code' => $storeCode,
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'address' => $request->input('address'),
                'city' => $request->input('city'),
                'state' => $request->input('state'),
                'zipCode' => $request->input('zipCode'),
                'country' => $request->input('country'),
                'taxNumber' => $request->input('taxNumber'),
                'currency' => $request->input('currency'),
                'isMainStore' => $request->input('isMainStore') ?? false,
                'status' => 'true',
                'database_created' => false, // Will be set to true after database creation
            ]);

            // Create separate database for this branch (unless it's the main store)
            if (!$store->isMainStore) {
                try {
                    TenantService::createTenantDatabase($store);
                    // Refresh to get updated database fields
                    $store = $store->fresh();
                } catch (\Exception $dbError) {
                    // Rollback store creation if database creation fails
                    $store->delete();
                    $errorMsg = $dbError->getMessage();
                    if (strpos($errorMsg, 'Access denied') !== false || strpos($errorMsg, '1044') !== false) {
                        return response()->json([
                            'error' => 'Database user does not have CREATE DATABASE privilege. Please run the grant_create_database.sql script as MySQL admin, or create the database manually.',
                            'details' => $errorMsg
                        ], 500);
                    }
                    return response()->json(['error' => 'Failed to create branch database: ' . $errorMsg], 500);
                }
            } else {
                // Main store uses the main database
                $store->update([
                    'database_name' => env('DB_DATABASE'),
                    'database_host' => env('DB_HOST', '127.0.0.1'),
                    'database_port' => env('DB_PORT', '3306'),
                    'database_username' => env('DB_USERNAME'),
                    'database_password' => env('DB_PASSWORD'),
                    'database_created' => true,
                ]);
            }

            $converted = arrayKeysToCamelCase($store->toArray());
            return response()->json($converted, 201);
        } catch (Exception $err) {
            return response()->json(['error' => $err->getMessage()], 500);
        }
    }

    /**
     * Get all stores
     */
    public function getAllStores(Request $request): JsonResponse
    {
        try {
            $query = $request->query('query');
            $status = $request->query('status');

            $stores = Store::when($status, function ($q) use ($status) {
                    return $q->where('status', $status);
                })
                ->when($query, function ($q) use ($query) {
                    return $q->where(function ($subQuery) use ($query) {
                        $subQuery->where('name', 'LIKE', '%' . $query . '%')
                            ->orWhere('code', 'LIKE', '%' . $query . '%')
                            ->orWhere('email', 'LIKE', '%' . $query . '%')
                            ->orWhere('city', 'LIKE', '%' . $query . '%');
                    });
                })
                ->orderBy('id', 'desc')
                ->get();

            $converted = arrayKeysToCamelCase($stores->toArray());
            return response()->json($converted, 200);
        } catch (Exception $err) {
            return response()->json(['error' => $err->getMessage()], 500);
        }
    }

    /**
     * Get paginated stores
     */
    public function getAllStoresPaginated(Request $request): JsonResponse
    {
        try {
            $query = $request->query('query');
            $status = $request->query('status');
            $page = $request->query('page', 1);
            $count = $request->query('count', 10);

            $stores = Store::when($status, function ($q) use ($status) {
                    return $q->where('status', $status);
                })
                ->when($query, function ($q) use ($query) {
                    return $q->where(function ($subQuery) use ($query) {
                        $subQuery->where('name', 'LIKE', '%' . $query . '%')
                            ->orWhere('code', 'LIKE', '%' . $query . '%')
                            ->orWhere('email', 'LIKE', '%' . $query . '%')
                            ->orWhere('city', 'LIKE', '%' . $query . '%');
                    });
                })
                ->orderBy('id', 'desc')
                ->paginate($count, ['*'], 'page', $page);

            $converted = arrayKeysToCamelCase($stores->toArray());
            return response()->json($converted, 200);
        } catch (Exception $err) {
            return response()->json(['error' => $err->getMessage()], 500);
        }
    }

    /**
     * Get single store by ID
     */
    public function getSingleStore(Request $request, $id): JsonResponse
    {
        try {
            $store = Store::with(['users', 'products', 'saleInvoices', 'purchaseInvoices', 'customers', 'suppliers'])
                ->find($id);

            if (!$store) {
                return response()->json(['error' => 'Store not found'], 404);
            }

            $converted = arrayKeysToCamelCase($store->toArray());
            return response()->json($converted, 200);
        } catch (Exception $err) {
            return response()->json(['error' => $err->getMessage()], 500);
        }
    }

    /**
     * Update store
     */
    public function updateSingleStore(Request $request, $id): JsonResponse
    {
        try {
            $store = Store::find($id);

            if (!$store) {
                return response()->json(['error' => 'Store not found'], 404);
            }

            $validator = validator($request->all(), [
                'name' => 'sometimes|string|unique:store,name,' . $id,
                'code' => 'sometimes|string|unique:store,code,' . $id,
                'email' => 'nullable|email',
                'phone' => 'nullable|string',
                'address' => 'nullable|string',
                'city' => 'nullable|string',
                'state' => 'nullable|string',
                'zipCode' => 'nullable|string',
                'country' => 'nullable|string',
                'taxNumber' => 'nullable|string',
                'currency' => 'nullable|string',
                'isMainStore' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()->first()], 400);
            }

            // If this store is set as main store, unset any existing main store
            if ($request->input('isMainStore')) {
                Store::where('isMainStore', true)->where('id', '!=', $id)->update(['isMainStore' => false]);
            }

            $store->update($request->only([
                'name', 'code', 'email', 'phone', 'address', 'city',
                'state', 'zipCode', 'country', 'taxNumber', 'currency', 'isMainStore'
            ]));

            $converted = arrayKeysToCamelCase($store->fresh()->toArray());
            return response()->json($converted, 200);
        } catch (Exception $err) {
            return response()->json(['error' => $err->getMessage()], 500);
        }
    }

    /**
     * Delete (soft delete) store
     */
    public function deleteSingleStore(Request $request, $id): JsonResponse
    {
        try {
            $store = Store::find($id);

            if (!$store) {
                return response()->json(['error' => 'Store not found'], 404);
            }

            // Prevent deleting main store
            if ($store->isMainStore) {
                return response()->json(['error' => 'Cannot delete the main store'], 400);
            }

            // Check if store has associated records
            $hasUsers = Users::where('storeId', $id)->exists();
            if ($hasUsers) {
                // Soft delete - just change status
                $store->update(['status' => 'false']);
                return response()->json(['message' => 'Store deactivated (has associated users)'], 200);
            }

            // Delete the tenant database if it exists
            if ($store->database_name && $store->database_created && !$store->isMainStore) {
                TenantService::deleteTenantDatabase($store);
            }

            $store->update(['status' => 'false']);
            return response()->json(['message' => 'Store deleted successfully'], 200);
        } catch (Exception $err) {
            return response()->json(['error' => $err->getMessage()], 500);
        }
    }

    /**
     * Assign user to store
     */
    public function assignUserToStore(Request $request): JsonResponse
    {
        try {
            $validator = validator($request->all(), [
                'userId' => 'required|integer|exists:users,id',
                'storeId' => 'required|integer|exists:store,id',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()->first()], 400);
            }

            $user = Users::find($request->input('userId'));
            $user->storeId = $request->input('storeId');
            $user->save();

            return response()->json(['message' => 'User assigned to store successfully'], 200);
        } catch (Exception $err) {
            return response()->json(['error' => $err->getMessage()], 500);
        }
    }

    /**
     * Get store statistics
     */
    public function getStoreStatistics(Request $request, $id): JsonResponse
    {
        try {
            $store = Store::find($id);

            if (!$store) {
                return response()->json(['error' => 'Store not found'], 404);
            }

            $statistics = [
                'totalProducts' => $store->products()->count(),
                'totalUsers' => $store->users()->count(),
                'totalCustomers' => $store->customers()->count(),
                'totalSuppliers' => $store->suppliers()->count(),
                'totalSaleInvoices' => $store->saleInvoices()->count(),
                'totalPurchaseInvoices' => $store->purchaseInvoices()->count(),
                'totalSalesAmount' => $store->saleInvoices()->sum('totalAmount'),
                'totalPurchaseAmount' => $store->purchaseInvoices()->sum('totalAmount'),
            ];

            return response()->json($statistics, 200);
        } catch (Exception $err) {
            return response()->json(['error' => $err->getMessage()], 500);
        }
    }

    /**
     * Get main store
     */
    public function getMainStore(): JsonResponse
    {
        try {
            $store = Store::where('isMainStore', true)->first();

            if (!$store) {
                return response()->json(['error' => 'Main store not found'], 404);
            }

            $converted = arrayKeysToCamelCase($store->toArray());
            return response()->json($converted, 200);
        } catch (Exception $err) {
            return response()->json(['error' => $err->getMessage()], 500);
        }
    }

    /**
     * Upload store logo
     */
    public function uploadStoreLogo(Request $request, $id): JsonResponse
    {
        try {
            $store = Store::find($id);

            if (!$store) {
                return response()->json(['error' => 'Store not found'], 404);
            }

            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images/stores'), $fileName);
                $store->logo = 'images/stores/' . $fileName;
                $store->save();
            }

            $converted = arrayKeysToCamelCase($store->fresh()->toArray());
            return response()->json($converted, 200);
        } catch (Exception $err) {
            return response()->json(['error' => $err->getMessage()], 500);
        }
    }

    /**
     * Create database for a branch/store
     */
    public function createBranchDatabase(Request $request, $id): JsonResponse
    {
        try {
            $store = Store::find($id);

            if (!$store) {
                return response()->json(['error' => 'Store not found'], 404);
            }

            // Check if database already exists
            if ($store->database_created && $store->database_name) {
                return response()->json([
                    'message' => 'Database already exists',
                    'database_name' => $store->database_name
                ], 200);
            }

            // Don't create database for main store
            if ($store->isMainStore) {
                // Main store uses main database
                $store->update([
                    'database_name' => env('DB_DATABASE'),
                    'database_host' => env('DB_HOST', '127.0.0.1'),
                    'database_port' => env('DB_PORT', '3306'),
                    'database_username' => env('DB_USERNAME'),
                    'database_password' => env('DB_PASSWORD'),
                    'database_created' => true,
                ]);
                return response()->json([
                    'message' => 'Main store configured to use main database',
                    'database_name' => env('DB_DATABASE')
                ], 200);
            }

            // Create the branch database
            $success = TenantService::createTenantDatabase($store);

            if (!$success) {
                return response()->json(['error' => 'Failed to create database. Check database permissions.'], 500);
            }

            $store->refresh();
            return response()->json([
                'message' => 'Database created successfully',
                'database_name' => $store->database_name
            ], 201);
        } catch (Exception $err) {
            return response()->json(['error' => $err->getMessage()], 500);
        }
    }
}
