import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Mail, Phone, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, getImageUrl } from '../../utils/formatters';
import api from '../../api/axios';

const AgentEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('CONTACTED');
  const [agentResponse, setAgentResponse] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/enquiries/agent?status=${statusFilter}`);
      if (res.data.success) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleOpenUpdateModal = (enq) => {
    setSelectedEnquiry(enq);
    setUpdateStatus(enq.status);
    setAgentResponse(enq.agentResponse || '');
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    setUpdating(true);
    try {
      const res = await api.put(`/enquiries/${selectedEnquiry._id}/status`, {
        status: updateStatus,
        agentResponse
      });
      if (res.data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === selectedEnquiry._id ? res.data.enquiry : e))
        );
        setSelectedEnquiry(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="warning">New Enquiry</Badge>;
      case 'CONTACTED':
        return <Badge variant="primary">Contacted</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="buy">In Progress</Badge>;
      case 'CLOSED':
        return <Badge variant="success">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Property Inquiries"
      subtitle="Respond to interested buyers and manage client communication pipelines."
    >
      <div className="flex flex-col gap-6">
        {/* Status Filters */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit overflow-x-auto">
          {['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Inquiries' : st}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <EmptyState
            icon={FileQuestion}
            title="No Inquiries Found"
            description="You have no enquiries matching this status."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {enquiries.map((enq) => (
              <div
                key={enq._id}
                className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(enq.status)}
                      <span className="text-[11px] text-slate-400">
                        Received on {formatDate(enq.createdAt)}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      From: {enq.name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-indigo-500" /> {enq.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-indigo-500" /> {enq.phone}
                      </span>
                    </div>

                    {enq.property && (
                      <Link
                        to={`/properties/${enq.property.slug || enq.property._id}`}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1 block"
                      >
                        Listing: {enq.property.title}
                      </Link>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      "{enq.message}"
                    </p>

                    {enq.agentResponse && (
                      <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                        <strong>Your Reply:</strong> {enq.agentResponse}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  <Button
                    onClick={() => handleOpenUpdateModal(enq)}
                    variant="primary"
                    size="sm"
                    icon={MessageSquare}
                  >
                    Update & Respond
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Enquiry Status Dialog */}
      <Modal
        isOpen={Boolean(selectedEnquiry)}
        onClose={() => setSelectedEnquiry(null)}
        title="Update Inquiry Status"
        subtitle={`Responding to ${selectedEnquiry?.name}`}
      >
        <form onSubmit={handleSaveStatus} className="flex flex-col gap-4">
          <Select
            label="Inquiry Status"
            options={[
              { value: 'NEW', label: 'NEW' },
              { value: 'CONTACTED', label: 'CONTACTED' },
              { value: 'IN_PROGRESS', label: 'IN_PROGRESS' },
              { value: 'CLOSED', label: 'CLOSED' }
            ]}
            value={updateStatus}
            onChange={(e) => setUpdateStatus(e.target.value)}
            placeholder=""
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Agent Response Note for Buyer
            </label>
            <textarea
              rows={4}
              value={agentResponse}
              onChange={(e) => setAgentResponse(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="e.g. Discussed over phone, sent project brochure on WhatsApp..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              onClick={() => setSelectedEnquiry(null)}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={updating}>
              Save & Notify Buyer
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default AgentEnquiriesPage;
