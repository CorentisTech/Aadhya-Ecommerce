"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Shield, ShieldCheck, Edit3, Trash2, 
  Power, PowerOff, X, AlertCircle, CheckCircle2,
  Sparkles, Users, Crown, Headphones, Pencil
} from 'lucide-react';

interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  last_login_at: string | null;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  support: 'Support',
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  super_admin: <Crown className="w-3.5 h-3.5" />,
  admin: <ShieldCheck className="w-3.5 h-3.5" />,
  editor: <Pencil className="w-3.5 h-3.5" />,
  support: <Headphones className="w-3.5 h-3.5" />,
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-amber-100 text-amber-800 border-amber-300',
  admin: 'bg-blue-100 text-blue-800 border-blue-300',
  editor: 'bg-green-100 text-green-800 border-green-300',
  support: 'bg-purple-100 text-purple-800 border-purple-300',
};

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add Admin Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ fullName: '', email: '', role: 'admin', password: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit Role Modal
  const [editAdmin, setEditAdmin] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState('');

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/admins');
      const data = await res.json();
      if (data.success) {
        setAdmins(data.admins || []);
      } else {
        setError(data.error || 'Failed to load admins');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Admin created successfully');
        setShowAddModal(false);
        setAddForm({ fullName: '', email: '', role: 'admin', password: '' });
        fetchAdmins();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setAddError(data.error || 'Failed to create admin');
      }
    } catch (err: any) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleChangeRole = async () => {
    if (!editAdmin) return;
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: editAdmin.id, role: editRole }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Role updated successfully');
        setEditAdmin(null);
        fetchAdmins();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    const newStatus = admin.status === 'active' ? 'disabled' : 'active';
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: admin.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Admin ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully`);
        fetchAdmins();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveAdmin = async (admin: AdminUser) => {
    if (!confirm(`Remove ${admin.first_name} ${admin.last_name} from admin access? They will become a regular customer.`)) return;
    try {
      const res = await fetch(`/api/admin/admins?adminId=${admin.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccess('Admin removed successfully');
        fetchAdmins();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (d: string | null) => {
    if (!d) return 'Never';
    return new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-[#996522] to-[#dfa658] rounded-2xl shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl tracking-wide text-gray-900">Admin Management</h1>
            <p className="text-xs text-gray-500 font-medium">Manage admin accounts, roles & permissions</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#cca05b] hover:bg-[#b8904f] text-white text-[11px] font-extrabold tracking-widest uppercase rounded-xl transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {success}
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
            <button onClick={() => setError(null)} className="ml-auto"><X className="w-3.5 h-3.5" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm font-semibold">Loading admins...</div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm font-semibold">No admin accounts found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 tracking-widest uppercase">Name</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 tracking-widest uppercase">Email</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 tracking-widest uppercase">Role</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 tracking-widest uppercase">Status</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 tracking-widest uppercase">Last Login</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 tracking-widest uppercase">Created</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 tracking-widest uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-gray-900">{admin.first_name} {admin.last_name}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-600">{admin.email}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-lg border ${ROLE_COLORS[admin.role] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {ROLE_ICONS[admin.role]} {ROLE_LABELS[admin.role] || admin.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${admin.status === 'active' ? 'text-emerald-600' : 'text-red-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${admin.status === 'active' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                        {admin.status === 'active' ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[11px] text-gray-500">{formatDateTime(admin.last_login_at)}</td>
                    <td className="px-5 py-3.5 text-[11px] text-gray-500">{formatDate(admin.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setEditAdmin(admin); setEditRole(admin.role); }}
                          title="Change Role"
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          title={admin.status === 'active' ? 'Disable' : 'Enable'}
                          className={`p-1.5 rounded-lg transition-colors ${admin.status === 'active' ? 'hover:bg-amber-50 text-gray-400 hover:text-amber-600' : 'hover:bg-emerald-50 text-gray-400 hover:text-emerald-600'}`}
                        >
                          {admin.status === 'active' ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleRemoveAdmin(admin)}
                          title="Remove Admin"
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Permission Reference Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold text-gray-900 tracking-wide uppercase mb-4">Role Permissions Reference</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { role: 'Super Admin', perms: 'Full Access — All modules, admin management, security settings' },
            { role: 'Admin', perms: 'Products, Categories, Orders, Users, Tracking, Reviews, Revenue, CMS' },
            { role: 'Editor', perms: 'Products, Categories, Banners, Offers, CMS/Policies' },
            { role: 'Support', perms: 'Users, Orders, Tracking, Support Tickets' },
          ].map((item) => (
            <div key={item.role} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-[10px] font-extrabold tracking-widest uppercase text-gray-700 mb-1.5">{item.role}</p>
              <p className="text-[10px] text-gray-500 leading-relaxed">{item.perms}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#cca05b] rounded-xl"><UserPlus className="w-4 h-4 text-white" /></div>
                  <h2 className="font-display font-bold text-base text-gray-900">Add New Admin</h2>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
              </div>

              {addError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5" /> {addError}
                </div>
              )}

              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Full Name</label>
                  <input
                    required type="text" value={addForm.fullName}
                    onChange={(e) => setAddForm(p => ({ ...p, fullName: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#cca05b]"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Email Address</label>
                  <input
                    required type="email" value={addForm.email}
                    onChange={(e) => setAddForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#cca05b]"
                    placeholder="admin@aadhya.co"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Role</label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#cca05b] appearance-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="support">Support</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Password</label>
                  <input
                    required type="password" value={addForm.password} minLength={8}
                    onChange={(e) => setAddForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#cca05b]"
                    placeholder="Min 8 characters"
                  />
                </div>
                <button
                  type="submit" disabled={addLoading}
                  className="w-full py-3 bg-[#cca05b] hover:bg-[#b8904f] text-white text-[11px] font-extrabold tracking-widest uppercase rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {addLoading ? 'Creating...' : 'Create Admin Account'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Role Modal */}
      <AnimatePresence>
        {editAdmin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditAdmin(null)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-display font-bold text-base text-gray-900">Change Role</h2>
                <button onClick={() => setEditAdmin(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-xs text-gray-500">
                Changing role for <strong>{editAdmin.first_name} {editAdmin.last_name}</strong> ({editAdmin.email})
              </p>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#cca05b] appearance-none"
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="support">Support</option>
              </select>
              <div className="flex gap-3">
                <button onClick={() => setEditAdmin(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 text-[11px] font-bold tracking-widest uppercase rounded-xl hover:bg-gray-200 transition-all">
                  Cancel
                </button>
                <button onClick={handleChangeRole}
                  className="flex-1 py-2.5 bg-[#cca05b] text-white text-[11px] font-bold tracking-widest uppercase rounded-xl hover:bg-[#b8904f] transition-all shadow-sm">
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
