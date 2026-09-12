import React from 'react';
import PropertyCard from './PropertyCard';
import { PropertyCardSkeleton } from '../common/SkeletonLoader';
import EmptyState from '../common/EmptyState';

const PropertyGrid = ({
  properties = [],
  loading = false,
  skeletonCount = 6,
  onResetFilters,
  emptyTitle,
  emptyDescription,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <PropertyCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No properties found'}
        description={
          emptyDescription || 'We could not find any properties matching your current filters. Try changing or clearing your search criteria.'
        }
        actionLabel={onResetFilters ? 'Clear All Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;
