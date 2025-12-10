<?php

namespace App\Http\Middleware;

use App\Models\Store;
use App\Models\Users;
use App\Services\TenantService;
use Closure;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StoreMiddleware
{
    /**
     * Handle an incoming request.
     * This middleware extracts the user's store from the JWT token
     * and makes it available to the request for filtering.
     * Also checks for X-Branch-Id header for admin users to switch stores.
     * When a branch has its own database, it switches to that database.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if ($token) {
            try {
                $secret = env('JWT_SECRET');
                $decoded = JWT::decode($token, new Key($secret, 'HS256'));
                $decoded_array = (array)$decoded;
                
                // Get user's store
                $userId = $decoded_array['sub'] ?? null;
                
                // Check if user can access all stores (admin or super admin)
                $canAccessAllStores = false;
                if (isset($decoded_array['roleId'])) {
                    // Role ID 1 is typically admin - can access all stores
                    $canAccessAllStores = $decoded_array['roleId'] == 1;
                }
                $request->attributes->set('canAccessAllStores', $canAccessAllStores);
                
                // Check for X-Branch-Id header (for store/branch switching from frontend)
                $headerBranchId = $request->header('X-Branch-Id');
                $isAllBranches = $request->header('X-All-Branches') === 'true';
                
                if ($headerBranchId && $headerBranchId !== 'main') {
                    $store = Store::on('mysql')->find($headerBranchId);
                    if ($store) {
                        // Check if this is the main store (All Branches overview mode)
                        if ($isAllBranches || $store->isMainStore) {
                            // Overview mode - use main database, don't filter by storeId (show all data)
                            TenantService::resetToMain();
                            $request->attributes->set('storeId', null);
                            $request->attributes->set('isAllBranchesMode', true);
                            $request->attributes->set('userStore', $store);
                            $request->attributes->set('isMainBranch', true);
                        } else {
                            // Specific branch - check if it has its own database
                            if ($store->database_created && $store->database_name && !$store->isMainStore) {
                                // Switch to branch's own database
                                TenantService::setTenant($store);
                                $request->attributes->set('storeId', null); // No filtering needed, data is already isolated
                                $request->attributes->set('isAllBranchesMode', false);
                                $request->attributes->set('userStore', $store);
                                $request->attributes->set('isMainBranch', false);
                                $request->attributes->set('usingTenantDb', true);
                            } else {
                                // Branch uses main database with storeId filtering
                                TenantService::resetToMain();
                                $request->attributes->set('storeId', (int)$headerBranchId);
                                $request->attributes->set('isAllBranchesMode', false);
                                $request->attributes->set('userStore', $store);
                                $request->attributes->set('isMainBranch', false);
                                $request->attributes->set('usingTenantDb', false);
                            }
                        }
                        $request->attributes->set('isStoreOverridden', true);
                    }
                } elseif ($userId && $decoded_array['role'] !== 'customer') {
                    // Use user's assigned store
                    $user = Users::find($userId);
                    
                    if ($user && $user->storeId) {
                        $store = Store::on('mysql')->find($user->storeId);
                        
                        if ($store && $store->database_created && $store->database_name && !$store->isMainStore) {
                            // User's store has its own database
                            TenantService::setTenant($store);
                            $request->attributes->set('storeId', null);
                            $request->attributes->set('usingTenantDb', true);
                        } else {
                            // Use main database with storeId filtering
                            $request->attributes->set('storeId', $user->storeId);
                            $request->attributes->set('usingTenantDb', false);
                        }
                        $request->attributes->set('userStore', $store);
                    }
                } else {
                    // No branch specified, use main database
                    TenantService::resetToMain();
                    $request->attributes->set('isMainBranch', true);
                }

            } catch (Exception $e) {
                // Token invalid or expired, continue without store context
                TenantService::resetToMain();
            }
        }

        $response = $next($request);
        
        // Reset to main database after request
        TenantService::resetToMain();

        return $response;
    }
}
