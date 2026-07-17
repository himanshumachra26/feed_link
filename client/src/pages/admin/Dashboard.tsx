import { useEffect, useState } from 'react';
import api from '../../api/client';
import AppShell from '../../components/layout/AppShell';
import type { AdminStats, User } from '../../types';
import { Users, Package, FileText, CheckCircle, Building2, HeartHandshake, Home, ShieldCheck, ClipboardList, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

type AdminUser = User & {
  _count?: {
    listings: number;
    requests: number;
  };
};

type CategoryKey = 'all' | 'restaurants' | 'ngos' | 'shelters';

const fallbackUsers: AdminUser[] = [
  {
    id: 'demo-1',
    email: 'restaurant@demo.com',
    role: 'DONOR',
    orgName: 'The Spice Garden Restaurant',
    verified: true,
    active: true,
    city: 'Mumbai',
    createdAt: '2025-01-12T10:00:00.000Z',
    _count: { listings: 4, requests: 2 },
  },
  {
    id: 'demo-2',
    email: 'cafe@demo.com',
    role: 'DONOR',
    orgName: 'Sunrise Café',
    verified: true,
    active: true,
    city: 'Delhi',
    createdAt: '2025-02-18T08:30:00.000Z',
    _count: { listings: 3, requests: 1 },
  },
  {
    id: 'demo-3',
    email: 'ngo@demo.com',
    role: 'NGO',
    orgName: 'Paws & Care Animal Shelter',
    verified: true,
    active: true,
    city: 'Mumbai',
    createdAt: '2025-03-03T14:45:00.000Z',
    _count: { listings: 0, requests: 5 },
  },
  {
    id: 'demo-4',
    email: 'shelter@demo.com',
    role: 'NGO',
    orgName: 'Bright Future Shelter',
    verified: false,
    active: true,
    city: 'Bengaluru',
    createdAt: '2025-04-14T11:20:00.000Z',
    _count: { listings: 0, requests: 3 },
  },
];

function getPartnerType(user: AdminUser) {
  const name = user.orgName.toLowerCase();
  if (user.role === 'DONOR') return 'Restaurant / Café';
  if (/shelter|rescue|care|animal|home/.test(name)) return 'Shelter';
  return 'NGO';
}

function matchCategory(user: AdminUser, category: CategoryKey) {
  if (category === 'all') return true;
  if (category === 'restaurants') return user.role === 'DONOR';
  if (category === 'shelters') return user.role === 'NGO' && /shelter|rescue|care|animal|home/.test(user.orgName.toLowerCase());
  if (category === 'ngos') return user.role === 'NGO' && !/shelter|rescue|care|animal|home/.test(user.orgName.toLowerCase());
  return false;
}

function getContributionLabel(user: AdminUser) {
  if (user.role === 'DONOR') {
    return `${user._count?.listings ?? 0} donations posted`;
  }
  return `${user._count?.requests ?? 0} pickups received`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>(fallbackUsers);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/users?page=1');
        if (data?.users?.length) {
          setUsers(data.users);
        }
      } catch {
        setUsers(fallbackUsers);
      }
    };

    api.get('/admin/stats').then((res) => setStats(res.data)).catch(() => undefined);
    load();
  }, []);

  const filteredUsers = users.filter((user) => matchCategory(user, activeCategory));
  const restaurantCount = users.filter((user) => user.role === 'DONOR').length;
  const ngoCount = users.filter((user) => user.role === 'NGO' && !/shelter|rescue|care|animal|home/.test(user.orgName.toLowerCase())).length;
  const shelterCount = users.filter((user) => user.role === 'NGO' && /shelter|rescue|care|animal|home/.test(user.orgName.toLowerCase())).length;

  const sidebarItems: Array<{ key: CategoryKey; label: string; count: number; icon: typeof Users }> = [
    { key: 'all', label: 'All Users', count: users.length, icon: Users },
    { key: 'restaurants', label: 'Restaurants & Cafes', count: restaurantCount, icon: Building2 },
    { key: 'ngos', label: 'NGOs', count: ngoCount, icon: HeartHandshake },
    { key: 'shelters', label: 'Shelters', count: shelterCount, icon: Home },
  ];

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-6 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-700">Operations overview</p>
              <h1 className="mt-1 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">Monitor community activity, verify partners, and keep food redistribution flowing smoothly.</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm text-gray-600 shadow-sm">
              <div className="font-semibold text-gray-900">{filteredUsers.length} active partners</div>
              <div className="mt-1">Live view of registrations and participation</div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[{ title: 'Partner directory', desc: 'View restaurants, NGOs, and shelters', href: '/admin/users', icon: Users }, { title: 'Food listings', desc: 'Monitor active donations across the network', href: '/admin/listings', icon: Package }, { title: 'Pickup requests', desc: 'Review open orders and acceptances', href: '/admin/requests', icon: ClipboardList }, { title: 'System settings', desc: 'Manage profile and dashboard settings', href: '/admin/settings', icon: Settings }].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} to={item.href} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">{item.title}</h2>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: 'Total Users',
              value: stats?.totalUsers ?? users.length,
              subtitle: 'Verified and active partners',
              icon: Users,
              accent: 'from-emerald-500 to-emerald-600',
            },
            {
              title: 'Food Listings',
              value: stats?.totalListings ?? 0,
              subtitle: 'Available donations across the network',
              icon: Package,
              accent: 'from-sky-500 to-blue-600',
            },
            {
              title: 'Pickup Requests',
              value: stats?.totalRequests ?? 0,
              subtitle: 'Open requests waiting for action',
              icon: FileText,
              accent: 'from-amber-500 to-orange-500',
            },
            {
              title: 'Completed Deliveries',
              value: stats?.completedRequests ?? 0,
              subtitle: 'Successfully fulfilled this week',
              icon: CheckCircle,
              accent: 'from-violet-500 to-fuchsia-600',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white`}>
                  <Icon size={18} />
                </div>
                <div className="text-sm font-medium text-gray-500">{item.title}</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{item.value}</div>
                <div className="mt-2 text-sm text-gray-500">{item.subtitle}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[300px_1fr]">
          <aside className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={18} />
                <h2 className="text-sm font-semibold text-gray-900">Partner Directory</h2>
              </div>
              <div className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveCategory(item.key)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left text-sm transition-all ${activeCategory === item.key ? 'border-emerald-500 bg-white text-emerald-700 shadow-sm' : 'border-transparent bg-transparent text-gray-700 hover:bg-white hover:shadow-sm'}`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={15} />
                        {item.label}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">{item.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Partner activity</h2>
                <p className="text-sm text-gray-500">Registered partners, location, and recent contribution summary.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                {filteredUsers.length} shown
              </span>
            </div>

            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm transition hover:shadow-md">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{user.orgName}</h3>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600 shadow-sm">
                          {getPartnerType(user)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.verified ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {user.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Registered</p>
                      <p className="mt-1 text-sm text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="rounded-xl bg-white p-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Location</p>
                      <p className="mt-1 text-sm text-gray-800">{user.city || 'Not provided'}</p>
                    </div>
                    <div className="rounded-xl bg-white p-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Activity</p>
                      <p className="mt-1 text-sm text-gray-800">{getContributionLabel(user)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
