import { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "./../../components/Modle";

const Home = () => {
  const [menu, setMenu] = useState([]);
  const [toggler, settoggler] = useState({
    addItem: false,
    deleteItem: false,
    deleteConfirmation: false,
    editItem: false,
    categoryToggler: false,
  });
  const url = "http://localhost:3001/";
  const imgPath="../../api/uploads/"
  const [NewMenu, setNewMenu] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`${url}`)
      .then((response) => {
        setMenu(response.data);
      })
      .catch((error) => {
        console.log("Error fetching menu data:", error);
      });
  };

  const handleEdit = (item) => {
    console.log("Edit item:", item);
    settoggler((prevState) => ({ ...prevState, editItem: true }));
  };

  const handleDelete = (item) => {
    setNewMenu(item); // Set the item to be deleted
    settoggler((prevState) => ({ ...prevState, deleteItem: true }));
  };

  const confirmDelete = (menu) => {
    axios
      .delete(`${url}menu/deleteitem`, { data: { name: menu.name } })
      .then((response) => {
        fetchData(); // Refresh the menu data after deletion
        console.log(menu);
        settoggler((prevState) => ({ ...prevState, deleteItem: false }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await axios.post("http://localhost:3001/menu/additems", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Item added:", response.data);
      fetchData(); // Refresh the menu data
      settoggler((prevState) => ({ ...prevState, addItem: false }));
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div>
      <Layout>
        <div className="w-full flex justify-between rounded-xl items-center py-3 px-3 shadow-lg bg-white">
          <h1 className="font-bold text-4xl">Dashboard</h1>
          <button
            className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red transition-all hover:bg-red-800 rounded-lg h-[60px]"
            onClick={() => settoggler((prevState) => ({ ...prevState, addItem: true }))}
          >
            Add Items
          </button>
        </div>

        <div>
          <Modal
            isOpen={toggler.addItem}
            onClose={() => settoggler((prevState) => ({ ...prevState, addItem: false }))}
            title={"Add a New Menu Item"}
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
                  <select name="category" id="category">
                    <option value="Category">Category</option>
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
            title={"Edit Menu Item"}
            btnTitle={"Save Changes"}
          >
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="editName" className="text-sm font-medium cursor-pointer">
                Edit Name
              </label>
              <input
                id="editName"
                type="text"
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter name"
              />
            </div>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="editCategory" className="text-sm font-medium cursor-pointer">
                Edit Category
              </label>
              <div>
                <select name="Category" id="editCategory">
                  <option value="Category">Category</option>
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
                  className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                  placeholder="Enter new category"
                />
              ) : null}
            </div>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="editPrice" className="text-sm font-medium cursor-pointer">
                Edit Price
              </label>
              <input
                id="editPrice"
                type="text"
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
              <textarea name="description" id="editDescription" cols={50}></textarea>
            </div>
          </Modal>

          {/* Delete Modal */}
          <Modal
  isOpen={toggler.deleteItem}
  onClose={() => settoggler((prevState) => ({ ...prevState, deleteItem: false }))}
  title={"Do you want to delete this item"}
  btnTitle={"Delete"}
  onClick={() => confirmDelete(NewMenu)} // Corrected prop name to onConfirm
>
  <h1>{NewMenu.name}</h1>
</Modal>
        </div>

        <div className="mt-6 overflow-y-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Available Stock</th>
                <th className="py-2 px-4 border-b">Options</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item._id}>
                  <td className="py-2 px-4 border-b">{item.name}</td>
                  <td className="py-2 px-4 border-b">{item.image || "No image"}</td>
                  <td className="py-2 px-4 border-b">${item.price}</td>
                  <td className="py-2 px-4 border-b">{item.category}</td>
                  <td className="py-2 px-4 border-b overflow-hidden">{item.description}</td>
                  <td className="py-2 px-4 border-b">{item.availableStock || "N/A"}</td>
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

export default Home;