import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Search, ChevronDown, ChevronUp, Edit, Trash, RefreshCw,Printer,LogOut } from 'lucide-react';
import Layout from '../Admin/Layout';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modle';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import PieChart from './../../components/PieChart.jsx';

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
  const [isPrintModalOpen, setisPrintModalOpen] = useState(false);
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
          fetchData()
        }

      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }, 500); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [orders.length, fetchData]);

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
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete order ID: ${orderId}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/remove`, { data: { orderid: orderId } });
          fetchData(); // Refresh the data after deletion
          toast.success('Order deleted successfully');
        } catch (error) {
          console.error('Error deleting order:', error);
          toast.error('Error deleting order');
        }
      }
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = Object.values(order).some((value) =>
      typeof value === 'string' && value.includes(searchTerm)
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

  // const totalPages = Math.ceil(sortedOrders.length / rowsPerPage);
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
let [PrintData,setprintdata]=useState();
  const  PrintResciept=(item)=>{
    setisPrintModalOpen(true)
    setprintdata(item)
  }


  const fulfillorder = async (order) => {
    const id = order._id;
    try {
      await axios.put(`${API_URL}/status`, {
        _id: id,
        delivery_status: 'Fulfilled',
        payment_status: 'Fulfilled',
      });
      toast.success('Order has been marked as completed');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Error updating order status');
    }
  };
  const cancleorder = async (order) => {
    const id = order._id;
    try {
      await axios.put(`${API_URL}/status`, {
        _id: id,
        delivery_status: 'Cancelled',
        payment_status: 'Cancelled',
      });
      toast.success('Order has been marked as Cancelled');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Error updating order status');
    }
  };

  const StockDeduction = async (order) => {
    for (const item of order.items) {
      try {
        const response = await axios.get(`http://localhost:3001/menu/search`, { params: { _id: item._id } });
        const currentItem = response.data;
        const newStock = currentItem.stock - item.total_items;
        await axios.put(`http://localhost:3001/menu/stocks`, { _id: item._id, stock: newStock });
      } catch (err) {
        console.error(err);
        toast.error('Error updating stock');
      }
    }
  };

  const OrderCountHandler = async (order) => {
    for (const item of order.items) {
      try {
        const response = await axios.get(`http://localhost:3001/menu/search`, { params: { _id: item._id } });
        const currentItem = response.data;
        const newOrderCount = currentItem.orderCount + item.total_items;
        await axios.put(`http://localhost:3001/menu/orders`, { _id: item._id, orderCount: newOrderCount });
      } catch (err) {
        console.error(err);
        toast.error('Error updating order count');
      }
    }
  };
  const [accounts, setAccounts] = useState({ purpose: '', amount: 0 });
  const HandleAccounts = (order, bill) => {
    setAccounts({
      purpose: `order${order.orderId} completed`,
      amount: bill
    });
  }

  const [finances,setFinances]=useState([]);

const finance_API_URL = 'http://localhost:3001/finances';

const handleAddFinance = async (order) => {
  const totalCredit = finances
    .filter((finance) => finance.type === 'credit')
    .reduce((acc, finance) => acc + finance.amount, 0);
  const totalDebit = finances
    .filter((finance) => finance.type === 'debit')
    .reduce((acc, finance) => acc + finance.amount, 0);

  const totalRevenue = totalCredit - totalDebit;
  const newFinances = {
    type: 'credit',
    amount: order.bill,
    purpose: `Order ${order.orderid} completed`,
    revenue: totalRevenue + order.bill
  };
  try {
    await axios.post(`${finance_API_URL}/add`, newFinances);
    toast.success('Finance added successfully');
    fetchData(); // Fetch updated finances
  } catch (error) {
    console.error('Error adding finance:', error);
    toast.error('Error adding finance');
  }
};

const HandleOrderCompletion = async (order) => {
  try {
    await handleAddFinance(order);
    await fulfillorder(order);
    await StockDeduction(order);
    await OrderCountHandler(order);
    toast.success('Order completed successfully');
  } catch (err) {
    console.error(err);
    toast.error('Error completing order');
  }
};

  // Count the number of orders for each delivery status
  const statusCounts = orders.reduce((acc, order) => {
    const status = order.delivery_status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  
  const fulfilledCount = statusCounts['Fulfilled'] || 0;
const canceledCount = statusCounts['Cancelled'] || 0;
const pendingCount = statusCounts['pending'] || 0;
const names = ['Fulfilled', 'Cancelled', 'Pending'];
const counts = [fulfilledCount, canceledCount, pendingCount];
  const filteredSalesOrders = orders.filter(order => {
    const matchesDeliveryStatus = order.delivery_status === 'Fulfilled';
    const matchesPaymentStatus = order.payment_status === 'Fulfilled';

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

    return matchesDeliveryStatus && matchesPaymentStatus && matchesDateFilter;
  });
  const totalSales = filteredSalesOrders.reduce((acc, order) => acc + order.bill, 0);
  const cookies = useMemo(() => new Cookies(), []);
  const navigate = useNavigate();
  const removeCookies=()=>{
    cookies.remove('employee');
    navigate('/login');
  }
  return (
    <Layout>
       <div className="">
        <h1 className="font-bold text-4xl">Dashboard</h1>
        <button
          onClick={removeCookies}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Total Sales</h2>
            <span className="text-2xl font-bold">${totalSales.toFixed(2)}</span>
          </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>
        <div className="bg-white shadow rounded-lg ">
          <div className="p-4 sm:p-6">
            <PieChart names={names} counts={counts} />
          </div>
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
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full bg-white">
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
                      <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('date')}>
                        Bill
                      </th>
                      <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('date')}>
                        Details
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
                                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition duration-200 ease-in-out">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderid}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.clientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.bill.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.items.map((item, index) => (
                            <div key={index} className="mb-2">
                              <div className="font-semibold">{item.name} x {item.total_items}</div>
                              {item.instructions && <div className="text-gray-400 italic">{item.instructions}</div>
                              }
                            </div>
                          ))}
                          {order.instructions?<td>
                            <div className="text-gray-400 italic">Instructions: {order.instructions}</div>
                          </td>:null}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.delivery_status === 'Fulfilled' ? 'bg-green-200 text-green-800' :
                            order.delivery_status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {order.delivery_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.payment_status === 'Fulfilled' ? 'bg-green-200 text-green-800' :
                            order.payment_status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {order.payment_status}
                          </span>
                        </td>


                        <td className='px-6 py-4 whitespace-nowrap w-full h-full flex items-center justify-center'>
                          {order.delivery_status === 'Fulfilled' && order.payment_status === 'Fulfilled' ? (
                            <span className='border-2 border-green-600 text-green-600 rounded-lg items-center text-center flex p-2'>Fulfilled</span>
                          ) : order.delivery_status === 'Cancelled' && order.payment_status === 'Cancelled' ? (
                            <span className='border-2 border-red-600 text-red-600 rounded-lg items-center text-center flex p-2'>Cancelled</span>
                          ) : (<div className='flex flex-col'>

                            <button
                              onClick={() => {HandleOrderCompletion(order)}}
                              className="text-white bg-red-600 transition-all hover:bg-red-700 p-2 rounded-md"
                            >
                              Mark as complete
                            </button>
                            <button
                              onClick={()=>cancleorder(order)}
                              className="text-white bg-red-600 transition-all hover:bg-red-700 p-2 rounded-md"
                            >
                              Mark as canceled
                            </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {order.delivery_status === 'Fulfilled' && order.payment_status === 'Fulfilled' ? (
                            null
                          ) : order.delivery_status === 'Cancelled' && order.payment_status === 'Cancelled' ? (
                            null
                          ) : (
                            <button
                              onClick={() => handleEdit(order)}
                              className="mr-2 text-blue-500 hover:text-blue-700"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteOrder(order.orderid)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash size={18} />
                          </button>
                          <button
                            onClick={() =>  PrintResciept(order)}
                            className="text-gray-500 hover:text-gray-700"
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
{/* printer modal */}

       {/* Printer Modal */}
<Modal
  isOpen={isPrintModalOpen}
  onClose={() => setisPrintModalOpen(false)}
  title="Print Receipt"
>
  {PrintData && (

    <div className="space-y-4 underline ">
      <label htmlFor="clientName" className="block text-lg font-medium text-gray-700 text-center">
                Order Sync
              </label>
      <div className='flex items-center justify-between text-center'>
        <label className="block text-sm font-medium text-gray-700">Order ID</label>
        <p className="mt-1 text-gray-900">{PrintData.orderid}</p>
      </div>
              <div className='w-full flex items-center justify-center text-center'>
        <p className="mt-1 text-gray-900">{new Date(PrintData.date).toLocaleDateString()}</p>
      </div>
      <div className='flex items-center justify-between text-center'>
        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
        <p className="mt-1 text-gray-900">{PrintData.clientName}</p>
      </div>
      <div className='flex items-center justify-between text-center'>
        <label className="block text-sm font-medium text-gray-700">Order Date</label>
        <p className="mt-1 text-gray-900">{PrintData.contact}</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Items</label>
        {PrintData.items.map((item, index) => (
          <div key={index} className="mt-1 text-gray-900">
            {item.name} x {item.total_items} - ${item.price.toFixed(2)}
            {item.instructions && <div className="text-gray-400 italic">{item.instructions}</div>}
          </div>
          
        ))}
      <div className='flex items-center justify-between text-center'>
        <label className="block text-sm font-medium text-gray-700">delivery Status</label>
        <p className="mt-1 text-gray-900">{PrintData.delivery_status}</p>
      </div>
      <div className='flex items-center justify-between text-center'>
        <label className="block text-sm font-medium text-gray-700">Payment Status</label>
        <p className="mt-1 text-gray-900">{PrintData.payment_status}</p>
      </div>
        
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Total Bill</label>
        <p className="mt-1 text-gray-900">${PrintData.bill.toFixed(2)}</p>
      </div>
    </div>
  )}
  <div className="mt-6 flex justify-end">
    <button
      onClick={() => window.print()}
      className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Print
    </button>
  </div>
</Modal>
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Order"
          onClick={handleSaveChanges}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                Order Sync
              </label>
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