import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DonorDashboard from './pages/donor/Dashboard';
import DonorListings from './pages/donor/Listings';
import DonateFood from './pages/donor/DonateFood';
import NGODashboard from './pages/ngo/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminListings from './pages/admin/Listings';
import AdminRequests from './pages/admin/Requests';
import AdminDeliveries from './pages/admin/Deliveries';
import ReportsPage from './pages/shared/ReportsPage';
import Landing from './pages/Landing';
import About from './pages/About';
import OperationsHub from './pages/shared/OperationsHub';
import RecordsPage from './pages/shared/RecordsPage';
import SettingsPage from './pages/shared/SettingsPage';
import DonorRequests from './pages/donor/Requests';
import NgoBrowseFood from './pages/ngo/BrowseFood';
import NgoRequests from './pages/ngo/MyRequests';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'DONOR' | 'NGO' | 'ADMIN' }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Loading…</div>;
  if (!user) return <Navigate to="/" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donor" element={<ProtectedRoute allowedRole="DONOR"><DonorDashboard /></ProtectedRoute>} />
          <Route path="/donor/operations" element={<ProtectedRoute allowedRole="DONOR"><OperationsHub /></ProtectedRoute>} />
          <Route path="/donor/listings" element={<ProtectedRoute allowedRole="DONOR"><DonorListings /></ProtectedRoute>} />
          <Route path="/donor/listings/new" element={<ProtectedRoute allowedRole="DONOR"><DonateFood /></ProtectedRoute>} />
          <Route path="/donor/requests" element={<ProtectedRoute allowedRole="DONOR"><DonorRequests /></ProtectedRoute>} />
          <Route path="/donor/reports" element={<ProtectedRoute allowedRole="DONOR"><ReportsPage role="DONOR" /></ProtectedRoute>} />
          <Route path="/donor/records" element={<ProtectedRoute allowedRole="DONOR"><RecordsPage role="DONOR" /></ProtectedRoute>} />
          <Route path="/donor/settings" element={<ProtectedRoute allowedRole="DONOR"><SettingsPage /></ProtectedRoute>} />
          <Route path="/donor/profile" element={<ProtectedRoute allowedRole="DONOR"><SettingsPage /></ProtectedRoute>} />
          
          <Route path="/ngo" element={<ProtectedRoute allowedRole="NGO"><NGODashboard /></ProtectedRoute>} />
          <Route path="/ngo/operations" element={<ProtectedRoute allowedRole="NGO"><OperationsHub /></ProtectedRoute>} />
          <Route path="/ngo/browse" element={<ProtectedRoute allowedRole="NGO"><NgoBrowseFood /></ProtectedRoute>} />
          <Route path="/ngo/requests" element={<ProtectedRoute allowedRole="NGO"><NgoRequests /></ProtectedRoute>} />
          <Route path="/ngo/reports" element={<ProtectedRoute allowedRole="NGO"><ReportsPage role="NGO" /></ProtectedRoute>} />
          <Route path="/ngo/records" element={<ProtectedRoute allowedRole="NGO"><RecordsPage role="NGO" /></ProtectedRoute>} />
          <Route path="/ngo/settings" element={<ProtectedRoute allowedRole="NGO"><SettingsPage /></ProtectedRoute>} />
          <Route path="/ngo/profile" element={<ProtectedRoute allowedRole="NGO"><SettingsPage /></ProtectedRoute>} />
          
          <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/operations" element={<ProtectedRoute allowedRole="ADMIN"><OperationsHub /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRole="ADMIN"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/listings" element={<ProtectedRoute allowedRole="ADMIN"><AdminListings /></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute allowedRole="ADMIN"><AdminRequests /></ProtectedRoute>} />
          <Route path="/admin/deliveries" element={<ProtectedRoute allowedRole="ADMIN"><AdminDeliveries /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRole="ADMIN"><ReportsPage role="ADMIN" /></ProtectedRoute>} />
          <Route path="/admin/records" element={<ProtectedRoute allowedRole="ADMIN"><RecordsPage role="ADMIN" /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRole="ADMIN"><SettingsPage /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute allowedRole="ADMIN"><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
