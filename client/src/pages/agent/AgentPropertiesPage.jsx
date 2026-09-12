import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, ExternalLink, Eye, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { formatPrice, formatArea, formatDate, getImageUrl } from '../../utils/formatters';
import api from '../../api/axios';

const AgentPropertiesPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/properties/agent/my-properties?status=${statusFilter}&page=${page}&limit=8`);
      if (res.data.success) {
        setProperties(res.data.properties);
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, [statusFilter, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
    try {
      const res = await api.delete(`/properties/${id}`);
      if (res.data.success) {
        setProperties((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete property');
    }
  };

  return (
    <DashboardLayout
      title="My Properties"
      subtitle="Manage your listed homes, apartments, and commercial units."
      actions={
        <Link to="/agent/properties/new">
          <Button variant="primary" size="sm" icon={PlusCircle}>
            Add Property
          </Button>
        </Link>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit overflow-x-auto">
          {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Properties' : st}
            </button>
          ))}
        </div>

        {/* Properties Table / Grid */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <EmptyState
            title="No Properties Found"
            description={
              statusFilter === 'ALL'
                ? 'You have not added any properties yet. Click "Add Property" to create your first listing.'
                : `No properties currently in "${statusFilter}" status.`
            }
            actionLabel="Add New Property"
            onAction={() => navigate('/agent/properties/new')}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {properties.map((prop) => (
              <div
                key={prop._id}
                className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={getImageUrl(prop.images?.[0]?.url)}
                    alt={prop.title}
                    className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          prop.status === 'APPROVED'
                            ? 'success'
                            : prop.status === 'PENDING'
                            ? 'warning'
                            : 'danger'
                        }
                        size="xs"
                      >
                        {prop.status}
                      </Badge>
                      <span className="text-[11px] font-bold text-slate-400">
                        {prop.propertyType} • For {prop.listingType}
                      </span>
                    </div>

                    <Link
                      to={`/properties/${prop.slug || prop._id}`}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                    >
                      {prop.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                      <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                        {formatPrice(prop.price, prop.listingType)}
                      </span>
                      <span>•</span>
                      <span>{formatArea(prop.area)}</span>
                      <span>•</span>
                      <span>{prop.location?.locality}, {prop.location?.city}</span>
                    </div>

                    {prop.status === 'REJECTED' && prop.rejectionReason && (
                      <div className="mt-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Admin Feedback:</strong> {prop.rejectionReason} (Edit listing to resubmit for review)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  <Link
                    to={`/properties/${prop.slug || prop._id}`}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="View Live"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/agent/properties/edit/${prop._id}`}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit Property"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(prop._id)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    title="Delete Property"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
              className="mt-4"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgentPropertiesPage;
