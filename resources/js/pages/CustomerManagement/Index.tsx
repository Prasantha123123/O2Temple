import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import CreateCustomerModal from './Components/CreateCustomerModal';
import EditCustomerModal from './Components/EditCustomerModal';
import DeleteCustomerModal from './Components/DeleteCustomerModal';
import HeaderLayout from '@/layouts/header-layout';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  customers: {
    data: Customer[];
    links: any;
    meta: any;
  };
  filters: {
    search?: string;
    active_only: boolean;
  };
}

const CustomerManagement: React.FC<Props> = ({ customers, filters }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Search form
  const { data: searchData, setData: setSearchData } = useForm({
    search: filters.search || '',
    active_only: filters.active_only,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/customers', searchData, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowEditModal(true);
  };

  const handleDelete = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowDeleteModal(true);
  };

  return (
         <HeaderLayout>
      <Head title="Customer Management" />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.get('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </Button>



              <h1 className="text-xl font-semibold text-gray-900">Customer Management</h1>
            </div>

          
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            {/* Controls Bar */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="active_only"
                    checked={searchData.active_only}
                    onCheckedChange={(checked) => setSearchData('active_only', checked as boolean)}
                  />
                  <Label htmlFor="active_only" className="text-sm text-gray-700">Active only</Label>
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search customers..."
                      value={searchData.search}
                      onChange={(e) => setSearchData('search', e.target.value)}
                      className="pl-10 w-80 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </form>
              </div>

              <Button
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                New Customer
              </Button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-6 gap-6 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">#</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">NAME</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">PHONE</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">EMAIL</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">JOINED</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTIONS</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {customers.data.map((customer, index) => (
                <div key={customer.id} className="grid grid-cols-6 gap-6 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                  <div className="text-sm text-gray-500 font-medium">
                    {customers.meta ? (customers.meta.current_page - 1) * customers.meta.per_page + index + 1 : index + 1}
                  </div>


                  <div className="text-gray-700">{customer.name}</div>
                  <div className="text-gray-700">{customer.phone}</div>
                  <div className="text-gray-700">{customer.email || 'None'}</div>
                  <div className="text-gray-700">{new Date(customer.created_at).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(customer)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(customer)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {customers.data.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                <p className="text-gray-500">Get started by adding your first customer.</p>
              </div>
            )}

            {/* Pagination */}
            {customers.data.length > 0 && customers.meta && customers.links && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{customers.meta.from || 1}</span> to{' '}
                  <span className="font-medium">{customers.meta.to || customers.data.length}</span> of{' '}
                  <span className="font-medium">{customers.meta.total || customers.data.length}</span> results
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => customers.links.prev && router.get(customers.links.prev)}
                    disabled={!customers.links.prev}
                    className="flex items-center gap-1 px-3 py-2"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {customers.meta.links && customers.meta.links.slice(1, -1).map((link: any, index: number) => (
                      <Button
                        key={index}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        onClick={() => link.url && router.get(link.url)}
                        disabled={!link.url}
                        className={`px-3 py-2 min-w-[40px] ${
                          link.active
                            ? 'bg-teal-500 hover:bg-teal-600 text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {link.label}
                      </Button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => customers.links.next && router.get(customers.links.next)}
                    disabled={!customers.links.next}
                    className="flex items-center gap-1 px-3 py-2"
                  >
                    Next
                    <ChevronRightIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateCustomerModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      <EditCustomerModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        customer={editingCustomer}
      />

      <DeleteCustomerModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        customer={editingCustomer}
      />
    </HeaderLayout>
  );
};

export default CustomerManagement;
