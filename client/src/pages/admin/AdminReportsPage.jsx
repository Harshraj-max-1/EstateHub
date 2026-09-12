import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ExternalLink, Check, Trash2, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, getImageUrl } from '../../utils/formatters';
import api from '../../api/axios';

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Resolution Modal State
  const [activeReport, setActiveReport] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('RESOLVED');
  const [adminNotes, setAdminNotes] = useState('');
  const [removeProperty, setRemoveProperty] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports?status=${statusFilter}`);
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const openResolutionModal = (rep) => {
    setActiveReport(rep);
    setUpdateStatus(rep.status);
    setAdminNotes(rep.adminNotes || '');
    setRemoveProperty(false);
  };

  const handleSaveResolution = async (e) => {
    e.preventDefault();
    if (!activeReport) return;

    setSaving(true);
    try {
      const res = await api.put(`/reports/${activeReport._id}`, {
        status: updateStatus,
        adminNotes,
        removeProperty
      });
      if (res.data.success) {
        setReports((prev) =>
          prev.map((r) => (r._id === activeReport._id ? res.data.report : r))
        );
        setActiveReport(null);
        alert('Report status updated successfully.');
      }
    } catch (err) {
      alert(err.message || 'Failed to update report');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Pending Review</Badge>;
      case 'INVESTIGATING':
        return <Badge variant="buy">Under Investigation</Badge>;
      case 'RESOLVED':
        return <Badge variant="success">Resolved</Badge>;
      case 'DISMISSED':
        return <Badge variant="default">Dismissed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Listing Moderation & Reports"
      subtitle="Investigate user reports for fake, inaccurate, or fraudulent property listings."
    >
      <div className="flex flex-col gap-6">
        {/* Status Filters */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit overflow-x-auto">
          {['ALL', 'PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Reports' : st}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="No Flagged Reports"
            description="There are currently no reports filed under this status."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {reports.map((rep) => (
              <div
                key={rep._id}
                className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(rep.status)}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                      Reason: {rep.reason}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Reported {formatDate(rep.createdAt)}
                    </span>
                  </div>

                  {rep.property ? (
                    <Link
                      to={`/properties/${rep.property.slug || rep.property._id}`}
                      target="_blank"
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 flex items-center gap-1.5"
                    >
                      <span>Flagged Property: {rep.property.title}</span>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </Link>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Property Deleted / Removed
                    </span>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <strong>Reporter Description:</strong> "{rep.description}"
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>
                      Reported by: <strong>{rep.reporter?.name}</strong> ({rep.reporter?.email})
                    </span>
                  </div>

                  {rep.adminNotes && (
                    <div className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                      <strong>Admin Resolution Note:</strong> {rep.adminNotes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800 flex-shrink-0">
                  <Button
                    onClick={() => openResolutionModal(rep)}
                    variant="primary"
                    size="sm"
                  >
                    Moderate & Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Moderate Report Modal */}
      <Modal
        isOpen={Boolean(activeReport)}
        onClose={() => setActiveReport(null)}
        title="Moderate Flagged Listing"
        subtitle={`Investigating report: ${activeReport?.reason}`}
      >
        <form onSubmit={handleSaveResolution} className="flex flex-col gap-4">
          <Select
            label="Resolution Status"
            options={[
              { value: 'PENDING', label: 'PENDING' },
              { value: 'INVESTIGATING', label: 'INVESTIGATING' },
              { value: 'RESOLVED', label: 'RESOLVED' },
              { value: 'DISMISSED', label: 'DISMISSED' }
            ]}
            value={updateStatus}
            onChange={(e) => setUpdateStatus(e.target.value)}
            placeholder=""
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Admin Resolution Notes
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="e.g. Verified ownership with agent, fixed price error..."
            />
          </div>

          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center gap-2">
            <input
              type="checkbox"
              id="removeProp"
              checked={removeProperty}
              onChange={(e) => setRemoveProperty(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
            />
            <label htmlFor="removeProp" className="text-xs font-bold text-red-700 dark:text-red-300 cursor-pointer">
              Also take down listing immediately (Reject property)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              onClick={() => setActiveReport(null)}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={saving}>
              Save Moderation Decision
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminReportsPage;
