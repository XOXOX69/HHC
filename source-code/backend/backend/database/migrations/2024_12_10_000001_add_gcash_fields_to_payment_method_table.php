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
        Schema::table('paymentMethod', function (Blueprint $table) {
            $table->string('methodType')->default('manual')->after('methodName'); // manual, gcash, bank, cod
            $table->string('qrCodeImage')->nullable()->after('logo'); // QR code image path for GCash/Maya
            $table->string('apiKey')->nullable()->after('instruction');
            $table->string('apiSecret')->nullable()->after('apiKey');
            $table->string('merchantId')->nullable()->after('apiSecret');
            $table->string('webhookUrl')->nullable()->after('merchantId');
            $table->boolean('isOnlinePayment')->default(false)->after('webhookUrl');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paymentMethod', function (Blueprint $table) {
            $table->dropColumn(['methodType', 'qrCodeImage', 'apiKey', 'apiSecret', 'merchantId', 'webhookUrl', 'isOnlinePayment']);
        });
    }
};
