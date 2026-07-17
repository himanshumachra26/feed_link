import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import AppShell from '../../components/layout/AppShell';
import Badge, { statusColor } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import type { Listing } from '../../types';
import { MapPin, Clock, Pencil, Trash2 } from 'lucide-react';

function fmt(d: string) {
  return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function DonorListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/listings/mine' + (filter ? `?status=${filter}` : ''));
    setListings(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    await api.delete(`/listings/${id}`);
    setListings(l => l.filter(x => x.id !== id));
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900">My Listings</h1>
        <Link to="/donor/listings/new">
          <Button>+ Add Listing</Button>
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['', 'AVAILABLE', 'RESERVED', 'COLLECTED', 'EXPIRED'].map(s => (
          <button key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition
              ${filter === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="mb-2">No listings yet.</p>
          <Link to="/donor/listings/new" className="text-emerald-600 text-sm hover:underline">
            Create your first listing →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map(l => (
            <div key={l.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{l.title}</h3>
                    <Badge color={statusColor(l.status)}>{l.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {l.quantity} {l.unit} · {l.foodType} · {l.suitableFor.replace(/,/g, ', ')}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                    <MapPin size={12} />
                    <span>{l.address}</span>
                    {l.lat && l.lng && (
                      <a
                        href={`https://www.google.com/maps?q=${l.lat},${l.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-emerald-600 hover:underline"
                      >
                        Open in Maps
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Clock size={12} />
                    <span>Pickup: {fmt(l.pickupStart)} – {fmt(l.pickupEnd)}</span>
                  </div>
                  {/* Requests count */}
                  {(l.requests?.length ?? 0) > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      {l.requests?.length} request(s)
                    </p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <Link to={`/donor/listings/${l.id}/edit`}>
                    <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Pencil size={15} />
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteListing(l.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
