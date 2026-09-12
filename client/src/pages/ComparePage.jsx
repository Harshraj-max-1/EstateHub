import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, Check, Minus, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { formatPrice, formatArea, getImageUrl } from '../utils/formatters';
import { AMENITIES_LIST } from '../utils/constants';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';

const ComparePage = () => {
  const { comparedProperties, removeFromCompare, clearCompare } = useCompare();

  if (comparedProperties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={Scale}
          title="No properties in comparison"
          description="You can add up to 4 properties to compare their prices, floor areas, bedrooms, amenities, and locations side-by-side."
          actionLabel="Browse Properties"
          onAction={() => (window.location.href = '/properties')}
        />
      </div>
    );
  }

  // Calculate best values for highlights
  const lowestPrice = Math.min(...comparedProperties.map((p) => p.price || Infinity));
  const largestArea = Math.max(...comparedProperties.map((p) => p.area || 0));
  const mostBedrooms = Math.max(...comparedProperties.map((p) => p.bedrooms || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <Scale className="w-4 h-4" />
            Decision Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Compare Properties ({comparedProperties.length}/4)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="text-xs font-bold text-slate-500 hover:text-red-500 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Clear Comparison
          </button>
          <Link to="/properties">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              Add More
            </Button>
          </Link>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
        <table className="w-full text-left border-collapse min-w-[700px]">
          {/* Table Header with Property Thumbnails */}
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="p-5 w-48 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                Property Feature
              </th>
              {comparedProperties.map((prop) => (
                <th key={prop._id} className="p-5 w-64 align-top">
                  <div className="flex flex-col gap-3 relative">
                    <button
                      onClick={() => removeFromCompare(prop._id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-red-600 text-white transition-colors cursor-pointer z-10"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-36 w-full rounded-2xl overflow-hidden relative">
                      <img
                        src={getImageUrl(prop.images?.[0]?.url)}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Link
                      to={`/properties/${prop.slug || prop._id}`}
                      className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors line-clamp-2"
                    >
                      {prop.title}
                    </Link>
                    <span className="text-xs text-slate-500">
                      {prop.location?.locality}, {prop.location?.city}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
            {/* Price */}
            <tr>
              <td className="p-5 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-950/40">
                Offering Price
              </td>
              {comparedProperties.map((prop) => {
                const isLowest = prop.price === lowestPrice && comparedProperties.length > 1;
                return (
                  <td key={prop._id} className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {formatPrice(prop.price, prop.listingType)}
                      </span>
                      {isLowest && (
                        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Best Price
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Price per sqft */}
            <tr>
              <td className="p-5 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-950/40">
                Rate / sqft
              </td>
              {comparedProperties.map((prop) => (
                <td key={prop._id} className="p-5 font-semibold text-slate-700 dark:text-slate-300">
                  {prop.price && prop.area
                    ? `₹${Math.round(prop.price / prop.area).toLocaleString('en-IN')}/sqft`
                    : 'N/A'}
                </td>
              ))}
            </tr>

            {/* Super Built-up Area */}
            <tr>
              <td className="p-5 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-950/40">
                Area
              </td>
              {comparedProperties.map((prop) => {
                const isLargest = prop.area === largestArea && comparedProperties.length > 1;
                return (
                  <td key={prop._id} className="p-5">
                    <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                      <span>{formatArea(prop.area)}</span>
                      {isLargest && (
                        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                          Largest
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Bedrooms & Bathrooms */}
            <tr>
              <td className="p-5 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-950/40">
                Bedrooms / Baths
              </td>
              {comparedProperties.map((prop) => (
                <td key={prop._id} className="p-5 font-semibold text-slate-700 dark:text-slate-300">
                  {prop.bedrooms || 0} Beds • {prop.bathrooms || 0} Baths
                </td>
              ))}
            </tr>

            {/* Property Type */}
            <tr>
              <td className="p-5 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-950/40">
                Property Type
              </td>
              {comparedProperties.map((prop) => (
                <td key={prop._id} className="p-5 font-semibold text-slate-700 dark:text-slate-300">
                  {prop.propertyType} (For {prop.listingType})
                </td>
              ))}
            </tr>

            {/* Furnishing */}
            <tr>
              <td className="p-5 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-950/40">
                Furnishing
              </td>
              {comparedProperties.map((prop) => (
                <td key={prop._id} className="p-5 font-semibold text-slate-700 dark:text-slate-300">
                  {prop.furnishing}
                </td>
              ))}
            </tr>

            {/* Covered Parking */}
            <tr>
              <td className="p-5 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-950/40">
                Parking Spaces
              </td>
              {comparedProperties.map((prop) => (
                <td key={prop._id} className="p-5 font-semibold text-slate-700 dark:text-slate-300">
                  {prop.parking || 1} Covered
                </td>
              ))}
            </tr>

            {/* Amenities Section Header */}
            <tr className="bg-slate-100/60 dark:bg-slate-800/40 font-bold">
              <td colSpan={comparedProperties.length + 1} className="p-3.5 text-xs uppercase tracking-wider text-slate-500">
                Amenities & Facilities Checklist
              </td>
            </tr>

            {/* Amenities rows */}
            {AMENITIES_LIST.map((amenity) => (
              <tr key={amenity}>
                <td className="p-4 font-medium text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                  {amenity}
                </td>
                {comparedProperties.map((prop) => {
                  const hasAmenity = prop.amenities?.includes(amenity);
                  return (
                    <td key={prop._id} className="p-4">
                      {hasAmenity ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                          <Check className="w-4 h-4" />
                          <span>Included</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Minus className="w-4 h-4" />
                          <span>No</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
