<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentHistoryController extends Controller
{
    /**
     * Display a listing of payment history.
     */
    public function index(Request $request)
    {
        $query = Invoice::with(['customer', 'items', 'allocation.bed', 'allocation.package', 'creator'])
            ->whereIn('status', ['completed', 'pending', 'cancelled'])
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('invoice_number', 'like', "%{$request->search}%")
                  ->orWhereHas('customer', function ($q2) use ($request) {
                      $q2->where('name', 'like', "%{$request->search}%")
                        ->orWhere('phone', 'like', "%{$request->search}%");
                  });
            });
        }

        if ($request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->invoice_type) {
            $query->where('invoice_type', $request->invoice_type);
        }

        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $invoices = $query->paginate(15);

        // Calculate summary statistics
        $totalRevenue = Invoice::where('payment_status', 'paid')->sum('total_amount');
        $pendingAmount = Invoice::where('payment_status', 'unpaid')->sum('total_amount') + 
                        Invoice::where('payment_status', 'partial')->sum('balance_amount');
        $todayRevenue = Invoice::where('payment_status', 'paid')
            ->whereDate('created_at', today())
            ->sum('total_amount');
        $totalInvoices = Invoice::count();

        return Inertia::render('PaymentHistory/Index', [
            'invoices' => $invoices,
            'filters' => [
                'search' => $request->search,
                'payment_status' => $request->payment_status,
                'invoice_type' => $request->invoice_type,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ],
            'stats' => [
                'total_revenue' => $totalRevenue,
                'pending_amount' => $pendingAmount,
                'today_revenue' => $todayRevenue,
                'total_invoices' => $totalInvoices,
            ],
        ]);
    }

    /**
     * Display a specific invoice detail.
     */
    public function show(Invoice $invoice)
    {
        $invoice->load(['customer', 'items.package', 'items.product', 'allocation.bed', 'allocation.package', 'payments', 'creator', 'completedBy']);

        return Inertia::render('PaymentHistory/Show', [
            'invoice' => $invoice,
        ]);
    }
}
