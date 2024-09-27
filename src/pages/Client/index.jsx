import SearchBar from "../../components/SearchBar";
import Card from "../../components/Card";
import { FaShoppingCart } from "react-icons/fa";
import Footer from "../../components/Footer";
import Popup from "../../components/Popup";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "../../Contaxt/contaxt";
import Minus from '../../assets/Symbols/Minus';
import Plus from '../../assets/Symbols/Plus';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Index = () => {
  const [menuContentState, setMenuContentState] = useState([]); // Initialize as an empty array
  const [filterMenu, setFilterMenu] = useState([]); // Initialize as an empty array
  const [order, setOrder] = useState({ fitem: '', search: '' });
  const [info, setInfo] = useState({ name: '', contact: '' });
  const [toggler, setToggler] = useState({ order: false, contact: false  });
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate(); // Correct route path
  const { setUser, user } = useUser();

  useEffect(() => {
    document.title = "Client home screen";  
    axios.get("http://localhost:3001/menu")
      .then((response) => {
        setMenuContentState(response.data);
        setFilterMenu(response.data); // Set initial filter menu state
        console.log("Filter Menu:", filterMenu);
      })
      .catch((error) => {
        console.log("Error fetching menu data:", error);
      });
      console.log("Menu Content State:", menuContentState);
  }, []);

  const updateContextWithSelectedItems = () => {
    setUser(selectedItems);
  };

  useEffect(() => {
    updateContextWithSelectedItems();
  }, [selectedItems]);

  const handleSearchChange = (e) => {
    setOrder(prevOrder => ({ ...prevOrder, search: e.target.value }));
  };

  const categories = [...new Set(menuContentState.map(item => item.category))];

  const filterItems = useCallback(() => {
    const filteredItems = menuContentState.filter((item) => {
      const matchesCategory = order.fitem && order.fitem !== 'All'
        ? item.category === order.fitem
        : true;
      const matchesSearch = item.item_name.toLowerCase().includes(order.search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilterMenu(filteredItems);
  }, [menuContentState, order.fitem, order.search]);

  useEffect(() => {
    filterItems();
  }, [order.search, order.fitem, filterItems]);

  const handleInfo = () => {
    if (info.name !== '') {
      setToggler(prevToggler => ({
        ...prevToggler,
        contact: !prevToggler.contact,
      }));
      console.log(info);
    }
  };

  const contact_popup_Toggler = () => {
    setToggler(prevToggler => ({
      ...prevToggler,
      contact: !prevToggler.contact,
    }));
  };

  const addquantity = (item) => {
    setSelectedItems((prevItems) =>
      prevItems.map((i) =>
        i.name === item.name
          ? { ...i, total_items: i.total_items + 1, total_bill: (i.total_items + 1) * i.price }
          : i
      )
    );
  };

  const minus = (item) => {
    setSelectedItems((prevItems) =>
      prevItems.map((i) =>
        i.name === item.name
          ? {
              ...i,
              total_items: i.total_items > 1 ? i.total_items - 1 : 1, // Ensure quantity doesn't go below 1
              total_bill: (i.total_items > 1 ? i.total_items - 1 : 1) * item.price
            }
          : i
      )
    );
  };

  const OrderHandler = (item) => {
    let Item_quantity = item.quantity || 1;
    let bill = item.price * Item_quantity; // Ensure item.price is defined here

    if (Object.keys(item).length !== 0 && !selectedItems.some(i => i.name === item.name)) {
      setSelectedItems(prevItems => [
        ...prevItems,
        {
          category: item.category,
          name: item.item_name,
          payment_status: 'pending',
          delivery: 'pending',
          item_count: Item_quantity,
          total_items: Item_quantity,
          total_bill: bill, // Ensure bill is correctly calculated
          price: item.price // Add price here if it's missing
        }
      ]);
    }
  };

  const OrderNowHandler = (item) => {
    OrderHandler(item);
    setToggler(prevToggler => ({
      ...prevToggler,
      order: !prevToggler.order,
    }));
  };

  const AddToCartHandler = (item) => {
    OrderHandler(item);
  };

  const DeleteOrdeHandler = (item) => {
    setSelectedItems((prevItems) => prevItems.filter((i) => i.name !== item.name));
  };

  const GrandTotal = () => {
    const total = selectedItems.reduce((acc, item) => acc + item.total_bill, 0);
    return total;
  };

  const handleContinue = () => {
    
    if (user && user.length > 0) {
      window.location.href = "/resciept";
      console.log(user)
    }
  };

  return (
    <div>
      <div className="flex flex-col top-0 m-0 items-center justify-center gap-6 sm:gap-8 ">
        {/* popup to get client infomation  */}
        <Popup className={`${toggler.contact ? 'block' : 'hidden'}`}>
          <h1 className="flex justify-center items-center capitalize my-2 font-bold text-xl">This information is necessary to ensure delivery</h1>
          <div className="flex flex-col items-start gap-y-3">
            <label htmlFor="name" className="text-md  font-bold cursor-pointer">
              Name
            </label>
            <input
              id="name"
              onChange={(e) => setInfo(prevInfo => ({ ...prevInfo, name: e.target.value }))}
              type="text"
              className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
              placeholder="Name"
            />
            <span className={`text-matte-red animate-pulse font-semibold ${info.name === '' ? 'block' : 'hidden'} `}>
              This field is mandatory
            </span>

            <label htmlFor="Contact" className="text-md font-bold cursor-pointer">
              Contact
            </label>
            <input
              id="contact"
              type="text"
              onChange={(e) => setInfo(prevInfo => ({ ...prevInfo, contact: e.target.value }))}
              className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
              placeholder="Contact"
            />
            <span className={`text-matte-red animate-pulse font-semibold ${info.contact === '' ? 'block' : 'hidden'} `}>
              This field is mandatory
            </span>
            <div className="my-3 flex items-center w-full justify-between">
              <button
                onClick={handleInfo}
                className="bg-white text-matte-red border-solid border-matte-red rounded-lg py-2 px-4">Continue without Number</button>
              <button
                onClick={contact_popup_Toggler}
                className="bg-matte-red text-white rounded-lg py-2 px-4">Continue</button>
            </div>
          </div>
        </Popup>
        {/* the following popup will display the selected order information */}
        <Popup
          Cross
          className={`${toggler.order ? 'block' : 'hidden'} w-full `}
          onClick={() => {
            setToggler(prevToggler => ({
              ...prevToggler,
              order: !prevToggler.order,
            }));
          }}
        >
          {selectedItems.map((item, index) => (
            <div
              key={index}
              className="backdrop-blur-lg rounded-xl border border-matte-black px-4 py-3 flex flex-col sm:flex-row justify-between items-center mb-4"
            >
              <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-6 justify-between items-start sm:items-center">
                <p className="text-lg font-medium">{item.name}</p>
                <p className="text-lg font-medium">{item.category}</p>
                <p className="text-lg font-medium">{item.total_bill.toFixed(2)} /US</p>
                <p
                  className={`p-2 rounded-lg text-sm font-medium ${item.delivery.toLowerCase() === 'pending'
                    ? 'bg-matte-yellow text-yellow-800'
                    : item.delivery.toLowerCase() === 'cancel'
                      ? 'bg-matte-red text-black'
                      : 'bg-green-600 text-green-800'
                    }`}
                >
                  {item.delivery}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 mt-2 sm:mt-0">
                <button onClick={() => minus(item)}>
                  <Minus className="text-lg" />
                </button>
                <p className="text-lg font-medium">{item.total_items}</p>
                <button onClick={() => addquantity(item)}>
                  <Plus className="text-lg" />
                </button>
                <button
                  onClick={() => DeleteOrdeHandler(item)}
                  className="absolute  rounded-lg text-lg sm:text-xl font-bold bg-white transition-all hover:bg-matte-red
                    hover:text-white text-red-500 p-2 sm:px-6 sm:py-3
                    translate-x-[5rem]
                    
                    ">
                  X
                </button>
              </div>
            </div>
          ))}
          <div>
            <h3>Grand Total: {GrandTotal()}</h3>
            <div className="flex justify-between">
              <button className="inline-flex items-center justify-center px-8 py-4
                   font-sans font-semibold tracking-wide text-white bg-matte-red 
                   rounded-lg h-[60px] transition-all">
                Cancel
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4
                   font-sans font-semibold tracking-wide text-white bg-matte-red 
                   rounded-lg h-[60px]
                   hover:animate-pulse
                   hover:border-matte-red
                   hover:bg-white
                   hover:text-matte-red
                   "
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>

          </div>
        </Popup>

        {/* following searchbar which will allow the user to preform live search and when 
         click event is preformed on a cart it will show all the items availabel in a cart 
            */}
        <SearchBar className="w-full sm:w-screen">
  <div className="w-full sm:w-auto">
    <div className="relative flex flex-col sm:flex-row items-center gap-4 py-4 sm:py-2">
      <input
        type="text"
        onChange={handleSearchChange}
        placeholder="Search..."
        className="w-full sm:flex-grow border border-slate-200 rounded-lg px-4 py-2 sm:py-3 sm:px-5 text-lg sm:text-xl md:text-2xl outline-none backdrop-blur-md"
      />
      <div className="relative flex items-center text-center">
        <button
          onClick={() => {
            setToggler(prevToggler => ({
              ...prevToggler,
              order: !prevToggler.order,
            }));
          }}
          className="relative flex justify-center items-center p-3 sm:p-4 text-xl sm:text-2xl md:text-3xl font-sans font-bold text-white bg-matte-red rounded-lg"
        >
          <FaShoppingCart />
        </button>
      </div>
    </div>
  </div>
</SearchBar>

        <div className="w-full flex flex-col items-center gap-6 sm:gap-8 p-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Menu</h1>
          <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-4 text-center">
            <div className="bg-white container rounded-lg shadow-lg lg:w-1/3 sm:py-2 flex flex-col justify-center sm:flex-row items-center gap-2 text-lg sm:text-xl md:text-2xl">
              <label className="mb-1 sm:mb-0">Category</label>
              <select
                onChange={(e) => setOrder({ ...order, fitem: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-matte-red"
              >
                <option>All</option>
                {categories.map((category, index) => (
                  <option value={category} key={index}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                onClick={filterItems}
                className="inline-flex items-center justify-center px-8 py-2 text-lg sm:text-xl font-semibold tracking-wide text-white bg-matte-black rounded-lg shadow-md transition-colors"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className="py-3 px-2 border border-black rounded-md backdrop-blur-md drop-shadow-md flex flex-wrap items-center justify-center gap-4 text-center">
          {filterMenu.map((item, index) => (
            <Card
              key={item.id || index}
              image={item.image}
              name={item.item_name}
              category={item.category}
              description={item.description}
              price={item.price}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
            >
              <button className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red rounded-lg h-[60px]" onClick={() => AddToCartHandler(item)}>
                Add to Cart
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red rounded-lg h-[60px]" onClick={() => OrderNowHandler(item)}>
                Order Now
              </button>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Index;