import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import CreateBedModal from './Components/CreateBedModal';
import EditBedModal from './Components/EditBedModal';
import DeleteBedModal from './Components/DeleteBedModal';
import HeaderLayout from '@/layouts/header-layout';

interface Bed {
  id: number;
  bed_number: string;
  status: 'available' | 'occupied' | 'maintenance';
  created_at: string;
  updated_at: string;
}

interface Props {
  beds: Bed[];
}

const BedManagement: React.FC<Props> = ({ beds: initialBeds }) => {
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);

  const filteredBeds = beds.filter(bed =>
    bed.bed_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (bed: Bed) => {
    setEditingBed(bed);
    setShowEditModal(true);
  };

  const handleDelete = (bed: Bed) => {
    setEditingBed(bed);
    setShowDeleteModal(true);
  };

  const handleCreateSuccess = (newBed: Bed) => {
    setBeds([...beds, newBed]);
    setShowCreateModal(false);
  };

  const handleEditSuccess = (updatedBed: Bed) => {
    setBeds(beds.map(bed => bed.id === updatedBed.id ? updatedBed : bed));
    setShowEditModal(false);
    setEditingBed(null);
  };

  const handleDeleteSuccess = () => {
    if (editingBed) {
      setBeds(beds.filter(bed => bed.id !== editingBed.id));
    }
    setShowDeleteModal(false);
    setEditingBed(null);
  };

  return (
    <HeaderLayout>
      <Head title="Bed Management" />

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


              <h1 className="text-xl font-semibold text-gray-900">Bed Management</h1>
            </div>

            <div className="px-3 py-1.5 bg-teal-500 text-white rounded-lg text-sm font-medium">
              {beds.length} Beds
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            {/* Controls Bar */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <form className="flex items-center gap-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search beds..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </form>

              <Button
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                New Bed
              </Button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-4 gap-6 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">#</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">BED NUMBER</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">STATUS</div>

              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTIONS</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredBeds.map((bed, index) => (
                <div key={bed.id} className="grid grid-cols-4 gap-6 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                  <div className="text-sm text-gray-500 font-medium">{index + 1}</div>
                  <div className="text-gray-900 font-medium">{bed.bed_number}</div>
                  <div>
                    <Badge className={getStatusBadgeColor(bed.status)}>
                      {bed.status.charAt(0).toUpperCase() + bed.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(bed)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(bed)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredBeds.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5M10.5 1.5v4.5m0-4.5L6 6m4.5-4.5L15 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No beds found</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first bed.</p>
                <Button
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                  onClick={() => setShowCreateModal(true)}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create First Bed
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateBedModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleCreateSuccess}
      />

      <EditBedModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        bed={editingBed}
        onSuccess={handleEditSuccess}
      />

      <DeleteBedModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        bed={editingBed}
        onSuccess={handleDeleteSuccess}
      />
    </HeaderLayout>
  );
};

export default BedManagement;
