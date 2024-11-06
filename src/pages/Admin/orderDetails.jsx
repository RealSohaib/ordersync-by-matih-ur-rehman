import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Search, ChevronDown, ChevronUp, Edit, Trash, RefreshCw,Printer } from 'lucide-react';
import Layout from './Layout';
import Modal from '../../components/Modle';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:3001/orders';

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('orderid');
  const [sortDirection, setSortDirection] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState('All');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Everytime');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data.length > orders.length) {
          toast.info('A new order has been placed!');
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [orders.length]);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleUpdateOrder = async (orderId, updatedData) => {
    try {
      await axios.put(`${API_URL}/edit`, { _id: orderId, ...updatedData });
      fetchData(); // Refresh the data after update
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error updating order');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`${API_URL}/remove`, { data: { _id: orderId } });
        fetchData(); // Refresh the data after deletion
        toast.success('Order deleted successfully');
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Error deleting order');
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = Object.values(order).some((value) =>
      value.includes(searchTerm)
    );
    const matchesDeliveryStatus = selectedDeliveryStatus === 'All' || order.delivery_status === selectedDeliveryStatus;
    const matchesPaymentStatus = selectedPaymentStatus === 'All' || order.payment_status === selectedPaymentStatus;

    const orderDate = new Date(order.date);
    const today = new Date();
    let matchesDateFilter = true;

    if (selectedDateFilter === 'This Day') {
      matchesDateFilter = orderDate.toDateString() === today.toDateString();
    } else if (selectedDateFilter === 'This Week') {
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      matchesDateFilter = orderDate >= startOfWeek && orderDate <= endOfWeek;
    } else if (selectedDateFilter === 'This Month') {
      matchesDateFilter = orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
    }

    return matchesSearch && matchesDeliveryStatus && matchesPaymentStatus && matchesDateFilter;
  });

  const sortedOrders = filteredOrders.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedOrders.length / rowsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleEdit = (order) => {
    setEditOrder(order);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    if (editOrder) {
      handleUpdateOrder(editOrder._id, editOrder);
      setIsEditModalOpen(false);
    }
  };

  const deliveryStatuses = ['All', ...new Set(orders.map(item => item.delivery_status))];
  const paymentStatuses = ['All', ...new Set(orders.map(item => item.payment_status))];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <div>
                <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700">
                  Date Filter
                </label>
                <select
                  id="dateFilter"
                  value={selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Everytime">Everytime</option>
                  <option value="This Day">This Day</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                </select>
              </div>
              <div className="w-full sm:w-auto mb-4 sm:mb-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              <div className="flex items-center">
                <label htmlFor="rowsPerPage" className="mr-2 text-sm">
                  Show:
                </label>
                <select
                  id="rowsPerPage"
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label htmlFor="deliveryStatus" className="block text-sm font-medium text-gray-700">
                    Delivery Status
                  </label>
                  <select
                    id="deliveryStatus"
                    value={selectedDeliveryStatus}
                    onChange={(e) => setSelectedDeliveryStatus(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {deliveryStatuses.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
                    Payment Status
                  </label>
                  <select
                    id="paymentStatus"
                    value={selectedPaymentStatus}
                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {paymentStatuses.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="animate-spin text-blue-500" size={48} />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('orderid')}>
                        Order ID
                        {sortColumn === 'orderid' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} className="inline ml-1" /> : <ChevronDown size={16} className="inline ml-1" />
                        )}
                      </th>
                      <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('clientName')}>
                        Customer Name
                        {sortColumn === 'clientName' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} className="inline ml-1" /> : <ChevronDown size={16} className="inline ml-1" />
                        )}
                      </th>
                      <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('date')}>
                        Order Date
                        {sortColumn === 'date' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} className="inline ml-1" /> : <ChevronDown size={16} className="inline ml-1" />
                        )}
                      </th>
                      <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('delivery_status')}>
                        Delivery Status
                        {sortColumn === 'delivery_status' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} className="inline ml-1" /> : <ChevronDown size={16} className="inline ml-1" />
                        )}
                      </th>
                      <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('payment_status')}>
                        Payment Status
                        {sortColumn === 'payment_status' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} className="inline ml-1" /> : <ChevronDown size={16} className="inline ml-1" />
                        )}
                      </th>
                      <th className="px-4 py-2">Fulfill</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{order.orderid}</td>
                        <td className="px-4 py-2">{order.clientName}</td>
                        <td className="px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.delivery_status === 'Fulfilled' ? 'bg-green-200 text-green-800' :
                            order.delivery_status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {order.delivery_status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.payment_status === 'Fulfilled' ? 'bg-green-200 text-green-800' :
                            order.payment_status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className='flex w-full items-center justify-center'>
                          {order.delivery_status === 'Completed' && order.payment_status === 'Completed' ? (
                            <span className='bg-green-500 text-green-700  items-center text-center flex'>Fulfilled</span>
                          ) : order.delivery_status === 'Cancelled' && order.payment_status === 'Cancelled' ? (
                            <span className=' border-2 border-red-600 text-red-600 rounded-lg  items-center text-center flex p-2'>Cancelled</span>
                          ) : (
                            <button
                              onClick={() => {
                                axios.put(`${API_URL}/status`, { _id: order._id, delivery_status: 'Fulfilled', payment_status: 'Fulfilled' })
                                  .then(fetchData)
                                  .catch((err) => alert(err));
                              }}
                              className="text-white bg-red-600 transition-all hover:bg-red-700 p-2 rounded-md"
                            >
                              Mark as complete
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleEdit(order)}
                            className="mr-2 text-blue-500 hover:text-blue-700"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Printer size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Order"
          onClick={handleSaveChanges}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                id="clientName"
                type="text"
                value={editOrder?.clientName || ''}
                onChange={(e) => setEditOrder({ ...editOrder, clientName: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="delivery_status" className="block text-sm font-medium text-gray-700">
                Delivery Status
              </label>
              <select
                id="delivery_status"
                value={editOrder?.delivery_status || ''}
                onChange={(e) => setEditOrder({ ...editOrder, delivery_status: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {deliveryStatuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <select
                id="payment_status"
                value={editOrder?.payment_status || ''}
                onChange={(e) => setEditOrder({ ...editOrder, payment_status: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {paymentStatuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </Modal>
      </div>
    </Layout>
  );
};

export default OrderDetails;