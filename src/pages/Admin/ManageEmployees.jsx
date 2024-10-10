import { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import Modal from "../../components/Modle";
import { FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Cookies } from 'react-cookie';

const url = "http://localhost:3001/user";

const Manageemployees = () => {
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
    <div>
      <Layout>
        <div className="w-full flex justify-between rounded-xl items-center py-3 px-3 shadow-lg bg-white">
          <h1 className="font-bold text-4xl">Employees Dashboard</h1>
          <button
            className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red transition-all hover:bg-red-800 rounded-lg h-[60px]"
            onClick={removeCookies}
          >
            Logout
          </button>
        </div>
        <div className="backdrop-blur-md border-1 py-3 px-1 w-full flex items-center justify-between gap-3 rounded-md my-2 border-black shadow-xl">
          <button
            className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red transition-all hover:bg-red-800 rounded-lg h-[60px]"
            onClick={() => setToggler((prevState) => ({ ...prevState, createUser: true }))}
          >
            Add Staff
          </button>
          <input
            type="text"
            placeholder="search..."
            className="bg-white w-[300px] border border-slate-200 rounded-lg py-3 px-5 outline-none bg-transparent"
          />
        </div>
        <Modal
          isOpen={toggler.createUser}
          onClose={() => setToggler((prevState) => ({ ...prevState, createUser: false }))}
          title={"Add a New Employee"}
          btnTitle={"Add"}
          onSubmit={handleNewUser()}
        >
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="name" className="text-sm font-medium cursor-pointer">
              Username
            </label>
            <input
              id="name"
              type="text"
              onChange={(e) => setNewUser({ ...newuser, name: e.target.value })}
              className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
              placeholder="Enter username"
            />
          </div>
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="password" className="text-sm font-medium cursor-pointer">
              Password
            </label>
            <input
              id="password"
              type="text"
              onChange={(e) => setNewUser({ ...newuser, password: e.target.value })}
              className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
              placeholder="Enter Password"
            />
          </div>
          <div className="flex flex-col items-start gap-y-4">
            <label htmlFor="duty" className="text-sm font-medium cursor-pointer">
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
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="salary" className="text-sm font-medium cursor-pointer">
              Salary
            </label>
            <div className="flex items-center justify-center">
              <input
                id="salary"
                type="number"
                onChange={(e) => setNewUser({ ...newuser, salary: e.target.value })}
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter Salary"
              />
              <span>PKR</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="joining-date" className="text-sm font-medium cursor-pointer">
              Joining Date
            </label>
            <input
              id="joining-date"
              type="date"
              onChange={(e) => setNewUser({ ...newuser, joiningdate: e.target.value })}
              className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
              placeholder="Enter Joining Date"
            />
          </div>
        </Modal>
        <Modal
          isOpen={toggler.deleteConfirmation}
          onClose={() => setToggler((prevState) => ({ ...prevState, deleteConfirmation: false }))}
          title={"Delete the following User?"}
          btnTitle={"Delete"}
          onSubmit={ConfirmDelete()}
        >
          <h1>{users ? users.username : null}</h1>
        </Modal>
        <Modal
          isOpen={toggler.editUser}
          onClose={() => setToggler((prevState) => ({ ...prevState, editUser: false }))}
          title={"Edit User"}
          btnTitle={"Edit"}
          onSubmit={ConfirmEdit()}
        >
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="username" className="text-sm font-medium cursor-pointer">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={edit.username || ""}
              onChange={(e) => setEdit({ ...edit, username: e.target.value })}
              className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
            />
          </div>
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="password" className="text-sm font-medium cursor-pointer">
              Password
            </label>
            <input
              id="password"
              type="text"
              value={edit.password || ""}
              onChange={(e) => setEdit({ ...edit, password: e.target.value })}
              className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
              placeholder="Enter Password"
            />
          </div>
          <div className="flex flex-col items-start gap-y-4">
            <label htmlFor="duty" className="text-sm font-medium cursor-pointer">
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
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="salary" className="text-sm font-medium cursor-pointer">
              Salary
            </label>
            <div className="flex items-center justify-center">
              <input
                id="salary"
                type="number"
                value={edit.salary || ""}
                onChange={(e) => setEdit({ ...edit, salary: e.target.value })}
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter Salary"
              />
              <span>PKR</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="joining-date" className="text-sm font-medium cursor-pointer">
              Joining Date
            </label>
            <input
              id="joining-date"
              type="date"
              onChange={(e) => setEdit({ ...edit, joiningdate: e.target.value })}
              value={edit.joiningdate || ""}
              className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
            />
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
                    <FaUserCircle className="text-2xl" />
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
                      <FaEdit />
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
      </Layout>
    </div>
  );
};

export default Manageemployees;