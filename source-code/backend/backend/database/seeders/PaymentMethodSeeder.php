<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $paymentMethod = new PaymentMethod();
        $paymentMethod->subAccountId = 1;
        $paymentMethod->methodName = 'Demo Payment Method';
        $paymentMethod->logo = Null;
        $paymentMethod->ownerAccount = 'Demo Owner Account';
        $paymentMethod->instruction = 'Demo Instruction';
        $paymentMethod->save();

        // GCash Payment Method
        $gcashPayment = new PaymentMethod();
        $gcashPayment->subAccountId = 1;
        $gcashPayment->methodName = 'GCash';
        $gcashPayment->methodType = 'gcash';
        $gcashPayment->logo = Null;
        $gcashPayment->ownerAccount = '09XX XXX XXXX'; // Replace with actual GCash number
        $gcashPayment->instruction = '<p><strong>How to pay with GCash:</strong></p>
            <ol>
                <li>Open your GCash app</li>
                <li>Tap "Send Money"</li>
                <li>Enter the GCash number shown above</li>
                <li>Enter the exact amount</li>
                <li>Review and confirm payment</li>
                <li>Save the reference number from your receipt</li>
                <li>Enter the reference number to confirm your order</li>
            </ol>';
        $gcashPayment->isOnlinePayment = true;
        $gcashPayment->save();
        
    }
}
