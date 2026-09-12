import React, { useEffect, useState } from 'react';
import { Heart, Building } from 'lucide-react';
import PropertyGrid from '../components/property/PropertyGrid';
import EmptyState from '../components/common/EmptyState';
import api from '../api/axios';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get('/favorites');
      if (res.data.success) {
        setFavorites(res.data.properties);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
          Saved Wishlist
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Saved Properties ({favorites.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quickly access and compare your bookmarked homes and investments.
        </p>
      </div>

      {/* Grid */}
      <PropertyGrid
        properties={favorites}
        loading={loading}
        emptyTitle="Your Wishlist is Empty"
        emptyDescription="You haven't saved any properties yet. Click the heart icon on any property to bookmark it here."
        onResetFilters={() => (window.location.href = '/properties')}
      />
    </div>
  );
};

export default FavoritesPage;
