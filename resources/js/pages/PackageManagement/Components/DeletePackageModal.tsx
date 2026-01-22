import React from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface Package {
  id: number;
  name: string;
  duration_minutes: number;
  price: number;
}

interface DeletePackageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package?: Package | null;
  onSuccess: () => void;
}

const DeletePackageModal: React.FC<DeletePackageModalProps> = ({ open, onOpenChange, package: pkg, onSuccess }) => {
  const handleDelete = () => {
    if (!pkg) return;
    router.delete(`/packages/${pkg.id}`, {
      onSuccess: () => {
        onSuccess();
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 bg-white">
        <div className="relative bg-white rounded-lg">
          <div className="p-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Delete Package</h2>
          </div>

          <div className="px-6 py-6">
            <p className="text-sm text-gray-700 mb-4">Are you sure you want to delete the following package?</p>
            {pkg && (
              <div className="mb-4">
                <div className="text-gray-900 font-medium">{pkg.name}</div>
                <div className="text-sm text-gray-600">Duration: {pkg.duration_minutes} minutes</div>
                <div className="text-sm text-gray-600">Price: {pkg.price}</div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="px-4 py-2">Cancel</Button>
              <Button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white">Delete</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePackageModal;
