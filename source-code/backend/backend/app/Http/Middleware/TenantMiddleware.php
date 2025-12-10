<?php

namespace App\Http\Middleware;

use App\Models\Store;
use App\Services\TenantService;
use Closure;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantMiddleware
{
    /**
     * Handle an incoming request.
     * Switch to the appropriate tenant database based on the X-Branch-Id header
     */
    public function handle(Request $request, Closure $next): Response
    {
        $branchId = $request->header('X-Branch-Id');
        
        if ($branchId && $branchId !== 'main') {
            // Get the store from main database
            $store = Store::on('mysql')->find($branchId);
            
            if ($store && $store->database_created && $store->database_name) {
                // Verify user has access to this branch
                if ($this->userCanAccessBranch($request, $store)) {
                    TenantService::setTenant($store);
                    $request->attributes->set('currentBranch', $store);
                    $request->attributes->set('isMainBranch', false);
                }
            }
        } else {
            // Using main database
            $request->attributes->set('isMainBranch', true);
            TenantService::resetToMain();
        }

        $response = $next($request);

        // Reset connection after request
        TenantService::resetToMain();

        return $response;
    }

    /**
     * Check if the user can access the specified branch
     */
    protected function userCanAccessBranch(Request $request, Store $store): bool
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return false;
        }

        try {
            $secret = env('JWT_SECRET');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            $decoded_array = (array)$decoded;
            
            // Admin can access all branches
            if (isset($decoded_array['roleId']) && $decoded_array['roleId'] == 1) {
                return true;
            }

            // Check if user is assigned to this branch
            $userId = $decoded_array['sub'] ?? null;
            if ($userId) {
                $user = \App\Models\Users::on('mysql')->find($userId);
                return $user && ($user->storeId == $store->id || $user->canAccessAllStores);
            }

            return false;
        } catch (Exception $e) {
            return false;
        }
    }
}
