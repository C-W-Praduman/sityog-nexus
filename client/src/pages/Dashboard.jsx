import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

const Dashboard = () => {
  const { token, user, setUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', rollNo: '', branch: '', semester: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return setLoading(false);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.user);
        setForm({
          name: res.data.user.name || '',
          mobile: res.data.user.mobile || '',
          rollNo: res.data.user.rollNo || '',
          branch: res.data.user.branch || '',
          semester: res.data.user.semester || ''
        });
      } catch (err) {
        // Error handled silently, user sees default message
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  if (!profile) return <div className="min-h-[60vh] flex items-center justify-center">No profile available.</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/api/auth/me`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data.user);
      // update auth context so navbar reflects new name
      if (typeof setUser === 'function') setUser(res.data.user);
      // update local user object stored in localStorage (name change reflected)
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.name = res.data.user.name;
        localStorage.setItem('user', JSON.stringify(parsed));
      }
      toast.success('Profile updated');
    } catch (err) {
      // Error handled via toast
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[70vh] py-30 px-4 sm:px-6 lg:px-8 bg-[#071026] text-white">
      <div className="max-w-3xl  mx-auto bg-[#0d1726] p-8 sm:p-12 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <p className="text-sm text-gray-300 mb-6">Welcome back, <strong>{profile.name}</strong>. Manage your public profile information below.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email (read-only)</label>
            <input value={profile.email} readOnly className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-gray-300" />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Full name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-gray-200" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Mobile</label>
              <input name="mobile" value={form.mobile} onChange={handleChange} className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-gray-200" placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Roll No</label>
              <input name="rollNo" value={form.rollNo} onChange={handleChange} className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-gray-200" placeholder="Optional" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Branch</label>
              <input name="branch" value={form.branch} onChange={handleChange} className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-gray-200" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Semester</label>
              <input name="semester" type="number" min="1" max="12" value={form.semester || ''} onChange={handleChange} className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-gray-200" placeholder="e.g. 3" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button disabled={saving} type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold">{saving ? 'Saving...' : 'Update Profile'}</button>
            <button type="button" onClick={logout} className="px-4 py-3 border border-gray-700 rounded text-gray-200">Logout</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
