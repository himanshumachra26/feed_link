import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import type { Notification } from '../../types';
import {
  LayoutDashboard, Package, FileText, Users, LogOut,
  Bell, Menu, X, ShieldCheck, Truck, BarChart3, Settings,
} from 'lucide-react';

// ── Sidebar nav config ────────────────────────────────────────
const donorNav: Array<{ to: string; label: string; icon: typeof LayoutDashboard; end?: boolean; key: string }> = [
  { to: '/donor', label: 'Dashboard', icon: LayoutDashboard, end: true, key: 'donor-dashboard' },
  { to: '/donor/operations', label: 'Operations Hub', icon: BarChart3, key: 'donor-operations' },
  { to: '/donor/listings', label: 'My Listings', icon: Package, key: 'donor-listings' },
  { to: '/donor/requests', label: 'Requests', icon: FileText, key: 'donor-requests' },
  { to: '/donor/reports', label: 'Reports', icon: BarChart3, key: 'donor-reports' },
  { to: '/donor/records', label: 'Records', icon: FileText, key: 'donor-records' },
  { to: '/donor/settings', label: 'Settings', icon: Settings, key: 'donor-settings' },
];
const ngoNav: Array<{ to: string; label: string; icon: typeof LayoutDashboard; end?: boolean; key: string }> = [
  { to: '/ngo', label: 'Dashboard', icon: LayoutDashboard, end: true, key: 'ngo-dashboard' },
  { to: '/ngo/operations', label: 'Operations Hub', icon: BarChart3, key: 'ngo-operations' },
  { to: '/ngo/browse', label: 'Browse Food', icon: Package, key: 'ngo-browse' },
  { to: '/ngo/requests', label: 'My Requests', icon: FileText, key: 'ngo-requests' },
  { to: '/ngo/reports', label: 'Reports', icon: BarChart3, key: 'ngo-reports' },
  { to: '/ngo/records', label: 'Records', icon: FileText, key: 'ngo-records' },
  { to: '/ngo/settings', label: 'Settings', icon: Settings, key: 'ngo-settings' },
];
const adminNav: Array<{ to: string; label: string; icon: typeof LayoutDashboard; end?: boolean; key: string }> = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, key: 'admin-dashboard' },
  { to: '/admin/operations', label: 'Operations Hub', icon: BarChart3, key: 'admin-operations' },
  { to: '/admin/users', label: 'Users', icon: Users, key: 'admin-users' },
  { to: '/admin/listings', label: 'Food Listings', icon: Package, key: 'admin-listings' },
  { to: '/admin/requests', label: 'Requests', icon: FileText, key: 'admin-requests' },
  { to: '/admin/deliveries', label: 'Deliveries', icon: Truck, key: 'admin-deliveries' },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3, key: 'admin-reports' },
  { to: '/admin/records', label: 'Records', icon: FileText, key: 'admin-records' },
  { to: '/admin/settings', label: 'Settings', icon: Settings, key: 'admin-settings' },
];

function getNavItems(role?: string) {
  if (role === 'DONOR') return donorNav;
  if (role === 'NGO') return ngoNav;
  return adminNav;
}

const sidebarTranslations: Record<string, Record<string, string>> = {
  en: {
    'Dashboard': 'Dashboard',
    'Operations Hub': 'Operations Hub',
    'My Listings': 'My Listings',
    'Requests': 'Requests',
    'Records': 'Records',
    'Settings': 'Settings',
    'Profile': 'Profile',
    'Logout': 'Logout',
    'Browse Food': 'Browse Food',
    'My Requests': 'My Requests',
    'Users': 'Users',
    'Food Listings': 'Food Listings',
    'Deliveries': 'Deliveries',
    'Reports': 'Reports',
  }
};

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const navItems = getNavItems(user?.role);
  const effectiveOpen = open || isHovered;

  const handleLogout = () => { logout(); navigate('/'); };
  const profileRoute = user?.role === 'DONOR' ? '/donor/profile' : user?.role === 'NGO' ? '/ngo/profile' : '/admin/profile';

  const currentLang = localStorage.getItem('language') || 'en';
  const t = (txt: string) => sidebarTranslations[currentLang]?.[txt] || txt;

  return (
    <>
      {/* Overlay on mobile */}
      {open && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />}

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col z-40
        transition-all duration-200 overflow-hidden whitespace-nowrap
        ${effectiveOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:w-16 lg:translate-x-0'}
        ${isHovered && !open ? 'lg:shadow-2xl' : ''}`}>

        {/* User info / Logo */}
        <div className={`flex items-center p-3 border-b border-gray-100 min-h-[56px] ${!effectiveOpen ? 'justify-center' : 'px-4'}`}>
          <div className={`w-8 h-8 rounded-full bg-emerald-600 text-white text-sm flex items-center justify-center font-bold flex-shrink-0 ${effectiveOpen ? 'hidden' : 'flex'}`}>
            {user?.orgName?.[0]?.toUpperCase()}
          </div>
          <div className={!effectiveOpen ? 'hidden' : 'block'}>
            <p className="text-sm font-medium text-gray-900 truncate w-48">{user?.orgName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-gray-500">{user?.role}</span>
              {user?.verified && <ShieldCheck size={12} className="text-emerald-500" />}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end, key: itemKey }) => (
            <NavLink
              key={itemKey}
              to={to}
              end={end}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) =>
                `flex items-center rounded-lg text-sm transition-colors ${effectiveOpen ? 'px-3 py-2 gap-2.5' : 'justify-center p-2.5'}
                ${isActive
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              title={!effectiveOpen ? t(label) : undefined}
            >
              <Icon size={effectiveOpen ? 18 : 20} className="flex-shrink-0" />
              <span className={!effectiveOpen ? 'hidden' : 'block'}>{t(label)}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-200">
          <NavLink
            to={profileRoute}
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={({ isActive }) => `flex items-center rounded-lg text-sm mb-1 transition-colors ${effectiveOpen ? 'px-3 py-2 gap-2.5' : 'justify-center p-2.5'} ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
            title={!effectiveOpen ? t("Profile") : undefined}
          >
            <Users size={effectiveOpen ? 18 : 20} className="flex-shrink-0" />
            <span className={!effectiveOpen ? 'hidden' : 'block'}>{t("Profile")}</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className={`flex items-center rounded-lg text-sm transition-colors w-full text-gray-600 hover:bg-red-50 hover:text-red-600 ${effectiveOpen ? 'px-3 py-2 gap-2.5' : 'justify-center p-2.5'}`}
            title={!effectiveOpen ? t("Logout") : undefined}
          >
            <LogOut size={effectiveOpen ? 18 : 20} className="flex-shrink-0" />
            <span className={!effectiveOpen ? 'hidden' : 'block'}>{t("Logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchUnread = async () => {
    try {
      const { data } = await api.get('/notifications/unread-count');
      setUnread(data.count);
    } catch { /* silent */ }
  };

  const loadNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      await api.patch('/notifications/read-all');
      setUnread(0);
    } catch { /* silent */ }
  };

  const handleNotificationClick = (n: Notification) => {
    setShowNotif(false);
    let route = '/';
    if (user?.role === 'NGO') {
      if (n.type === 'NEW_DONATION') {
        route = '/ngo/browse';
      } else if (n.type === 'REQUEST_ACCEPTED' || n.type === 'SYSTEM') {
        route = '/ngo/requests';
      } else {
        route = '/ngo';
      }
    } else if (user?.role === 'DONOR') {
      if (n.type === 'REQUEST_RECEIVED' || n.type === 'FOOD_REQUEST') {
        route = '/donor/requests';
      } else {
        route = '/donor';
      }
    } else if (user?.role === 'ADMIN') {
      route = '/admin';
    }
    navigate(route);
  };

  const hideHamburger = localStorage.getItem('hideHamburger') === 'true';

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between gap-2 px-4 sticky top-0 z-10">
      <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
        {hideHamburger ? (
          <button onClick={onMenuClick} className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors lg:hidden">
            <Menu size={20} />
          </button>
        ) : (
          <button onClick={onMenuClick} className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors">
            <Menu size={20} />
          </button>
        )}
        <Link to={user?.role === 'DONOR' ? '/donor' : user?.role === 'NGO' ? '/ngo' : '/admin'} className="flex items-center gap-1.5 hover:opacity-85 transition-opacity cursor-pointer">
          <span className="text-xl">🌿</span>
          <span className="font-bold text-lg text-emerald-600 tracking-tight hidden sm:block">FeedLink</span>
        </Link>
      </div>

      <div className="hidden lg:block" />

      <div className="ml-auto flex items-center gap-3 flex-shrink-0">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); if (!showNotif) loadNotifications(); }}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold">Notifications</span>
                <button onClick={() => setShowNotif(false)}><X size={14} /></button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm py-6">No notifications</p>
                ) : notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white text-sm flex items-center justify-center font-semibold shadow-sm hover:ring-2 hover:ring-emerald-200 transition-all cursor-pointer">
              {user?.orgName?.[0]?.toUpperCase()}
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.orgName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    const route = user?.role === 'DONOR' ? '/donor/profile' : user?.role === 'NGO' ? '/ngo/profile' : '/admin/profile';
                    navigate(route);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    const route = user?.role === 'DONOR' ? '/donor/settings' : user?.role === 'NGO' ? '/ngo/settings' : '/admin/settings';
                    navigate(route);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function GuestAuthOverlay({ onClose, isRestricted }: { onClose?: () => void; isRestricted: boolean }) {
  const { user, login, register: signUp } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [role, setRole] = useState<'DONOR' | 'NGO'>('DONOR');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (isRestricted) {
      const currentRole = user?.role || 'DONOR';
      navigate(currentRole === 'DONOR' ? '/donor' : currentRole === 'NGO' ? '/ngo' : '/admin');
    } else {
      if (onClose) onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (tab === 'login') {
        await login(email, password);
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          navigate(payload.role === 'DONOR' ? '/donor' : payload.role === 'NGO' ? '/ngo' : '/admin');
        }
      } else {
        await signUp({ email, password, role, orgName, phone, city });
        navigate(role === 'DONOR' ? '/donor' : '/ngo');
      }
      if (onClose) onClose();
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Authentication failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xl w-full max-w-md my-8 relative">
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-2xl font-bold text-emerald-600 mb-1">
            <span>🌿</span>
            <span>FeedLink</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mt-1">
            {isRestricted ? "Restricted Area" : "Authentication Required"}
          </h3>
          <p className="text-gray-500 text-xs mt-1">
            {isRestricted 
              ? "Access to settings, records, reports, operational hub, and profile is restricted to registered members. Please sign in or register." 
              : "To make changes or perform this action, please sign in or register first."}
          </p>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-gray-100 mb-5">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 pb-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${tab === 'login' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-gray-550 hover:text-gray-800'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 pb-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${tab === 'register' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-gray-550 hover:text-gray-800'}`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-650 bg-red-50 border border-red-100 px-3 py-2 rounded-lg mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder-gray-405 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder-gray-405 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {tab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Organization / Name</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Green Cafe / Food Shelter"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder-gray-405 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder-gray-405 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder-gray-405 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Role Type</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="reg-role"
                      value="DONOR"
                      checked={role === 'DONOR'}
                      onChange={() => setRole('DONOR')}
                      className="accent-emerald-600"
                    />
                    Donor (Food Provider)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="reg-role"
                      value="NGO"
                      checked={role === 'NGO'}
                      onChange={() => setRole('NGO')}
                      className="accent-emerald-600"
                    />
                    NGO (Food Receiver)
                  </label>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer text-center mt-3"
          >
            {loading ? "Processing..." : tab === 'login' ? "Sign In" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main App Shell ─────────────────────────────────────────────
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const { user, setGuestRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isGuest = localStorage.getItem('isGuest') === 'true';
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  useEffect(() => {
    const handleLoginRequired = () => {
      setShowAuthOverlay(true);
    };
    window.addEventListener('guest-login-required', handleLoginRequired);
    return () => {
      window.removeEventListener('guest-login-required', handleLoginRequired);
    };
  }, []);

  // Intercept all interactive clicks inside main content for guest users
  useEffect(() => {
    if (!isGuest) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const mainElement = document.querySelector('main');
      if (!mainElement || !mainElement.contains(e.target as Node)) return;

      let target = e.target as HTMLElement | null;
      let isInteractive = false;

      while (target && target !== mainElement) {
        const tagName = target.tagName.toLowerCase();
        if (
          tagName === 'button' ||
          tagName === 'input' ||
          tagName === 'select' ||
          tagName === 'textarea' ||
          tagName === 'a' ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer')
        ) {
          // Bypass if clicking inside login overlay or the role selector
          if (target.closest('.guest-auth-overlay') || target.closest('.explore-role-selector')) {
            break;
          }
          isInteractive = true;
          break;
        }
        target = target.parentElement;
      }

      if (isInteractive) {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('guest-login-required'));
      }
    };

    window.addEventListener('click', handleGlobalClick, true);
    return () => {
      window.removeEventListener('click', handleGlobalClick, true);
    };
  }, [isGuest]);

  const isRestrictedPage = isGuest && (
    location.pathname.includes('/settings') ||
    location.pathname.includes('/profile')
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Guest Warning Banner */}
      {isGuest && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs md:text-sm font-semibold flex flex-wrap gap-2 items-center justify-between shadow-md z-30">
          <div className="flex items-center gap-1.5">
            <span>🛡️</span>
            <span>You are browsing as Guest. Sensitive information (names, emails, etc.) is masked with ***.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Explore pages as:</span>
            <select
              value={user?.role || 'DONOR'}
              onChange={(e) => {
                const role = e.target.value as any;
                if (setGuestRole) {
                  setGuestRole(role);
                  navigate(role === 'DONOR' ? '/donor' : role === 'NGO' ? '/ngo' : '/admin');
                }
              }}
              className="bg-white text-emerald-800 rounded px-2 py-0.5 border-none font-bold text-xs cursor-pointer focus:ring-2 focus:ring-emerald-300 explore-role-selector"
            >
              <option value="DONOR">Donor Dashboard</option>
              <option value="NGO">NGO Dashboard</option>
              <option value="ADMIN">Admin Dashboard</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Layout wrapper */}
      <div className="flex-1 flex flex-row relative">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={`flex-1 min-h-screen flex flex-col transition-all duration-200 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
          <Topbar onMenuClick={toggleSidebar} />
          <main className={`flex-1 p-5 max-w-7xl w-full mx-auto transition-all ${isRestrictedPage ? 'blur-[6px] pointer-events-none select-none' : ''}`}>
            {children}
          </main>

          {/* Shared Panel Footer */}
          <footer className="border-t border-gray-200 bg-white py-6 px-5 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <div className="flex flex-col sm:flex-row items-center gap-1.5 font-bold text-emerald-600">
                <span className="flex items-center gap-1">
                  <span>🌿</span>
                  <span>FeedLink</span>
                </span>
                <span className="text-[9px] bg-amber-50 border border-amber-200 text-amber-800 uppercase tracking-wider font-bold rounded-full px-2 py-0.5">
                  AdSense Approval Pending
                </span>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/about" className="hover:text-emerald-600 transition-colors">About Us</Link>
                <Link to="/blogs" className="hover:text-emerald-600 transition-colors">Blogs</Link>
                <Link to="/help" className="hover:text-emerald-600 transition-colors">Help & FAQ</Link>
                <Link to="/terms" className="hover:text-emerald-600 transition-colors">Terms</Link>
                <Link to="/privacy" className="hover:text-emerald-600 transition-colors">Privacy</Link>
                <Link to="/ads-partner" className="hover:text-emerald-600 transition-colors">Ads Partner</Link>
                <Link to="/sitemap" className="hover:text-emerald-600 transition-colors">Sitemap</Link>
              </div>
              <p>&copy; {new Date().getFullYear()} FeedLink. Free platform.</p>
            </div>
          </footer>
        </div>
      </div>

      {/* Guest Login/Signup Overlay */}
      {(isRestrictedPage || showAuthOverlay) && (
        <div className="guest-auth-overlay">
          <GuestAuthOverlay 
            isRestricted={isRestrictedPage} 
            onClose={() => setShowAuthOverlay(false)} 
          />
        </div>
      )}
    </div>
  );
}
