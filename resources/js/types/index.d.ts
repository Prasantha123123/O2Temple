import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// POS System Types
export interface Bed {
    id: number;
    bed_number: string;
    display_name: string;
    grid_row: number;
    grid_col: number;
    bed_type: string;
    hourly_rate?: number;
    description?: string;
    status: 'available' | 'occupied' | 'maintenance' | 'booked_soon';
    current_allocation?: BedAllocation | null;
}

export interface Package {
    id: number;
    name: string;
    duration_minutes: number;
    price: number;
}

export interface Product {
    id: number;
    name: string;
    sku: string;
    description?: string;
    category: string;
    price: number;
    cost_price?: number;
    stock_quantity?: number;
    track_inventory?: boolean;
    is_active: boolean;
    image?: string;
}

export interface Customer {
    id: number;
    name: string;
    phone: string;
    email?: string;
}

export interface BedAllocation {
    id: number;
    booking_number: string;
    customer_id: number;
    bed_id: number;
    package_id: number;
    start_time: string;
    end_time: string;
    status: 'pending' | 'confirmed' | 'active' | 'in_progress' | 'completed' | 'cancelled';
    payment_status: 'pending' | 'paid';
    total_amount: number;
    discount_amount: number;
    service_charge: number;
    tax_amount: number;
    final_amount: number;
    notes?: string;
    customer: Customer;
    bed: Bed;
    package: Package;
}

export interface InvoiceItem {
    id: number;
    invoice_id: number;
    package_id?: number;
    product_id?: number;
    item_type: 'package' | 'product' | 'service' | 'custom';
    item_name: string;
    description?: string;
    quantity: number;
    unit_price: number;
    discount_amount: number;
    tax_amount: number;
    total_price: number;
}

export interface InvoicePayment {
    id: number;
    invoice_id: number;
    amount: number;
    payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';
    reference_number?: string;
    notes?: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    payment_date: string;
}

export interface Invoice {
    id: number;
    invoice_number: string;
    customer_id?: number;
    allocation_id?: number;
    invoice_type: 'walk_in' | 'booking' | 'pos_sale';
    subtotal: number;
    discount_amount: number;
    discount_percentage: number;
    service_charge: number;
    service_charge_percentage: number;
    tax_amount: number;
    tax_percentage: number;
    additional_charges: number;
    total_amount: number;
    paid_amount: number;
    balance_amount: number;
    payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
    status: 'draft' | 'pending' | 'completed' | 'cancelled' | 'voided';
    kitchen_note?: string;
    notes?: string;
    completed_at?: string;
    customer?: Customer;
    allocation?: BedAllocation;
    items: InvoiceItem[];
    payments: InvoicePayment[];
}
