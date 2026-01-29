<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Advance Payment Receipt - {{ $booking->booking_number }}</title>
    <style>
        @page {
            size: 80mm auto;
            margin: 0;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.1;
            margin: 0;
            padding: 3mm 2mm;
            width: 76mm;
            color: #000;
            background: #fff;
        }
        
        .receipt-header {
            text-align: center;
            margin-bottom: 6px;
            border-bottom: 1px dashed #000;
            padding-bottom: 3px;
        }
        
        .logo {
            width: 80px;
            height: 80px;
        }
        
        .business-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 1px;
        }
        
        .business-info {
            font-size: 10px;
            line-height: 1.0;
            margin-bottom: 1px;
        }
        
        .receipt-title {
            font-size: 13px;
            font-weight: bold;
            margin: 4px 0 3px 0;
            text-align: center;
            background: #000;
            color: #fff;
            padding: 3px 0;
        }
        
        .receipt-info {
            margin-bottom: 4px;
            font-size: 11px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1px;
            word-break: break-word;
        }
        
        .section-header {
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
            padding: 2px 0;
            margin: 3px 0;
            font-weight: bold;
            font-size: 11px;
            text-align: center;
        }
        
        .payment-item {
            margin-bottom: 4px;
            font-size: 11px;
            padding: 3px;
            background: #f5f5f5;
            border-radius: 2px;
        }
        
        .payment-method {
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .totals {
            border-top: 1px dashed #000;
            padding-top: 5px;
            margin-top: 8px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1px;
            font-size: 11px;
        }
        
        .grand-total {
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            padding: 2px 0;
            margin: 2px 0;
            font-weight: bold;
            font-size: 12px;
        }
        
        .balance-section {
            margin-top: 4px;
            padding: 4px;
            background: #fffacd;
            border: 1px dashed #ccc;
            border-radius: 2px;
        }
        
        .receipt-footer {
            text-align: center;
            margin-top: 5px;
            border-top: 1px dashed #000;
            padding-top: 3px;
            font-size: 10px;
        }
        
        .center {
            text-align: center;
        }
        
        .bold {
            font-weight: bold;
        }
        
        .note {
            font-size: 9px;
            font-style: italic;
            text-align: center;
            margin-top: 4px;
            color: #666;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-header">
        <img src="{{ asset('images/logo1.png') }}" alt="O2Temple Logo" class="logo">
        <div class="business-name">O2TEMPLE</div>
        <div class="business-info">
            133/11/C Gothami place,<br>
            Rajagiriya, Sri Lanka<br>
            Tel: +94 71 155 0750
        </div>
    </div>

    <div class="receipt-title">ADVANCE PAYMENT RECEIPT</div>

    <div class="receipt-info">
        <div class="info-row">
            <span>Booking #:</span>
            <span class="bold">{{ $booking->booking_number }}</span>
        </div>
        <div class="info-row">
            <span>Date:</span>
            <span>{{ now()->format('d/m/Y H:i') }}</span>
        </div>
        <div class="info-row">
            <span>Customer:</span>
            <span>{{ $booking->customer->name }}</span>
        </div>
        <div class="info-row">
            <span>Phone:</span>
            <span>{{ $booking->customer->phone }}</span>
        </div>
    </div>

    <div class="section-header">BOOKING DETAILS</div>
    
    <div class="receipt-info">
        <div class="info-row">
            <span>Bed:</span>
            <span>{{ $booking->bed->bed_number }}</span>
        </div>
        <div class="info-row">
            <span>Package:</span>
            <span>{{ $booking->package->name }}</span>
        </div>
        <div class="info-row">
            <span>Duration:</span>
            <span>{{ $booking->package->duration_minutes }} min</span>
        </div>
        <div class="info-row">
            <span>Booking Date:</span>
            <span>{{ $booking->start_time->format('d/m/Y') }}</span>
        </div>
        <div class="info-row">
            <span>Time:</span>
            <span>{{ $booking->start_time->format('H:i') }} - {{ $booking->end_time->format('H:i') }}</span>
        </div>
        <div class="info-row">
            <span>Package Price:</span>
            <span class="bold">LKR {{ number_format($booking->total_amount ?? $booking->package->price, 2) }}</span>
        </div>
    </div>

    <div class="section-header">ADVANCE PAYMENTS</div>

    @foreach($advancePayments as $payment)
    <div class="payment-item">
        <div class="info-row">
            <span>Receipt #:</span>
            <span class="bold">{{ $payment->receipt_number }}</span>
        </div>
        <div class="info-row">
            <span>Date:</span>
            <span>{{ $payment->created_at->format('d/m/Y H:i') }}</span>
        </div>
        <div class="info-row">
            <span>Method:</span>
            <span class="payment-method">{{ $payment->payment_method_label }}</span>
        </div>
        @if($payment->reference_number)
        <div class="info-row">
            <span>Reference:</span>
            <span>{{ $payment->reference_number }}</span>
        </div>
        @endif
        <div class="info-row">
            <span>Amount:</span>
            <span class="bold">LKR {{ number_format($payment->amount, 2) }}</span>
        </div>
        @if($payment->receivedBy)
        <div class="info-row">
            <span>Received by:</span>
            <span>{{ $payment->receivedBy->name }}</span>
        </div>
        @endif
    </div>
    @endforeach

    <div class="totals">
        <div class="total-row">
            <span>Package Price:</span>
            <span>LKR {{ number_format($booking->total_amount ?? $booking->package->price, 2) }}</span>
        </div>
        <div class="total-row grand-total">
            <span>TOTAL ADVANCE PAID:</span>
            <span>LKR {{ number_format($totalAdvancePaid, 2) }}</span>
        </div>
        
        <div class="balance-section">
            <div class="total-row">
                <span class="bold">BALANCE TO PAY:</span>
                <span class="bold">LKR {{ number_format($balanceAmount, 2) }}</span>
            </div>
        </div>
    </div>

    <div class="note">
        * Please present this receipt at check-in<br>
        * Balance payment due at the time of service
    </div>

    <div class="receipt-footer">
        <div>Thank you for your advance payment!</div>
        <div>{{ now()->format('d/m/Y H:i:s') }}</div>
        <div style="margin-top: 5px;">
            {{ auth()->user() ? 'Printed by: ' . auth()->user()->name : '' }}
        </div>
    </div>

    <script>
        window.onload = function() {
            window.print();
        }
    </script>
</body>
</html>
