<?php

namespace App\Http\Controllers;

use App\Services\AllBranchesService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AllBranchesController extends Controller
{
    /**
     * Get aggregated dashboard statistics from all branches
     */
    public function getDashboardStats(): JsonResponse
    {
        try {
            $stats = AllBranchesService::getDashboardStats();
            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get aggregated sales from all branches
     */
    public function getAllSales(Request $request): JsonResponse
    {
        try {
            $startDate = $request->query('startDate');
            $endDate = $request->query('endDate');
            
            $sales = AllBranchesService::getAllBranchesSales($startDate, $endDate);
            
            return response()->json([
                'getAllSaleInvoice' => $sales,
                'aggregatedPaidAmount' => array_sum(array_column($sales, 'paidAmount')),
                'aggregatedDueAmount' => array_sum(array_column($sales, 'dueAmount')),
                'aggregatedTotalAmount' => array_sum(array_column($sales, 'totalAmount')),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get aggregated transactions from all branches
     */
    public function getAllTransactions(Request $request): JsonResponse
    {
        try {
            $startDate = $request->query('startDate');
            $endDate = $request->query('endDate');
            
            $transactions = AllBranchesService::getAllBranchesTransactions($startDate, $endDate);
            
            $totalCredit = 0;
            $totalDebit = 0;
            
            foreach ($transactions as $t) {
                if ($t->type === 'credit' || $t->type === 'Credit') {
                    $totalCredit += $t->amount;
                } else {
                    $totalDebit += $t->amount;
                }
            }
            
            return response()->json([
                'getAllTransaction' => $transactions,
                'totalCredit' => $totalCredit,
                'totalDebit' => $totalDebit,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get branch comparison report
     */
    public function getBranchComparison(): JsonResponse
    {
        try {
            $stats = AllBranchesService::getDashboardStats();
            
            // Sort branches by sales
            $branchStats = $stats['branchStats'];
            usort($branchStats, function ($a, $b) {
                return $b['sales'] - $a['sales'];
            });
            
            return response()->json([
                'branches' => $branchStats,
                'totals' => [
                    'sales' => $stats['totalSales'],
                    'purchases' => $stats['totalPurchases'],
                    'products' => $stats['totalProducts'],
                    'customers' => $stats['totalCustomers'],
                    'transactions' => $stats['totalTransactions'],
                ],
                'branchCount' => $stats['branchCount'],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
