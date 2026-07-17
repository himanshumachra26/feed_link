import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import { Bell, Lock, ShieldCheck, SlidersHorizontal, UserCircle2, Loader2, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { useForm } from 'react-hook-form';
import Input from '../../components/ui/Input';

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(location.pathname.endsWith('/profile') ? 'profile' : null);

  // If the user navigates directly to /profile while on this page, open the modal
  useEffect(() => {
    if (location.pathname.endsWith('/profile')) {
      setActiveModal('profile');
    }
  }, [location.pathname]);

  const closeModal = () => {
    setActiveModal(null);
    if (location.pathname.endsWith('/profile')) {
      // If we are on the /profile route and close the modal, go back to settings
      const baseRoute = location.pathname.replace('/profile', '/settings');
      navigate(baseRoute, { replace: true });
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Settings</p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-900">Control your dashboard experience</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">Manage your account, updates, and team visibility from one place.</p>
            </div>
            {user?.verified && (
              <div className="rounded-2xl border border-emerald-200 bg-white/80 p-3 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShieldCheck size={18} />
                  <span className="text-sm font-semibold">Verified account</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Profile Section */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <UserCircle2 size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Profile</h2>
                <p className="text-sm text-gray-500">Manage your organization name, contact details, and account identity.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveModal('profile')}
              className="mt-4 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Edit profile
            </button>
          </div>

          {/* Alerts Section */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Bell size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500">Choose when you receive new requests, approvals, and reminder alerts.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveModal('alerts')}
              className="mt-4 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Configure alerts
            </button>
          </div>

          {/* Security Section */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Lock size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Security</h2>
                <p className="text-sm text-gray-500">Review password strength, sessions, and verification status.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveModal('security')}
              className="mt-4 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Secure account
            </button>
          </div>
        </div>

        {/* Modals */}
        <ProfileModal open={activeModal === 'profile'} onClose={closeModal} user={user} refresh={refresh} />
        <SecurityModal open={activeModal === 'security'} onClose={closeModal} />
        <AlertsModal open={activeModal === 'alerts'} onClose={closeModal} />
      </div>
    </AppShell>
  );
}

// --------------------------------------------------------------------------
// Profile Modal
// --------------------------------------------------------------------------
function ProfileModal({ open, onClose, user, refresh }: any) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      orgName: user?.orgName || '',
      phone: user?.phone || '',
      city: user?.city || '',
      address: user?.address || ''
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setSuccess(false);
    try {
      await api.put('/profile', data);
      await refresh();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (e) {
      console.error(e);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Account Profile" width="max-w-2xl">
      <div className="space-y-6">
        {/* Profile Header (Heavy Info) */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5 p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-emerald-600 text-white text-3xl flex items-center justify-center font-bold shadow-md">
              {user?.orgName?.[0]?.toUpperCase()}
            </div>
            {user?.verified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <ShieldCheck size={20} className="text-emerald-500" />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900">{user?.orgName}</h3>
            <p className="text-sm text-gray-500 mb-3">{user?.email} • {user?.role}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-center">
                <p className="text-xs text-gray-500 font-medium">Account Status</p>
                <p className={`text-sm font-semibold ${user?.active ? 'text-emerald-600' : 'text-red-600'}`}>
                  {user?.active ? 'Active' : 'Suspended'}
                </p>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-center">
                <p className="text-xs text-gray-500 font-medium">Member Since</p>
                <p className="text-sm font-semibold text-gray-700">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              {user?.role === 'DONOR' && (
                <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-center">
                  <p className="text-xs text-gray-500 font-medium">Total Impact</p>
                  <p className="text-sm font-semibold text-emerald-600">4,250 kg</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input {...register('orgName')} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input {...register('phone')} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input {...register('city')} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <textarea {...register('address')} rows={3} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-4">
            {success && <div className="text-emerald-600 text-sm flex items-center gap-2 mr-auto"><CheckCircle2 size={16} /> Profile updated successfully!</div>}
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-70 cursor-pointer shadow-sm">
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// --------------------------------------------------------------------------
// Security Modal
// --------------------------------------------------------------------------
function SecurityModal({ open, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await api.put('/auth/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      reset();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (e: any) {
      console.error(e);
      setError(e.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Secure Account">
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            required
            {...register('currentPassword', { required: true })}
          />
          <Input
            label="New Password"
            type="password"
            required
            {...register('newPassword', { required: true, minLength: 6 })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            required
            {...register('confirmPassword', { required: true })}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <div className="text-emerald-600 text-sm flex items-center gap-2"><CheckCircle2 size={16} /> Password updated successfully!</div>}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-70 cursor-pointer">
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
            </button>
          </div>
        </form>

        {/* Last Login Active Log */}
        <div className="border-t border-gray-100 pt-4 mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Last Active Login</h4>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Device:</span>
              <span className="text-gray-800 font-semibold">Windows Desktop PC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Browser:</span>
              <span className="text-gray-800 font-semibold">Google Chrome v126</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">IP Address:</span>
              <span className="text-gray-800 font-semibold">103.44.82.11 (Mumbai, India)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Time:</span>
              <span className="text-gray-800 font-semibold">16/07/2026, 04:02 PM (Active Session)</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// --------------------------------------------------------------------------
// Alerts Modal
// --------------------------------------------------------------------------
function AlertsModal({ open, onClose }: any) {
  const [emailAlerts, setEmailAlerts] = useState(() => localStorage.getItem('emailAlerts') !== 'false');
  const [donorAlerts, setDonorAlerts] = useState(() => localStorage.getItem('donorAlerts') !== 'false');
  const [pickupAlerts, setPickupAlerts] = useState(() => localStorage.getItem('pickupAlerts') !== 'false');
  const [approveAlerts, setApproveAlerts] = useState(() => localStorage.getItem('approveAlerts') !== 'false');
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    localStorage.setItem('emailAlerts', String(emailAlerts));
    localStorage.setItem('donorAlerts', String(donorAlerts));
    localStorage.setItem('pickupAlerts', String(pickupAlerts));
    localStorage.setItem('approveAlerts', String(approveAlerts));
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal open={open} onClose={onClose} title="Configure Alerts">
      <div className="space-y-5">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-semibold text-gray-900">Email Alerts</p>
            <p className="text-xs text-gray-500">Receive summaries and updates via your email address.</p>
          </div>
          <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600" />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-semibold text-gray-900">Donor Alerts</p>
            <p className="text-xs text-gray-500">Get notified when new food donations are listed in your city.</p>
          </div>
          <input type="checkbox" checked={donorAlerts} onChange={(e) => setDonorAlerts(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600" />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-semibold text-gray-900">Pickup Updates</p>
            <p className="text-xs text-gray-500">Receive alerts when food leaves premises or is out for transit.</p>
          </div>
          <input type="checkbox" checked={pickupAlerts} onChange={(e) => setPickupAlerts(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600" />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-semibold text-gray-900">Approval Notifications</p>
            <p className="text-xs text-gray-500">Get notified when your requested orders are approved or declined.</p>
          </div>
          <input type="checkbox" checked={approveAlerts} onChange={(e) => setApproveAlerts(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600" />
        </label>

        {success && <div className="text-emerald-600 text-sm flex items-center gap-2"><CheckCircle2 size={16} /> Notification settings saved!</div>}

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Cancel</button>
          <button onClick={handleSave} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 cursor-pointer shadow-sm">
            Save Alerts
          </button>
        </div>
      </div>
    </Modal>
  );
}
