import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, Map, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import PropertyFilterPanel from '../components/property/PropertyFilterPanel';
import PropertyGrid from '../components/property/PropertyGrid';
import PropertyMapView from '../components/property/PropertyMapView';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import api from '../api/axios';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract filters from URL searchParams
  const filters = {
    q: searchParams.get('q') || '',
    city: searchParams.get('city') || '',
    locality: searchParams.get('locality') || '',
    propertyType: searchParams.get('propertyType') || '',
    listingType: searchParams.get('listingType') || 'BUY',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    furnishing: searchParams.get('furnishing') || '',
    amenities: searchParams.get('amenities') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10)
  };

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset page to 1 on filter changes
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams({ listingType: 'BUY', page: '1' }));
  };

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const queryString = searchParams.toString();
      const res = await api.get(`/properties?${queryString}`);
      if (res.data.success) {
        setProperties(res.data.properties);
        setTotal(res.data.total);
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProperties]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Discover Properties in India
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Showing <strong className="text-slate-800 dark:text-slate-200">{total}</strong> verified listings
            {filters.city ? ` in ${filters.city}` : ''}
          </p>
        </div>

        {/* View Switcher & Sorting & Mobile Filter Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            <span>Filters</span>
          </button>

          {/* Sort Select */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters('sortBy', e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="newest" className="dark:bg-slate-900">Newest First</option>
              <option value="price_asc" className="dark:bg-slate-900">Price: Low to High</option>
              <option value="price_desc" className="dark:bg-slate-900">Price: High to Low</option>
              <option value="area_asc" className="dark:bg-slate-900">Area: Small to Large</option>
              <option value="area_desc" className="dark:bg-slate-900">Area: Large to Small</option>
              <option value="views_desc" className="dark:bg-slate-900">Most Viewed</option>
            </select>
          </div>

          {/* Grid vs Map Toggle */}
          <div className="flex items-center rounded-xl p-1 bg-slate-100 dark:bg-slate-800/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Map View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Properties Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-20">
          <PropertyFilterPanel
            filters={filters}
            onFilterChange={updateFilters}
            onReset={resetFilters}
          />
        </aside>

        {/* Properties Content Area */}
        <main className="lg:col-span-3 min-w-0 flex flex-col gap-8">
          {viewMode === 'map' ? (
            <PropertyMapView properties={properties} className="h-[650px]" />
          ) : (
            <>
              <PropertyGrid
                properties={properties}
                loading={loading}
                skeletonCount={6}
                onResetFilters={resetFilters}
              />
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={(p) => updateFilters('page', p.toString())}
                className="mt-4"
              />
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      <Modal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Properties"
      >
        <PropertyFilterPanel
          filters={filters}
          onFilterChange={(k, v) => {
            updateFilters(k, v);
          }}
          onReset={() => {
            resetFilters();
            setMobileFilterOpen(false);
          }}
        />
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Apply Filters ({total} found)
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PropertiesPage;
