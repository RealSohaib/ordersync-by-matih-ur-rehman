import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './Layout';
const API_URL = 'http://localhost:3001';
const IMG_PATH = '../../api/uploads/';

export default function Dashboard() {
  const [menu, setMenu] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const cookies = useMemo(() => new Cookies(), []);

  const validateCookies = useCallback(() => {
    // const userRole = cookies.user.role;
    if (!cookies) {
      navigate('/login');
    }
    else{
      // toast.success('Welcome to admin dashboard');
    }
  }, [cookies, navigate]);

  useEffect(() => {
    validateCookies('user');
    fetchData();
  }, [validateCookies]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      setMenu(response.data);
    } catch (error) {
      console.error('Error fetching menu data:', error);
      toast.error('Failed to fetch menu data');
    }
  };

  const handleLogout = () => {
    cookies.remove('user');
    navigate('/login');
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await axios.post(`${API_URL}/menu/additems`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchData();
      setIsAddModalOpen(false);
      toast.success('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await axios.put(`${API_URL}/menu/edititem`, Object.fromEntries(formData));
      fetchData();
      setIsEditModalOpen(false);
      toast.success('Item updated successfully');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const handleDeleteItem = async () => {
    try {
      await axios.delete(`${API_URL}/menu/deleteitem`, { data: { name: itemToDelete.name } });
      fetchData();
      setIsDeleteModalOpen(false);
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>

    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 rounded-l-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200">
              Search
            </button>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-colors duration-200"
          >
            Add Item
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMenu.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={item.image ? `${IMG_PATH}${item.image}` : '/placeholder.svg'}
                      alt={item.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.stock === 0 ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Out of Stock
                      </span>
                    ) : (
                      item.stock
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditItem(item);
                        setIsEditModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(item);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="add-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Item</h3>
              <form onSubmit={handleAddItem} className="mt-2 text-left">
                <input name="name" placeholder="Item Name" required className="mt-2 p-2 w-full border rounded" />
                <select name="category" required className="mt-2 p-2 w-full border rounded">
                  <option value="">Select Category</option>
                  {[...new Set(menu.map((item) => item.category))].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200">
              add
            </button>
                <input name="price" type="number" placeholder="Price" required className="mt-2 p-2 w-full border rounded" />
                <input name="stock" type="number" placeholder="Available Stock" required className="mt-2 p-2 w-full border rounded" />
                <input name="image" type="file" className="mt-2 p-2 w-full border rounded" />
                <textarea name="description" placeholder="Description (optional)" className="mt-2 p-2 w-full border rounded" />
                <div className="items-center px-4 py-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="edit-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Item</h3>
              <form onSubmit={handleEditItem} className="mt-2 text-left">
                <input name="name" defaultValue={editItem?.name} required className="mt-2 p-2 w-full border rounded" />
                <select name="category" defaultValue={editItem?.category} required className="mt-2 p-2 w-full border rounded">
                  {[...new Set(menu.map((item) => item.category))].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <input name="price" type="number" defaultValue={editItem?.price} required className="mt-2 p-2 w-full border rounded" />
                <input name="stock" type="number" defaultValue={editItem?.stock} required className="mt-2 p-2 w-full border rounded" />
                <input name="image" type="file" className="mt-2 p-2 w-full border rounded" />
                <textarea name="description" defaultValue={editItem?.description} className="mt-2 p-2 w-full border rounded" />
                <div className="items-center px-4 py-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="delete-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete {itemToDelete?.name}?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleDeleteItem}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>

  );
}