import React from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, PhoneIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import AppLayout from '@/layouts/app-layout';

interface BedAllocation {
  id: number;
  bed: {
    id: number;
    name: string;
    type: string;
  };
  package: {
    id: number;
    name: string;
    price: number;
  };
  check_in_date: string;
  check_out_date: string;
  status: string;
  created_at: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  created_at: string;
  updated_at: string;
  allocations: BedAllocation[];
}

interface Props {
  customer: Customer;
}

const CustomerShow: React.FC<Props> = ({ customer }) => {
  return (
    <>
      <Head title={`Customer - ${customer.name}`} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-bold text-lg">
                  {customer.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
                <p className="text-gray-600">Customer Details</p>
              </div>
            </div>
          </div>
          
          <Badge variant="secondary" className="bg-teal-100 text-teal-800">
            Customer
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{customer.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">
                      {new Date(customer.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bed Allocations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Bed Allocations</h2>
                <p className="text-gray-600">History of bed bookings and stays</p>
              </div>

              {customer.allocations.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  <div className="bg-gray-50 px-6 py-3 grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    <div>BED</div>
                    <div>PACKAGE</div>
                    <div>CHECK-IN</div>
                    <div>CHECK-OUT</div>
                    <div>STATUS</div>
                    <div>PRICE</div>
                  </div>
                  {customer.allocations.map((allocation) => (
                    <div key={allocation.id} className="px-6 py-4 grid grid-cols-6 gap-4 items-center">
                      <div>
                        <p className="font-medium">{allocation.bed.name}</p>
                        <p className="text-sm text-gray-600">{allocation.bed.type}</p>
                      </div>
                      <div>{allocation.package.name}</div>
                      <div>
                        {new Date(allocation.check_in_date).toLocaleDateString()}
                      </div>
                      <div>
                        {allocation.check_out_date 
                          ? new Date(allocation.check_out_date).toLocaleDateString()
                          : 'Active'
                        }
                      </div>
                      <div>
                        <Badge
                          variant={allocation.status === 'active' ? 'default' : 'secondary'}
                          className={
                            allocation.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {allocation.status}
                        </Badge>
                      </div>
                      <div>
                        ${allocation.package.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Bed Allocations</h3>
                  <p>This customer has no bed allocation history yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CustomerShowWithLayout = (props: Props) => {
  return (
    <AppLayout>
      <CustomerShow {...props} />
    </AppLayout>
  );
};

export default CustomerShowWithLayout;