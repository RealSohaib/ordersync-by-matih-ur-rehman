import { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { LogOut } from 'lucide-react';
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "./../../components/Modle";
import { toast } from "react-toastify";
import { useCookies } from 'react-cookie';
import { Avatar } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const ManageInventory = () => {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(['admin']);
  const [inventory, setInventory] = useState([]);
  const [menu, setMenu] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
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
  const [newInventory, setNewInventory] = useState({});
  const [edit, setEdit] = useState({});

  useEffect(() => {
    fetchData();
    fetchMenuData();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [searchQuery, selectedCategory, inventory]);

  const fetchData = () => {
    axios
      .get(`${url}inventory`)
      .then((response) => {
        setInventory(response.data);
        setFilteredInventory(response.data);
      })
      .catch((error) => {
        console.log("Error fetching inventory data:", error);
      });
  };

  const fetchMenuData = () => {
    axios
      .get(`${url}menu`)
      .then((response) => {
        setMenu(response.data);
      })
      .catch((error) => {
        console.log("Error fetching menu data:", error);
      });
  };

  const filterInventory = () => {
    const filtered = inventory.filter(item =>
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredInventory(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleEdit = (item) => {
    setEdit(item);
    console.log("Edit item:", item);

    settoggler((prevState) => ({ ...prevState, editItem: true }));
  };

  useEffect(() => {
    console.log(edit);
  }, [edit]);

  const removeCookies = () => {
    removeCookie('admin');
    navigate("/login");
  };

  const ConfirmEdit = () => {
    const data = edit;
    try {
      axios.put(`http://localhost:3001/inventory/edititem`, data)
        .then(() => {
          console.log("Edit successful");
          settoggler((prevState) => ({ ...prevState, editItem: false }));
          fetchData();
          toast("Successfully item Edited");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleDelete = (item) => {
    setNewInventory(item);
    settoggler((prevState) => ({ ...prevState, deleteItem: true }));
  };

  const confirmDelete = (inventory) => {
    axios
      .delete(`${url}inventory/deleteitem`, { data: { name: inventory.name } })
      .then((response) => {
        fetchData();
        console.log(inventory);
        settoggler((prevState) => ({ ...prevState, deleteItem: false }));
        toast("Successfully item deleted", response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await axios.post("http://localhost:3001/inventory/additems", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Item added:", response.data);
      fetchData();
      settoggler((prevState) => ({ ...prevState, addItem: false }));
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleAddToMenu = async (item) => {
    try {
      const response = await axios.post("http://localhost:3001/menu/additems", item);
      console.log("Item added to menu:", response.data);
      fetchMenuData();
      toast("Item added to menu successfully");
    } catch (error) {
      console.error("Error adding item to menu:", error);
    }
  };

  const categories = ['All', ...new Set(inventory.map(item => item.category))];

  return (
    <Layout>
      <div className="w-full flex justify-between rounded-xl items-center py-3 px-3 shadow-lg bg-white">
        <h1 className="font-bold text-4xl">Manage Inventory</h1>
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
            placeholder="Search inventory..."
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

      {/* Adding item option */}
      <div>
        <Modal
          isOpen={toggler.addItem}
          onClose={() => settoggler((prevState) => ({ ...prevState, addItem: false }))}
          title={"Add a New Inventory Item"}
          btnTitle={"Add Item"}
          type="submit"
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
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="category" className="text-sm font-medium cursor-pointer">
                Add Category
              </label>
              <div>
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
              {toggler.categoryToggler ? (
                <input
                  id="newCategory"
                  name="newCategory"
                  type="text"
                  className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                  placeholder="Enter new category"
                />
              ) : null}
            </div>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="price" className="text-sm font-medium cursor-pointer">
                Add Price
              </label>
              <input
                id="price"
                name="price"
                type="text"
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
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
              <textarea name="description" id="description" cols={50}></textarea>
            </div>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={toggler.editItem}
          onClose={() => settoggler((prevState) => ({ ...prevState, editItem: false }))}
          title={"Edit Inventory Item"}
          onClick={ConfirmEdit}
          btnTitle={"Save Changes"}
        >
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="editName" className="text-sm font-medium cursor-pointer">
              Edit Name
            </label>
            <input
              id="editName"
              type="text"
              value={edit.name}
              onChange={(e) => setEdit({ ...edit, name: e.target.value })}
              className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
              placeholder="Enter name"
            />
          </div>
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="editCategory" className="text-sm font-medium cursor-pointer">
              Edit Category
            </label>
            <div>
              <select
                onChange={(e) => setEdit({ ...edit, category: e.target.value })}
              >
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
            {toggler.categoryToggler ? (
              <input
                id="newEditCategory"
                type="text"
                value={edit.category}
                onChange={(e) => setEdit({ ...edit, category: e.target.value })}
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter new category"
              />
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="editStock" className="text-sm font-medium cursor-pointer">
              Edit Available Stock
            </label>
            <input
              id="editStock"
              type="number"
              value={edit.stock}
              onChange={(e) => setEdit({ ...edit, stock: e.target.value })}
              className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
              placeholder="Enter stock"
            />
          </div>
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="editPrice" className="text-sm font-medium cursor-pointer">
              Edit Price
            </label>
            <input
              id="editPrice"
              type="text"
              value={edit.price}
              onChange={(e) => setEdit({ ...edit, price: e.target.value })}
              className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
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
              value={edit.description}
              onChange={(e) => setEdit({ ...edit, description: e.target.value })}
              cols={50}
            ></textarea>
            <button className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                    onClick={ConfirmEdit}>
                      Edit 
            </button>
          </div>
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={toggler.deleteItem}
          onClose={() => settoggler((prevState) => ({ ...prevState, deleteItem: false }))}
          title={"Do you want to delete this item"}
        >
          <h1>{newInventory.name}</h1>
          <button className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={() => confirmDelete(newInventory)}>
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
              <th className="py-2 px-4 border-b">Stock</th>
              <th className="py-2 px-4 border-b">Options</th>
              <th className="py-2 px-4 border-b">Add to Menu</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item._id}>
                <td className="py-2 px-4 border-b"><Avatar alt="Remy Sharp" src={item.image ? `${imgPath}${item.image}` : "../public/vite.svg"} /></td>
                <td className="py-2 px-4 border-b item-center justify-center">{item.name}</td>
                <td className="py-2 px-4 border-b item-center justify-center">${item.price}</td>
                <td className="py-2 px-4 border-b item-center justify-center">{item.category}</td>
                <td className="py-2 px-4 border-b overflow-hidden">
                  {item.description.length > 10 ? `${item.description.substring(0, 10)}...` : item.description}
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
                <td className="py-2 px-4 border-b">
                  {menu.some(menuItem => menuItem.name === item.name) ? (
                    <span>Already added</span>
                  ) : (
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleAddToMenu(item)}
                    >
                      Add to Menu
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ManageInventory;