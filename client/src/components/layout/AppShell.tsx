import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import type { Notification } from '../../types';
import {
  LayoutDashboard, Package, FileText, Users, LogOut,
  Bell, Menu, X, ShieldCheck, Truck, BarChart3, Settings, UserCircle2, HeartHandshake,
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

// ── Main App Shell ─────────────────────────────────────────────
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`min-h-screen flex flex-col transition-all duration-200 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Topbar onMenuClick={toggleSidebar} />
        <main className="flex-1 p-5 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
