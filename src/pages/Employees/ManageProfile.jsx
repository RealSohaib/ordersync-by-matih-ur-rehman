import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { Edit2, LogOut, User, Eye, EyeOff } from 'lucide-react';
import PropTypes from 'prop-types'; // Import PropTypes
import Layout from './Layout';
import Modal from '../../components/Modle';
import { toast } from 'react-toastify';

const UserProfile = ({ user, onEdit }) => (
  <div className="bg-white shadow rounded-lg p-6 text-center">
    <div className="flex items-center flex-col justify-center space-x-4 mb-4">
      <div className="bg-white text-blue-500 border-solid border-2 rounded-full p-3">
        <User size={60} />
      </div>
      <div>
        <h2 className="text-2xl font-bold">{user.username}</h2>
      </div>
    </div>
    <div className="space-y-2 w-full">
      <div className="flex w-full justify-between">
        <span className="font-semibold">Password:</span>
        <span>{user.password}</span>
      </div>
      <div className="flex w-full justify-end">
        <button
          onClick={() => onEdit(user, 'password')}
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          Change Password
        </button>
      </div>
      <div className="flex w-full justify-between">
        <span className="font-semibold">Role:</span>
        <span>{user.role}</span>
      </div>
      {user.role !== 'employee' && (
        <div className="flex w-full justify-end">
          <button
            onClick={() => onEdit(user, 'role')}
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            Change Role
          </button>
        </div>
      )}
      <div className="flex w-full justify-between">
        <span className="font-semibold">Duty:</span>
        <span>{user.duty}</span>
      </div>
      {user.role !== 'employee' && (
        <div className="flex w-full justify-end">
          <button
            onClick={() => onEdit(user, 'duty')}
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            Change Duty
          </button>
        </div>
      )}
    </div>
    <button
      onClick={() => onEdit(user, 'profile')}
      className="mt-4 flex items-center justify-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
    >
      <Edit2 size={16} />
      <span>Edit Profile</span>
    </button>
  </div>
);

// Add prop types validation
UserProfile.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    duty: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default function ManageProfile() {
  const cookies = useMemo(() => new Cookies(), []); // Memoize cookies object
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editField, setEditField] = useState('');

  useEffect(() => {
    const userCookie = cookies.get('employee');
    if (userCookie) {
      setUser(userCookie);
    } else {
      navigate('/login');
    }
  }, [navigate, cookies]);

  const handleLogout = () => {
    cookies.remove('employee');
    navigate('/login');
  };

  const handleEdit = (user, field) => {
    setEdit(user);
    setEditField(field);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      if (editField === 'password') {
        await axios.put(`http://localhost:3001/user/change-password`, {
          _id: edit._id,
          password: user.password,
          newpassword: edit.password,
        });
        toast.success("Password changed successfully");
      } else {
        await axios.put(`http://localhost:3001/user/edit`, {
          _id: edit._id,
          newusername: edit.username,
          password: user.password,
          newpassword: edit.password,
          newduty: edit.duty,
          newsalary: edit.salary,
        });
        if (editField === 'profile') {
          toast.success("Profile updated successfully");
        } else if (editField === 'role') {
          toast.success("Role updated successfully");
        } else if (editField === 'duty') {
          toast.success("Duty updated successfully");
        }
      }
      setUser((prevUser) => ({ ...prevUser, ...edit }));
      cookies.set('employee', { ...user, ...edit }, { path: '/' }); // Update the cookie
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Error updating user');
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="space-y-6 w-full max-w-md">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-3xl font-bold text-gray-900">Manage Profile</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          <div className="bg-white w-full h-full shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <UserProfile user={user} onEdit={handleEdit} />
            </div>
          </div>

          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Edit User Credentials"
            onClick={handleSaveChanges}
          >
            <div className="space-y-4">
              {editField === 'profile' && (
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
              )}
              {editField === 'password' && (
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
              )}
              {editField === 'role' && user.role !== 'employee' && (
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    value={edit.role || ''}
                    onChange={(e) => setEdit({ ...edit, role: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              {editField === 'duty' && user.role !== 'employee' && (
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
              )}
            </div>
            <button
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={handleSaveChanges}
            >
              Save Changes
              <Edit2 className="ml-2" />
            </button>
          </Modal>
        </div>
      </div>
    </Layout>
  );
}