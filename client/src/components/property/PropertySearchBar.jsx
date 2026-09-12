import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, IndianRupee, SlidersHorizontal } from 'lucide-react';
import Button from '../common/Button';
import { INDIAN_CITIES, PROPERTY_TYPES } from '../../utils/constants';

const PropertySearchBar = ({ className = '', initialValues = {} }) => {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState(initialValues.listingType || 'BUY');
  const [city, setCity] = useState(initialValues.city || '');
  const [propertyType, setPropertyType] = useState(initialValues.propertyType || '');
  const [budget, setBudget] = useState(initialValues.budget || '');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (listingType) params.append('listingType', listingType);
    if (city) params.append('city', city);
    if (propertyType && propertyType !== 'All') params.append('propertyType', propertyType);

    if (budget) {
      if (budget === 'under-50l') {
        params.append('maxPrice', '5000000');
      } else if (budget === '50l-1cr') {
        params.append('minPrice', '5000000');
        params.append('maxPrice', '10000000');
      } else if (budget === '1cr-3cr') {
        params.append('minPrice', '10000000');
        params.append('maxPrice', '30000000');
      } else if (budget === 'above-3cr') {
        params.append('minPrice', '30000000');
      } else if (budget === 'under-25k') {
        params.append('maxPrice', '25000');
      } else if (budget === '25k-50k') {
        params.append('minPrice', '25000');
        params.append('maxPrice', '50000');
      } else if (budget === 'above-50k') {
        params.append('minPrice', '50000');
      }
    }

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Buy / Rent Switcher */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setListingType('BUY')}
          className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            listingType === 'BUY'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'
          }`}
        >
          Buy Property
        </button>
        <button
          type="button"
          onClick={() => setListingType('RENT')}
          className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            listingType === 'RENT'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'
          }`}
        >
          Rent Property
        </button>
      </div>

      {/* Main Search Container */}
      <form
        onSubmit={handleSearch}
        className="p-3 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center"
      >
        {/* City Input */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <MapPin className="w-5 h-5 text-indigo-500 flex-shrink-0" />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Location
            </span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="" className="dark:bg-slate-900">All Cities (India)</option>
              {INDIAN_CITIES.map((c) => (
                <option key={c} value={c} className="dark:bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Property Type */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <Building className="w-5 h-5 text-indigo-500 flex-shrink-0" />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Property Type
            </span>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="" className="dark:bg-slate-900">All Categories</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t} className="dark:bg-slate-900">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <IndianRupee className="w-5 h-5 text-indigo-500 flex-shrink-0" />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Budget Range
            </span>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="" className="dark:bg-slate-900">Any Price</option>
              {listingType === 'BUY' ? (
                <>
                  <option value="under-50l" className="dark:bg-slate-900">Under ₹50 Lakh</option>
                  <option value="50l-1cr" className="dark:bg-slate-900">₹50 Lakh - ₹1 Cr</option>
                  <option value="1cr-3cr" className="dark:bg-slate-900">₹1 Cr - ₹3 Cr</option>
                  <option value="above-3cr" className="dark:bg-slate-900">Above ₹3 Cr</option>
                </>
              ) : (
                <>
                  <option value="under-25k" className="dark:bg-slate-900">Under ₹25,000/mo</option>
                  <option value="25k-50k" className="dark:bg-slate-900">₹25,000 - ₹50,000/mo</option>
                  <option value="above-50k" className="dark:bg-slate-900">Above ₹50,000/mo</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Search Submit Button */}
        <div>
          <Button type="submit" size="md" icon={Search} className="w-full h-full py-3.5">
            Search Properties
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertySearchBar;
