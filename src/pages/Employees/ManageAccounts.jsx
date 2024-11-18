import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Edit, Trash, Printer } from 'lucide-react';
import Layout from './Layout';
import Modal from '../../components/Modle';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import CustomPieChart from '../../components/PieChart';

const API_URL = 'http://localhost:3001/finances';

const ManageAccounts = () => {
  const [finances, setFinances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [editFinance, setEditFinance] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [isaddModalOpen, setisaddModalOpen] = useState(false);
  const [newFinances, setNewFinances] = useState({
    amount: 0,
    type: 'credit',
    date: new Date().toISOString().split('T')[0],
    purpose: '',
    revenue: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setFinances(response.data);
    } catch (error) {
      console.error('Error fetching finances:', error);
      toast.error('Failed to fetch finances. Please try again.');
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // fetch data every 60 seconds
    return () => clearInterval(interval); // cleanup on unmount
  }, [fetchData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleUpdateFinance = async (financeId, updatedData) => {
    try {
      await axios.put(`${API_URL}/edit`, { _id: financeId, ...updatedData });
      fetchData();
      toast.success('Finance updated successfully');
    } catch (error) {
      console.error('Error updating finance:', error);
      toast.error('Error updating finance');
    }
  };

  const handleDeleteFinance = async (finance) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete finance: ${finance.purpose}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/delete`, { data: { _id: finance._id } });
          fetchData();
          toast.success('Finance deleted successfully');
        } catch (error) {
          console.error('Error deleting finance:', error);
          toast.error('Error deleting finance');
        }
      }
    });
  };

  const handleEdit = (finance) => {
    setEditFinance(finance);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      await handleUpdateFinance(editFinance._id, editFinance);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleAddFinance = async (e) => {
    e.preventDefault();
    if (newFinances.amount < 0) {
      toast.error('Amount cannot be negative');
      return;
    }
    try {
      await axios.post(`${API_URL}/add`, newFinances);
      toast.success(`Finance added successfully as ${newFinances.type}`);
      fetchData();
      setisaddModalOpen(false);
    } catch (error) {
      console.error('Error adding finance:', error);
      toast.error('Error adding finance');
    }
  };

  const filteredFinances = finances.filter((finance) => {
    const matchesSearchTerm =
      finance.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finance.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilterType = filterType === 'All' || finance.type === filterType;
    return matchesSearchTerm && matchesFilterType;
  });

  const sortedFinances = filteredFinances.sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedFinances = sortedFinances.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const financeTypes = [...new Set(finances.map((item) => item.type))];

  const totalCredit = finances
    .filter((finance) => finance.type === 'credit')
    .reduce((acc, finance) => acc + finance.amount, 0);
  const totalDebit = finances
    .filter((finance) => finance.type === 'debit')
    .reduce((acc, finance) => acc + finance.amount, 0);

  const totalRevenue = totalCredit - totalDebit;
  const names = ['Credit', 'Debit', 'Revenue'];
  const counts = [totalCredit, totalDebit, totalRevenue];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Manage Accounts</h1>
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700">
            logout
          </button>
        </div>
        <button
          onClick={() => setisaddModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Add Finance
        </button>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <div className="w-full sm:w-auto mb-4 sm:mb-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search finances..."
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

            {/* Add the PieChart component */}
            <div className="my-4">
              <CustomPieChart names={names} counts={counts} />
            </div>
<div className="flex items-center">
                <label htmlFor="filterType" className="mr-2 text-sm">
                  Filter:
                </label>
                <select
                  id="filterType"
                  value={filterType}
                  onChange={handleFilterChange}
                  className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {financeTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Type</th>
                    <th className="py-2 px-4 border-b">Amount</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Purpose</th>
                    <th className="py-2 px-4 border-b">Revenue</th>
                    <th className="py-2 px-4 border-b">Options</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFinances.map((finance) => (
                    <tr key={finance._id}>
                      <td className="py-2 px-4 border-b">{finance.type}</td>
                      <td className="py-2 px-4 border-b">{finance.amount}</td>
                      <td className="py-2 px-4 border-b">{new Date(finance.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">{finance.purpose}</td>
                      <td className="py-2 px-4 border-b">{finance.revenue}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          onClick={() => handleEdit(finance)}
                        >
                          <Edit />
                        </button>
                        {/* <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteFinance(finance)}
                        >
                          <Trash />
                        </button> */}
                        <button
                          className="text-green-500 hover:text-green-700 ml-2"
                          onClick={() => {
                            setPrintData(finance);
                            setIsPrintModalOpen(true);
                          }}
                        >
                          <Printer />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {Math.ceil(filteredFinances.length / rowsPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredFinances.length / rowsPerPage)))}
                disabled={currentPage === Math.ceil(filteredFinances.length / rowsPerPage)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Finance"
        onClick={handleSaveChanges}
        btnTitle="Save Changes"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="editType" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <input
              id="editType"
              type="text"
              value={editFinance?.type || ''}
              onChange={(e) => setEditFinance({ ...editFinance, type: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="editAmount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              id="editAmount"
              type="number"
              value={editFinance?.amount || ''}
              onChange={(e) => setEditFinance({ ...editFinance, amount: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="editDate" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="editDate"
              type="date"
              value={editFinance?.date ? new Date(editFinance.date).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditFinance({ ...editFinance, date: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="editPurpose" className="block text-sm font-medium text-gray-700">
              Purpose
            </label>
            <input
              id="editPurpose"
              type="text"
              value={editFinance?.purpose || ''}
              onChange={(e) => setEditFinance({ ...editFinance, purpose: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="editRevenue" className="block text-sm font-medium text-gray-700">
              Revenue
            </label>
            <input
              id="editRevenue"
              type="number"
              value={editFinance?.revenue || ''}
              onChange={(e) => setEditFinance({ ...editFinance, revenue: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </Modal>

      {/* Print Modal */}
      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Print Receipt"
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Finance Details</h2>
            <p>Type: {printData?.type}</p>
            <p>Amount: {printData?.amount}</p>
            <p>Date: {new Date(printData?.date).toLocaleDateString()}</p>
            <p>Purpose: {printData?.purpose}</p>
            <p>Revenue: {printData?.revenue}</p>
          </div>
          <button
            onClick={() => {
              window.print();
              setIsPrintModalOpen(false);
            }}
            className="w-full inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-blue-500 transition-all hover:bg-blue-700 rounded-lg h-[60px]"
          >
            Print
          </button>
        </div>
      </Modal>
      <Modal
      isOpen={isaddModalOpen}
      onClose={() => setisaddModalOpen(false)}
      title="Add Finance"
      >
        <form onSubmit={handleAddFinance}>
          <div className='flex flex-col  items-start gap-y-3'>
            <div className='w-full flex justify-between'>
              <label htmlFor="type">Type</label>
              <select
                onChange={(e) => {
                  setNewFinances({ ...newFinances, type: e.target.value })
                }}
                className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {financeTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='w-full flex justify-between'>
            <label htmlFor="amount">Amount</label>
            <input type="number"
              className="p-4 bg-transparent border focus:shadow-lg focus:border-2 focus:border-blue-400 border-gray-200 rounded-lg outline-none"
              onChange={(e) => {
                setNewFinances({ ...newFinances, amount: e.target.value })
              }}
            />
          </div>
          <div className='w-full flex justify-between'>
            <label htmlFor="purpose">Purpose</label>
            <input type="text"
              onChange={(e) => {
                setNewFinances({ ...newFinances, purpose: e.target.value })
              }}
              className="p-4 bg-transparent border focus:shadow-lg focus:border-2 focus:border-blue-400 border-gray-200 rounded-lg outline-none" />
          </div>
          <div className='w-full flex justify-end'>
            <button type="submit" className="w-full px-4 py-2 text-sm font-medium tracking-wide text-white bg-matte-red rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Add Finance
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default ManageAccounts;