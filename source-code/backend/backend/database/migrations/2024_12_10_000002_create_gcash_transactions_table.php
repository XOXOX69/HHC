<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gcash_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('paymentMethodId');
            $table->unsignedBigInteger('customerId')->nullable();
            $table->unsignedBigInteger('cartOrderId')->nullable();
            $table->unsignedBigInteger('saleInvoiceId')->nullable();
            $table->string('referenceNumber')->unique();
            $table->string('gcashReferenceNumber')->nullable();
            $table->string('senderMobile')->nullable();
            $table->string('senderName')->nullable();
            $table->decimal('amount', 15, 2);
            $table->string('status')->default('pending'); // pending, processing, completed, failed, refunded
            $table->string('paymentType')->default('payment'); // payment, refund
            $table->text('remarks')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('paidAt')->nullable();
            $table->timestamps();

            $table->foreign('paymentMethodId')->references('id')->on('paymentMethod');
            $table->foreign('customerId')->references('id')->on('customer');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gcash_transactions');
    }
};
