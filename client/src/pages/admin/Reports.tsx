import AppShell from '../../components/layout/AppShell';
import { BarChart3, TrendingUp, Users, PackageCheck } from 'lucide-react';

export default function AdminReports() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Reports</h1>
          <p className="text-sm text-gray-500">Analytics and impact metrics for the entire platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><PackageCheck size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Food Saved</p>
              <p className="text-2xl font-bold text-gray-900">12,450 kg</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Users size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active NGOs</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><TrendingUp size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><BarChart3 size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Carbon Offset</p>
              <p className="text-2xl font-bold text-gray-900">31.2 tCO2e</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex items-center justify-center">
          <p className="text-gray-400 font-medium flex flex-col items-center gap-2">
            <BarChart3 size={48} className="text-gray-200" />
            Monthly Impact Chart (Placeholder)
          </p>
        </div>
      </div>
    </AppShell>
  );
}
