import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Calendar, Clock, MapPin, XCircle, ArrowRight } from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { formatDate, getImageUrl } from '../utils/formatters';
import api from '../api/axios';

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/my');
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
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this visit request?')) return;
    try {
      const res = await api.put(`/appointments/${id}/status`, { status: 'CANCELLED' });
      if (res.data.success) {
        setAppointments((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status: 'CANCELLED' } : app))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Pending Confirmation</Badge>;
      case 'CONFIRMED':
        return <Badge variant="success">Confirmed by Agent</Badge>;
      case 'COMPLETED':
        return <Badge variant="primary">Visit Completed</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Declined</Badge>;
      case 'CANCELLED':
        return <Badge variant="default">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <CalendarCheck className="w-4 h-4" />
          Buyer Schedule
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Scheduled Site Visits ({appointments.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your upcoming in-person property viewings and agent meetings.
        </p>
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
          title="No Visits Scheduled"
          description="Browse available properties and schedule an in-person tour at your convenient date and time."
          actionLabel="Find Properties to Visit"
          onAction={() => (window.location.href = '/properties')}
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
                    className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
                  />
                )}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(app.status)}
                  </div>
                  <Link
                    to={`/properties/${app.property?.slug || app.property?._id}`}
                    className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                  >
                    {app.property?.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                    <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(app.visitDate)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{app.timeSlot}</span>
                    </div>
                  </div>

                  {app.agentNotes && (
                    <div className="mt-1 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200">
                      <strong>Agent Notes:</strong> {app.agentNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500">
                  <span className="block font-semibold text-slate-800 dark:text-slate-200">
                    Host: {app.agent?.name}
                  </span>
                  <span>{app.agent?.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  {app.status === 'PENDING' || app.status === 'CONFIRMED' ? (
                    <button
                      onClick={() => handleCancelAppointment(app._id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      Cancel Visit
                    </button>
                  ) : null}
                  <Link
                    to={`/properties/${app.property?.slug || app.property?._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <span>View Property</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
