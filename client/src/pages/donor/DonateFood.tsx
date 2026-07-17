import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import api from '../../api/client';

const field = 'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500';

const getLocalDatetimeString = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

export default function DonateFood() {
  const navigate = useNavigate(); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const submit = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); const v = Object.fromEntries(new FormData(e.currentTarget));
    try { setSaving(true); setError(''); await api.post('/listings', { ...v, quantity: Number(v.quantity), servings: Number(v.servings), deliveryCharge: Number(v.deliveryCharge || 0), suitableFor: 'community', pickupStart: new Date().toISOString(), pickupEnd: new Date(Date.now()+4*3600000).toISOString(), expiresAt: new Date(String(v.expiresAt)).toISOString() }); navigate('/donor/listings'); } catch (x: any) { setError(x.response?.data?.error || 'Could not publish donation'); } finally { setSaving(false); } };
  return <AppShell><div className="mx-auto max-w-3xl"><h1 className="text-2xl font-bold">Donate food</h1><p className="mt-1 text-sm text-gray-500">Share safe surplus food with local NGOs.</p><form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-2">
    <label className="text-sm font-medium">Food name<input required name="title" className={field} placeholder="e.g. Fresh vegetable pulao" /></label>
    <label className="text-sm font-medium">Category<select name="category" className={field}><option>Veg</option><option>Non-Veg</option><option>Vegan</option><option>Jain</option><option>Others</option></select></label>
    <label className="text-sm font-medium">Food type<select name="foodType" className={field}><option>Solid</option><option>Liquid</option><option>Semi-liquid</option></select></label>
    <label className="text-sm font-medium">Condition<select name="condition" className={field}><option>Cooked</option><option>Uncooked</option><option>Mixed</option></select></label>
    <label className="text-sm font-medium">Quantity<input required name="quantity" type="number" min="1" className={field} /></label>
    <label className="text-sm font-medium">Unit<select name="unit" className={field}><option>kg</option><option>boxes</option><option>servings</option><option>litres</option></select></label>
    <label className="text-sm font-medium">Servings<input required name="servings" type="number" min="1" className={field} /></label>
    <label className="text-sm font-medium">Best before<input required name="expiresAt" type="datetime-local" defaultValue={getLocalDatetimeString(new Date(Date.now() + 4 * 3600000))} className={field} /></label>
    <label className="text-sm font-medium md:col-span-2">Description<textarea name="description" className={field} rows={3} placeholder="Ingredients, handling or allergen notes" /></label>
    <label className="text-sm font-medium md:col-span-2">Pickup address<input required name="address" className={field} placeholder="Restaurant address" /></label>
    <label className="text-sm font-medium">City<input required name="city" className={field} placeholder="Mumbai" /></label>
    <label className="text-sm font-medium">Delivery option<select name="deliveryOption" className={field}><option value="NGO_PICKUP">NGO Pickup</option><option value="RESTAURANT_DELIVERY">Restaurant Delivery</option></select></label>
    <label className="text-sm font-medium">Delivery charge<input name="deliveryCharge" type="number" min="0" defaultValue="0" className={field} /></label>
    {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}<div className="md:col-span-2 flex justify-end"><button disabled={saving} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Publishing…' : 'Publish donation'}</button></div>
  </form></div></AppShell>;
}
