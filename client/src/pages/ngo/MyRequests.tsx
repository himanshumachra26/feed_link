import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import { Clock, CheckCircle2, XCircle, PackageCheck, Loader2, Truck } from 'lucide-react';
import api from '../../api/client';

export default function NgoRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
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
    loadRequests();
  }, []);
  const handleCompleted = async (id: string) => {
    try {
      await api.patch(`/requests/${id}`, { status: 'COMPLETED' });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'COMPLETED' } : r));
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to complete request');
    }
  };

  const sortedRequests = [...requests].sort((a, b) => {
    // Sort PENDING, ACCEPTED, PICKED_UP to top
    const score = (status: string) => {
      if (status === 'PENDING') return 4;
      if (status === 'ACCEPTED') return 3;
      if (status === 'PICKED_UP') return 2;
      return 1;
    };
    if (score(a.status) !== score(b.status)) return score(b.status) - score(a.status);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
            <p className="text-sm text-gray-500">Track the status of your food requests to donors.</p>
          </div>
          <Link
            to="/ngo/browse"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold cursor-pointer shadow-sm transition-all"
          >
            Browse & Request Food
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20 text-emerald-600">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-16 text-gray-500 space-y-4">
              <div>
                <p className="font-medium text-gray-900">No requests yet.</p>
                <p className="text-sm">Browse available food and send a request!</p>
              </div>
              <Link
                to="/ngo/browse"
                className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold cursor-pointer shadow-sm transition-all"
              >
                Browse Available Food
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Requested Item</th>
                  <th className="px-6 py-4">Donor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {req.id.split('-')[0].toUpperCase().substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{req.listing?.title}</td>
                    <td className="px-6 py-4 text-gray-600">{req.listing?.donor?.orgName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                        req.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                        req.status === 'PICKED_UP' ? 'bg-amber-50 text-amber-700' :
                        req.status === 'ACCEPTED' ? 'bg-blue-50 text-blue-700' : 
                        req.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {req.status === 'COMPLETED' && <CheckCircle2 size={12} />}
                        {req.status === 'PICKED_UP' && <Truck size={12} />}
                        {req.status === 'ACCEPTED' && <CheckCircle2 size={12} />}
                        {req.status === 'PENDING' && <Clock size={12} />}
                        {req.status === 'REJECTED' && <XCircle size={12} />}
                        {req.status === 'PICKED_UP' ? 'Food Left' : req.status === 'COMPLETED' ? 'Food Reached' : req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      {['ACCEPTED', 'PICKED_UP'].includes(req.status) ? (
                        <button
                          onClick={() => handleCompleted(req.id)}
                          className="px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Food Reached
                        </button>
                      ) : req.status === 'COMPLETED' ? (
                        <span className="text-xs text-gray-400 font-medium">Completed</span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShell>
  );
}
