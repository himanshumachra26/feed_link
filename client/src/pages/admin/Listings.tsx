import { useEffect, useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import { Package, Loader2, ShieldCheck } from 'lucide-react';
import api from '../../api/client';

export default function AdminListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadListings = async () => {
    try {
      const { data } = await api.get('/listings?status=ALL'); // status=ALL to get all statuses
      setListings(data.listings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food Listings</h1>
          <p className="text-sm text-gray-500">Monitor all food donations across the platform.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-emerald-600">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-medium text-gray-900">No food listings found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Food Item</th>
                    <th className="px-6 py-4">Donor (Listed By)</th>
                    <th className="px-6 py-4">Receiver (Claimed By)</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listings.map((item) => {
                    // Find if there is an accepted request (meaning claimed)
                    const claimedReq = item.requests?.find((r: any) => 
                      ['ACCEPTED', 'PICKED_UP', 'COMPLETED'].includes(r.status)
                    );
                    const pendingReqsCount = item.requests?.filter((r: any) => r.status === 'PENDING').length ?? 0;

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.id.toUpperCase().substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                          <Package size={14} className="text-gray-400 flex-shrink-0" /> {item.title}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-800">{item.donor?.orgName}</span>
                            {item.donor?.verified && <ShieldCheck size={14} className="text-emerald-500" />}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {claimedReq ? (
                            <span className="text-emerald-700 font-semibold">{claimedReq.ngo?.orgName}</span>
                          ) : pendingReqsCount > 0 ? (
                            <span className="text-amber-600 font-medium">{pendingReqsCount} Request(s) Pending</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                            item.status === 'AVAILABLE' ? 'bg-blue-50 text-blue-700' : 
                            item.status === 'RESERVED' ? 'bg-amber-50 text-amber-700' : 
                            'bg-emerald-50 text-emerald-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(item.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
