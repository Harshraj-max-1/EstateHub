import React from 'react';
import { RotateCcw, Search, MapPin, Building, Bed, Bath, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import Button from '../common/Button';
import { INDIAN_CITIES, PROPERTY_TYPES, FURNISHING_STATUS, AMENITIES_LIST } from '../../utils/constants';

const PropertyFilterPanel = ({ filters, onFilterChange, onReset }) => {
  const handleTypeToggle = (type) => {
    let currentTypes = filters.propertyType ? filters.propertyType.split(',') : [];
    if (currentTypes.includes(type)) {
      currentTypes = currentTypes.filter((t) => t !== type);
    } else {
      currentTypes.push(type);
    }
    onFilterChange('propertyType', currentTypes.join(','));
  };

  const handleAmenityToggle = (amenity) => {
    let currentAmenities = filters.amenities ? filters.amenities.split(',') : [];
    if (currentAmenities.includes(amenity)) {
      currentAmenities = currentAmenities.filter((a) => a !== amenity);
    } else {
      currentAmenities.push(amenity);
    }
    onFilterChange('amenities', currentAmenities.join(','));
  };

  const selectedTypes = filters.propertyType ? filters.propertyType.split(',') : [];
  const selectedAmenities = filters.amenities ? filters.amenities.split(',') : [];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col gap-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Filters
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Keyword Search */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Keyword Search
        </label>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search locality, title, features..."
            value={filters.q || ''}
            onChange={(e) => onFilterChange('q', e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Buy / Rent Switch */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Listing Purpose
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => onFilterChange('listingType', 'BUY')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filters.listingType === 'BUY'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('listingType', 'RENT')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filters.listingType === 'RENT'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Rent
          </button>
        </div>
      </div>

      {/* City */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          City
        </label>
        <select
          value={filters.city || ''}
          onChange={(e) => onFilterChange('city', e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-slate-100 cursor-pointer"
        >
          <option value="" className="dark:bg-slate-900">All Cities</option>
          {INDIAN_CITIES.map((c) => (
            <option key={c} value={c} className="dark:bg-slate-900">
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Property Types */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Property Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map((type) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeToggle(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bedrooms (BHK) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Bedrooms (BHK)
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {['1', '2', '3', '4'].map((bhk) => (
            <button
              key={bhk}
              type="button"
              onClick={() => onFilterChange('bedrooms', filters.bedrooms === bhk ? '' : bhk)}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filters.bedrooms === bhk
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {bhk === '4' ? '4+ BHK' : `${bhk} BHK`}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Furnishing */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Furnishing
        </label>
        <select
          value={filters.furnishing || ''}
          onChange={(e) => onFilterChange('furnishing', e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
        >
          <option value="" className="dark:bg-slate-900">All Furnishing Types</option>
          {FURNISHING_STATUS.map((f) => (
            <option key={f} value={f} className="dark:bg-slate-900">
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Amenities Multi-Select */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Amenities
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {AMENITIES_LIST.map((amenity) => {
            const isSelected = selectedAmenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => handleAmenityToggle(amenity)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{amenity}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilterPanel;
