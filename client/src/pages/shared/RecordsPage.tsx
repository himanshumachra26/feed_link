import { useState, useEffect } from 'react';
import AppShell from '../../components/layout/AppShell';
import { ArrowRightLeft, CheckCircle2, Clock3, Gift, HandHeart, Users2, Search, Loader2 } from 'lucide-react';
import api from '../../api/client';

type RecordsRole = 'DONOR' | 'NGO' | 'ADMIN';

function getMeta(role: RecordsRole) {
  if (role === 'NGO') {
    return {
      title: 'Past pickups and impact',
      subtitle: 'Track every completed pickup and review your community impact.',
      accent: 'from-emerald-500 to-teal-600',
      icon: HandHeart,
    };
  }

  if (role === 'ADMIN') {
    return {
      title: 'Past operations and records',
      subtitle: 'Keep an eye on food movement, partner approvals, and platform health.',
      accent: 'from-violet-500 to-fuchsia-600',
      icon: Users2,
    };
  }

  return {
    title: 'Past donations and records',
    subtitle: 'Review completed donations, reserved requests, and recent activity.',
    accent: 'from-sky-500 to-blue-600',
    icon: Gift,
  };
}

export default function RecordsPage({ role = 'DONOR' }: { role?: RecordsRole }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const meta = getMeta(role);
  const Icon = meta.icon;

  const loadRecords = async () => {
    try {
      const { data } = await api.get('/requests');
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [role]);

  // Translate database status strings to user friendly text
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'ACCEPTED': return 'Accepted';
      case 'REJECTED': return 'Rejected';
      case 'PICKED_UP': return 'In Transit';
      case 'COMPLETED': return 'Completed';
      default: return status;
    }
  };

  // Filter records based on role-specific context and user input
  const processedRecords = requests.map((r: any) => {
    let title = r.listing?.title || 'Food Donation';
    let detail = '';
    
    if (role === 'NGO') {
      detail = `Requested from ${r.listing?.donor?.orgName || 'Donor'}`;
    } else if (role === 'DONOR') {
      detail = `Claimed by ${r.ngo?.orgName || 'NGO'}`;
    } else {
      // Admin
      detail = `${r.listing?.donor?.orgName || 'Donor'} ➔ ${r.ngo?.orgName || 'NGO'}`;
    }

    return {
      id: r.id,
      title,
      detail,
      time: new Date(r.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: r.status,
      statusLabel: getStatusLabel(r.status),
    };
  });

  const filteredRecords = processedRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.detail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || record.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const completedCount = requests.filter(r => r.status === 'COMPLETED').length;
  const inProgressCount = requests.filter(r => ['ACCEPTED', 'PICKED_UP'].includes(r.status)).length;
  const totalCount = requests.length;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className={`rounded-3xl border border-gray-200 bg-gradient-to-br ${meta.accent} p-6 text-white shadow-sm`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Records</p>
              <h1 className="mt-2 text-2xl font-semibold">{meta.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/90">{meta.subtitle}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Icon size={22} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={17} />
              <p className="text-sm font-semibold">Completed</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{completedCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600">
              <Clock3 size={17} />
              <p className="text-sm font-semibold">In Progress</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{inProgressCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sky-600">
              <ArrowRightLeft size={17} />
              <p className="text-sm font-semibold">Total Transfers</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{totalCount}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent history</h2>
              <p className="text-sm text-gray-500">Everything from the past few days in one place.</p>
            </div>
            <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
              {filteredRecords.length} of {totalCount} entries
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search records by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'ALL', label: 'All' },
                { val: 'PENDING', label: 'Pending' },
                { val: 'ACCEPTED', label: 'Accepted' },
                { val: 'PICKED_UP', label: 'In Transit' },
                { val: 'COMPLETED', label: 'Completed' },
                { val: 'REJECTED', label: 'Rejected' }
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setSelectedStatus(item.val)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    selectedStatus === item.val
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20 text-emerald-600">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-20 text-gray-500 border border-gray-100 border-dashed rounded-2xl">
              No matching records found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <div key={record.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-50/70">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{record.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{record.detail}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                      record.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                      record.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      record.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {record.statusLabel}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-gray-400">{record.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
