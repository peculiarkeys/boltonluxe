import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotFound from '@/pages/NotFound';

// Consumer App context and layout
import { ConsumerAuthProvider, useConsumerAuth } from '@/consumer/contexts/ConsumerAuthContext';
import ConsumerLayout from '@/consumer/layouts/ConsumerLayout';

// ─── Lazy Loaded Pages ────────────────────────────────────────────────
const Dashboard = React.lazy(() => import('@/pages/Index'));
const Properties = React.lazy(() => import('@/pages/Properties'));
const Login = React.lazy(() => import('@/pages/Login'));
const Unauthorized = React.lazy(() => import('@/pages/Unauthorized'));
const BookingsCalendar = React.lazy(() => import('@/pages/bookings/BookingsCalendar'));

// Business Development imports
const BusinessDevelopmentIndex = React.lazy(() => import('@/pages/business-development/Index'));
const DebtRecoveryPage = React.lazy(() => import('@/pages/business-development/DebtRecovery'));
const CompaniesPage = React.lazy(() => import('@/pages/business-development/Companies'));
const LeadsPage = React.lazy(() => import('@/pages/business-development/Leads'));
const ContactsPage = React.lazy(() => import('@/pages/business-development/Contacts'));
const OpportunitiesPage = React.lazy(() => import('@/pages/business-development/Opportunities'));
const RelationshipManagersPage = React.lazy(() => import('@/pages/business-development/RelationshipManagers'));

// Loyalty Program imports
const LoyaltyIndex = React.lazy(() => import('@/pages/loyalty/Index'));
const CheckIn = React.lazy(() => import('@/pages/loyalty/CheckIn'));
const Enroll = React.lazy(() => import('@/pages/loyalty/Enroll'));
const Notifications = React.lazy(() => import('@/pages/loyalty/Notifications'));
const Members = React.lazy(() => import('@/pages/loyalty/Members'));
const PointsManagement = React.lazy(() => import('@/pages/loyalty/Points'));
const Rewards = React.lazy(() => import('@/pages/loyalty/Rewards'));
const Redemptions = React.lazy(() => import('@/pages/loyalty/Redemptions'));
const MemberActivities = React.lazy(() => import('@/pages/loyalty/Activities'));
const Reports = React.lazy(() => import('@/pages/loyalty/Reports'));

// Consumer App pages
const ConsumerLogin = React.lazy(() => import('@/consumer/pages/ConsumerLogin'));
const ConsumerSignUp = React.lazy(() => import('@/consumer/pages/ConsumerSignUp'));
const ConsumerDashboard = React.lazy(() => import('@/consumer/pages/ConsumerDashboard'));
const ConsumerStays = React.lazy(() => import('@/consumer/pages/ConsumerStays'));
const ConsumerAccount = React.lazy(() => import('@/consumer/pages/ConsumerAccount'));
const ConsumerRewards = React.lazy(() => import('@/consumer/pages/ConsumerRewards'));

// ─── Loading Fallback ────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-normal">
    Loading...
  </div>
);

// ─── Consumer Protected Route (Supabase auth) ────────────────────────
const ConsumerProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useConsumerAuth();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// ─── Admin Routes (under /boltonadmin) ────────────────────────────────
const AdminRoutes = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        
        <Route index element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="properties" element={
          <ProtectedRoute>
            <Layout><Properties /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Bookings Routes */}
        <Route path="bookings/calendar" element={
          <ProtectedRoute>
            <Layout><BookingsCalendar /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Loyalty Program Routes */}
        <Route path="loyalty" element={
          <ProtectedRoute>
            <Layout><LoyaltyIndex /></Layout>
          </ProtectedRoute>
        } />

        <Route path="loyalty/checkin" element={
          <ProtectedRoute>
            <Layout><CheckIn /></Layout>
          </ProtectedRoute>
        } />

        <Route path="loyalty/enroll" element={
          <ProtectedRoute>
            <Layout><Enroll /></Layout>
          </ProtectedRoute>
        } />

        <Route path="loyalty/notifications" element={
          <ProtectedRoute>
            <Layout><Notifications /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="loyalty/members" element={
          <ProtectedRoute>
            <Layout><Members /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="loyalty/points" element={
          <ProtectedRoute>
            <Layout><PointsManagement /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="loyalty/rewards" element={
          <ProtectedRoute>
            <Layout><Rewards /></Layout>
          </ProtectedRoute>
        } />

        <Route path="loyalty/redemptions" element={
          <ProtectedRoute>
            <Layout><Redemptions /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="loyalty/activities" element={
          <ProtectedRoute>
            <Layout><MemberActivities /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="loyalty/reports" element={
          <ProtectedRoute>
            <Layout><Reports /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Business Development Routes */}
        <Route path="business-development" element={
          <ProtectedRoute>
            <Layout><BusinessDevelopmentIndex /></Layout>
          </ProtectedRoute>
        } />

        <Route path="business-development/companies" element={
          <ProtectedRoute>
            <Layout><CompaniesPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="business-development/leads" element={
          <ProtectedRoute>
            <Layout><LeadsPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="business-development/contacts" element={
          <ProtectedRoute>
            <Layout><ContactsPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="business-development/opportunities" element={
          <ProtectedRoute>
            <Layout><OpportunitiesPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="business-development/debt-recovery" element={
          <ProtectedRoute>
            <Layout><DebtRecoveryPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="business-development/relationship-managers" element={
          <ProtectedRoute>
            <Layout><RelationshipManagersPage /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="settings" element={
          <ProtectedRoute>
            <Layout>
              <div className="p-8 text-center space-y-4">
                <h1 className="text-2xl font-semibold">Settings</h1>
                <p>System configuration and user preferences.</p>
              </div>
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <ConsumerAuthProvider>
        <Router>
          <div className="min-h-screen">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ── Consumer Routes (root level) ── */}
                <Route path="/login" element={<ConsumerLogin />} />
                <Route path="/signup" element={<ConsumerSignUp />} />
                
                <Route element={
                  <ConsumerProtectedRoute>
                    <ConsumerLayout />
                  </ConsumerProtectedRoute>
                }>
                  <Route path="/dashboard" element={<ConsumerDashboard />} />
                  <Route path="/stays" element={<ConsumerStays />} />
                  <Route path="/account" element={<ConsumerAccount />} />
                  <Route path="/rewards" element={<ConsumerRewards />} />
                </Route>
                
                {/* Root redirect to consumer dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* ── Admin Routes (under /boltonadmin) ── */}
                <Route path="/boltonadmin/*" element={<AdminRoutes />} />
                
                {/* ── Catch-all ── */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster position="top-right" />
          </div>
        </Router>
      </ConsumerAuthProvider>
    </AuthProvider>
  );
}

export default App;
