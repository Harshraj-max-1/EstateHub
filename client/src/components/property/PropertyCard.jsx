import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Heart,
  Scale,
  Sparkles,
  Check
} from 'lucide-react';
import Badge from '../common/Badge';
import { formatPrice, formatArea, getImageUrl } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import api from '../../api/axios';

const PropertyCard = ({ property, onFavoriteToggle, initialIsFavorite = false }) => {
  const { isAuthenticated } = useAuth();
  const { addToCompare, removeFromCompare, isComparing } = useCompare();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favLoading, setFavLoading] = useState(false);

  const primaryImage =
    property.images?.find((img) => img.isPrimary)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please log in to save properties to your favorites.');
      return;
    }

    setFavLoading(true);
    try {
      const res = await api.post(`/favorites/${property._id}`);
      if (res.data.success) {
        setIsFavorite(res.data.isFavorite);
        if (onFavoriteToggle) onFavoriteToggle(property._id, res.data.isFavorite);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isComparing(property._id)) {
      removeFromCompare(property._id);
    } else {
      const res = addToCompare(property);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  const comparing = isComparing(property._id);

  return (
    <div className="group relative rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Image Container */}
      <Link to={`/properties/${property.slug || property._id}`} className="relative h-60 w-full overflow-hidden block">
        <img
          src={getImageUrl(primaryImage)}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant={property.listingType === 'BUY' ? 'buy' : 'rent'} size="xs">
            For {property.listingType}
          </Badge>
          {property.isFeatured && (
            <Badge variant="featured" size="xs">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Featured
            </Badge>
          )}
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-900/80 text-white backdrop-blur-md">
            {property.propertyType}
          </span>
        </div>

        {/* Action Buttons (Favorite & Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={handleCompareClick}
            className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
              comparing
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900'
            }`}
            title={comparing ? 'Remove from comparison' : 'Compare property'}
            aria-label="Compare property"
          >
            {comparing ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
          </button>

          <button
            onClick={handleFavoriteClick}
            disabled={favLoading}
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer"
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            aria-label="Favorite property"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'
              }`}
            />
          </button>
        </div>

        {/* Bottom Image Overlay: Price */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between z-10">
          <div>
            <span className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
              {formatPrice(property.price, property.listingType)}
            </span>
          </div>
          {property.price && property.area && property.listingType === 'BUY' && (
            <span className="text-[11px] font-semibold text-slate-200 backdrop-blur-sm bg-black/40 px-2 py-0.5 rounded-md">
              ₹{Math.round(property.price / property.area).toLocaleString('en-IN')}/sqft
            </span>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span className="truncate">
              {property.location?.locality}, {property.location?.city}
            </span>
          </div>

          <Link to={`/properties/${property.slug || property._id}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {property.title}
            </h3>
          </Link>
        </div>

        {/* Specs Row */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
          {property.bedrooms !== undefined && property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-slate-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms !== undefined && property.bathrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Square className="w-4 h-4 text-slate-400" />
            <span>{formatArea(property.area)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
