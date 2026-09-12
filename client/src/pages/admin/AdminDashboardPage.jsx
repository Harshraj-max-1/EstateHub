import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building,
  CheckSquare,
  ShieldAlert,
  CalendarCheck,
  FileQuestion,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';
import api from '../../api/axios';

const PIE_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  const stats = data?.stats || {
    totalUsers: 0,
    totalAgents: 0,
    totalBuyers: 0,
    totalProperties: 0,
    pendingProperties: 0,
    approvedProperties: 0,
    rejectedProperties: 0,
    totalEnquiries: 0,
    totalAppointments: 0,
    pendingReports: 0
  };

  return (
    <DashboardLayout
      title="Platform Administration"
      subtitle="Comprehensive overview of marketplace operations, pending approvals, and user accounts."
      actions={
        <Link to="/admin/properties">
          <Button variant="primary" size="sm" icon={CheckSquare}>
            Review Pending ({stats.pendingProperties})
          </Button>
        </Link>
      }
    >
      <div className="flex flex-col gap-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Pending Approvals"
            value={stats.pendingProperties}
            icon={CheckSquare}
            color="amber"
          />
          <StatCard
            title="Active Listings"
            value={stats.approvedProperties}
            icon={Building}
            color="emerald"
          />
          <StatCard
            title="Registered Users"
            value={stats.totalUsers}
            icon={Users}
            color="indigo"
          />
          <StatCard
            title="Flagged Reports"
            value={stats.pendingReports}
            icon={ShieldAlert}
            color="rose"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Properties by Type BarChart */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Properties by Category
              </h3>
              <p className="text-xs text-slate-400">Distribution across property types</p>
            </div>

            <div className="h-64 w-full">
              {data?.charts?.propertyTypeCounts ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts.propertyTypeCounts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
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
                    <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading chart...
                </div>
              )}
            </div>
          </div>

          {/* Buy vs Rent PieChart */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Listing Purpose (Buy vs Rent)
              </h3>
              <p className="text-xs text-slate-400">Marketplace inventory split</p>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              {data?.charts?.listingTypeCounts ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.charts.listingTypeCounts}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.charts.listingTypeCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
            </div>

            <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {data?.charts?.listingTypeCounts?.map((item, idx) => (
                <span key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span>{item.name}: {item.value}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Admin Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/properties"
            className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Listing Review Queue
                </h4>
                <p className="text-xs text-slate-400">{stats.pendingProperties} pending approval</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/users"
            className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  User Management
                </h4>
                <p className="text-xs text-slate-400">{stats.totalUsers} total accounts</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/reports"
            className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Report Moderation
                </h4>
                <p className="text-xs text-slate-400">{stats.pendingReports} reported items</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
