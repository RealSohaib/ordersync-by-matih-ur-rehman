import { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
// import { UserSearch } from "lucide-react";
import Modal from "./../../components/Modle"

const Home = () => {
  const [menu, setMenu] = useState([]);
  const [toggler,settoggler]=useState({
    addItem:false,
    deleteItem:false,
    editItem:false
  })

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:3001/")
      .then((response) => {
        setMenu(response.data);
      })
      .catch((error) => {
        console.log("Error fetching menu data:", error);
      });
  };

  const handleEdit = (item) => {
    // Handle edit action
    console.log("Edit item:", item);
    settoggler({ editItem: true })
  
  };

  const handleDelete = (item) => {
    // Handle delete action
    console.log("Delete item:", item);
    settoggler({deleteItem: true })
  };


  return (
    <div>
      <Layout>
        <div className="w-full flex justify-between rounded-xl items-center py-3 px-3 shadow-lg bg-white">
          <h1 className="font-bold text-4xl">Dashboard</h1>
          <button
            className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red transition-all hover:bg-red-800 rounded-lg h-[60px]"
            onClick={() => settoggler({ addItem: true })}
          >
            Add Items
          </button>
        </div>

        <div>
          <Modal
            isOpen={toggler.addItem}
            onClose={() => settoggler({ addItem: false })}
            title={"Add a New Menu Item"}
            btnTitle={"Add Item"}
            // onClick={() => (item)}
          >
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="name" className="text-sm font-medium cursor-pointer">
                Add Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="name" className="text-sm font-medium cursor-pointer">
                Add Category
              </label>

              <select name="Category" id="">
              <option value="Category">Category</option>
              </select>
              <button
              >
                +
              </button>
              <input
                id="name"
                type="text"
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="name" className="text-sm font-medium cursor-pointer">
               Add Price
              </label>
              <input
                id="name"
                type="text"
                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="name" className="text-sm font-medium cursor-pointer">
                Add Image
              </label>
              <input type="file" name="image"  id="" />
            </div>
            <div className="flex flex-col items-start gap-y-3">
            </div>
            <div className="flex flex-col items-start gap-y-3">
              <label htmlFor="name" className="text-sm font-medium cursor-pointer  border-1 border-black">
                Add Descrption (optional)
              </label>
              <textarea name="description" id="" cols={50}></textarea>
            </div>

</Modal>

{/*  edit toggler  */}
<Modal
            isOpen={toggler.editItem}
            onClose={() => settoggler({editItem: false })}
            title={"Edit Menu Item"}
            btnTitle={"Save Changes"}
            onClick={() => handleEdit(item)}
          >
          </Modal>

          {/* deletion toggler */}
<Modal
            isOpen={toggler.deleteItem}
            onClose={() => settoggler({deleteItem: false })}
            title={"Do you want to delete this item"}
            
            btnTitle={"Delete"}
            onClick={() => handleDelete(item)}
          >
            
          </Modal>
</div>

        <div className="mt-6">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Available Stock</th>
                <th className="py-2 px-4 border-b">Options</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border-b">{item.name}</td>
                  <td className="py-2 px-4 border-b">${item.price}</td>
                  <td className="py-2 px-4 border-b">{item.category}</td>
                  <td className="py-2 px-4 border-b overflow-hidden">{item.description}</td>
                  <td className="py-2 px-4 border-b">{item.availableStock||"NAN"}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={()=>settoggler({editItem: true })} 
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                     onClick={()=>    settoggler({deleteItem: true })} 
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