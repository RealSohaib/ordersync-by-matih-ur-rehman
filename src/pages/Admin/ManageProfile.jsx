import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { Edit2, LogOut, User, Eye, EyeOff } from 'lucide-react';
import Layout from './Layout'

const Modal = ({ isOpen, onClose, title, children, btnTitle, onClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {children}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={onClick}
            >
              {btnTitle}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfile = ({ user, onEdit }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <div className="flex items-center space-x-4 mb-4">
      <div className="bg-blue-500 text-white rounded-full p-3">
        <User size={32} />
      </div>
      <h2 className="text-2xl font-bold">{user.username}</h2>
    </div>
    <div className="space-y-2">
      <p><span className="font-semibold">Role:</span> {user.role}</p>
      <p><span className="font-semibold">Duty:</span> {user.duty}</p>
    </div>
    <button
      onClick={() => onEdit(user)}
      className="mt-4 flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
    >
      <Edit2 size={16} />
      <span>Edit Profile</span>
    </button>
  </div>
);

export default function ManageProfile() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const userCookie = cookies.get('user');
    if (userCookie) {
      setUser(userCookie);
    } else {
      navigate('/login');
    }
  }, [navigate, cookies]);

  const handleLogout = () => {
    cookies.remove('user');
    navigate('/login');
  };

  const handleEdit = (user) => {
    setEdit(user);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/changepassword/${user._id}`, edit);
      setUser((prevUser) => ({ ...prevUser, ...edit }));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Manage Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <UserProfile user={user} onEdit={handleEdit} />
          </div>
        </div>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit User Credentials"
          btnTitle="Save Changes"
          onClick={handleSaveChanges}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={edit.username || ''}
                onChange={(e) => setEdit({ ...edit, username: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={edit.password || ''}
                  onChange={(e) => setEdit({ ...edit, password: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="duty" className="block text-sm font-medium text-gray-700">
                Duty
              </label>
              <input
                id="duty"
                type="text"
                value={edit.duty || ''}
                onChange={(e) => setEdit({ ...edit, duty: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}