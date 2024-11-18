import { useState, useEffect, useCallback } from "react";
import Layout from './Layout.jsx';
import axios from "axios";
import { LogOut } from 'lucide-react';
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../../components/Modle"; // Corrected import
import { toast } from "react-toastify";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Avatar } from "@mui/material";
import CustomPieChart from '../../components/PieChart'; // Ensure this path and component name are correct

const Home = () => {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(['admin']);
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toggler, settoggler] = useState({
    addItem: false,
    deleteItem: false,
    deleteConfirmation: false,
    editItem: false,
    categoryToggler: false,
  });
  const url = "http://localhost:3001/";
  const imgPath = "../../api/uploads/";
  const [NewMenu, setNewMenu] = useState({});
  const [edit, setedit] = useState({});

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    filterMenu();
  }, [searchQuery, selectedCategory, menu]);

  const fetchData = () => {
    axios
      .get(`${url}`)
      .then((response) => {
        setMenu(response.data);
        setFilteredMenu(response.data);
      })
      .catch((error) => {
        console.log("Error fetching menu data:", error);
      });
  };

  const filterMenu = useCallback(() => {
    const filtered = menu.filter((item) =>
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())))
    );
    setFilteredMenu(filtered);
  }, [menu, searchQuery, selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleEdit = (item) => {
    setedit(item);
    settoggler((prevState) => ({ ...prevState, editItem: true }));
  };

  const removeCookies = () => {
    removeCookie('admin');
    navigate("/login");
  };

  const ConfirmEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const stock = formData.get("stock");
    const price = formData.get("price");
  
    if (stock < 0 || price < 0) {
      toast.error("Stock and price cannot be negative");
      return;
    }
  
    const updatedItem = {
      ...edit,
      name: formData.get("name"),
      category: formData.get("category"),
      stock: parseInt(stock, 10),
      price: parseFloat(price),
      description: formData.get("description"),
    };
  
    axios.put(`http://localhost:3001/menu/edititem`, updatedItem)
      .then(() => {
        settoggler((prevState) => ({ ...prevState, editItem: false }));
        fetchData();
        toast.success("Successfully edited item");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error editing item");
      });
  };

  const handleDelete = (item) => {
    setNewMenu(item);
    settoggler((prevState) => ({ ...prevState, deleteItem: true }));
  };

  const confirmDelete = () => {
    axios.delete(`${url}menu/deleteitem`, { data: { name: NewMenu.name } })
      .then((response) => {
        fetchData();
        settoggler((prevState) => ({ ...prevState, deleteItem: false }));
        toast.success("Successfully deleted item");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const stock = formData.get("stock");
    const price = formData.get("price");

    if (stock < 0 || price < 0) {
      toast.error("Stock and price cannot be negative");
      return;
    }
    else
    {try {
      await axios.post("http://localhost:3001/menu/additems", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchData();
      settoggler((prevState) => ({ ...prevState, addItem: false }));
      toast.success("Item added successfully");
    } catch (error) {
      console.error("Error adding item:", error);
    }}
  };

  const categories = [ ...new Set(menu.map((item) => item.category))];
  const totalstock = menu.reduce((sum, item) => sum + item.stock, 0);
  const totalOrders = menu.reduce((sum, item) => sum + item.orderCount, 0);

  // Prepare data for the pie chart
  const names = menu.map((item) => item.name);
  const counts = menu.map((item) => item.stock);
  const order=menu.map((item)=>item.orderCount);
  const category=menu.map((item)=>item.category);
  //for form validation
  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(name);
  };

  const validateNumber = (contact) => {
    const regex = /^[0-9]*$/;
    return regex.test(contact);
  };
  // Count number of items with the same category
  const categoryCounts = menu.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <Layout>
      <div className="w-full flex justify-between rounded-xl items-center py-3 px-3 shadow-lg bg-white">
        <h1 className="font-bold text-4xl">Dashboard</h1>
        <button
          onClick={removeCookies}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
      <div className="my-1 rounded-md backdrop-blur-md border-1 py-3 flex items-center justify-center gap-3 container">
        <div>
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-white w-[300px] border border-slate-200 rounded-lg py-3 px-5 outline-none bg-transparent"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="bg-white border border-slate-200 rounded-lg py-3 px-5 outline-none bg-transparent"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <button
          className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red transition-all hover:bg-red-800 rounded-lg h-[60px]"
          onClick={() => settoggler((prevState) => ({ ...prevState, addItem: true }))}
        >
          Add Item
        </button>
      </div>
      {/* Add the PieChart component */}
      <div className="flex flex-grow items-center justify-between w-full gap-4">
        <div className="w-full md:w-1/3 backdrop-blur-md shadow-xl rounded-xl border-solid border-2 p-4">
          <CustomPieChart names={names} counts={counts} />
          <h1 className="text-4xl flex items-center justify-center text-center">Total Stock: {totalstock}</h1>
        </div>
        <div className="w-full md:w-1/3 backdrop-blur-md shadow-xl rounded-xl border-solid border-2 p-4">
          <CustomPieChart names={names} counts={order} />
          <h1 className="text-4xl flex items-center justify-center text-center">Total Orders: {totalOrders}</h1>
        </div>
        <div className="w-full md:w-1/3 backdrop-blur-md shadow-xl rounded-xl border-solid border-2 p-4">
          <CustomPieChart names={Object.keys(categoryCounts)} counts={Object.values(categoryCounts)} />
          <h1 className="text-4xl flex items-center justify-center text-center">Total Categories: {Object.keys(categoryCounts).length}</h1>
        </div>
      </div>

      {/* Adding item option */}
      <div>
        <Modal
          isOpen={toggler.addItem}
          onClose={() => settoggler((prevState) => ({ ...prevState, addItem: false }))}
          title={"Add a New Menu Item"}
        >
          <form onSubmit={handleAddItem}>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="name" className="text-sm font-medium cursor-pointer">
                Add Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={(e)=>{validateNumber(e.target.value)}}
                className="w-full p-4 bg-transparent border focus:shadow-lg focus:border-2 focus:border-blue-400 border-gray-200 rounded-lg outline-none"
                placeholder="Enter your name"
              />
              <div className="flex items-center justify-between w-full gap-x-2">
              <label>Add Stocks</label>
              <input
                id="name"
                name="stock"
                type="number"
                className=" p-4 
                focus:shadow-lg focus:border-2 focus:border-blue-400
                bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter your name"
                />
                </div>
            </div>
            <div className="flex flex-col items-start gap-y-3 text-center">
              <label htmlFor="category" className="text-sm font-medium cursor-pointer">
                Add Category
              </label>
              <div className="flex items-center justify-between w-full mb-2">
                <div className="">
                <select name="category">
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  onClick={() =>
                    settoggler((prevState) => ({
                      ...prevState,
                      categoryToggler: !prevState.categoryToggler,
                    }))
                  }
                  >
                  +
                </button>
                  </div>

                  <div>
              {toggler.categoryToggler ? (
                <input
                id="newCategory"
                name="newCategory"
                type="text"
                className="w-full focus:shadow-lg focus:border-2 focus:border-blue-400 p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter new category"
                />
              ) : null}
              </div>
              </div>
            </div>
            <div className="flex items-center justify-between  text-center gap-y-3">
              <label htmlFor="price" className="text-sm font-medium cursor-pointer">
                Add Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                onChange={(e)=>{validateNumber(e.target.value)}
                }
                className="focus:shadow-lg focus:border-2  focus:border-blue-400 p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter price"
              />
            </div>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="image" className="text-sm font-medium cursor-pointer">
                Add Image
              </label>
              <input type="file" name="image" id="image" />
            </div>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="description" className="text-sm font-medium cursor-pointer">
                Add Description (optional)
              </label>
              <textarea className="focus:shadow-lg focus:border-2 focus:border-blue-400" name="description" id="description" cols={54}></textarea>
            </div>
            <button onClick={handleAddItem()} className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
              Add
            </button>
          </form>
        </Modal>
                {/* Edit Modal */}
    <Modal
      isOpen={toggler.editItem}
      onClose={() => settoggler((prevState) => ({ ...prevState, editItem: false, categoryToggler: false }))}
      title={"Edit Menu Item"}
      btnTitle={"Save Changes"}
    >
      <form onSubmit={ConfirmEdit}>
        <div className="flex items-start gap-y-3">
          <label htmlFor="editName" className="text-sm font-medium cursor-pointer">
            Edit Name
          </label>
          <input
            id="editName"
            name="name"
            type="text"
            defaultValue={edit.name}
            className=" p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
            placeholder="Enter name"
          />
        </div>
        <div className="flex  items-start gap-y-3">
          <label htmlFor="category" className="text-sm font-medium cursor-pointer">
            Add Category
          </label>
          <select name="category" className="p-4 bg-transparent border border-gray-200 rounded-lg outline-none">
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            onClick={() =>
              settoggler((prevState) => ({
                ...prevState,
                categoryToggler: !prevState.categoryToggler,
              }))
            }
          >
            + 
          </button>
          {toggler.categoryToggler && (
            <input
              id="newCategory"
              name="newCategory"
              type="text"
              className="w-full focus:shadow-lg focus:border-2 focus:border-blue-400 p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
              placeholder="Enter new category"
            />
          )}
        </div>
        <div className="flex  items-center gap-y-3">
          <label htmlFor="editStock" className="text-sm font-medium cursor-pointer">
            Edit Available Stock
          </label>
          <input
            id="editStock"
            name="stock"
            type="number"
            defaultValue={edit.stock}
            className="p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
            placeholder="Enter stock"
          />
        </div>
        <div className="flex  items-center gap-y-3">
          <label htmlFor="editPrice" className="text-sm font-medium cursor-pointer">
            Edit Price
          </label>
          <input
            id="editPrice"
            name="price"
            type="number"
            defaultValue={edit.price}
            className="p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
            placeholder="Enter price"
          />
        </div>
        <div className="flex flex-col items-start gap-y-3">
          <label htmlFor="editImage" className="text-sm font-medium cursor-pointer">
            Edit Image
          </label>
          <input type="file" name="image" id="editImage" />
        </div>
        <div className="flex flex-col items-start gap-y-3">
          <label htmlFor="editDescription" className="text-sm font-medium cursor-pointer">
            Edit Description (optional)
          </label>
          <textarea
            name="description"
            id="editDescription"
            defaultValue={edit.description}
            className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
            cols={50}
          ></textarea>
        </div>
        <button type="submit" className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
          Save Changes
        </button>
      </form>
    </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={toggler.deleteItem}
          onClose={() => settoggler((prevState) => ({ ...prevState, deleteItem: false }))}
          title={"Do you want to delete this item"}// Corrected prop name to onConfirm
        >
          <h1>{NewMenu.name}</h1>
          <button    className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"  onClick={() => confirmDelete(NewMenu)} >
            Delete 
          </button>
        </Modal>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Orders</th>
              <th className="py-2 px-4 border-b">Stock</th>
              <th className="py-2 px-4 border-b">Options</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenu.map((item, index) => (
              <tr key={item._id || index}>
                <td className="py-2 px-4 border-b"><Avatar alt="Remy Sharp" src={item.image ? `/${item.image}` : "../public/vite.svg"} /></td>
                <td className="py-2 px-4 border-b item-center justify-center">{item.name}</td>
                <td className="py-2 px-4 border-b item-center justify-center">${item.price}</td>
                <td className="py-2 px-4 border-b item-center justify-center">{item.category}</td>  
                <td className="py-2 px-4 border-b overflow-hidden">
                  {item.description.length > 10 ? `${item.description.substring(0, 10)}...` : item.description}
                </td>
                <td className="py-2 px-4 border-b">
                  {item.orderCount === 0 ?
                    <span className="text-red-500 font-bold">no orders yet</span>
                    :
                    item.orderCount
                  }
                </td>
                <td className="py-2 px-4 border-b">
                  {item.stock === 0 ?
                    <span className="text-red-500 font-bold">Out of Stock</span>
                    :
                    item.stock
                  }
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
  );
};

export default Home;