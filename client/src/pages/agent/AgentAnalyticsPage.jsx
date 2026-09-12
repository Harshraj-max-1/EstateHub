import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import { Eye, FileQuestion, CalendarCheck, TrendingUp, Building } from 'lucide-react';
import api from '../../api/axios';

const AgentAnalyticsPage = () => {
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
    totalViews: 0,
    totalEnquiries: 0,
    totalAppointments: 0
  };

  return (
    <DashboardLayout
      title="Performance Analytics"
      subtitle="In-depth breakdown of property engagement, lead conversions, and visit requests."
    >
      <div className="flex flex-col gap-8">
        {/* KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Views" value={stats.totalViews} icon={Eye} color="indigo" />
          <StatCard title="Active Properties" value={stats.activeListings} icon={Building} color="emerald" />
          <StatCard title="Inquiries Received" value={stats.totalEnquiries} icon={FileQuestion} color="blue" />
          <StatCard title="Visits Requested" value={stats.totalAppointments} icon={CalendarCheck} color="purple" />
        </div>

        {/* Big Views Trend Chart */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              7-Day Visitor Discovery Curve
            </h3>
            <p className="text-xs text-slate-400">Total property impressions and detail page views</p>
          </div>

          <div className="h-72 w-full">
            {analytics?.charts?.viewsOverTime ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.charts.viewsOverTime}>
                  <defs>
                    <linearGradient id="colorViewsPage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
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
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorViewsPage)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Loading analytics...
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentAnalyticsPage;
