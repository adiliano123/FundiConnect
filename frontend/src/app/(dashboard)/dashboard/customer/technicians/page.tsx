'use client';

import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Select from '@/components/ui/Select';
import StarRating from '@/components/ui/StarRating';
import { categoryService } from '@/services/category.service';
import { technicianService } from '@/services/technician.service';
import { Category, Technician } from '@/types';
import { MapPin, Search, Shield } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function DashboardFindTechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '', city: '', category_id: '', available: false,
  });

  useEffect(() => {
    categoryService.getAll().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const fetchTechnicians = useCallback(async () => {
    setLoading(true);
    try {
      const res = await technicianService.getAll({
        ...filters,
        category_id: filters.category_id ? Number(filters.category_id) : undefined,
        available:   filters.available || undefined,
        page,
        per_page: 9,
      });
      setTechnicians(res.data);
      setTotal(res.total);
      setLastPage(res.last_page);
    } catch {
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  }, [page, filters.search, filters.city, filters.category_id, filters.available]); // eslint-disable-line

  useEffect(() => { fetchTechnicians(); }, [fetchTechnicians]);

  const set = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Find Technicians</h1>
        <p className="text-gray-500 text-sm mt-0.5">{total} verified professionals available</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={filters.search}
              onChange={e => set('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
              aria-label="Search technicians"
            />
          </div>
          <Select
            placeholder="All Categories"
            value={filters.category_id}
            onChange={e => set('category_id', e.target.value)}
            options={categories.map(c => ({ value: c.id, label: c.name }))}
          />
          <input
            type="text"
            placeholder="City or location..."
            value={filters.city}
            onChange={e => set('city', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
            aria-label="Filter by city"
          />
          <label className="flex items-center gap-2 px-3 py-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.available}
              onChange={e => set('available', e.target.checked)}
              className="w-4 h-4 accent-[#1C9AD6]"
            />
            <span className="text-sm text-gray-700">Available Now</span>
          </label>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="sm" /></div>
      ) : technicians.length === 0 ? (
        <EmptyState icon={Search} title="No technicians found" description="Try adjusting your filters." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicians.map(tech => (
              <Link
                key={tech.id}
                href={`/technicians/${tech.id}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden group"
              >
                <div className="h-1 bg-gradient-to-r from-[#1C9AD6] to-[#59BD7B]" />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1C9AD6] to-[#1D234F] flex items-center justify-center text-white font-bold text-base shadow-sm">
                      {tech.user?.name?.charAt(0)}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="success" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" aria-hidden="true" />
                        Verified
                      </Badge>
                      {tech.is_available && <Badge variant="info" className="text-xs">Available</Badge>}
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#1C9AD6] transition-colors">
                    {tech.user?.name}
                  </h3>
                  <p className="text-xs text-[#1C9AD6] font-medium mt-0.5">{tech.category?.name}</p>

                  <div className="flex items-center gap-1.5 mt-2">
                    <StarRating rating={Math.round(tech.rating ?? 0)} size="sm" />
                    <span className="text-xs text-gray-500">
                      {(tech.rating ?? 0).toFixed(1)} ({tech.total_reviews ?? 0})
                    </span>
                  </div>

                  {tech.user?.city && (
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      {tech.user.city}
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1D234F]">
                      TZS {tech.hourly_rate != null ? tech.hourly_rate.toLocaleString() : '—'}
                      <span className="text-xs text-gray-400 font-normal">/hr</span>
                    </span>
                    <span className="text-xs text-gray-400">{tech.experience_years} yrs</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {lastPage > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                Previous
              </button>
              <span className="px-3 py-1.5 text-xs text-gray-500">Page {page} of {lastPage}</span>
              <button disabled={page === lastPage} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
