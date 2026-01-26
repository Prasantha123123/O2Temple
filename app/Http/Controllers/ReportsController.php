<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Customer;
use App\Models\BedAllocation;
use App\Models\Package;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    /**
     * Display the reports dashboard.
     */
    public function index(Request $request)
    {
        $year = $request->year ?? now()->year;
        $month = $request->month ?? now()->month;

        // === SUMMARY CARDS ===
        
        // Total Revenue (all time - paid invoices)
        $totalRevenue = Invoice::where('payment_status', 'paid')->sum('total_amount');
        
        // Monthly Revenue (current month)
        $monthlyRevenue = Invoice::where('payment_status', 'paid')
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->sum('total_amount');
        
        // Today's Revenue
        $todayRevenue = Invoice::where('payment_status', 'paid')
            ->whereDate('created_at', today())
            ->sum('total_amount');
        
        // Yesterday's Revenue
        $yesterdayRevenue = Invoice::where('payment_status', 'paid')
            ->whereDate('created_at', today()->subDay())
            ->sum('total_amount');
        
        // Total Customers
        $totalCustomers = Customer::count();
        
        // New Customers This Month
        $newCustomersThisMonth = Customer::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count();
        
        // Total Bookings (all time)
        $totalBookings = BedAllocation::count();
        
        // Bookings This Month
        $bookingsThisMonth = BedAllocation::whereYear('start_time', $year)
            ->whereMonth('start_time', $month)
            ->count();
        
        // Pending Payments
        $pendingPayments = Invoice::where('payment_status', 'unpaid')->sum('total_amount') +
            Invoice::where('payment_status', 'partial')->sum('balance_amount');
        
        // Total Invoices
        $totalInvoices = Invoice::count();
        
        // Completed Sessions Today
        $completedSessionsToday = BedAllocation::where('status', 'completed')
            ->whereDate('end_time', today())
            ->count();

        // === DAILY REVENUE TABLE (Last 30 days) ===
        $dailyRevenue = Invoice::where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as invoice_count'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'desc')
            ->get();

        // === MONTHLY REVENUE TABLE (Current year) ===
        $monthlyRevenueTable = Invoice::where('payment_status', 'paid')
            ->whereYear('created_at', $year)
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('COUNT(*) as invoice_count'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
            ->orderBy('month', 'asc')
            ->get()
            ->map(function ($item) {
                $item->month_name = Carbon::create()->month($item->month)->format('F');
                return $item;
            });

        // === REVENUE BY INVOICE TYPE ===
        $revenueByType = Invoice::where('payment_status', 'paid')
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->select(
                'invoice_type',
                DB::raw('COUNT(*) as invoice_count'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('invoice_type')
            ->get();

        // === TOP PACKAGES ===
        $topPackages = Package::withCount(['allocations' => function ($query) use ($year, $month) {
                $query->whereYear('start_time', $year)
                    ->whereMonth('start_time', $month);
            }])
            ->orderByDesc('allocations_count')
            ->limit(5)
            ->get();

        // === TOP CUSTOMERS ===
        $topCustomers = Customer::withSum(['invoices' => function ($query) use ($year, $month) {
                $query->where('payment_status', 'paid')
                    ->whereYear('created_at', $year)
                    ->whereMonth('created_at', $month);
            }], 'total_amount')
            ->withCount(['invoices' => function ($query) use ($year, $month) {
                $query->whereYear('created_at', $year)
                    ->whereMonth('created_at', $month);
            }])
            ->orderByDesc('invoices_sum_total_amount')
            ->limit(5)
            ->get();

        // === BOOKING STATUS SUMMARY ===
        $bookingStatusSummary = BedAllocation::whereYear('start_time', $year)
            ->whereMonth('start_time', $month)
            ->select(
                'status',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('status')
            ->get();

        // === PAYMENT STATUS SUMMARY ===
        $paymentStatusSummary = Invoice::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->select(
                'payment_status',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('payment_status')
            ->get();

        return Inertia::render('Reports/Index', [
            'stats' => [
                'total_revenue' => $totalRevenue,
                'monthly_revenue' => $monthlyRevenue,
                'today_revenue' => $todayRevenue,
                'yesterday_revenue' => $yesterdayRevenue,
                'total_customers' => $totalCustomers,
                'new_customers_this_month' => $newCustomersThisMonth,
                'total_bookings' => $totalBookings,
                'bookings_this_month' => $bookingsThisMonth,
                'pending_payments' => $pendingPayments,
                'total_invoices' => $totalInvoices,
                'completed_sessions_today' => $completedSessionsToday,
            ],
            'dailyRevenue' => $dailyRevenue,
            'monthlyRevenueTable' => $monthlyRevenueTable,
            'revenueByType' => $revenueByType,
            'topPackages' => $topPackages,
            'topCustomers' => $topCustomers,
            'bookingStatusSummary' => $bookingStatusSummary,
            'paymentStatusSummary' => $paymentStatusSummary,
            'filters' => [
                'year' => (int) $year,
                'month' => (int) $month,
            ],
        ]);
    }
}
