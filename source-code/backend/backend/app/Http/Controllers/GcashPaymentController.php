<?php

namespace App\Http\Controllers;

use App\Models\GcashTransaction;
use App\Models\PaymentMethod;
use App\Models\CartOrder;
use App\Models\Transaction;
use App\Models\ManualPayment;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GcashPaymentController extends Controller
{
    /**
     * Initialize a GCash payment
     */
    public function initializePayment(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'customerId' => 'required|integer',
            'paymentMethodId' => 'required|integer',
            'senderMobile' => 'required|string',
            'senderName' => 'required|string',
            'cartOrderId' => 'nullable|integer',
            'saleInvoiceId' => 'nullable|integer',
        ]);

        try {
            DB::beginTransaction();

            $paymentMethod = PaymentMethod::find($request->input('paymentMethodId'));
            
            if (!$paymentMethod) {
                return response()->json(['error' => 'Payment method not found'], 404);
            }

            // Generate unique reference number
            $referenceNumber = GcashTransaction::generateReferenceNumber();

            // Create GCash transaction record
            $gcashTransaction = GcashTransaction::create([
                'paymentMethodId' => $request->input('paymentMethodId'),
                'customerId' => $request->input('customerId'),
                'cartOrderId' => $request->input('cartOrderId'),
                'saleInvoiceId' => $request->input('saleInvoiceId'),
                'referenceNumber' => $referenceNumber,
                'senderMobile' => $request->input('senderMobile'),
                'senderName' => $request->input('senderName'),
                'amount' => $request->input('amount'),
                'status' => 'pending',
                'paymentType' => 'payment',
                'metadata' => [
                    'initiated_at' => now()->toISOString(),
                    'ip_address' => $request->ip(),
                ],
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Payment initialized successfully',
                'data' => [
                    'referenceNumber' => $referenceNumber,
                    'amount' => $gcashTransaction->amount,
                    'status' => $gcashTransaction->status,
                    'gcashNumber' => $paymentMethod->ownerAccount,
                    'accountName' => $paymentMethod->methodName,
                    'instruction' => $paymentMethod->instruction,
                    'transactionId' => $gcashTransaction->id,
                ]
            ], 201);

        } catch (Exception $err) {
            DB::rollBack();
            Log::error('GCash payment initialization failed: ' . $err->getMessage());
            return response()->json(['error' => 'Failed to initialize payment: ' . $err->getMessage()], 500);
        }
    }

    /**
     * Verify/Confirm GCash payment (manual verification by admin or customer submitting reference)
     */
    public function verifyPayment(Request $request, $id): JsonResponse
    {
        $request->validate([
            'gcashReferenceNumber' => 'required|string',
            'remarks' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $gcashTransaction = GcashTransaction::find($id);

            if (!$gcashTransaction) {
                return response()->json(['error' => 'Transaction not found'], 404);
            }

            if ($gcashTransaction->status === 'completed') {
                return response()->json(['error' => 'Transaction already completed'], 400);
            }

            // Update transaction with GCash reference
            $gcashTransaction->update([
                'gcashReferenceNumber' => $request->input('gcashReferenceNumber'),
                'status' => 'processing', // Admin will verify and mark as completed
                'remarks' => $request->input('remarks'),
                'metadata' => array_merge($gcashTransaction->metadata ?? [], [
                    'gcash_ref_submitted_at' => now()->toISOString(),
                ]),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'GCash reference submitted successfully. Awaiting verification.',
                'data' => arrayKeysToCamelCase($gcashTransaction->toArray()),
            ], 200);

        } catch (Exception $err) {
            DB::rollBack();
            Log::error('GCash payment verification failed: ' . $err->getMessage());
            return response()->json(['error' => 'Failed to verify payment'], 500);
        }
    }

    /**
     * Admin confirms the GCash payment
     */
    public function confirmPayment(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:completed,failed,refunded',
            'remarks' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $gcashTransaction = GcashTransaction::with(['cartOrder', 'customer', 'paymentMethod'])
                ->find($id);

            if (!$gcashTransaction) {
                return response()->json(['error' => 'Transaction not found'], 404);
            }

            $newStatus = $request->input('status');
            $paidAt = $newStatus === 'completed' ? now() : null;

            // Update transaction status
            $gcashTransaction->update([
                'status' => $newStatus,
                'paidAt' => $paidAt,
                'remarks' => $request->input('remarks') ?? $gcashTransaction->remarks,
                'metadata' => array_merge($gcashTransaction->metadata ?? [], [
                    'confirmed_at' => now()->toISOString(),
                    'confirmed_status' => $newStatus,
                ]),
            ]);

            // If payment is completed and linked to cart order, update the order
            if ($newStatus === 'completed' && $gcashTransaction->cartOrderId) {
                $cartOrder = CartOrder::find($gcashTransaction->cartOrderId);
                if ($cartOrder) {
                    $cartOrder->update([
                        'paidAmount' => $cartOrder->paidAmount + $gcashTransaction->amount,
                        'dueAmount' => max(0, $cartOrder->dueAmount - $gcashTransaction->amount),
                    ]);

                    // Create accounting transaction
                    $paymentMethod = $gcashTransaction->paymentMethod;
                    if ($paymentMethod && $paymentMethod->subAccountId) {
                        Transaction::create([
                            'date' => now(),
                            'debitId' => $paymentMethod->subAccountId,
                            'creditId' => 8, // Accounts Receivable (adjust based on your chart of accounts)
                            'particulars' => "GCash Payment - Ref: {$gcashTransaction->referenceNumber}",
                            'amount' => $gcashTransaction->amount,
                            'type' => 'sale',
                            'relatedId' => $gcashTransaction->cartOrderId,
                            'status' => 'true',
                        ]);
                    }

                    // Create manual payment record for tracking
                    ManualPayment::create([
                        'paymentMethodId' => $gcashTransaction->paymentMethodId,
                        'customerId' => $gcashTransaction->customerId,
                        'cartOrderId' => $gcashTransaction->cartOrderId,
                        'amount' => $gcashTransaction->amount,
                        'manualTransactionId' => $gcashTransaction->referenceNumber,
                        'CustomerAccount' => $gcashTransaction->senderMobile,
                        'CustomerTransactionId' => $gcashTransaction->gcashReferenceNumber,
                        'isVerified' => 'Verified',
                        'status' => 'true',
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Payment ' . $newStatus . ' successfully',
                'data' => arrayKeysToCamelCase($gcashTransaction->fresh()->toArray()),
            ], 200);

        } catch (Exception $err) {
            DB::rollBack();
            Log::error('GCash payment confirmation failed: ' . $err->getMessage());
            return response()->json(['error' => 'Failed to confirm payment: ' . $err->getMessage()], 500);
        }
    }

    /**
     * Get all GCash transactions with pagination and filters
     */
    public function getAllTransactions(Request $request): JsonResponse
    {
        try {
            $query = GcashTransaction::with(['customer:id,username,phone', 'paymentMethod:id,methodName', 'cartOrder:id,totalAmount']);

            // Filter by status
            if ($request->has('status') && $request->query('status') !== 'all') {
                $query->where('status', $request->query('status'));
            }

            // Filter by date range
            if ($request->has('startDate') && $request->has('endDate')) {
                $query->whereBetween('created_at', [
                    Carbon::parse($request->query('startDate'))->startOfDay(),
                    Carbon::parse($request->query('endDate'))->endOfDay(),
                ]);
            }

            // Filter by customer
            if ($request->has('customerId')) {
                $query->where('customerId', $request->query('customerId'));
            }

            // Search by reference number
            if ($request->has('search')) {
                $search = $request->query('search');
                $query->where(function($q) use ($search) {
                    $q->where('referenceNumber', 'like', "%{$search}%")
                      ->orWhere('gcashReferenceNumber', 'like', "%{$search}%")
                      ->orWhere('senderMobile', 'like', "%{$search}%");
                });
            }

            $pagination = getPagination($request->query());
            
            $total = $query->count();
            $transactions = $query->orderBy('created_at', 'desc')
                ->skip($pagination['skip'])
                ->take($pagination['limit'])
                ->get();

            // Calculate aggregations
            $aggregations = GcashTransaction::selectRaw('
                SUM(CASE WHEN status = "completed" THEN amount ELSE 0 END) as totalCompleted,
                SUM(CASE WHEN status = "pending" THEN amount ELSE 0 END) as totalPending,
                SUM(CASE WHEN status = "processing" THEN amount ELSE 0 END) as totalProcessing,
                COUNT(CASE WHEN status = "completed" THEN 1 END) as countCompleted,
                COUNT(CASE WHEN status = "pending" THEN 1 END) as countPending,
                COUNT(CASE WHEN status = "processing" THEN 1 END) as countProcessing
            ')->first();

            return response()->json([
                'transactions' => arrayKeysToCamelCase($transactions->toArray()),
                'total' => $total,
                'aggregations' => $aggregations,
            ], 200);

        } catch (Exception $err) {
            Log::error('Failed to fetch GCash transactions: ' . $err->getMessage());
            return response()->json(['error' => 'Failed to fetch transactions'], 500);
        }
    }

    /**
     * Get single GCash transaction
     */
    public function getSingleTransaction($id): JsonResponse
    {
        try {
            $transaction = GcashTransaction::with(['customer', 'paymentMethod', 'cartOrder'])
                ->find($id);

            if (!$transaction) {
                return response()->json(['error' => 'Transaction not found'], 404);
            }

            return response()->json(arrayKeysToCamelCase($transaction->toArray()), 200);

        } catch (Exception $err) {
            return response()->json(['error' => 'Failed to fetch transaction'], 500);
        }
    }

    /**
     * Get transactions by customer
     */
    public function getCustomerTransactions(Request $request, $customerId): JsonResponse
    {
        try {
            $transactions = GcashTransaction::with(['paymentMethod:id,methodName'])
                ->where('customerId', $customerId)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json(arrayKeysToCamelCase($transactions->toArray()), 200);

        } catch (Exception $err) {
            return response()->json(['error' => 'Failed to fetch customer transactions'], 500);
        }
    }
}
