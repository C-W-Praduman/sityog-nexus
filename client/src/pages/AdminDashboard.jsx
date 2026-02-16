import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';
import { FaUserShield, FaUserSlash, FaTrash, FaUserCheck, FaArrowLeft, FaEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (userId) => {
    setActionLoading(userId);
    try {
      const res = await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message);
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (err) {
      toast.error('Failed to update block status');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also remove them from Firebase.')) return;
    
    setActionLoading(userId);
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] pt-32 flex justify-center text-blue-400 font-bold">
      Loading System Directory...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-bold mb-4 cursor-pointer">
              <FaArrowLeft className="mr-2" /> Return to Nexus
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-4">
              <FaUserShield className="text-purple-500 shrink-0" /> Administrative Panel
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">Manage the SITYOG Nexus biological entities and permissions.</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-center md:min-w-[140px]">
            <span className="text-xs font-bold text-blue-400 block uppercase mb-1">Total Users</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{users.length}</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest text-center sm:text-left">Identity</th>
                  <th className="hidden sm:table-cell px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Role</th>
                  <th className="hidden md:table-cell px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-sm sm:text-base shrink-0">
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm sm:text-base truncate">{u.name}</p>
                          <p className="text-[10px] sm:text-xs text-gray-400 truncate max-w-[120px] sm:max-w-none">{u.email}</p>
                          <div className="flex sm:hidden mt-1 gap-2">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                              u.role === 'host' ? 'text-purple-400' : 'text-blue-400'
                            }`}>
                              {u.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        u.role === 'host' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 
                        u.role === 'admin' ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 
                        'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-center">
                      {u.isBlocked ? (
                        <span className="text-red-500 text-xs font-bold flex items-center justify-center gap-1">
                          <FaUserSlash size={10} /> Suspended
                        </span>
                      ) : (
                        <span className="text-green-500 text-xs font-bold flex items-center justify-center gap-1">
                          <FaUserCheck size={10} /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                        <button 
                          onClick={() => navigate(`/admin/users/${u._id}`)}
                          className="p-1.5 sm:p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all cursor-pointer"
                          title="Edit Entity Profile"
                        >
                          <FaEdit size={14} className="sm:size-[16px]" />
                        </button>
                        <button 
                          onClick={() => toggleBlock(u._id)}
                          disabled={actionLoading === u._id || u.role === 'host'}
                          className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer ${
                            u.isBlocked 
                              ? 'bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white' 
                              : 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white'
                          } disabled:opacity-30 disabled:cursor-not-allowed`}
                          title={u.isBlocked ? "Unblock Entity" : "Suspend Entity"}
                        >
                          {u.isBlocked ? <FaUserCheck size={14} className="sm:size-[16px]" /> : <FaUserSlash size={14} className="sm:size-[16px]" />}
                        </button>
                        <button 
                          onClick={() => deleteUser(u._id)}
                          disabled={actionLoading === u._id || u.role === 'host'}
                          className="p-1.5 sm:p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Purge Entity"
                        >
                          <FaTrash size={14} className="sm:size-[16px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
