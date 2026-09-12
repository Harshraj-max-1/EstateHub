import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Building, Mail, Phone, Clock, ArrowRight } from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { formatDate, formatPrice, getImageUrl } from '../utils/formatters';
import api from '../api/axios';

const MyEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await api.get('/enquiries/my');
        if (res.data.success) {
          setEnquiries(res.data.enquiries);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="warning">Submitted</Badge>;
      case 'CONTACTED':
        return <Badge variant="primary">Agent Contacted</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="buy">In Progress</Badge>;
      case 'CLOSED':
        return <Badge variant="success">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
          <FileQuestion className="w-4 h-4" />
          Buyer Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Submitted Enquiries ({enquiries.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track agent responses and updates for your property enquiries.
        </p>
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
          title="No Enquiries Submitted"
          description="When you contact an agent about a property, your message history and agent responses will appear here."
          actionLabel="Explore Properties"
          onAction={() => (window.location.href = '/properties')}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {enquiries.map((enq) => (
            <div
              key={enq._id}
              className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                {enq.property?.images?.[0] && (
                  <img
                    src={getImageUrl(enq.property.images[0].url)}
                    alt={enq.property.title}
                    className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                  />
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(enq.status)}
                    <span className="text-[11px] text-slate-400">
                      Submitted on {formatDate(enq.createdAt)}
                    </span>
                  </div>
                  <Link
                    to={`/properties/${enq.property?.slug || enq.property?._id}`}
                    className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                  >
                    {enq.property?.title}
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-1 italic mt-1">
                    "{enq.message}"
                  </p>
                  {enq.agentResponse && (
                    <div className="mt-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200">
                      <strong>Agent Response:</strong> {enq.agentResponse}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500">
                  <span className="block font-semibold text-slate-800 dark:text-slate-200">
                    Agent: {enq.agent?.name}
                  </span>
                  <span>{enq.agent?.phone}</span>
                </div>
                <Link
                  to={`/properties/${enq.property?.slug || enq.property?._id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  <span>View Property</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnquiriesPage;
