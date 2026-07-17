import { useEffect, useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import { Search, Filter, ShieldCheck, UserX, UserCheck, Loader2 } from 'lucide-react';
import api from '../../api/client';

export default function UsersManage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const roleQuery = roleFilter !== 'ALL' ? `&role=${roleFilter}` : '';
      const searchQuery = search ? `&search=${encodeURIComponent(search)}` : '';
      
      const { data } = await api.get(`/admin/users?page=1${roleQuery}${searchQuery}`);
      setUsers(data.users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadUsers();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, roleFilter]);

  const toggleVerify = async (userId: string) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/verify`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: data.verified } : u));
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to update verification status');
    }
  };

  const toggleSuspend = async (userId: string) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/suspend`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: data.active } : u));
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to update suspension status');
    }
  };

  // Status filtering performed on frontend
  const filteredUsers = users.filter(user => {
    if (statusFilter === 'SUSPENDED') return !user.active;
    if (statusFilter === 'VERIFIED') return user.active && user.verified;
    if (statusFilter === 'UNVERIFIED') return user.active && !user.verified;
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Manage all registered NGOs and Donors on the platform.</p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="DONOR">Donors</option>
                <option value="NGO">NGOs</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="VERIFIED">Verified / Active</option>
                <option value="UNVERIFIED">Pending Verification</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-emerald-600">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
            <Filter size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-medium text-gray-900">No users match your filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Impact Stats</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            {u.orgName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-1.5">
                              {u.orgName}
                              {u.verified && <ShieldCheck size={14} className="text-emerald-500" />}
                            </div>
                            <div className="text-gray-500 text-xs">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                          u.role === 'DONOR' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                          !u.active ? 'bg-red-50 text-red-700' : 
                          u.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {!u.active ? 'Suspended' : u.verified ? 'Active & Verified' : 'Pending Verification'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {u.role === 'DONOR' ? `${u._count?.listings ?? 0} listings` : `${u._count?.requests ?? 0} requests`}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          {/* Toggle Verify */}
                          <button
                            onClick={() => toggleVerify(u.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              u.verified 
                                ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50' 
                                : 'text-gray-400 hover:text-emerald-600 hover:bg-gray-50'
                            }`}
                            title={u.verified ? "Revoke Verification" : "Verify User"}
                          >
                            <ShieldCheck size={16} />
                          </button>
                          
                          {/* Suspend / Activate */}
                          {u.active ? (
                            <button 
                              onClick={() => toggleSuspend(u.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
                              title="Suspend"
                            >
                              <UserX size={16} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => toggleSuspend(u.id)}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" 
                              title="Activate"
                            >
                              <UserCheck size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Showing {filteredUsers.length} total users</span>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
