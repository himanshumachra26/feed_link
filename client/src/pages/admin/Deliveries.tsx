import { useEffect, useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import { Truck, Clock, Loader2 } from 'lucide-react';
import api from '../../api/client';

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDeliveries = async () => {
    try {
      // Fetch requests that are in transit (picked up but not completed)
      const { data } = await api.get('/requests');
      const relevant = data.filter((r: any) => r.status === 'PICKED_UP');
      setDeliveries(relevant);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Deliveries Tracking</h1>
          <p className="text-sm text-gray-500">Monitor food shipments currently in transit.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-emerald-600">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
            <Truck size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-medium text-gray-900">No active deliveries in transit.</p>
            <p className="text-sm">When donors mark food as left or NGOs pick it up, they will show up here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveries.map(d => (
              <div key={d.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Truck size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">
                          DEL-{d.id.split('-')[0].toUpperCase().substring(0, 6)}
                        </h3>
                        <p className="text-[10px] text-gray-400">
                          Mode: {d.listing?.deliveryOption === 'NGO_PICKUP' ? 'NGO Pickup' : 'Donor Delivery'}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-800">
                      {d.listing?.deliveryOption === 'RESTAURANT_DELIVERY' ? 'Picked in Tempo by Donor' : 'Picked by NGO'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      <p className="line-clamp-2"><span className="font-medium text-gray-900">From:</span> {d.listing?.donor?.orgName} ({d.listing?.city})</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <p className="line-clamp-2"><span className="font-medium text-gray-900">To:</span> {d.ngo?.orgName} ({d.ngo?.city})</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-amber-500" />
                    <span>In transit</span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(d.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
