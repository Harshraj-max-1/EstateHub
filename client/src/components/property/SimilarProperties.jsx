import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { PropertyCardSkeleton } from '../common/SkeletonLoader';
import api from '../../api/axios';

const SimilarProperties = ({ propertyId }) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;
    const fetchSimilar = async () => {
      try {
        const res = await api.get(`/properties/${propertyId}/similar`);
        if (res.data.success) {
          setSimilar(res.data.properties);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSimilar();
  }, [propertyId]);

  if (!loading && similar.length === 0) return null;

  return (
    <div className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Similar Properties You May Like
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rule-based smart matches based on city, price range, and configuration
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <PropertyCardSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similar.map((prop) => (
            <PropertyCard key={prop._id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilarProperties;
