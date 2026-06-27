'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Select from '@/components/ui/Select';
import StarRating from '@/components/ui/StarRating';
import { categoryService } from '@/services/category.service';
import { technicianService } from '@/services/technician.service';
import { Category, Technician } from '@/types';
import { MapPin, Search, Shield } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

function TechniciansContent() {
  const searchParams = useSearchParams();

  const [categories, setCategories]   = useState<Category[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading]         = useState(true);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [lastPage, setLastPage]       = useState(1);

  // Individual filter states — driven by URL params or user input
  const [search,    setSearch]    = useState(searchParams.get('search')      || '');
  const [city,      setCity]      = useState(searchParams.get('city')        || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '');
  const [available, setAvailable] = useState(false);

  // Sync filter state whenever the URL params change (nav / service card click)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCity(searchParams.get('city') || '');
    setCategoryId(searchParams.get('category_id') || '');
    setPage(1);
  }, [searchParams]);

  // Load categories for the dropdown once
  useEffect(() => {
    categoryService.getAll().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const fetchTechnicians = useCallback(async () => {
    setLoading(true);
    try {
      const res = await technicianService.getAll({
        search:      search      || undefined,
        city:        city        || undefined,
        category_id: categoryId  ? Number(categoryId) : undefined,
        available:   available   || undefined,
        page,
        per_page: 12,
      });
      setTechnicians(res.data);
      setTotal(res.total);
      setLastPage(res.last_page);
    } catch {
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  }, [search, city, categoryId, available, page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchTechnicians();
  }, [fetchTechnicians]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page header ───────────────────────────────────── */}
      <div className="bg-[#1D234F] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {search ? `Technicians for "${search}"` : 'Find Technicians'}
          </h1>
          <p className="text-gray-300 text-sm">
            {total} verified professional{total !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Filters ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search by name or skill..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
                aria-label="Search technicians"
              />
            </div>

            {/* Category */}
            <Select
              placeholder="All Categories"
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              aria-label="Filter by category"
            />

            {/* City */}
            <input
              type="text"
              placeholder="City or location..."
              value={city}
              onChange={(e) => { setCity(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C9AD6]"
              aria-label="Filter by city"
            />

            {/* Available */}
            <label className="flex items-center gap-2 px-3 py-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => { setAvailable(e.target.checked); setPage(1); }}
                className="w-4 h-4 accent-[#1C9AD6]"
              />
              <span className="text-sm text-gray-700">Available Now</span>
            </label>
          </div>
        </div>

        {/* ── Results ───────────────────────────────────────── */}
        {loading ? (
          <LoadingSpinner fullPage />
        ) : technicians.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No technicians found"
            description="Try adjusting your search filters to find available professionals."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {technicians.map((tech) => (
                <Link
                  key={tech.id}
                  href={`/technicians/${tech.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#1C9AD6] flex items-center justify-center text-white font-bold text-lg">
                        {tech.user?.name?.charAt(0)}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="success">
                          <Shield className="w-3 h-3 mr-1" aria-hidden="true" />
                          Verified
                        </Badge>
                        {tech.is_available && <Badge variant="info">Available</Badge>}
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-900">{tech.user?.name}</h3>
                    <p className="text-sm text-[#1C9AD6] font-medium">{tech.category?.name}</p>

                    <div className="flex items-center gap-1.5 mt-2">
                      <StarRating rating={Math.round(tech.rating ?? 0)} size="sm" />
                      <span className="text-xs text-gray-500">
                        {(tech.rating ?? 0).toFixed(1)} ({tech.total_reviews ?? 0})
                      </span>
                    </div>

                    {tech.user?.city && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" aria-hidden="true" />
                        {tech.user.city}
                      </div>
                    )}

                    {tech.bio && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{tech.bio}</p>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-[#1D234F]">
                          TZS {tech.hourly_rate != null ? tech.hourly_rate.toLocaleString() : '—'}
                        </span>
                        <span className="text-xs text-gray-400">/hr</span>
                      </div>
                      <span className="text-xs text-gray-500">{tech.experience_years} yrs</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} of {lastPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === lastPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function TechniciansPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <TechniciansContent />
    </Suspense>
  );
}
