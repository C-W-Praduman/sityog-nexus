import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';
import { FaUserEdit, FaArrowLeft, FaSave, FaExclamationTriangle } from 'react-icons/fa';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: 'user',
    mobile: '',
    rollNo: '',
    branch: '',
    semester: ''
  });

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = res.data.user;
      setProfile(userData);
      setForm({
        name: userData.name || '',
        role: userData.role || 'user',
        mobile: userData.mobile || '',
        rollNo: userData.rollNo || '',
        branch: userData.branch || '',
        semester: userData.semester || ''
      });
    } catch (err) {
      toast.error('Failed to fetch user details');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/api/admin/users/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User profile updated successfully');
      navigate('/admin');
    } catch (err) {
      toast.error('Failed to update user profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] pt-32 flex justify-center text-blue-400 font-bold">
      Accessing User Matrix...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-bold mb-8 group transition-all">
          <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" /> 
          Back to Admin Panel
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl -z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="w-fit p-4 bg-purple-600/20 rounded-2xl border border-purple-500/30 shrink-0">
              <FaUserEdit className="text-purple-400 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Manage Entity</h1>
              <p className="text-gray-400 text-sm">Update permissions and metadata for <b className="text-blue-400 break-all">{profile.email}</b></p>
            </div>
          </div>

          {profile.isBlocked && (
            <div className="mb-8 p-4 bg-red-600/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-bold">
              <FaExclamationTriangle /> This entity is currently suspended from the Nexus network.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Access Role</label>
                <select 
                  name="role" 
                  value={form.role} 
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                >
                  <option value="user" className="bg-[#0f172a]">User</option>
                  <option value="host" className="bg-[#0f172a]">Host</option>
                  <option value="admin" className="bg-[#0f172a]">Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Reference</label>
                <input 
                  name="mobile" 
                  value={form.mobile} 
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Academic Roll No</label>
                <input 
                  name="rollNo" 
                  value={form.rollNo} 
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Branch Branch</label>
                <input 
                  name="branch" 
                  value={form.branch} 
                  onChange={handleChange}
                  placeholder="e.g. CSE"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Semester Stage</label>
                <input 
                  name="semester" 
                  type="number"
                  min="1"
                  max="12"
                  value={form.semester} 
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button 
                type="submit" 
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all active:scale-[0.98] cursor-pointer text-sm sm:text-base"
              >
                <FaSave /> {saving ? 'Commiting Changes...' : 'Save Profile Matrix'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/admin')}
                className="px-8 py-4 border border-white/10 text-gray-300 font-bold rounded-2xl hover:bg-white/5 transition-all cursor-pointer text-sm sm:text-base"
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
