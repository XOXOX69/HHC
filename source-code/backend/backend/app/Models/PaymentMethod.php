<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;


    protected $table = 'paymentMethod';

    protected $fillable = [
        'methodName',
        'methodType',
        'subAccountId',
        'logo',
        'qrCodeImage',
        'ownerAccount',
        'instruction',
        'apiKey',
        'apiSecret',
        'merchantId',
        'webhookUrl',
        'isOnlinePayment',
    ];

    protected $casts = [
        'isOnlinePayment' => 'boolean',
    ];

    public function subAccount()
    {
        return $this->belongsTo(SubAccount::class, 'subAccountId');
    }

    public function gcashTransactions()
    {
        return $this->hasMany(GcashTransaction::class, 'paymentMethodId');
    }

    public function isGcash()
    {
        return $this->methodType === 'gcash' || 
               stripos($this->methodName, 'gcash') !== false;
    }

}