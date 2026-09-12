import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Check, X, Building, MapPin, User, ExternalLink, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { formatPrice, formatArea, formatDate, getImageUrl } from '../../utils/formatters';
import api from '../../api/axios';

const AdminPropertiesPage = () => {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rejection Dialog State
  const [rejectProperty, setRejectProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/properties/pending');
      if (res.data.success) {
        setPendingProperties(res.data.properties);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (propertyId) => {
    if (!window.confirm('Approve and publish this property to live search?')) return;
    try {
      const res = await api.put(`/admin/properties/${propertyId}/review`, {
        action: 'APPROVE'
      });
      if (res.data.success) {
        setPendingProperties((prev) => prev.filter((p) => p._id !== propertyId));
        alert('Property approved and published successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to approve property');
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectProperty) return;

    setActionLoading(true);
    try {
      const res = await api.put(`/admin/properties/${rejectProperty._id}/review`, {
        action: 'REJECT',
        rejectionReason
      });
      if (res.data.success) {
        setPendingProperties((prev) => prev.filter((p) => p._id !== rejectProperty._id));
        setRejectProperty(null);
        setRejectionReason('');
        alert('Property rejected and feedback sent to agent.');
      }
    } catch (err) {
      alert(err.message || 'Failed to reject property');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Listing Approval Queue"
      subtitle="Review pending agent property submissions, verify coordinates, and approve for public discovery."
    >
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
            ))}
          </div>
        ) : pendingProperties.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="All Clear! No Pending Reviews"
            description="All submitted property listings have been reviewed and approved."
          />
        ) : (
          <div className="flex flex-col gap-5">
            {pendingProperties.map((prop) => (
              <div
                key={prop._id}
                className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col lg:flex-row gap-6 items-start justify-between"
              >
                <div className="flex flex-col sm:flex-row gap-5 flex-1 items-start">
                  <img
                    src={getImageUrl(prop.images?.[0]?.url)}
                    alt={prop.title}
                    className="w-full sm:w-44 h-36 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" size="xs">
                        Pending Review
                      </Badge>
                      <Badge size="xs">{prop.propertyType}</Badge>
                      <span className="text-[11px] font-bold text-slate-400">
                        For {prop.listingType}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {prop.title}
                    </h3>

                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                      {formatPrice(prop.price, prop.listingType)}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      <span>
                        {prop.location?.address}, {prop.location?.locality}, {prop.location?.city}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
                      <span>{prop.bedrooms || 0} BHK</span>
                      <span>•</span>
                      <span>{prop.bathrooms || 0} Baths</span>
                      <span>•</span>
                      <span>{formatArea(prop.area)}</span>
                      <span>•</span>
                      <span>{prop.furnishing}</span>
                    </div>

                    {/* Agent snippet */}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Submitted by <strong>{prop.agent?.name}</strong> ({prop.agent?.email}, {prop.agent?.phone})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Approve / Reject Actions */}
                <div className="flex sm:flex-row lg:flex-col items-center gap-2.5 w-full lg:w-44 flex-shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800">
                  <Button
                    onClick={() => handleApprove(prop._id)}
                    variant="success"
                    size="sm"
                    icon={Check}
                    className="w-full"
                  >
                    Approve & Publish
                  </Button>

                  <Button
                    onClick={() => setRejectProperty(prop)}
                    variant="danger"
                    size="sm"
                    icon={X}
                    className="w-full"
                  >
                    Reject with Notes
                  </Button>

                  <Link
                    to={`/properties/${prop.slug || prop._id}`}
                    target="_blank"
                    className="w-full text-center py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1"
                  >
                    <span>Inspect Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Listing Reason Modal */}
      <Modal
        isOpen={Boolean(rejectProperty)}
        onClose={() => setRejectProperty(null)}
        title="Reject Property Listing"
        subtitle={`Provide feedback for ${rejectProperty?.agent?.name}`}
      >
        <form onSubmit={handleRejectSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Rejection Reason & Required Changes *
            </label>
            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please update photos with clearer resolution, or specify exact floor number..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              onClick={() => setRejectProperty(null)}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm" isLoading={actionLoading}>
              Reject Listing
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminPropertiesPage;
