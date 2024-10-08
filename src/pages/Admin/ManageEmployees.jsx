import { useEffect, useState } from "react"
import Layout from "./Layout"
import axios from "axios"
import Modal from "../../components/Modle"
import { FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const url="http://localhost:3001/user"
import { Cookies } from 'react-cookie';


const Manageemployees = () => {
  const cookies = new Cookies();
  const [users,setusers]=useState([]);
  const [Employees,setEmployees]=useState(null);
  const [edit,setEdit]=useState([])
  
    const [toggler,setToggler]=useState({
        editUser: false,
        createUser:false,
      deleteConfirmation: false,
        displayPassword:false,
        passwordToggler:false,
        dutyToggler:false
    })

    const FetchData = () => {
        axios
          .get(`${url}`) // Ensure `url` is defined and correct
          .then((response) => {
            console.log(response.data);
            setEmployees(response.data.filter((user) => user.role === "employee")); // Correct role filtering
          })
          .catch((error) => {
            console.error("Error fetching data:", error); // Use `console.error` for errors
          });
      };
      const navigate = useNavigate();

      const userCookie = cookies.get('user');
    useEffect(()=>{
        FetchData();
         console.log(users.username)
        // FetchAdmin();
        if (!userCookie)
          {
          navigate("/login");
      }
    },[navigate])
    // const filterItems = useCallback(() => {
    //     const filteredItems = menuContentState.filter((item) => {
    //       const matchesCategory = order.fitem && order.fitem !== 'All'
    //         ? item.category === order.fitem
    //         : true;
    //       const matchesSearch = item.name.includes(order.search);
    //       return matchesCategory && matchesSearch;
    //     });
    //     setFilterMenu(filteredItems);
    //   }, [menuContentState, order.fitem, order.search]);




    const ConfirmDelete = (users) => {
      // Ensure `user` and `user.username` are valid before proceeding
      if (users && users.username) {
          console.log("Deleting user with username:", users.username);
          axios.delete(`${url}/remove/${users.username}`) // Ensure this endpoint exists
              .then(() => {
                  window.confirm("Deleted successfully");
                  FetchData(); // Refresh data after deletion
                  setToggler((prevState) => ({
                    ...prevState,
                    deleteConfirmation: false,
                }));
              })
              .catch((err) => {
                  console.log("Error deleting user:"+err);
                  // Use `err.response.data` to get more information from the server response
              });
      } else {
          console.log("Invalid user or missing username.");
      }
  };
  
  

    const MakeChages = (item) => {
        axios.put(`${url}/changepassword/${item._id}`)
            .then((response) => {
                FetchData(); // Assuming FetchData is a function that refreshes the data after update
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const ChangeUsername = (item) => {
        MakeChages(item)
    };
    const ChangePassword = (item) => {
        MakeChages(item)
    };

    const handleDelete = (item) => {
        // Ensure the item exists before setting state
        if (item) {
            setusers(item); // Assuming setUsers is setting the selected item for deletion
            setToggler((prevState) => ({
                ...prevState,
                deleteConfirmation: true,
            }));
        } else {
            console.log("Invalid item passed to handleDelete.");
        }
    }

    const handleEdit=(item)=>{
        setusers(item);
        setToggler((prevState) => ({...prevState, editUser: true, users: item }));
    }
    const HandleSearch=()=>{

    }
    const HandleToggler = (item) => setToggler((prevState) => ({
        ...prevState,
        [item]: !prevState[item] // Dynamically toggles between true and false
    }));
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
          <div className="backdrop-blur-md border-1 py-3 px-1 flex items-center
          justify-center gap-3 rounded-md my-2 border-black shadow-xl">
         <div>

          <input
            type="text"
            placeholder="Enter your content"
            className="bg-white w-[300px] border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent"
            />
            <button
            className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red transition-all hover:bg-red-800 rounded-lg h-[60px]"
            // onClick={() => settoggler((prevState) => ({ ...prevState, addItem: true }))}
            >
          Search
        </button>
            </div>
          <button
            className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red transition-all hover:bg-red-800 rounded-lg h-[60px]"
            onClick={() => setToggler((prevState) => ({ ...prevState, createUser: true }))}
          >
            Add Staff
          </button>
          </div>
          {/* modle which will display option to create a newuser */}
          <Modal
          isOpen={toggler.createUser}
          onClose={() => setToggler((prevState) => ({ ...prevState, createUser: false }))}
          title={"Add a New Employee"}
          btnTitle={"Add a new user"}

          >
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="name" className="text-sm font-medium cursor-pointer">
                username
              </label>
              <input
                id="name"
                type="text"
                // onChange={(e)=>setusers(...users,)}
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter username"
              />
            </div>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="name" className="text-sm font-medium cursor-pointer">
                Password
              </label>
              <input
                id="name"
                type="text"
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter Password"
              />
            </div>

            <div className="flex flex-col  items-start gap-y-4">
              <label htmlFor="name" className="text-sm font-medium cursor-pointer">
                duty
              </label>
              <div className="flex justify-between w-full">
              <select name="duty" className={`flex items-center w-full transition-all hover:border-black  text-2xl border-2 rounded-md`} id="">
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
className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red transition-all hover:bg-red-800 rounded-lg h-[60px]">
    Assign one
</button>
</div>
{toggler.dutyToggler ? (
    <input
        id="name"
        type="text"
        className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
        placeholder="Assign a Duty"
    />
) : null}

            </div>

            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="name" className="text-sm font-medium cursor-pointer">
                salery
              </label>
              <div className="flex items-center justify-center">
              <input
                id="number"
                type="number"
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter your name"
                />
                <span>pkr</span>
                </div>
            </div>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="name" className="text-sm font-medium cursor-pointer">
                joining date
              </label>
              <input
                id="name"
                type="date"
                value={Date.now()}
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter your name"
              />
            </div>
          </Modal>

          <Modal
          isOpen={toggler.deleteConfirmation}
          onClose={() => setToggler((prevState) => ({ ...prevState, deleteConfirmation: false }))}
          title={"Delete the following User?"}
          btnTitle={"Delete"}
          onClick={ConfirmDelete(users)}
          onSubmit={ConfirmDelete(users)}
          >
            <h1>
                {users?users.username:null}
            </h1>
          </Modal>
          {/*
          editing modle
          */}
          <Modal
          isOpen={toggler.editUser}
          onClose={() => setToggler((prevState) => ({ ...prevState, editUser: false }))}
          title={"Edit User"}
          btnTitle={"Edit"}
        //   onClick={confir}
          >
        <div className="flex flex-col items-start gap-y-3">
  <label htmlFor="username" className="text-sm font-medium cursor-pointer">
    Username
  </label>
  <input
    id="username"
    type="text"
    value={users ? users.username : ""}
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
    value={users ? users.password:null}
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
      Assign one
    </button>
  </div>
  {toggler.dutyToggler ? (
    <input
      id="duty-assignment"
      type="text"
      value={users ? users.duty : ""}
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
      value={users ? users.salary:null}
      onChange={(e) => setEdit({ ...edit, duty: e.target.value })}
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
    value={users ? users.joiningdate : ""}
    className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
  />
</div>

          </Modal>

          {/*table container to show and */}
          <div className="mt-6 overflow-x-auto">
          <table className="min-w-full bg-white ">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Profile Picrure</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Password</th>
                <th className="py-2 px-4 border-b">duty</th>
                <th className="py-2 px-4 border-b">salary</th>
                <th className="py-2 px-4 border-b">Joining Date</th>
                <th className="py-2 px-4 border-b">Option</th>

              </tr>
            </thead>
            <tbody>
                {Employees?.map((item) => (
                  <tr key={item._id}>
                    <td className="py-2 px-4 border-b flex justify-center ">
                        {/* <Avatar alt="Remy Sharp" src={item.image?`${imgPath}+${item.image}`:"../public/vite.svg"} />
                         */}
                    <FaUserCircle className="text-2xl"/>
                    </td>
                    <td className="py-2 px-4 border-b item-center justify-center">{item.username}</td>
                  <td className="py-2 px-4 border-b item-center">{item.password}</td>
                  <td className="py-2 px-4 border-b item-center">{item.duty}</td>
                  <td className="py-2 px-4 border-b item-center">{item.salary}</td>
                  <td className="py-2 px-4 border-b item-center justify-center">
                    date here
                  </td>
                  {/* <td className="py-2 px-4 border-b item-center
                  overflow-hidden justify-center">{item.joiningdate?item.joiningdate:Date()}</td> */}
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
  )
}

export default Manageemployees
