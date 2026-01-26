import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

interface Package {
  id: number;
  name: string;
  price: number;
  duration_minutes: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface InvoiceItem {
  id: number;
  item_type: string;
  item_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
  total_price: number;
  package?: Package;
  product?: Product;
}

interface Payment {
  id: number;
  amount: number;
  payment_method: string;
  reference_number?: string;
  payment_date: string;
  status: string;
}

interface Allocation {
  id: number;
  bed?: {
    id: number;
    bed_number: string;
  };
  package?: Package;
  start_time: string;
  end_time: string;
}

interface User {
  id: number;
  name: string;
}

interface Invoice {
  id: number;
  invoice_number: string;
  customer?: Customer;
  allocation?: Allocation;
  invoice_type: 'walk_in' | 'booking' | 'pos_sale' | 'addon';
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
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
  kitchen_note?: string;
  notes?: string;
  items: InvoiceItem[];
  payments: Payment[];
  creator?: User;
  completed_by?: User;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  invoice: Invoice;
}

const InvoiceDetail: React.FC<Props> = ({ invoice }) => {
  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      unpaid: { label: 'Unpaid', className: 'bg-red-100 text-red-700' },
      partial: { label: 'Partial', className: 'bg-yellow-100 text-yellow-700' },
      paid: { label: 'Paid', className: 'bg-green-100 text-green-700' },
      refunded: { label: 'Refunded', className: 'bg-gray-100 text-gray-700' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unpaid;
    return <Badge className={`${config.className} text-sm px-3 py-1`}>{config.label}</Badge>;
  };

  const getInvoiceTypeBadge = (type: string) => {
    const typeConfig = {
      walk_in: { label: 'Walk-in', className: 'bg-blue-100 text-blue-700' },
      booking: { label: 'Booking', className: 'bg-purple-100 text-purple-700' },
      pos_sale: { label: 'POS Sale', className: 'bg-teal-100 text-teal-700' },
      addon: { label: 'Add-on', className: 'bg-orange-100 text-orange-700' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.pos_sale;
    return <Badge className={`${config.className} text-sm px-3 py-1`}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
      completed: { label: 'Completed', className: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={`${config.className} text-sm px-3 py-1`}>{config.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      cash: 'Cash',
      card: 'Card',
      upi: 'UPI',
      bank_transfer: 'Bank Transfer',
      wallet: 'Wallet',
    };
    return methods[method] || method;
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <Head title={`Invoice ${invoice.invoice_number}`} />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.get('/payment-history')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </Button>
              
              <img 
                src="/jaanNetworklogo.jpeg" 
                alt="JAAN Network" 
                className="h-8 w-auto object-contain"
              />
              
              <h1 className="text-xl font-semibold text-gray-900">Invoice Details</h1>
            </div>
            
            <div className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm font-medium">
              Invoice
            </div>
          </div>

          {/* Invoice Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Invoice Header */}
            <div className="px-6 py-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <DocumentTextIcon className="w-6 h-6 text-purple-500" />
                    <span className="text-2xl font-bold font-mono text-purple-600">
                      {invoice.invoice_number}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    {getInvoiceTypeBadge(invoice.invoice_type)}
                    {getStatusBadge(invoice.status)}
                    {getPaymentStatusBadge(invoice.payment_status)}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center gap-2 justify-end">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Created: {formatDateTime(invoice.created_at)}</span>
                  </div>
                  {invoice.completed_at && (
                    <div className="mt-1">
                      Completed: {formatDateTime(invoice.completed_at)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer & Session Info */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Customer Details
                  </h3>
                  {invoice.customer ? (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invoice.customer.name}</p>
                        <p className="text-sm text-gray-500">{invoice.customer.phone}</p>
                        {invoice.customer.email && (
                          <p className="text-sm text-gray-500">{invoice.customer.email}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Walk-in customer</p>
                  )}
                </div>

                {invoice.allocation && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Session Details
                    </h3>
                    <div className="space-y-1">
                      {invoice.allocation.bed && (
                        <p className="text-sm">
                          <span className="text-gray-500">Bed:</span>{' '}
                          <Badge className="bg-teal-100 text-teal-700 font-mono">
                            {invoice.allocation.bed.bed_number}
                          </Badge>
                        </p>
                      )}
                      {invoice.allocation.package && (
                        <p className="text-sm">
                          <span className="text-gray-500">Package:</span>{' '}
                          <span className="font-medium">{invoice.allocation.package.name}</span>
                        </p>
                      )}
                      <p className="text-sm">
                        <span className="text-gray-500">Time:</span>{' '}
                        {formatDateTime(invoice.allocation.start_time)} - {formatDateTime(invoice.allocation.end_time)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Items */}
            <div className="px-6 py-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Invoice Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Item</th>
                      <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase">Qty</th>
                      <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Unit Price</th>
                      <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Discount</th>
                      <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Tax</th>
                      <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3">
                          <div className="font-medium text-gray-900">{item.item_name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500">{item.description}</div>
                          )}
                          <Badge className="bg-gray-100 text-gray-600 text-xs mt-1">
                            {item.item_type}
                          </Badge>
                        </td>
                        <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                        <td className="py-3 text-right text-gray-700">{formatCurrency(item.unit_price)}</td>
                        <td className="py-3 text-right text-red-600">
                          {item.discount_amount > 0 ? `-${formatCurrency(item.discount_amount)}` : '-'}
                        </td>
                        <td className="py-3 text-right text-gray-500">
                          {item.tax_amount > 0 ? formatCurrency(item.tax_amount) : '-'}
                        </td>
                        <td className="py-3 text-right font-semibold text-gray-900">
                          {formatCurrency(item.total_price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  {invoice.discount_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Discount {invoice.discount_percentage > 0 && `(${invoice.discount_percentage}%)`}
                      </span>
                      <span className="text-red-600">-{formatCurrency(invoice.discount_amount)}</span>
                    </div>
                  )}
                  {invoice.service_charge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Service Charge {invoice.service_charge_percentage > 0 && `(${invoice.service_charge_percentage}%)`}
                      </span>
                      <span className="text-gray-900">{formatCurrency(invoice.service_charge)}</span>
                    </div>
                  )}
                  {invoice.tax_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Tax {invoice.tax_percentage > 0 && `(${invoice.tax_percentage}%)`}
                      </span>
                      <span className="text-gray-900">{formatCurrency(invoice.tax_amount)}</span>
                    </div>
                  )}
                  {invoice.additional_charges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Additional Charges</span>
                      <span className="text-gray-900">{formatCurrency(invoice.additional_charges)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-purple-600">{formatCurrency(invoice.total_amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Paid Amount</span>
                    <span className="text-green-600 font-medium">{formatCurrency(invoice.paid_amount)}</span>
                  </div>
                  {invoice.balance_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Balance Due</span>
                      <span className="text-red-600 font-medium">{formatCurrency(invoice.balance_amount)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment History */}
            {invoice.payments && invoice.payments.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BanknotesIcon className="w-4 h-4" />
                  Payment History
                </h3>
                <div className="space-y-3">
                  {invoice.payments.map((payment) => (
                    <div 
                      key={payment.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <BanknotesIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {getPaymentMethodLabel(payment.payment_method)}
                            {payment.reference_number && ` • Ref: ${payment.reference_number}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {formatDateTime(payment.payment_date)}
                        </p>
                        <Badge className={payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {(invoice.notes || invoice.kitchen_note) && (
              <div className="px-6 py-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Notes
                </h3>
                {invoice.notes && (
                  <p className="text-sm text-gray-700 mb-2">{invoice.notes}</p>
                )}
                {invoice.kitchen_note && (
                  <p className="text-sm text-gray-500 italic">Kitchen: {invoice.kitchen_note}</p>
                )}
              </div>
            )}

            {/* Footer Info */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
              <div className="flex justify-between">
                {invoice.creator && (
                  <span>Created by: {invoice.creator.name}</span>
                )}
                {invoice.completed_by && (
                  <span>Completed by: {invoice.completed_by.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetail;
