import { useEffect, useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import { BarChart3, TrendingUp, Users, PackageCheck, Award, Calendar, Loader2 } from 'lucide-react';
import api from '../../api/client';

type ReportsRole = 'DONOR' | 'NGO' | 'ADMIN';

function getMeta(role: ReportsRole) {
  if (role === 'NGO') {
    return {
      title: 'NGO Impact & Analytics',
      subtitle: 'Analyze your food collection metrics, active requests, and contribution levels.',
      accent: 'from-emerald-500 to-teal-600',
      heroStat: 'Servings Received',
    };
  }

  if (role === 'ADMIN') {
    return {
      title: 'Platform System Reports',
      subtitle: 'Global performance analytics, user engagement logs, and database metrics.',
      accent: 'from-violet-500 to-fuchsia-600',
      heroStat: 'Total Platform Food Saved',
    };
  }

  return {
    title: 'Restaurant Donation Reports',
    subtitle: 'Track your restaurant\'s community contributions, active listings, and rating metrics.',
    accent: 'from-sky-500 to-blue-600',
    heroStat: 'Total Food Donated',
  };
}

export default function ReportsPage({ role = 'DONOR' }: { role?: ReportsRole }) {
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const meta = getMeta(role);

  const loadData = async () => {
    try {
      const [statsRes, requestsRes] = await Promise.all([
        api.get('/stats/dashboard'),
        api.get('/requests')
      ]);
      setStats(statsRes.data);
      setRequests(requestsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [role]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex justify-center items-center py-40 text-emerald-600">
          <Loader2 className="animate-spin" size={40} />
        </div>
      </AppShell>
    );
  }

  // --- Calculate Dynamic Metrics ---
  const completedRequests = requests.filter(r => r.status === 'COMPLETED');
  
  // Total Food Servings/Quantities (estimate 20 servings per listing average if not specified)
  const totalVolume = completedRequests.reduce((acc, r) => acc + (r.listing?.quantity || 15), 0);

  // Group requests by month for the chart
  const getMonthlyChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts: Record<string, number> = {};

    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const label = `${months[d.getMonth()]} ${String(d.getFullYear()).substring(2)}`;
      counts[label] = 0;
    }

    requests.forEach(r => {
      const date = new Date(r.createdAt);
      const label = `${months[date.getMonth()]} ${String(date.getFullYear()).substring(2)}`;
      if (counts[label] !== undefined) {
        counts[label] += 1;
      }
    });

    const maxVal = Math.max(...Object.values(counts), 1);
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: count,
      percentage: (count / maxVal) * 100
    }));
  };

  const chartData = getMonthlyChartData();

  // Find Top Partners (NGOs for Donor, Donors for NGO, both for Admin)
  const getTopPartners = () => {
    const partnerCounts: Record<string, { count: number; name: string }> = {};

    completedRequests.forEach(r => {
      if (role === 'DONOR') {
        const id = r.ngoId;
        const name = r.ngo?.orgName || 'Unknown NGO';
        partnerCounts[id] = { count: (partnerCounts[id]?.count || 0) + 1, name };
      } else if (role === 'NGO') {
        const id = r.listing?.donorId;
        const name = r.listing?.donor?.orgName || 'Unknown Restaurant';
        if (id) {
          partnerCounts[id] = { count: (partnerCounts[id]?.count || 0) + 1, name };
        }
      } else {
        // Admin: Count all active restaurants
        const id = r.listing?.donorId;
        const name = r.listing?.donor?.orgName || 'Unknown Restaurant';
        if (id) {
          partnerCounts[id] = { count: (partnerCounts[id]?.count || 0) + 1, name };
        }
      }
    });

    return Object.values(partnerCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  };

  const topPartners = getTopPartners();

  // --- Display Metrics Configuration ---
  const getCards = () => {
    if (role === 'NGO') {
      return [
        { label: 'Total Servings Claimed', val: `${totalVolume * 15} servings`, icon: PackageCheck, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Completed Pickups', val: `${stats?.completedPickups || 0} orders`, icon: Award, color: 'text-blue-600 bg-blue-50' },
        { label: 'Active Requests Today', val: `${stats?.pendingRequests || 0} pending`, icon: Calendar, color: 'text-amber-600 bg-amber-50' },
        { label: 'Success Rate', val: `${requests.length ? Math.round((completedRequests.length / requests.length) * 100) : 100}%`, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
      ];
    }
    if (role === 'ADMIN') {
      return [
        { label: 'Total Food Saved', val: `${totalVolume} kg`, icon: PackageCheck, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Platform Users', val: `${stats?.totalUsers || 0} partners`, icon: Users, color: 'text-blue-600 bg-blue-50' },
        { label: 'Completed Shipments', val: `${stats?.completedRequests || 0} total`, icon: Award, color: 'text-purple-600 bg-purple-50' },
        { label: 'Active Listings', val: `${stats?.totalListings || 0} listings`, icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
      ];
    }
    // DONOR
    return [
      { label: 'Total Food Saved', val: `${totalVolume} kg`, icon: PackageCheck, color: 'text-emerald-600 bg-emerald-50' },
      { label: 'Completed Deliveries', val: `${stats?.completedDonations || 0} donations`, icon: Award, color: 'text-blue-600 bg-blue-50' },
      { label: 'Total Claims Received', val: `${stats?.totalRequests || 0} requests`, icon: Users, color: 'text-purple-600 bg-purple-50' },
      { label: 'Active Listings', val: `${stats?.activeListings || 0} active`, icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
    ];
  };

  const cards = getCards();

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header Card */}
        <div className={`rounded-3xl border border-gray-200 bg-gradient-to-br ${meta.accent} p-6 text-white shadow-sm`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Platform Analytics</p>
              <h1 className="mt-2 text-2xl font-semibold">{meta.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/90">{meta.subtitle}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <BarChart3 size={22} />
            </div>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const CardIcon = card.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${card.color}`}><CardIcon size={24} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">{card.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">{card.val}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Analytics Sections */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Monthly Bar Chart */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm md:col-span-2 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Monthly Performance Analytics</h3>
              <p className="text-xs text-gray-500">Distribution volume and transfer logs from the last 6 months.</p>
            </div>

            {/* Custom Interactive CSS Bar Chart */}
            <div className="flex items-end justify-between pt-6 px-4 gap-4 h-56">
              {chartData.map((bar, i) => (
                <div key={i} className="flex flex-col items-center flex-1 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    {bar.value} requests
                  </div>
                  
                  {/* Bar Container with fixed height track */}
                  <div className="w-full h-36 flex items-end bg-gray-50 dark:bg-gray-850 rounded-lg overflow-hidden border border-gray-100/50">
                    <div 
                      style={{ height: `${bar.percentage}%` }}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all duration-500 cursor-pointer shadow-inner"
                    />
                  </div>
                  
                  <span className="text-[10px] font-bold text-gray-500 mt-2 whitespace-nowrap">{bar.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Partners list */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {role === 'DONOR' ? 'Top NGO Receivers' : role === 'NGO' ? 'Top Restaurant Partners' : 'Top Contributors'}
              </h3>
              <p className="text-xs text-gray-500">Ranked by volume of completed food transfers.</p>
            </div>

            {topPartners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-sm">
                <Award size={32} className="text-gray-200 mb-2" />
                No active records.
              </div>
            ) : (
              <div className="space-y-4">
                {topPartners.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 truncate w-32">{p.name}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      {p.count} deals
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
