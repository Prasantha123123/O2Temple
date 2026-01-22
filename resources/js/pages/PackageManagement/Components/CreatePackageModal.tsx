import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface CreatePackageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (pkg: any) => void;
}

const CreatePackageModal: React.FC<CreatePackageModalProps> = ({ open, onOpenChange, onSuccess }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    duration_minutes: 60,
    price: 0.00,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/packages', {
      onSuccess: (response: any) => {
        onSuccess(response?.props?.package || response?.data?.package || data);
        onOpenChange(false);
        reset();
      },
    });
  };

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 bg-white">
        <div className="relative bg-white rounded-lg">
          <div className="flex items-center gap-3 p-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a2 2 0 00-2 2v2H6a2 2 0 00-2 2v6h12V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Create Package</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 bg-white">
            <div className="space-y-5 mt-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  required
                  className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:border-teal-500 text-black"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="duration_minutes" className="text-sm font-medium text-gray-700 mb-2 block">
                  Duration (minutes) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration_minutes"
                  type="text"
                  value={data.duration_minutes}
                  onChange={(e) => setData('duration_minutes', Number(e.target.value))}
                  required
                  className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:border-teal-500 text-black"
                />
                {errors.duration_minutes && <p className="text-red-500 text-xs mt-1">{errors.duration_minutes}</p>}
              </div>

              <div>
                <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
                  Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="text"
                  step="0.01"
                  value={data.price}
                  onChange={(e) => setData('price', Number(e.target.value))}
                  required
                  className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:border-teal-500 text-black"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-6 mt-6 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-4 py-2">
                Cancel
              </Button>
              <Button type="submit" disabled={processing} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white">
                {processing ? 'Creating...' : 'Create Package'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePackageModal;
