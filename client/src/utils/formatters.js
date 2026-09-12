/**
 * Formats property price into Indian currency format (Lakhs, Crores, K, etc.)
 */
export const formatPrice = (price, listingType = 'BUY') => {
  if (!price && price !== 0) return '₹0';

  if (listingType === 'RENT') {
    return `₹${price.toLocaleString('en-IN')}/mo`;
  }

  if (price >= 10000000) {
    const cr = (price / 10000000).toFixed(2).replace(/\.00$/, '');
    return `₹${cr} Cr`;
  }

  if (price >= 100000) {
    const lakh = (price / 100000).toFixed(2).replace(/\.00$/, '');
    return `₹${lakh} Lakh`;
  }

  return `₹${price.toLocaleString('en-IN')}`;
};

/**
 * Formats area in sqft
 */
export const formatArea = (sqft) => {
  if (!sqft) return '0 sqft';
  return `${Number(sqft).toLocaleString('en-IN')} sqft`;
};

/**
 * Formats date into readable string
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Formats time relative (e.g. "2 hours ago")
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateStr);
};

/**
 * Resolve full image URL (handles external Unsplash/Cloudinary or local /uploads)
 */
export const getImageUrl = (url) => {
  if (!url) {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Local static upload
  return url;
};

/**
 * Get user initials for avatar fallback
 */
export const getInitials = (name) => {
  if (!name) return 'EH';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
