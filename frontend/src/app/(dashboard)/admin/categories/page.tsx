'use client';

import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { categoryService } from '@/services/category.service';
import api from '@/lib/axios';
import { Category } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoryService.getAll().then(({ data }) => setCategories(data)).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post('/admin/categories', {
        name: newName.trim(),
        description: newDesc.trim(),
        slug: newName.trim().toLowerCase().replace(/\s+/g, '-'),
        is_active: true,
        sort_order: categories.length + 1,
      });
      setCategories(prev => [...prev, data.data]);
      setNewName(''); setNewDesc('');
      toast.success('Category created');
    } catch { toast.error('Failed to create category'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Category deleted');
    } catch { toast.error('Failed to delete category'); }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage service categories available on the platform.</p>
      </div>

      {/* Add form */}
      <Card>
        <h2 className="font-bold text-gray-900 mb-4">Add New Category</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <input
            value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Category name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
            required
          />
          <input
            value={newDesc} onChange={e => setNewDesc(e.target.value)}
            placeholder="Short description (optional)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
          />
          <button
            type="submit" disabled={saving}
            className="px-5 py-2 bg-[#1D234F] text-white text-sm font-semibold rounded-xl hover:bg-[#161b3d] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </Card>

      {/* List */}
      <Card>
        <h2 className="font-bold text-gray-900 mb-4">All Categories</h2>
        {loading ? (
          <div className="flex justify-center py-8"><LoadingSpinner size="sm" /></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {categories.map(c => (
              <div key={c.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                  {c.description && <p className="text-xs text-gray-400 mt-0.5">{c.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button onClick={() => handleDelete(c.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
