import { useState, useEffect } from 'react';
import AppShell from '../../components/layout/AppShell';
import { Package, MapPin, Clock, Search, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../../api/client';
import type { Listing } from '../../types';

export default function BrowseFood() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [foodType, setFoodType] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('');
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());

  const loadListings = async () => {
    setLoading(true);
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const typeParam = foodType !== 'ALL' ? `&foodType=${foodType}` : '';
      const cityParam = cityFilter ? `&city=${encodeURIComponent(cityFilter)}` : '';

      const { data } = await api.get(`/listings?status=AVAILABLE${searchParam}${typeParam}${cityParam}`);
      setListings(data.listings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadListings();
    }, 450);
    return () => clearTimeout(delayDebounceFn);
  }, [search, foodType, cityFilter]);

  const handleRequest = async (listingId: string) => {
    setRequestingId(listingId);
    try {
      await api.post('/requests', { listingId, message: 'We are available to pick this up.' });
      setRequestedIds(prev => new Set(prev).add(listingId));
    } catch (e: any) {
      const errorMsg = e.response?.data?.error;
      if (e.response?.status === 409 && errorMsg?.includes('already requested')) {
        setRequestedIds(prev => new Set(prev).add(listingId));
      } else {
        alert(errorMsg || 'Failed to request food');
      }
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Available Food</h1>
          <p className="text-sm text-gray-500">Find donations nearby and request pickups.</p>
        </div>

        {/* Filter Panel */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search food item name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">Food Type:</span>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
              >
                <option value="ALL">All Types</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="baked-goods">Baked Goods</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">City:</span>
              <input
                type="text"
                placeholder="e.g. Mumbai"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1 text-xs font-semibold text-gray-700 focus:outline-none w-28 placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-emerald-600">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-medium text-gray-900">No food listings available right now.</p>
            <p className="text-sm">Check back later or adjust your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: any) => (
              <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="h-32 bg-emerald-50 flex items-center justify-center text-emerald-200">
                  <Package size={48} />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-2" title={listing.title}>{listing.title}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase tracking-wider font-bold rounded flex-shrink-0 ml-2">
                      {listing.foodType}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium mb-4">
                    {listing.donor?.orgName}
                    {listing.donor?.verified && <ShieldCheck size={14} className="text-emerald-500" />}
                  </div>
                  
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-gray-500 line-clamp-1" title={listing.address}>
                      <MapPin size={14} className="text-gray-400 flex-shrink-0" /> {listing.city} • {listing.address}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={14} className="text-amber-500 flex-shrink-0" /> 
                      Expires: {new Date(listing.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Package size={14} className="text-gray-400 flex-shrink-0" /> 
                      {listing.quantity} {listing.unit}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleRequest(listing.id)}
                    disabled={requestingId === listing.id || requestedIds.has(listing.id)}
                    className={`w-full mt-5 py-2.5 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      requestedIds.has(listing.id)
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {requestingId === listing.id ? (
                      <><Loader2 size={16} className="animate-spin" /> Requesting...</>
                    ) : requestedIds.has(listing.id) ? (
                      <><ShieldCheck size={16} /> Request Sent</>
                    ) : (
                      'Request Pickup'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
