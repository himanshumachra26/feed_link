import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import AppShell from '../../components/layout/AppShell';
import StatCard from '../../components/ui/StatCard';
import type { NGOStats } from '../../types';
import { Package, FileText, CheckCircle, Clock, ArrowRight, History, Settings } from 'lucide-react';
import type { Listing } from '../../types';

export default function NGODashboard() {
  const [stats, setStats] = useState<NGOStats | null>(null);
  const [donations, setDonations] = useState<Listing[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    api.get('/stats/dashboard').then((res) => setStats(res.data));
    api.get('/listings?limit=6').then((res) => setDonations(res.data.listings));
  }, []);
  const accept = async (listingId: string) => { try { await api.post('/requests', { listingId }); setNotice('Request sent to the restaurant.'); setDonations(d => d.filter(x => x.id !== listingId)); } catch (e: any) { setNotice(e.response?.data?.error || 'Could not request this donation.'); } };

  return (
    <AppShell>
      <div className="mb-6 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">NGO operations center</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Track food pickups, requests, and records</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">Browse available food, manage pickup requests, and stay on top of your delivery history.</p>
          </div>
          <Link to="/ngo/operations" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
            Open operations hub <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My Requests" value={stats?.totalRequests ?? 0} icon={FileText} color="bg-emerald-500" />
        <StatCard label="Pending" value={stats?.pendingRequests ?? 0} icon={Clock} color="bg-yellow-500" />
        <StatCard label="Accepted" value={stats?.acceptedRequests ?? 0} icon={CheckCircle} color="bg-blue-500" />
        <StatCard label="Available Listings" value={stats?.availableListings ?? 0} icon={Package} color="bg-purple-500" />
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[{ title: 'Browse food', desc: 'Find nearby donations from restaurants', href: '/ngo/browse', icon: Package }, { title: 'My requests', desc: 'Track pickup request status', href: '/ngo/requests', icon: FileText }, { title: 'Past records', desc: 'View completed pickups and impact', href: '/ngo/records', icon: History }, { title: 'Settings', desc: 'Adjust profile and alerts', href: '/ngo/settings', icon: Settings }].map((item) => {
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

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">How this works</h2>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li>• Browse food listings posted by local donors.</li>
          <li>• Submit a pickup request and track its status.</li>
          <li>• Use the dashboard to monitor accepted and completed pickups.</li>
        </ul>
      </div>
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><div><h2 className="font-semibold">Available donations</h2><p className="text-sm text-gray-500">Fresh food shared by nearby restaurants.</p></div><Link to="/ngo/browse" className="text-sm text-emerald-600">View all</Link></div>
        {notice && <p className="mt-3 rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700">{notice}</p>}
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{donations.map(d => <article key={d.id} className="rounded-xl border border-gray-200 p-4"><div className="flex justify-between gap-2"><h3 className="font-semibold text-gray-900">{d.title}</h3><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">{d.category || d.foodType}</span></div><p className="mt-2 text-sm text-gray-500">{d.quantity} {d.unit} · {d.servings || 1} servings</p><p className="mt-1 text-xs text-gray-400">{d.donor?.orgName} · {d.city}</p><button onClick={() => accept(d.id)} className="mt-3 w-full rounded-lg border border-emerald-600 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50">Request donation</button></article>)}{!donations.length && <p className="text-sm text-gray-500">No available donations right now.</p>}</div>
      </section>
    </AppShell>
  );
}
