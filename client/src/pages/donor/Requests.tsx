import { useEffect, useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import { Check, X, FileText, Loader2, Truck } from 'lucide-react';
import api from '../../api/client';

export default function DonorRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
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

  const handleAction = async (id: string, status: 'ACCEPTED' | 'REJECTED' | 'PICKED_UP') => {
    try {
      await api.patch(`/requests/${id}`, { status });
      // Update state locally
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to update request status');
    }
  };

  const sortedRequests = [...requests].sort((a, b) => {
    // Sort PENDING and ACCEPTED to top
    const score = (status: string) => {
      if (status === 'PENDING') return 3;
      if (status === 'ACCEPTED') return 2;
      return 1;
    };
    if (score(a.status) !== score(b.status)) return score(b.status) - score(a.status);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incoming Requests</h1>
          <p className="text-sm text-gray-500">Manage requests from NGOs for your active food listings.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-emerald-600">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-medium text-gray-900">No incoming requests yet.</p>
            <p className="text-sm">Requests will appear here when an NGO requests your listings.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedRequests.map((req) => (
              <div key={req.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{req.ngo?.orgName}</h3>
                    <p className="text-sm text-gray-600 font-medium mt-0.5">Requested: {req.listing?.title}</p>
                    {req.message && (
                      <p className="text-sm text-gray-500 italic mt-1.5">"{req.message}"</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 md:ml-auto">
                  {req.status === 'PENDING' ? (
                    <>
                      <button 
                        onClick={() => handleAction(req.id, 'ACCEPTED')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        <Check size={16} /> Accept
                      </button>
                      <button 
                        onClick={() => handleAction(req.id, 'REJECTED')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white text-red-600 border border-red-200 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <X size={16} /> Decline
                      </button>
                    </>
                  ) : req.status === 'ACCEPTED' ? (
                    <>
                      <button 
                        onClick={() => handleAction(req.id, 'PICKED_UP')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
                      >
                        <Truck size={16} /> Food Left
                      </button>
                      <span className="px-3 py-1.5 text-sm font-medium rounded-lg border bg-blue-50 text-blue-700 border-blue-100">
                        Awaiting Pickup
                      </span>
                    </>
                  ) : (
                    <span className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${
                      req.status === 'PICKED_UP' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      req.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {req.status === 'PICKED_UP' ? 'Food Left' : req.status === 'COMPLETED' ? 'Delivered' : req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
