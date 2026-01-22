import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import CreatePackageModal from './Components/CreatePackageModal';
import EditPackageModal from './Components/EditPackageModal';
import DeletePackageModal from './Components/DeletePackageModal';
import HeaderLayout from '@/layouts/header-layout';

interface Package {
  id: number;
  name: string;
  duration_minutes: number;
  price: number;
}

interface Props {
  packages: Package[];
}

const PackageManagement: React.FC<Props> = ({ packages: initialPackages }) => {
  const [packages, setPackages] = useState<Package[]>(initialPackages || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const filtered = packages.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleEdit = (pkg: Package) => { setEditingPackage(pkg); setShowEditModal(true); };
  const handleDelete = (pkg: Package) => { setEditingPackage(pkg); setShowDeleteModal(true); };

  const handleCreateSuccess = (newPkg: Package) => { setPackages([...packages, newPkg]); setShowCreateModal(false); };
  const handleEditSuccess = (updatedPkg: Package) => { setPackages(packages.map(p => p.id === updatedPkg.id ? updatedPkg : p)); setShowEditModal(false); setEditingPackage(null); };
  const handleDeleteSuccess = () => { if (editingPackage) setPackages(packages.filter(p => p.id !== editingPackage.id)); setShowDeleteModal(false); setEditingPackage(null); };

  return (
    <HeaderLayout>
      <Head title="Package Management" />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </Button>

              <h1 className="text-xl font-semibold text-gray-900">Package Management</h1>
            </div>

         
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <form className="flex items-center gap-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </form>

              <Button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium" onClick={() => setShowCreateModal(true)}>
                <PlusIcon className="w-4 h-4 mr-2" /> New Package
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-6 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">#</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">NAME</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">DURATION</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">PRICE</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTIONS</div>
            </div>

            <div className="divide-y divide-gray-200">
              {filtered.map((pkg, idx) => (
                <div key={pkg.id} className="grid grid-cols-5 gap-6 px-6 py-4 items-center hover:bg-gray-50">
                  <div className="text-sm text-gray-500 font-medium">{idx + 1}</div>
                  <div className="text-gray-900 font-medium">{pkg.name}</div>
                  <div className="text-gray-700">{pkg.duration_minutes} mins</div>

                  <div className="text-gray-700">{Number(pkg.price).toFixed(2)}</div>

                  <div className="flex items-center gap-2 ">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(pkg)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50" title="Edit"><PencilIcon className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(pkg)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50" title="Delete"><TrashIcon className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a2 2 0 00-2 2v2H6a2 2 0 00-2 2v6h12V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
                <p className="text-gray-500 mb-4">Add your first package to get started.</p>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white" onClick={() => setShowCreateModal(true)}><PlusIcon className="w-4 h-4 mr-2"/>Create Package</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreatePackageModal open={showCreateModal} onOpenChange={setShowCreateModal} onSuccess={handleCreateSuccess} />
      <EditPackageModal open={showEditModal} onOpenChange={setShowEditModal} package={editingPackage} onSuccess={handleEditSuccess} />
      <DeletePackageModal open={showDeleteModal} onOpenChange={setShowDeleteModal} package={editingPackage} onSuccess={handleDeleteSuccess} />
    </HeaderLayout>
  );
};

export default PackageManagement;
