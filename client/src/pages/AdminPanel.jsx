import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Database, Settings, Shield, Trash2, Eye, ArrowLeft, Plus, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import Card3D from '../components/Card3D';

export default function AdminPanel() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Queries
  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => (await api.get('/admin/stats')).data
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => (await api.get('/admin/users')).data,
    enabled: true // Always fetch users
  });

  const { data: foods, isLoading: foodsLoading, error: foodsError } = useQuery({
    queryKey: ['adminFoods'],
    queryFn: async () => (await api.get('/food')).data,
    enabled: true,
    retry: 1
  });

  // Mutations
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => api.delete(`/admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      queryClient.invalidateQueries(['adminStats']);
      toast.success('User deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete user');
    }
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => api.put(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      queryClient.invalidateQueries(['adminStats']);
      toast.success('User role updated');
    },
    onError: () => {
      toast.error('Failed to update user role');
    }
  });

  const addFoodMutation = useMutation({
    mutationFn: (foodData) => api.post('/food', foodData),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminFoods']);
      toast.success('Food added successfully');
      setShowAddFoodModal(false);
      setNewFood({
        name: '',
        category: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        sugar: '',
        tags: []
      });
    },
    onError: () => {
      toast.error('Failed to add food');
    }
  });

  const addUserMutation = useMutation({
    mutationFn: (userData) => api.post('/admin/users', userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      queryClient.invalidateQueries(['adminStats']);
      toast.success('User added successfully');
      setShowAddUserModal(false);
      setNewUser({
        email: '',
        name: '',
        password: '',
        role: 'user'
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to add user');
    }
  });

  const updateFoodMutation = useMutation({
    mutationFn: ({ foodId, foodData }) => api.put(`/food/${foodId}`, foodData),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminFoods']);
      toast.success('Food updated successfully');
      setShowEditFoodModal(false);
      setEditingFood(null);
    },
    onError: () => {
      toast.error('Failed to update food');
    }
  });

  const deleteFoodMutation = useMutation({
    mutationFn: (foodId) => api.delete(`/food/${foodId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminFoods']);
      toast.success('Food deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete food');
    }
  });

  // State
  const [activeSection, setActiveSection] = useState('dashboard');
  const [viewingUserProfile, setViewingUserProfile] = useState(null);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showEditFoodModal, setShowEditFoodModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [newFood, setNewFood] = useState({
    name: '',
    category: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    sugar: '',
    tags: []
  });
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    password: '',
    role: 'user'
  });

  // Always show these 6 cards regardless of API data
  const allCards = [
    { icon: Users, title: 'Total Users', value: stats?.totalUsers || 0, color: 'from-blue-500 to-cyan-500' },
    { icon: Users, title: 'Active Users', value: stats?.activeUsers || 0, color: 'from-green-500 to-emerald-500' },
    { icon: Users, title: 'Inactive Users', value: stats?.inactiveUsers || 0, color: 'from-red-500 to-pink-500' },
    { icon: Database, title: 'Diet Plans', value: stats?.totalDietPlans || 0, color: 'from-purple-500 to-indigo-500' },
    { icon: Settings, title: 'Workout Plans', value: stats?.totalWorkoutPlans || 0, color: 'from-orange-500 to-amber-500' },
    { icon: Shield, title: 'AI Requests Today', value: stats?.aiRequestsToday || 0, color: 'from-cyan-500 to-blue-500' }
  ];

  console.log('AdminPanel - Stats:', stats);
  console.log('AdminPanel - Cards:', allCards);
  console.log('AdminPanel - Active Section:', activeSection);

  // Render User Management Section
  if (activeSection === 'users') {
    return (
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setActiveSection('dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition"
              style={{ background: '#4CAF50', boxShadow: '0 0 20px rgba(76, 175, 80, 0.4)' }}
            >
              <Plus size={20} />
              Add User
            </button>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">👥 User Management</h1>
          <p className="text-white/70">Monitor platform usage and manage accounts efficiently</p>
        </motion.div>

        <Card3D style={{ backgroundColor: '#25253D', borderColor: 'rgba(108, 99, 255, 0.1)', boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white/70 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 text-white/70 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 text-white/70 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-white/70 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 text-white/70 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-white/70">Loading users...</td>
                  </tr>
                ) : users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="border-b border-white/10 hover:bg-white/5 transition">
                      <td className="py-3 px-4">
                        <div className="text-white font-semibold">
                          {user.profile?.name || 'Not set'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white">{user.email}</div>
                        <div className="text-white/50 text-xs">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          user.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {user.isVerified ? '🟢 Active' : '🟡 Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRoleMutation.mutate({ 
                            userId: user._id, 
                            role: e.target.value 
                          })}
                          className={`px-2 py-1 text-xs rounded border border-white/20 bg-gray-800 ${
                            user.role === 'admin' ? 'text-red-400' :
                            user.role === 'nutritionist' ? 'text-purple-400' :
                            'text-blue-400'
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="nutritionist">Nutritionist</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setViewingUserProfile(user)}
                            className="p-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition"
                            title="View Profile"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this user?')) {
                                deleteUserMutation.mutate(user._id);
                              }
                            }}
                            className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-white/70">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card3D>

        {/* Enhanced User Profile Modal */}
        {viewingUserProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card3D className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#25253D', borderColor: 'rgba(108, 99, 255, 0.1)', boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">👤 User Profile Details</h3>
                <button
                  onClick={() => setViewingUserProfile(null)}
                  className="text-white/70 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                    📋 Basic Information
                  </h4>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Full Name:</label>
                    <p className="text-white text-lg">{viewingUserProfile.profile?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Email:</label>
                    <p className="text-white">{viewingUserProfile.email}</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Age:</label>
                    <p className="text-white">{viewingUserProfile.profile?.age || 'Not provided'} years</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Gender:</label>
                    <p className="text-white capitalize">{viewingUserProfile.profile?.gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Account Status:</label>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${
                      viewingUserProfile.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {viewingUserProfile.isVerified ? '🟢 Active' : '🟡 Pending Verification'}
                    </span>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Role:</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                      viewingUserProfile.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      viewingUserProfile.role === 'nutritionist' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {viewingUserProfile.role === 'admin' ? '🛡️ Admin' :
                       viewingUserProfile.role === 'nutritionist' ? '👨‍⚕️ Nutritionist' :
                       '👤 User'}
                    </span>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Member Since:</label>
                    <p className="text-white">{new Date(viewingUserProfile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </div>

                {/* Physical Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                    📏 Physical Information
                  </h4>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Height:</label>
                    <p className="text-white">{viewingUserProfile.profile?.height || 'Not provided'} cm</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Current Weight:</label>
                    <p className="text-white">{viewingUserProfile.profile?.weight || 'Not provided'} kg</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Target Weight:</label>
                    <p className="text-white">{viewingUserProfile.profile?.targetWeight || 'Not set'} kg</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Activity Level:</label>
                    <p className="text-white capitalize">{viewingUserProfile.profile?.activityLevel || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">BMI:</label>
                    <p className="text-white">
                      {viewingUserProfile.profile?.height && viewingUserProfile.profile?.weight ? 
                        (viewingUserProfile.profile.weight / Math.pow(viewingUserProfile.profile.height / 100, 2)).toFixed(1) :
                        'Cannot calculate'
                      }
                    </p>
                  </div>
                </div>

                {/* Goals & Preferences */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                    🎯 Goals & Preferences
                  </h4>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Primary Goal:</label>
                    <p className="text-white capitalize">{viewingUserProfile.profile?.goal || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Dietary Preferences:</label>
                    <p className="text-white">
                      {viewingUserProfile.profile?.dietaryPreferences?.length > 0 ? 
                        viewingUserProfile.profile.dietaryPreferences.join(', ') : 
                        'None specified'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Meal Preferences:</label>
                    <p className="text-white">
                      {viewingUserProfile.profile?.mealPreferences?.length > 0 ? 
                        viewingUserProfile.profile.mealPreferences.join(', ') : 
                        'None specified'
                      }
                    </p>
                  </div>
                </div>

                {/* Health Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                    🏥 Health Information
                  </h4>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Food Allergies:</label>
                    <div className="mt-1">
                      {viewingUserProfile.profile?.allergies?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {viewingUserProfile.profile.allergies.map((allergy, index) => (
                            <span key={index} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                              🚫 {allergy}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/70 text-sm">No known allergies</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Medical Conditions:</label>
                    <p className="text-white">
                      {viewingUserProfile.profile?.medicalConditions?.length > 0 ? 
                        viewingUserProfile.profile.medicalConditions.join(', ') : 
                        'None reported'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm font-medium">Medications:</label>
                    <p className="text-white">
                      {viewingUserProfile.profile?.medications?.length > 0 ? 
                        viewingUserProfile.profile.medications.join(', ') : 
                        'None reported'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <button
                  onClick={() => setViewingUserProfile(null)}
                  className="w-full py-3 text-white rounded-lg transition font-semibold"
                  style={{ background: '#6C63FF', boxShadow: '0 0 20px rgba(108, 99, 255, 0.4)' }}
                >
                  Close Profile
                </button>
              </div>
            </Card3D>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card3D className="max-w-md w-full" style={{ backgroundColor: '#25253D', borderColor: 'rgba(108, 99, 255, 0.1)', boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">👤 Add New User</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-white/70 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                addUserMutation.mutate(newUser);
              }} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-white/20 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-white/20 focus:border-blue-500 focus:outline-none"
                    placeholder="user@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-white/20 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter password"
                    required
                    minLength="6"
                  />
                  <p className="text-white/50 text-xs mt-1">Minimum 6 characters</p>
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-white/20 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="user">👤 User</option>
                    <option value="nutritionist">👨‍⚕️ Nutritionist</option>
                    <option value="admin">🛡️ Admin</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addUserMutation.isLoading}
                    className="flex-1 py-3 text-white rounded-lg transition font-medium disabled:opacity-50"
                    style={{ background: '#4CAF50', boxShadow: '0 0 20px rgba(76, 175, 80, 0.4)' }}
                  >
                    {addUserMutation.isLoading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              </form>
            </Card3D>
          </div>
        )}
      </div>
    );
  }

  // Render Food Management Section
  if (activeSection === 'foods') {
    return (
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setActiveSection('dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <button
              onClick={() => setShowAddFoodModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition"
              style={{ background: '#4CAF50', boxShadow: '0 0 20px rgba(76, 175, 80, 0.4)' }}
            >
              <Plus size={20} />
              Add Food
            </button>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">🍎 Food Management</h1>
          <p className="text-white/70">Manage food database and nutritional information</p>
        </motion.div>

        <Card3D style={{ backgroundColor: '#25253D', borderColor: 'rgba(108, 99, 255, 0.1)', boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white/70 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 text-white/70 font-semibold">Category</th>
                  <th className="text-left py-3 px-4 text-white/70 font-semibold">Calories</th>
                  <th className="text-left py-3 px-4 text-white/70 font-semibold">Protein</th>
                  <th className="text-left py-3 px-4 text-white/70 font-semibold">Carbs</th>
                  <th className="text-left py-3 px-4 text-white/70 font-semibold">Fat</th>
                  <th className="text-left py-3 px-4 text-white/70 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {foodsLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-white/70">Loading foods...</td>
                  </tr>
                ) : foodsError ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-red-400">
                      Error loading foods: {foodsError.message}
                      <br />
                      <small className="text-white/50">Check console for details</small>
                    </td>
                  </tr>
                ) : foods && foods.length > 0 ? (
                  foods.map((food) => (
                      <tr key={food._id} className="border-b border-white/10 hover:bg-white/5 transition">
                        <td className="py-3 px-4">
                          <div className="text-white font-semibold">{food.name}</div>
                          {/* Food Tags */}
                          {food.tags && food.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {food.tags.map((tag, index) => (
                                <span key={index} className={`px-1 py-0.5 rounded text-xs ${
                                  tag === 'diabetic-friendly' ? 'bg-green-500/20 text-green-400' :
                                  tag === 'low-carb' ? 'bg-yellow-500/20 text-yellow-400' :
                                tag === 'high-protein' ? 'bg-purple-500/20 text-purple-400' :
                                tag === 'gluten-free' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          {food.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">{food.calories}</td>
                      <td className="py-3 px-4 text-white">{food.protein}g</td>
                      <td className="py-3 px-4 text-white">{food.carbs}g</td>
                      <td className="py-3 px-4 text-white">{food.fat}g</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingFood(food);
                              setShowEditFoodModal(true);
                            }}
                            className="p-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition"
                            title="Edit Food"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this food?')) {
                                deleteFoodMutation.mutate(food._id);
                              }
                            }}
                            className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                            title="Delete Food"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-white/70">
                      No foods found. Click "Add Food" to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card3D>

        {/* Add Food Modal */}
        {showAddFoodModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card3D className="max-w-2xl w-full" style={{ backgroundColor: '#25253D', borderColor: 'rgba(108, 99, 255, 0.1)', boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Add New Food</h3>
                <button
                  onClick={() => setShowAddFoodModal(false)}
                  className="text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                addFoodMutation.mutate(newFood);
              }} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">Food Name</label>
                  <input
                    type="text"
                    value={newFood.name}
                    onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Category</label>
                  <select
                    value={newFood.category}
                    onChange={(e) => setNewFood({...newFood, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="grains">Grains</option>
                    <option value="proteins">Proteins</option>
                    <option value="dairy">Dairy</option>
                    <option value="snacks">Snacks</option>
                    <option value="beverages">Beverages</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Calories</label>
                    <input
                      type="number"
                      value={newFood.calories}
                      onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Protein (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newFood.protein}
                      onChange={(e) => setNewFood({...newFood, protein: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newFood.carbs}
                      onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Fat (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newFood.fat}
                      onChange={(e) => setNewFood({...newFood, fat: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Fiber (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newFood.fiber}
                      onChange={(e) => setNewFood({...newFood, fiber: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Sugar (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newFood.sugar}
                      onChange={(e) => setNewFood({...newFood, sugar: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Food Tags */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">Food Tags (Optional)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['diabetic-friendly', 'low-carb', 'high-protein', 'gluten-free', 'vegan', 'vegetarian'].map((tag) => (
                      <label key={tag} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newFood.tags?.includes(tag)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewFood({...newFood, tags: [...(newFood.tags || []), tag]});
                            } else {
                              setNewFood({...newFood, tags: newFood.tags.filter(t => t !== tag)});
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className={`text-xs px-2 py-1 rounded ${
                          tag === 'diabetic-friendly' ? 'bg-green-500/20 text-green-400' :
                          tag === 'low-carb' ? 'bg-yellow-500/20 text-yellow-400' :
                          tag === 'high-protein' ? 'bg-purple-500/20 text-purple-400' :
                          tag === 'gluten-free' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {tag}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddFoodModal(false)}
                    className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addFoodMutation.isLoading}
                    className="flex-1 py-2 text-white rounded transition disabled:opacity-50"
                    style={{ background: '#4CAF50', boxShadow: '0 0 20px rgba(76, 175, 80, 0.4)' }}
                  >
                    {addFoodMutation.isLoading ? 'Adding...' : 'Add Food'}
                  </button>
                </div>
              </form>
            </Card3D>
          </div>
        )}

        {/* Edit Food Modal */}
        {showEditFoodModal && editingFood && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card3D className="max-w-2xl w-full" style={{ backgroundColor: '#25253D', borderColor: 'rgba(108, 99, 255, 0.1)', boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Edit Food</h3>
                <button
                  onClick={() => {
                    setShowEditFoodModal(false);
                    setEditingFood(null);
                  }}
                  className="text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                updateFoodMutation.mutate({
                  foodId: editingFood._id,
                  foodData: editingFood
                });
              }} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">Food Name</label>
                  <input
                    type="text"
                    value={editingFood.name}
                    onChange={(e) => setEditingFood({...editingFood, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Category</label>
                  <select
                    value={editingFood.category}
                    onChange={(e) => setEditingFood({...editingFood, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="grains">Grains</option>
                    <option value="proteins">Proteins</option>
                    <option value="dairy">Dairy</option>
                    <option value="snacks">Snacks</option>
                    <option value="beverages">Beverages</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Calories</label>
                    <input
                      type="number"
                      value={editingFood.calories}
                      onChange={(e) => setEditingFood({...editingFood, calories: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Protein (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingFood.protein}
                      onChange={(e) => setEditingFood({...editingFood, protein: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingFood.carbs}
                      onChange={(e) => setEditingFood({...editingFood, carbs: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Fat (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingFood.fat}
                      onChange={(e) => setEditingFood({...editingFood, fat: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Fiber (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingFood.fiber || ''}
                      onChange={(e) => setEditingFood({...editingFood, fiber: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Sugar (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingFood.sugar || ''}
                      onChange={(e) => setEditingFood({...editingFood, sugar: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-white/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Food Tags */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">Food Tags</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['diabetic-friendly', 'low-carb', 'high-protein', 'gluten-free', 'vegan', 'vegetarian'].map((tag) => (
                      <label key={tag} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingFood.tags?.includes(tag)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingFood({...editingFood, tags: [...(editingFood.tags || []), tag]});
                            } else {
                              setEditingFood({...editingFood, tags: editingFood.tags?.filter(t => t !== tag) || []});
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className={`text-xs px-2 py-1 rounded ${
                          tag === 'diabetic-friendly' ? 'bg-green-500/20 text-green-400' :
                          tag === 'low-carb' ? 'bg-yellow-500/20 text-yellow-400' :
                          tag === 'high-protein' ? 'bg-purple-500/20 text-purple-400' :
                          tag === 'gluten-free' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {tag}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditFoodModal(false);
                      setEditingFood(null);
                    }}
                    className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateFoodMutation.isLoading}
                    className="flex-1 py-2 text-white rounded transition disabled:opacity-50"
                    style={{ background: '#6C63FF', boxShadow: '0 0 20px rgba(108, 99, 255, 0.4)' }}
                  >
                    {updateFoodMutation.isLoading ? 'Updating...' : 'Update Food'}
                  </button>
                </div>
              </form>
            </Card3D>
          </div>
        )}
      </div>
    );
  }

  // Default Dashboard View
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">🛡️ Admin Control Panel</h1>
        <p className="text-white/70">Complete system administration and management</p>
      </motion.div>

      {/* Admin Dashboard Content */}
      <div className="space-y-8">
        {/* Stats Cards - Always Show All 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card3D className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: '#25253D', borderColor: 'rgba(108, 99, 255, 0.1)', boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)' }}>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="text-white" size={26} />
                </div>
                <h3 className="text-white/70 text-sm mb-1 font-semibold">{card.title}</h3>
                <p className="text-4xl font-bold text-white">{card.value}</p>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* System Status & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card3D className="hover:shadow-2xl transition-all duration-300" style={{ backgroundColor: '#25253D', borderColor: 'rgba(108, 99, 255, 0.1)', boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)' }}>
            <h2 className="text-2xl font-bold text-white mb-4">📊 System Status</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/30 transition-all duration-300 group">
                <h3 className="text-green-400 font-semibold group-hover:text-green-300 transition-colors">🟢 All Systems Operational</h3>
                <p className="text-white/70 text-sm">Database connected, AI services active</p>
              </div>
              <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/30 transition-all duration-300 group">
                <h3 className="text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">🤖 AI Service Status</h3>
                <p className="text-white/70 text-sm">Gemini API: Active</p>
              </div>
              <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/30 transition-all duration-300 group">
                <h3 className="text-purple-400 font-semibold group-hover:text-purple-300 transition-colors">📊 Today's Activity</h3>
                <p className="text-white/70 text-sm">
                  {stats?.newUsersToday || 0} new users, {stats?.aiRequestsToday || 0} AI requests
                </p>
              </div>
            </div>
          </Card3D>

          <Card3D className="hover:shadow-2xl transition-all duration-300" style={{ backgroundColor: '#25253D', borderColor: 'rgba(108, 99, 255, 0.1)', boxShadow: '0 4px 20px rgba(108, 99, 255, 0.1)' }}>
            <h2 className="text-2xl font-bold text-white mb-4">⚡ Quick Actions</h2>
            <p className="text-white/50 text-xs mb-4">DEBUG: Quick Actions card is rendering</p>
            <div className="space-y-3">
              <button 
                onClick={() => setActiveSection('users')}
                className="w-full flex items-center gap-3 p-4 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 group"
                style={{ background: '#6C63FF', boxShadow: '0 0 20px rgba(108, 99, 255, 0.4)' }}
              >
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                  <Users size={20} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">👥 User Management</h3>
                  <p className="text-white/80 text-sm">Manage users, roles & profiles</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveSection('foods')}
                className="w-full flex items-center gap-3 p-4 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 group"
                style={{ background: '#4CAF50', boxShadow: '0 0 20px rgba(76, 175, 80, 0.4)' }}
              >
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                  <Database size={20} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">🍎 Food Management</h3>
                  <p className="text-white/80 text-sm">Add, edit & manage food items</p>
                </div>
              </button>
            </div>
          </Card3D>
        </div>
      </div>
    </div>
  );
}