import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import AppShell from '../../components/layout/AppShell';
import type { DonorStats, Request, Listing } from '../../types';
import Badge, { statusColor } from '../../components/ui/Badge';
import { Package, FileText, CheckCircle, Clock, ArrowRight, History, Settings, Plus, MapPin } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

export default function DonorDashboard() {
  const [stats, setStats] = useState<DonorStats | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);

  useEffect(() => {
    api.get('/stats/dashboard').then(r => setStats(r.data));
    api.get('/requests?status=PENDING').then(r => setRequests(r.data.slice(0, 5)));
    api.get('/listings/mine?status=AVAILABLE').then(r => setMyListings(r.data.slice(0, 3)));
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Block */}
        <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Donor control center</p>
              <h1 className="mt-1 text-2xl font-bold text-gray-900">Manage donations, requests, records, and settings</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">Post new food donations, review active orders, and keep your impact history in one place.</p>
            </div>
            <Link to="/donor/operations" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm hover:shadow transition-shadow">
              Open operations hub <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Listings" value={stats?.totalListings ?? 0} icon={Package} color="bg-emerald-500" />
          <StatCard label="Active Listings" value={stats?.activeListings ?? 0} icon={Package} color="bg-blue-500" />
          <StatCard label="Pending Requests" value={stats?.pendingRequests ?? 0} icon={Clock} color="bg-yellow-500" />
          <StatCard label="Completed Deals" value={stats?.completedDonations ?? 0} icon={CheckCircle} color="bg-purple-500" />
        </div>

        {/* Quick Links Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: 'Create Donation', desc: 'Post surplus food for local NGOs', href: '/donor/listings/new', icon: Plus },
            { title: 'Orders & Requests', desc: 'Track pending and accepted requests', href: '/donor/requests', icon: FileText },
            { title: 'Past Records', desc: 'Review completed transactions and deals', href: '/donor/records', icon: History },
            { title: 'Settings', desc: 'Update profile and alert preferences', href: '/donor/settings', icon: Settings }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} to={item.href} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
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

        {/* Main Content Layout splits */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Columns (Span 2) */}
          <div className="md:col-span-2 space-y-6">
            {/* My Active Food Donations */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">My Active Donations</h2>
                  <p className="text-xs text-gray-500">Food packages currently listed as available for local NGOs.</p>
                </div>
                <Link to="/donor/listings" className="text-xs font-semibold text-emerald-600 hover:underline">View all</Link>
              </div>

              {myListings.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
                  <Package className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-xs font-medium text-gray-700">No active donations listed.</p>
                  <Link to="/donor/listings/new" className="text-xs text-emerald-600 hover:underline mt-1 inline-block font-semibold">
                    Post a new donation +
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {myListings.map(d => (
                    <article key={d.id} className="rounded-xl border border-gray-150 p-4 bg-gray-50/50 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{d.title}</h3>
                        <span className="rounded bg-emerald-50 border border-emerald-150 px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold text-emerald-700">
                          {d.foodType}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mb-3">
                        {d.quantity} {d.unit} listed
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <MapPin size={12} /> {d.city}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Current Pending Requests */}
            {requests.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <div>
                    <h2 className="font-bold text-gray-900">Current Pending Requests</h2>
                    <p className="text-xs text-gray-500">NGO requests waiting for pickup approval.</p>
                  </div>
                  <Link to="/donor/requests" className="text-xs font-semibold text-emerald-600 hover:underline">View all</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {requests.map(req => (
                    <div key={req.id} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">{req.listing?.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Requested by: {req.ngo?.orgName}</p>
                      </div>
                      <Badge color={statusColor(req.status)}>{req.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Span 1) */}
          <div className="space-y-6">
            {/* Guidelines Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-900">How donation flow works</h3>
              <ul className="space-y-3 text-xs text-gray-600">
                <li className="flex gap-2">
                  <span className="text-emerald-600 font-bold">1.</span>
                  <span>Post surplus food with active details, quantities, and expiration time stamps.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600 font-bold">2.</span>
                  <span>Review and accept pickup reservations submitted by verified local NGOs.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600 font-bold">3.</span>
                  <span>NGO collects the food. Confirm delivery handover by clicking <strong>Food Left</strong>.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
