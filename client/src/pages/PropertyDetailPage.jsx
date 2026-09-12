import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Heart,
  Scale,
  Share2,
  Flag,
  Phone,
  Mail,
  MessageSquare,
  Star,
  CheckCircle2,
  ShieldCheck,
  Building,
  Car,
  Layers,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import PropertyGallery from '../components/property/PropertyGallery';
import PropertyMapView from '../components/property/PropertyMapView';
import SimilarProperties from '../components/property/SimilarProperties';
import EnquiryModal from '../components/modals/EnquiryModal';
import AppointmentModal from '../components/modals/AppointmentModal';
import ReportModal from '../components/modals/ReportModal';
import ReviewModal from '../components/modals/ReviewModal';
import ShareModal from '../components/modals/ShareModal';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { formatPrice, formatArea, formatDate, getInitials } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import api from '../api/axios';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCompare, removeFromCompare, isComparing } = useCompare();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(5.0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Modals state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchPropertyData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/properties/${id}`);
        if (res.data.success) {
          setProperty(res.data.property);

          // Check if favorited
          if (isAuthenticated) {
            api.get(`/favorites/check/${res.data.property._id}`).then((favRes) => {
              if (favRes.data.success) setIsFavorite(favRes.data.isFavorite);
            });
          }

          // Fetch agent reviews
          if (res.data.property?.agent?._id) {
            api.get(`/reviews/agent/${res.data.property.agent._id}`).then((revRes) => {
              if (revRes.data.success) {
                setReviews(revRes.data.reviews);
                setAvgRating(revRes.data.avgRating);
                setTotalReviews(revRes.data.totalReviews);
              }
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      alert('Please login to save this property.');
      return;
    }
    setFavLoading(true);
    try {
      const res = await api.post(`/favorites/${property._id}`);
      if (res.data.success) {
        setIsFavorite(res.data.isFavorite);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/messages/conversations', {
        receiverId: property.agent._id,
        propertyId: property._id
      });
      if (res.data.success) {
        navigate(`/messages?conv=${res.data.conversation._id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse flex flex-col gap-6">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
            </div>
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Property Not Found
        </h2>
        <p className="text-sm text-slate-500">
          The property you are looking for does not exist or has been removed.
        </p>
        <Link to="/properties">
          <Button variant="primary">Browse All Properties</Button>
        </Link>
      </div>
    );
  }

  const comparing = isComparing(property._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>
      </div>

      {/* Top Header: Title, Badges, Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={property.listingType === 'BUY' ? 'buy' : 'rent'}>
              For {property.listingType}
            </Badge>
            {property.isFeatured && (
              <Badge variant="featured">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Featured Listing
              </Badge>
            )}
            <Badge variant="default">{property.propertyType}</Badge>
            <Badge variant="success">Verified Property</Badge>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span>
              {property.location?.address}, {property.location?.locality}, {property.location?.city}, {property.location?.state}
            </span>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              if (comparing) {
                removeFromCompare(property._id);
              } else {
                const res = addToCompare(property);
                if (!res.success) alert(res.message);
              }
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              comparing
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{comparing ? 'In Compare' : 'Compare'}</span>
          </button>

          <button
            onClick={handleFavoriteToggle}
            disabled={favLoading}
            className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer ${
              isFavorite ? 'bg-red-50 dark:bg-red-950/40 border-red-200 text-red-500' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
          </button>

          <button
            onClick={() => setShareModalOpen(true)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Share property"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setReportModalOpen(true)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            title="Report listing"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      <PropertyGallery images={property.images} title={property.title} />

      {/* Main Content Layout: Details + Sticky Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10 items-start">
        {/* Left 2 Columns: Specs, Description, Amenities, Map, Reviews */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* Key Specs Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-indigo-500" /> Bedrooms
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {property.bedrooms ? `${property.bedrooms} BHK` : 'N/A'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-indigo-500" /> Bathrooms
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {property.bathrooms ? `${property.bathrooms} Baths` : 'N/A'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Square className="w-3.5 h-3.5 text-indigo-500" /> Super Area
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {formatArea(property.area)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-indigo-500" /> Furnishing
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {property.furnishing}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              About this Property
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {property.description}
            </div>

            {/* Additional Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Total Floors:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{property.floors} Floors</p>
              </div>
              <div>
                <span className="text-slate-400">Covered Parking:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{property.parking} Spaces</p>
              </div>
              <div>
                <span className="text-slate-400">Year of Construction:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{property.constructionYear || 2023}</p>
              </div>
              <div>
                <span className="text-slate-400">Listing Status:</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Ready for Possession</p>
              </div>
              <div>
                <span className="text-slate-400">Verified By:</span>
                <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">EstateHub Inspection</p>
              </div>
              <div>
                <span className="text-slate-400">Listing Date:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(property.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Features & Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location & Map Section */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Location & Neighborhood
            </h3>
            <p className="text-xs text-slate-500">
              {property.location?.address}, {property.location?.locality}, {property.location?.city}
            </p>
            <PropertyMapView
              properties={[property]}
              center={[property.location?.coordinates?.lat || 28.5355, property.location?.coordinates?.lng || 77.3910]}
              zoom={14}
              className="h-80"
            />
          </div>

          {/* Agent Section & Verified Reviews */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                {property.agent?.avatar ? (
                  <img
                    src={property.agent.avatar}
                    alt={property.agent.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center">
                    {getInitials(property.agent?.name)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {property.agent?.name}
                    </h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      Verified Agent
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {property.agent?.agencyName || 'Independent Real Estate Consultant'} • {property.agent?.experienceYears || 5}+ Years Experience
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{avgRating} ({totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleStartChat} variant="outline" size="sm" icon={MessageSquare}>
                  Chat
                </Button>
                {isAuthenticated && user?.role === 'BUYER' && (
                  <Button onClick={() => setReviewModalOpen(true)} variant="ghost" size="sm">
                    Write Review
                  </Button>
                )}
              </div>
            </div>

            {/* Reviews List */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Client Reviews ({reviews.length})
              </h4>
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400">No reviews published yet for this agent.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                            {getInitials(rev.user?.name)}
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {rev.user?.name}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-400 text-xs">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Column: Price and Scheduling Action Box */}
        <div className="lg:col-span-1 sticky top-24">
          <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl flex flex-col gap-6">
            {/* Price Box */}
            <div className="flex flex-col pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Offering Price
              </span>
              <span className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {formatPrice(property.price, property.listingType)}
              </span>
              {property.price && property.area && property.listingType === 'BUY' && (
                <span className="text-xs text-slate-500 mt-1 font-medium">
                  Estimated ₹{Math.round(property.price / property.area).toLocaleString('en-IN')}/sqft
                </span>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  if (!isAuthenticated) navigate('/login');
                  else setAppointmentModalOpen(true);
                }}
                variant="primary"
                size="md"
                icon={Calendar}
                className="w-full py-3.5 text-sm"
              >
                Schedule Site Visit
              </Button>

              <Button
                onClick={() => {
                  if (!isAuthenticated) navigate('/login');
                  else setEnquiryModalOpen(true);
                }}
                variant="outline"
                size="md"
                icon={Mail}
                className="w-full py-3.5 text-sm"
              >
                Send Enquiry to Agent
              </Button>

              <Button
                onClick={handleStartChat}
                variant="ghost"
                size="md"
                icon={MessageSquare}
                className="w-full py-3 text-xs"
              >
                Direct Chat with Agent
              </Button>
            </div>

            {/* Trust highlights */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-indigo-700 dark:text-indigo-300">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>EstateHub Buyer Protection</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Your appointment is guaranteed and monitored for quality. Zero spam calls from third parties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rule-Based Recommendations Carousel */}
      <SimilarProperties propertyId={property._id} />

      {/* Action Modals */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        property={property}
      />
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        property={property}
      />
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        property={property}
      />
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        agent={property.agent}
        property={property}
        onReviewSubmitted={(newRev) => setReviews([newRev, ...reviews])}
      />
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        property={property}
      />
    </div>
  );
};

export default PropertyDetailPage;
