<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait StoreFilterTrait
{
    /**
     * Get the store ID from the request
     * Returns null if in "All Branches" mode (show all data)
     * or the specific branch's store ID for filtering
     */
    protected function getStoreId(Request $request): ?int
    {
        // If in All Branches mode, return null to show all data
        if ($request->attributes->get('isAllBranchesMode')) {
            return null;
        }
        
        // If a specific store is selected via header, use that
        $storeId = $request->attributes->get('storeId');
        if ($storeId !== null) {
            return (int) $storeId;
        }
        
        // If admin specified a store in the request body, use that
        if ($request->attributes->get('canAccessAllStores')) {
            if ($request->has('storeId') && $request->input('storeId')) {
                return (int) $request->input('storeId');
            }
            // Admin without store filter - return null to get all stores
            return null;
        }
        
        return null;
    }

    /**
     * Check if user can access all stores
     */
    protected function canAccessAllStores(Request $request): bool
    {
        return $request->attributes->get('canAccessAllStores', false);
    }

    /**
     * Get store ID for creating records
     * Always returns a store ID - either from request or user's assigned store
     * Also handles tenant database mode where data is already isolated by database
     */
    protected function getStoreIdForCreate(Request $request): ?int
    {
        // If admin specified a store in request body, use that
        if ($request->has('storeId') && $request->input('storeId')) {
            return (int) $request->input('storeId');
        }
        
        // If storeId is set in request attributes (branch without own database)
        $storeId = $request->attributes->get('storeId');
        if ($storeId !== null) {
            return (int) $storeId;
        }
        
        // If using tenant database, get the store ID from userStore
        // This handles branches with their own separate database
        $userStore = $request->attributes->get('userStore');
        if ($userStore && $request->attributes->get('usingTenantDb')) {
            return (int) $userStore->id;
        }
        
        // If userStore is available but not using tenant db (for other scenarios)
        if ($userStore) {
            return (int) $userStore->id;
        }
        
        // For All Branches mode, return null (product will be created without storeId)
        // This is acceptable as admin can assign storeId later or it's a global product
        if ($request->attributes->get('isAllBranchesMode')) {
            return null;
        }
        
        return null;
    }

    /**
     * Apply store filter to a query builder
     */
    protected function applyStoreFilter($query, Request $request, string $storeColumn = 'storeId')
    {
        $storeId = $this->getStoreId($request);
        
        if ($storeId !== null) {
            return $query->where($storeColumn, $storeId);
        }
        
        return $query;
    }
}
