<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GcashTransaction extends Model
{
    use HasFactory;

    protected $table = 'gcash_transactions';

    protected $fillable = [
        'paymentMethodId',
        'customerId',
        'cartOrderId',
        'saleInvoiceId',
        'referenceNumber',
        'gcashReferenceNumber',
        'senderMobile',
        'senderName',
        'amount',
        'status',
        'paymentType',
        'remarks',
        'metadata',
        'paidAt',
    ];

    protected $casts = [
        'metadata' => 'array',
        'paidAt' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'paymentMethodId');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customerId');
    }

    public function cartOrder()
    {
        return $this->belongsTo(CartOrder::class, 'cartOrderId');
    }

    public function saleInvoice()
    {
        return $this->belongsTo(SaleInvoice::class, 'saleInvoiceId');
    }

    // Generate unique reference number
    public static function generateReferenceNumber(): string
    {
        $prefix = 'GC';
        $timestamp = now()->format('ymdHis');
        $random = strtoupper(substr(md5(uniqid()), 0, 6));
        return $prefix . $timestamp . $random;
    }
}
