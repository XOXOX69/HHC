<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory;

    protected $table = 'store';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'code',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'zipCode',
        'country',
        'logo',
        'taxNumber',
        'currency',
        'isMainStore',
        'status',
        'database_name',
        'database_host',
        'database_port',
        'database_username',
        'database_password',
        'database_created',
    ];

    protected $hidden = [
        'database_password',
    ];

    protected $casts = [
        'database_created' => 'boolean',
        'isMainStore' => 'boolean',
    ];

    // Relationships
    public function users(): HasMany
    {
        return $this->hasMany(Users::class, 'storeId');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'storeId');
    }

    public function saleInvoices(): HasMany
    {
        return $this->hasMany(SaleInvoice::class, 'storeId');
    }

    public function purchaseInvoices(): HasMany
    {
        return $this->hasMany(PurchaseInvoice::class, 'storeId');
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class, 'storeId');
    }

    public function suppliers(): HasMany
    {
        return $this->hasMany(Supplier::class, 'storeId');
    }

    public function adjustInvoices(): HasMany
    {
        return $this->hasMany(AdjustInvoice::class, 'storeId');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'storeId');
    }
}
