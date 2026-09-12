import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CompareProvider } from './context/CompareContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CompareDrawer from './components/property/CompareDrawer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ComparePage from './pages/ComparePage';
import FavoritesPage from './pages/FavoritesPage';
import MessagesPage from './pages/MessagesPage';
import MyEnquiriesPage from './pages/MyEnquiriesPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Agent Pages
import AgentDashboardPage from './pages/agent/AgentDashboardPage';
import AgentPropertiesPage from './pages/agent/AgentPropertiesPage';
import AddEditPropertyPage from './pages/agent/AddEditPropertyPage';
import AgentEnquiriesPage from './pages/agent/AgentEnquiriesPage';
import AgentAppointmentsPage from './pages/agent/AgentAppointmentsPage';
import AgentAnalyticsPage from './pages/agent/AgentAnalyticsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <CompareProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
                <Navbar />

                <main className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/properties" element={<PropertiesPage />} />
                    <Route path="/properties/:id" element={<PropertyDetailPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />

                    {/* Authenticated Buyer Routes */}
                    <Route
                      path="/favorites"
                      element={
                        <ProtectedRoute>
                          <FavoritesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/messages"
                      element={
                        <ProtectedRoute>
                          <MessagesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-enquiries"
                      element={
                        <ProtectedRoute>
                          <MyEnquiriesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-appointments"
                      element={
                        <ProtectedRoute>
                          <MyAppointmentsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Agent Routes */}
                    <Route
                      path="/agent"
                      element={
                        <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                          <AgentDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agent/properties"
                      element={
                        <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                          <AgentPropertiesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agent/properties/new"
                      element={
                        <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                          <AddEditPropertyPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agent/properties/edit/:id"
                      element={
                        <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                          <AddEditPropertyPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agent/enquiries"
                      element={
                        <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                          <AgentEnquiriesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agent/appointments"
                      element={
                        <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                          <AgentAppointmentsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agent/analytics"
                      element={
                        <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                          <AgentAnalyticsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <AdminDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/properties"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <AdminPropertiesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <AdminUsersPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/reports"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <AdminReportsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Catch-All */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>

                <CompareDrawer />
                <Footer />
              </div>
            </Router>
          </CompareProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
