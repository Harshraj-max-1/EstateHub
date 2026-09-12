import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  CheckCircle2,
  Clock,
  FileQuestion,
  CalendarCheck,
  Eye,
  PlusCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatPrice, formatArea, getImageUrl } from '../../utils/formatters';
import api from '../../api/axios';

const STATUS_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const AgentDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/agent');
        if (res.data.success) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const stats = analytics?.stats || {
    totalProperties: 0,
    activeListings: 0,
    pendingListings: 0,
    totalEnquiries: 0,
    totalAppointments: 0,
    totalViews: 0
  };

  return (
    <DashboardLayout
      title="Agent Dashboard"
      subtitle="Track your listing performance, incoming buyer inquiries, and upcoming visits."
      actions={
        <Link to="/agent/properties/new">
          <Button variant="primary" size="sm" icon={PlusCircle}>
            Add New Property
          </Button>
        </Link>
      }
    >
      <div className="flex flex-col gap-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            title="Active Listings"
            value={stats.activeListings}
            icon={Building}
            color="emerald"
            trend={12}
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingListings}
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Total Property Views"
            value={stats.totalViews}
            icon={Eye}
            color="indigo"
            trend={18}
          />
          <StatCard
            title="Buyer Enquiries"
            value={stats.totalEnquiries}
            icon={FileQuestion}
            color="blue"
            trend={8}
          />
          <StatCard
            title="Scheduled Visits"
            value={stats.totalAppointments}
            icon={CalendarCheck}
            color="purple"
          />
          <StatCard
            title="Total Portfolio"
            value={stats.totalProperties}
            icon={TrendingUp}
            color="rose"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Views Chart */}
          <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Property Views (Last 7 Days)
              </h3>
              <p className="text-xs text-slate-400">Daily unique buyer discovery trends</p>
            </div>

            <div className="h-64 w-full">
              {analytics?.charts?.viewsOverTime ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.charts.viewsOverTime}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading charts...
                </div>
              )}
            </div>
          </div>

          {/* Status Distribution Pie */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Listings Status Breakdown
              </h3>
              <p className="text-xs text-slate-400">Active vs Pending vs Rejected</p>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              {analytics?.charts?.statusDistribution ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.charts.statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.charts.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Rejected
              </span>
            </div>
          </div>
        </div>

        {/* Top Performing Properties Table */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Top Performing Properties
            </h3>
            <Link
              to="/agent/properties"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Property</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Views</th>
                  <th className="pb-3">Enquiries</th>
                  <th className="pb-3">Visits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {analytics?.topProperties?.map((prop) => (
                  <tr key={prop._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-4 flex items-center gap-3">
                      <img
                        src={getImageUrl(prop.images?.[0]?.url)}
                        alt={prop.title}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <Link
                        to={`/properties/${prop.slug || prop._id}`}
                        className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 truncate max-w-xs block"
                      >
                        {prop.title}
                      </Link>
                    </td>
                    <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">
                      {formatPrice(prop.price)}
                    </td>
                    <td className="py-3.5">
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
                    </td>
                    <td className="py-3.5 font-semibold text-slate-600 dark:text-slate-300">
                      {prop.viewsCount || 0}
                    </td>
                    <td className="py-3.5 font-semibold text-slate-600 dark:text-slate-300">
                      {prop.enquiriesCount || 0}
                    </td>
                    <td className="py-3.5 font-semibold text-slate-600 dark:text-slate-300">
                      {prop.appointmentsCount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentDashboardPage;
