import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  FileQuestion,
  CalendarCheck,
  BarChart3,
  Users,
  ShieldAlert,
  Settings,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardSidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const agentLinks = [
    { label: 'Overview', to: '/agent', icon: LayoutDashboard, end: true },
    { label: 'My Properties', to: '/agent/properties', icon: Building },
    { label: 'Add Property', to: '/agent/properties/new', icon: PlusCircle },
    { label: 'Enquiries', to: '/agent/enquiries', icon: FileQuestion },
    { label: 'Appointments', to: '/agent/appointments', icon: CalendarCheck },
    { label: 'Analytics', to: '/agent/analytics', icon: BarChart3 }
  ];

  const adminLinks = [
    { label: 'Platform Stats', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Review Listings', to: '/admin/properties', icon: CheckSquare },
    { label: 'Manage Users', to: '/admin/users', icon: Users },
    { label: 'Report Moderation', to: '/admin/reports', icon: ShieldAlert }
  ];

  const links = role === 'ADMIN' ? adminLinks : agentLinks;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col gap-2">
        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            {role === 'ADMIN' ? 'Admin Portal' : 'Agent Management'}
          </span>
        </div>

        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
