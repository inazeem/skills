import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyEmail from './pages/Auth/VerifyEmail';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminClients from './pages/Admin/Clients';
import AdminServices from './pages/Admin/Services';
import AdminInvoices from './pages/Admin/Invoices';
import AdminTickets from './pages/Admin/Tickets';
import AdminReports from './pages/Admin/Reports';
import AdminSettings from './pages/Admin/Settings';

// Reseller Pages
import ResellerDashboard from './pages/Reseller/Dashboard';
import ResellerClients from './pages/Reseller/Clients';
import ResellerServices from './pages/Reseller/Services';
import ResellerInvoices from './pages/Reseller/Invoices';
import ResellerTickets from './pages/Reseller/Tickets';

// Client Pages
import ClientDashboard from './pages/Client/Dashboard';
import ClientServices from './pages/Client/Services';
import ClientInvoices from './pages/Client/Invoices';
import ClientTickets from './pages/Client/Tickets';
import ClientProfile from './pages/Client/Profile';

// Shared Pages
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Component (redirects if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              <Route path="/forgot-password" element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              } />
              <Route path="/reset-password" element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              } />
              <Route path="/verify-email" element={<VerifyEmail />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/clients" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminClients />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/services" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminServices />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/invoices" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminInvoices />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/tickets" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminTickets />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminReports />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminSettings />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Reseller Routes */}
              <Route path="/reseller" element={
                <ProtectedRoute allowedRoles={['reseller']}>
                  <Layout>
                    <ResellerDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reseller/clients" element={
                <ProtectedRoute allowedRoles={['reseller']}>
                  <Layout>
                    <ResellerClients />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reseller/services" element={
                <ProtectedRoute allowedRoles={['reseller']}>
                  <Layout>
                    <ResellerServices />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reseller/invoices" element={
                <ProtectedRoute allowedRoles={['reseller']}>
                  <Layout>
                    <ResellerInvoices />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reseller/tickets" element={
                <ProtectedRoute allowedRoles={['reseller']}>
                  <Layout>
                    <ResellerTickets />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Client Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <Layout>
                    <ClientDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/services" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <Layout>
                    <ClientServices />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/invoices" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <Layout>
                    <ClientInvoices />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/tickets" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <Layout>
                    <ClientTickets />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <Layout>
                    <ClientProfile />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Default redirect based on user role */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;