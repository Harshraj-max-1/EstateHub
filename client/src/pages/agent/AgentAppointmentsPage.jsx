import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Calendar, Clock, Check, X, CheckCircle2, User, Phone } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, getImageUrl } from '../../utils/formatters';
import api from '../../api/axios';

const AgentAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Status Action Modal
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [actionStatus, setActionStatus] = useState('');
  const [agentNotes, setAgentNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/appointments/agent?status=${statusFilter}`);
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const openActionModal = (app, status) => {
    setActiveAppointment(app);
    setActionStatus(status);
    setAgentNotes(app.agentNotes || (status === 'CONFIRMED' ? 'Confirmed. Meeting point: Main clubhouse gate.' : ''));
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!activeAppointment || !actionStatus) return;

    setSaving(true);
    try {
      const res = await api.put(`/appointments/${activeAppointment._id}/status`, {
        status: actionStatus,
        agentNotes
      });
      if (res.data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === activeAppointment._id ? res.data.appointment : a))
        );
        setActiveAppointment(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to update visit status');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Needs Confirmation</Badge>;
      case 'CONFIRMED':
        return <Badge variant="success">Confirmed</Badge>;
      case 'COMPLETED':
        return <Badge variant="primary">Completed</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Declined</Badge>;
      case 'CANCELLED':
        return <Badge variant="default">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Scheduled Visits & Tours"
      subtitle="Manage your on-site meeting schedule and coordinate with interested buyers."
    >
      <div className="flex flex-col gap-6">
        {/* Status Filters */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit overflow-x-auto">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Visits' : st}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No Scheduled Visits"
            description="You have no appointments matching this status filter."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {appointments.map((app) => (
              <div
                key={app._id}
                className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  {app.property?.images?.[0] && (
                    <img
                      src={getImageUrl(app.property.images[0].url)}
                      alt={app.property.title}
                      className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(app.status)}
                      <span className="text-[11px] text-slate-400">
                        Requested by {app.user?.name}
                      </span>
                    </div>

                    <Link
                      to={`/properties/${app.property?.slug || app.property?._id}`}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                    >
                      {app.property?.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
                      <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(app.visitDate)}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {app.timeSlot}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3.5 h-3.5" />
                        {app.user?.phone || 'No phone'}
                      </span>
                    </div>

                    {app.message && (
                      <p className="text-xs text-slate-500 italic mt-0.5">
                        Client Note: "{app.message}"
                      </p>
                    )}

                    {app.agentNotes && (
                      <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                        <strong>Meeting Note:</strong> {app.agentNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  {app.status === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => openActionModal(app, 'CONFIRMED')}
                        variant="success"
                        size="sm"
                        icon={Check}
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => openActionModal(app, 'REJECTED')}
                        variant="danger"
                        size="sm"
                        icon={X}
                      >
                        Decline
                      </Button>
                    </>
                  )}

                  {app.status === 'CONFIRMED' && (
                    <Button
                      onClick={() => openActionModal(app, 'COMPLETED')}
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Action Modal */}
      <Modal
        isOpen={Boolean(activeAppointment)}
        onClose={() => setActiveAppointment(null)}
        title={`Update Appointment (${actionStatus})`}
        subtitle={`Scheduled with ${activeAppointment?.user?.name}`}
      >
        <form onSubmit={handleUpdateStatus} className="flex flex-col gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Visit Date: {formatDate(activeAppointment?.visitDate)} • Slot: {activeAppointment?.timeSlot}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Meeting Instructions / Notes for Buyer
            </label>
            <textarea
              rows={3}
              value={agentNotes}
              onChange={(e) => setAgentNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="e.g. Please meet at Tower A lobby. Security has been given visitor pass..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              onClick={() => setActiveAppointment(null)}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={actionStatus === 'REJECTED' ? 'danger' : 'success'}
              size="sm"
              isLoading={saving}
            >
              Confirm {actionStatus}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default AgentAppointmentsPage;
