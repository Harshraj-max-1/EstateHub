import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  Heart,
  Scale,
  MessageSquare,
  Sun,
  Moon,
  User,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  ShieldCheck,
  CalendarCheck,
  FileQuestion,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCompare } from '../../context/CompareContext';
import NotificationDropdown from './NotificationDropdown';
import Button from './Button';
import { getInitials } from '../../utils/formatters';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { compareCount } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-400 bg-clip-text text-transparent">
              Estate<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
            </span>
            <span className="text-[10px] -mt-1 font-medium tracking-wider text-slate-400 uppercase">
              Real Estate Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Link
            to="/properties"
            className={`px-3 py-2 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80 ${
              isActive('/properties') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40' : ''
            }`}
          >
            Explore Properties
          </Link>

          <Link
            to="/compare"
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 ${
              isActive('/compare') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40' : ''
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Compare</span>
            {compareCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-indigo-600 text-white rounded-full">
                {compareCount}
              </span>
            )}
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/favorites"
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 ${
                  isActive('/favorites') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40' : ''
                }`}
              >
                <Heart className="w-4 h-4 text-red-500" />
                <span>Favorites</span>
              </Link>

              <Link
                to="/messages"
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 ${
                  isActive('/messages') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40' : ''
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Add Property CTA for Agents */}
          {user?.role === 'AGENT' && (
            <Link to="/agent/properties/new" className="hidden sm:inline-flex">
              <Button size="sm" icon={PlusCircle} variant="primary">
                Add Property
              </Button>
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          {/* Real-time Notifications */}
          {isAuthenticated && <NotificationDropdown />}

          {/* User Profile / Auth State */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {getInitials(user?.name)}
                  </div>
                )}
                <span className="hidden lg:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {user?.name}
                </span>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 py-2 divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.email}
                    </p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {user?.role} ACCOUNT
                    </span>
                  </div>

                  <div className="py-1">
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-500" />
                        Admin Portal
                      </Link>
                    )}

                    {user?.role === 'AGENT' && (
                      <>
                        <Link
                          to="/agent"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                          Agent Dashboard
                        </Link>
                        <Link
                          to="/agent/properties/new"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-500" />
                          Add New Property
                        </Link>
                      </>
                    )}

                    {user?.role === 'BUYER' && (
                      <>
                        <Link
                          to="/my-appointments"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <CalendarCheck className="w-4 h-4 text-emerald-500" />
                          My Scheduled Visits
                        </Link>
                        <Link
                          to="/my-enquiries"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <FileQuestion className="w-4 h-4 text-amber-500" />
                          My Enquiries
                        </Link>
                      </>
                    )}

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      Profile Settings
                    </Link>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 flex flex-col gap-2">
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Explore Properties
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4" /> Compare
            </span>
            {compareCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-indigo-600 text-white rounded-full font-bold">
                {compareCount}
              </span>
            )}
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-red-500" /> Favorites
              </Link>
              <Link
                to="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Messages
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
