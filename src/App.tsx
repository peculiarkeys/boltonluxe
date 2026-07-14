
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Index';
import Properties from '@/pages/Properties';
import Login from '@/pages/Login';
import Unauthorized from '@/pages/Unauthorized';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import NotFound from '@/pages/NotFound';
import BookingsCalendar from '@/pages/bookings/BookingsCalendar';


// Business Development imports
import BusinessDevelopmentIndex from '@/pages/business-development/Index';
import DebtRecoveryPage from '@/pages/business-development/DebtRecovery';
import CompaniesPage from '@/pages/business-development/Companies';
import LeadsPage from '@/pages/business-development/Leads';
import ContactsPage from '@/pages/business-development/Contacts';
import OpportunitiesPage from '@/pages/business-development/Opportunities';
import RelationshipManagersPage from '@/pages/business-development/RelationshipManagers';

// Loyalty Program imports
import LoyaltyIndex from '@/pages/loyalty/Index';
import CheckIn from '@/pages/loyalty/CheckIn';
import Enroll from '@/pages/loyalty/Enroll';
import Notifications from '@/pages/loyalty/Notifications';
import Members from '@/pages/loyalty/Members';
import PointsManagement from '@/pages/loyalty/Points';
import Rewards from '@/pages/loyalty/Rewards';
import MemberActivities from '@/pages/loyalty/Activities';
import Reports from '@/pages/loyalty/Reports';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/properties" element={
        <ProtectedRoute>
          <Layout><Properties /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Bookings Routes */}
      <Route path="/bookings/calendar" element={
        <ProtectedRoute>
          <Layout><BookingsCalendar /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Loyalty Program Routes */}
      <Route path="/loyalty" element={
        <ProtectedRoute>
          <Layout><LoyaltyIndex /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/loyalty/checkin" element={
        <ProtectedRoute>
          <Layout><CheckIn /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/loyalty/enroll" element={
        <ProtectedRoute>
          <Layout><Enroll /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/loyalty/notifications" element={
        <ProtectedRoute>
          <Layout><Notifications /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/loyalty/members" element={
        <ProtectedRoute>
          <Layout><Members /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/loyalty/points" element={
        <ProtectedRoute>
          <Layout><PointsManagement /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/loyalty/rewards" element={
        <ProtectedRoute>
          <Layout><Rewards /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/loyalty/activities" element={
        <ProtectedRoute>
          <Layout><MemberActivities /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/loyalty/reports" element={
        <ProtectedRoute>
          <Layout><Reports /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Business Development Routes */}
      <Route path="/business-development" element={
        <ProtectedRoute>
          <Layout><BusinessDevelopmentIndex /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/business-development/companies" element={
        <ProtectedRoute>
          <Layout><CompaniesPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/business-development/leads" element={
        <ProtectedRoute>
          <Layout><LeadsPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/business-development/contacts" element={
        <ProtectedRoute>
          <Layout><ContactsPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/business-development/opportunities" element={
        <ProtectedRoute>
          <Layout><OpportunitiesPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/business-development/debt-recovery" element={
        <ProtectedRoute>
          <Layout><DebtRecoveryPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/business-development/relationship-managers" element={
        <ProtectedRoute>
          <Layout><RelationshipManagersPage /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <div className="p-8 text-center space-y-4">
              <h1 className="text-2xl font-bold">Settings</h1>
              <p>System configuration and user preferences.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
