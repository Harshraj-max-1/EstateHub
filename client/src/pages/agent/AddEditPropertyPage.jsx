import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Building2,
  FileText,
  MapPin,
  Sparkles,
  Upload,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Star,
  Plus
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  INDIAN_CITIES,
  PROPERTY_TYPES,
  FURNISHING_STATUS,
  AMENITIES_LIST
} from '../../utils/constants';
import { formatPrice, formatArea, getImageUrl } from '../../utils/formatters';
import api from '../../api/axios';

const STEPS = [
  { id: 1, name: 'Basic Info', icon: Building2 },
  { id: 2, name: 'Details & Specs', icon: FileText },
  { id: 3, name: 'Location & Map', icon: MapPin },
  { id: 4, name: 'Amenities', icon: Sparkles },
  { id: 5, name: 'Photos & Media', icon: Upload },
  { id: 6, name: 'Review & Submit', icon: CheckCircle2 }
];

const AddEditPropertyPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    listingType: 'BUY',
    price: '',
    area: '',
    bedrooms: 2,
    bathrooms: 2,
    floors: 1,
    parking: 1,
    furnishing: 'Semi-Furnished',
    constructionYear: new Date().getFullYear(),
    location: {
      country: 'India',
      state: 'Uttar Pradesh',
      city: 'Noida',
      locality: 'Sector 150',
      address: '',
      coordinates: { lat: 28.4385, lng: 77.4947 }
    },
    amenities: ['Gym', '24x7 Security', 'Power Backup', 'Lift'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        isPrimary: true
      }
    ]
  });

  // Load existing property data in Edit Mode
  useEffect(() => {
    if (!isEditMode) return;
    const loadProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        if (res.data.success) {
          setFormData(res.data.property);
        }
      } catch (err) {
        setError(err.message || 'Failed to load property details.');
      }
    };
    loadProperty();
  }, [id, isEditMode]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.title || !formData.description) {
        setError('Please provide a property title and description.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.price || !formData.area) {
        setError('Please provide price and total area.');
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.location.city || !formData.location.locality || !formData.location.address) {
        setError('Please fill in city, locality, and complete address.');
        return;
      }
    }
    if (currentStep === 5) {
      if (formData.images.length === 0) {
        setError('Please upload or include at least one property photo.');
        return;
      }
    }

    setError('');
    setCurrentStep((prev) => Math.min(STEPS.length, prev + 1));
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  // Image upload handler
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError('');

    const uploadFormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadFormData.append('images', files[i]);
    }

    try {
      const res = await api.post('/properties/upload-images', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...res.data.images]
        }));
      }
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const filtered = prev.images.filter((_, idx) => idx !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return { ...prev, images: filtered };
    });
  };

  const setPrimaryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, idx) => ({
        ...img,
        isPrimary: idx === index
      }))
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (isEditMode) {
        const res = await api.put(`/properties/${id}`, formData);
        if (res.data.success) {
          alert('Property updated successfully!');
          navigate('/agent/properties');
        }
      } else {
        const res = await api.post('/properties', formData);
        if (res.data.success) {
          alert(res.data.message);
          navigate('/agent/properties');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to submit property listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title={isEditMode ? 'Edit Property Listing' : 'Create New Property Listing'}
      subtitle="Complete the guided 6-step wizard to submit your property for admin review and publication."
    >
      <div className="flex flex-col gap-8">
        {/* Wizard Stepper Header */}
        <div className="p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px]">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-4 ring-indigo-500/20'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Step {step.id}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {step.id !== STEPS.length && (
                    <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-800 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Form Body */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-semibold border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          {/* STEP 1: Basic Info */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 1: Basic Information
              </h3>

              <Input
                label="Property Title *"
                placeholder="e.g. ATS Pristine Ultra Luxury 3BHK Green Suite"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Listing Type *"
                  options={[
                    { value: 'BUY', label: 'For Sale (Buy)' },
                    { value: 'RENT', label: 'For Rent' }
                  ]}
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                  placeholder=""
                />

                <Select
                  label="Property Category *"
                  options={PROPERTY_TYPES}
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  placeholder=""
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Detailed Description *
                </label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe key highlights, floor plan, views, sunlight, ventilation, and nearby landmarks..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: Details & Specs */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 2: Pricing & Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={formData.listingType === 'BUY' ? 'Price (in ₹) *' : 'Monthly Rent (in ₹) *'}
                  type="number"
                  placeholder="e.g. 18500000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
                <Input
                  label="Super Area (in Sqft) *"
                  type="number"
                  placeholder="e.g. 2150"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Input
                  label="Bedrooms (BHK)"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                />
                <Input
                  label="Bathrooms"
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                />
                <Input
                  label="Total Floors"
                  type="number"
                  min="1"
                  value={formData.floors}
                  onChange={(e) => setFormData({ ...formData, floors: Number(e.target.value) })}
                />
                <Input
                  label="Parking Spaces"
                  type="number"
                  min="0"
                  value={formData.parking}
                  onChange={(e) => setFormData({ ...formData, parking: Number(e.target.value) })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Furnishing Status"
                  options={FURNISHING_STATUS}
                  value={formData.furnishing}
                  onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                  placeholder=""
                />
                <Input
                  label="Construction / Handover Year"
                  type="number"
                  value={formData.constructionYear}
                  onChange={(e) =>
                    setFormData({ ...formData, constructionYear: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 3: Location */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 3: Location & Coordinates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="City *"
                  options={INDIAN_CITIES}
                  value={formData.location.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, city: e.target.value }
                    })
                  }
                  placeholder=""
                />
                <Input
                  label="Locality / Sector *"
                  placeholder="e.g. Sector 150"
                  value={formData.location.locality}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, locality: e.target.value }
                    })
                  }
                  required
                />
              </div>

              <Input
                label="Full Address *"
                placeholder="e.g. Tower 4, Flat 1802, ATS Pristine, Noida Expressway"
                value={formData.location.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value }
                  })
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Latitude"
                  type="number"
                  step="any"
                  value={formData.location.coordinates.lat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        coordinates: {
                          ...formData.location.coordinates,
                          lat: Number(e.target.value)
                        }
                      }
                    })
                  }
                />
                <Input
                  label="Longitude"
                  type="number"
                  step="any"
                  value={formData.location.coordinates.lng}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        coordinates: {
                          ...formData.location.coordinates,
                          lng: Number(e.target.value)
                        }
                      }
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 4: Amenities */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 4: Select Amenities & Features
              </h3>
              <p className="text-xs text-slate-500">
                Choose all facilities available in this residential or commercial unit.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {AMENITIES_LIST.map((amenity) => {
                  const isSelected = formData.amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <span>{amenity}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Images */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 5: Upload Property Photos
              </h3>

              {/* Upload Drop Area */}
              <div className="p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col items-center justify-center text-center gap-3">
                <Upload className="w-10 h-10 text-indigo-500" />
                <div>
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Click to upload images
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG, WEBP up to 10MB each</p>
                </div>
                {uploadingImages && (
                  <span className="text-xs text-indigo-600 font-bold animate-pulse">
                    Uploading images, please wait...
                  </span>
                )}
              </div>

              {/* Uploaded Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group h-32 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800"
                  >
                    <img
                      src={getImageUrl(img.url)}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {img.isPrimary && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white shadow-sm">
                        Primary Cover
                      </span>
                    )}

                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(idx)}
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-white text-white hover:text-slate-900 text-xs font-bold transition-colors"
                          title="Set as Primary Cover"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-bold transition-colors"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-6 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 6: Review & Finalize Listing
              </h3>

              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-6 items-start">
                <img
                  src={getImageUrl(formData.images?.[0]?.url)}
                  alt="Review"
                  className="w-full md:w-56 h-40 rounded-2xl object-cover"
                />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={formData.listingType === 'BUY' ? 'buy' : 'rent'}>
                      For {formData.listingType}
                    </Badge>
                    <Badge>{formData.propertyType}</Badge>
                    <Badge variant="warning">Status: Pending Admin Approval</Badge>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    {formData.title}
                  </h4>
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {formatPrice(formData.price, formData.listingType)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formData.location?.address}, {formData.location?.locality}, {formData.location?.city}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                    <span>{formData.bedrooms} BHK</span>
                    <span>•</span>
                    <span>{formData.bathrooms} Baths</span>
                    <span>•</span>
                    <span>{formatArea(formData.area)}</span>
                    <span>•</span>
                    <span>{formData.furnishing}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
                <strong>Publication Notice:</strong> After submission, this property listing will be reviewed by an EstateHub Administrator. You will receive an instant notification once approved.
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            {currentStep > 1 ? (
              <Button onClick={handlePrev} variant="outline" size="sm" icon={ArrowLeft}>
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNext}
                variant="primary"
                size="sm"
                icon={ArrowRight}
                iconPosition="right"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="success"
                size="md"
                isLoading={loading}
                icon={CheckCircle2}
              >
                {isEditMode ? 'Save & Submit Changes' : 'Submit Property for Review'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddEditPropertyPage;
