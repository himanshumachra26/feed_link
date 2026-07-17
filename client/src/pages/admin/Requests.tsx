import { useEffect, useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import { FileText, Loader2 } from 'lucide-react';
import api from '../../api/client';

export default function AdminRequests() {
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

  const sortedRequests = [...requests].sort((a, b) => {
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
    if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food Requests</h1>
          <p className="text-sm text-gray-500">Track requests made by NGOs for available food listings.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20 text-emerald-600">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="font-medium text-gray-900">No requests found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">NGO</th>
                  <th className="px-6 py-4">Food Listing</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {req.id.split('-')[0].toUpperCase().substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4">{req.ngo?.orgName || 'Unknown NGO'}</td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">{req.listing?.title || 'Unknown Listing'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        req.status === 'COMPLETED' || req.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700' : 
                        req.status === 'REJECTED' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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
