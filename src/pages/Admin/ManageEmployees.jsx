import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { Edit2, LogOut, User } from 'lucide-react';
import Layout from './Layout';
import Modal from '../../components/Modle';

const url = "http://localhost:3001/user";

const ManageEmployees = () => {
  const cookies = new Cookies();
  const [users, setUsers] = useState([]);
  const [Employees, setEmployees] = useState(null);
  const [edit, setEdit] = useState({});
  const [newuser, setNewUser] = useState({});
  const [toggler, setToggler] = useState({
    editUser: false,
    createUser: false,
    deleteConfirmation: false,
    displayPassword: false,
    passwordToggler: false,
    dutyToggler: false
  });

  const navigate = useNavigate();
  const userCookie = cookies.get('user');

  const FetchData = () => {
    axios
      .get(`${url}`)
      .then((response) => {
        setEmployees(response.data.filter((user) => user.role === "employee"));
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  };

  useEffect(() => {
    FetchData();
    if (!userCookie) {
      navigate("/login");
    }
  }, [navigate, userCookie]);

  const ConfirmDelete = () => {
    if (users && users.username) {
      axios.delete(`${url}/remove`, { data: { username: users.username } })
        .then(() => {
          window.confirm("Deleted successfully");
          FetchData();
          setToggler((prevState) => ({
            ...prevState,
            deleteConfirmation: false,
          }));
        })
        .catch((err) => {
          console.log("Error deleting user:", err);
        });
    } else {
      console.log("Invalid user or missing username.");
    }
  };

  const ConfirmEdit = () => {
    if (edit && edit._id) {
      axios.put(`${url}/update`, edit)
        .then(() => {
          window.confirm("Edited successfully");
          FetchData();
          setToggler((prevState) => ({
            ...prevState,
            editUser: false,
          }));
        })
        .catch((err) => {
          console.log("Error editing user:", err);
        });
    } else {
      console.log("Invalid user or missing ID.");
    }
  };

  const handleDelete = (item) => {
    if (item) {
      setUsers(item);
      setToggler((prevState) => ({
        ...prevState,
        deleteConfirmation: true,
      }));
    } else {
      console.log("Invalid item passed to handleDelete.");
    }
  };

  const handleEdit = (item) => {
    if (item) {
      setEdit(item);
      setToggler((prevState) => ({ ...prevState, editUser: true }));
    } else {
      console.log("Invalid item passed to handleEdit.");
    }
  };

  const handleNewUser = () => {
    axios.post(`${url}/adduser`, newuser)
      .then((response) => {
        FetchData();
        setToggler((prevState) => ({ ...prevState, createUser: false }));
      })
      .catch((err) => console.error(err));
  };

  const duty = Employees ? [...new Set(Employees.map(item => item.duty))] : [];

  const removeCookies = () => {
    cookies.remove('user');
    navigate("/login");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Manage Employees</h1>
          <button
            onClick={removeCookies}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <button
              onClick={() => setToggler((prevState) => ({ ...prevState, createUser: true }))}
              className="w-full sm:w-auto px-4 py-2 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-colors duration-200"
            >
              Add Staff
            </button>
            <input
              type="text"
              placeholder="Search..."
              className="mt-4 w-full sm:w-64 px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <Modal
          isOpen={toggler.createUser}
          onClose={() => setToggler((prevState) => ({ ...prevState, createUser: false }))}
          title="Add a New Employee"
          btnTitle="Add"
          onClick={handleNewUser}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="name"
                type="text"
                onChange={(e) => setNewUser({ ...newuser, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                onChange={(e) => setNewUser({ ...newuser, password: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Password"
              />
            </div>
            <div>
              <label htmlFor="duty" className="block text-sm font-medium text-gray-700">
                Duty
              </label>
              <div className="flex justify-between w-full">
                <select
                  name="duty"
                  onChange={(e) => setNewUser({ ...newuser, duty: e.target.value })}
                  className="flex items-center w-full transition-all hover:border-black text-2xl border-2 rounded-md"
                  id="duty"
                >
                  {duty.length > 0 ? (
                    duty.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <option disabled>No duties available</option>
                  )}
                </select>
                <button
                  onClick={() => setToggler((prevState) => ({ ...prevState, dutyToggler: true }))}
                  className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red transition-all hover:bg-red-800 rounded-lg h-[60px]"
                >
                  +
                </button>
              </div>
              {toggler.dutyToggler ? (
                <input
                  id="duty"
                  type="text"
                  onChange={(e) => setNewUser({ ...newuser, duty: e.target.value })}
                  className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                  placeholder="Assign a Duty"
                />
              ) : null}
            </div>
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                Salary
              </label>
              <div className="flex items-center justify-center">
                <input
                  id="salary"
                  type="number"
                  onChange={(e) => setNewUser({ ...newuser, salary: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Salary"
                />
                <span>PKR</span>
              </div>
            </div>
            <div>
              <label htmlFor="joining-date" className="block text-sm font-medium text-gray-700">
                Joining Date
              </label>
              <input
                id="joining-date"
                type="date"
                onChange={(e) => setNewUser({ ...newuser, joiningdate: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Joining Date"
              />
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={toggler.deleteConfirmation}
          onClose={() => setToggler((prevState) => ({ ...prevState, deleteConfirmation: false }))}
          title="Delete the following User?"
          btnTitle="Delete"
          onClick={ConfirmDelete}
        >
          <h1>{users ? users.username : null}</h1>
        </Modal>

        <Modal
          isOpen={toggler.editUser}
          onClose={() => setToggler((prevState) => ({ ...prevState, editUser: false }))}
          title="Edit User"
          btnTitle="Edit"
          onClick={ConfirmEdit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={edit.username || ""}
                onChange={(e) => setEdit({ ...edit, username: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={edit.password || ""}
                onChange={(e) => setEdit({ ...edit, password: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Password"
              />
            </div>
            <div>
              <label htmlFor="duty" className="block text-sm font-medium text-gray-700">
                Duty
              </label>
              <div className="flex justify-between w-full">
                <select
                  name="duty"
                  onChange={(e) => setEdit({ ...edit, duty: e.target.value })}
                  className="flex items-center w-full transition-all hover:border-black text-2xl border-2 rounded-md"
                  id="duty"
                  value={edit.duty || ""}
                >
                  {duty.length > 0 ? (
                    duty.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <option disabled>No duties available</option>
                  )}
                </select>
                <button
                  onClick={() => setToggler((prevState) => ({ ...prevState, dutyToggler: true }))}
                  className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red transition-all hover:bg-red-800 rounded-lg h-[60px]"
                >
                  +
                </button>
              </div>
              {toggler.dutyToggler ? (
                <input
                  id="duty-assignment"
                  type="text"
                  value={edit.duty || ""}
                  onChange={(e) => setEdit({ ...edit, duty: e.target.value })}
                  className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                  placeholder="Assign a Duty"
                />
              ) : null}
            </div>
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                Salary
              </label>
              <div className="flex items-center justify-center">
                <input
                  id="salary"
                  type="number"
                  value={edit.salary || ""}
                  onChange={(e) => setEdit({ ...edit, salary: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Salary"
                />
                <span>PKR</span>
              </div>
            </div>
            <div>
              <label htmlFor="joining-date" className="block text-sm font-medium text-gray-700">
                Joining Date
              </label>
              <input
                id="joining-date"
                type="date"
                onChange={(e) => setEdit({ ...edit, joiningdate: e.target.value })}
                value={edit.joiningdate || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </Modal>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Profile Picture</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Password</th>
                <th className="py-2 px-4 border-b">Duty</th>
                <th className="py-2 px-4 border-b">Salary</th>
                <th className="py-2 px-4 border-b">Joining Date</th>
                <th className="py-2 px-4 border-b">Option</th>
              </tr>
            </thead>
            <tbody>
              {Employees?.map((item) => (
                <tr key={item._id}>
                  <td className="py-2 px-4 border-b flex justify-center">
                    <User size={32} />
                  </td>
                  <td className="py-2 px-4 border-b item-center justify-center">{item.username}</td>
                  <td className="py-2 px-4 border-b item-center">{item.password}</td>
                  <td className="py-2 px-4 border-b item-center">{item.duty}</td>
                  <td className="py-2 px-4 border-b item-center">{item.salary}</td>
                  <td className="py-2 px-4 border-b item-center justify-center">
                    {item.joiningdate}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit2 />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(item)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ManageEmployees;