import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Modal from '../../components/Modle';

const API_URL = 'http://localhost:3001';

export default function Index() {
  const [menuContentState, setMenuContentState] = useState([]);
  const [filterMenu, setFilterMenu] = useState([]);
  const [order, setOrder] = useState({ fitem: 'All', search: '' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(true);
  const [userInfo, setUserInfo] = useState({ name: '', contact: '' });
  const [errors, setErrors] = useState({ name: '', contact: '' });

  const [cookies, setCookie] = useCookies(['client']);
  const navigate = useNavigate();

  const FetchData = () => {
    axios.get(API_URL)
      .then((response) => {
        setMenuContentState(response.data);
        setFilterMenu(response.data);
      })
      .catch((error) => {
        console.log("Error fetching menu data:", error);
      });
  };

  useEffect(() => {
    document.title = "Client home screen";
    FetchData();
  }, []);

  useEffect(() => {
    if (cookies.client) {
      navigate('/resciept');
    }
  }, [cookies, navigate]);

  const handleSearchChange = (e) => {
    setOrder(prevOrder => ({ ...prevOrder, search: e.target.value }));
  };

  const categories = ['All', ...new Set(menuContentState.map(item => item.category))];

  const filterItems = useCallback(() => {
    const filteredItems = menuContentState.filter((item) => {
      const matchesCategory = order.fitem && order.fitem !== 'All'
        ? item.category === order.fitem
        : true;
      const matchesSearch = item.name?.toLowerCase().includes(order.search.toLowerCase()) ||
                            item.description?.toLowerCase().includes(order.search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilterMenu(filteredItems);
  }, [menuContentState, order.fitem, order.search]);

  useEffect(() => {
    filterItems();
  }, [order.search, order.fitem, filterItems]);

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
              total_items: i.total_items > 1 ? i.total_items - 1 : 1,
              total_bill: (i.total_items > 1 ? i.total_items - 1 : 1) * item.price
            }
          : i
      )
    );
  };

  const OrderHandler = (item) => {
    let Item_quantity = item.quantity || 1;
    let bill = item.price * Item_quantity;

    if (Object.keys(item).length !== 0 && !selectedItems.some(i => i.name === item.name)) {
      setSelectedItems(prevItems => [
        ...prevItems,
        {
          category: item.category,
          name: item.name,
          payment_status: 'pending',
          delivery: 'pending',
          item_count: Item_quantity,
          total_items: Item_quantity,
          total_bill: bill,
          price: item.price
        }
      ]);
    }
  };

  const OrderNowHandler = (item) => {
    OrderHandler(item);
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
    if (selectedItems.length > 0) {
      const orderData = {
        clientName: userInfo.name,
        contact: userInfo.contact,
        items: selectedItems,
        instructions: ''
      };

      axios.post(`${API_URL}/orders`, orderData)
        .then((response) => {
          setCookie('client', JSON.stringify(response.data), { path: '/' });
          navigate("/resciept");
        })
        .catch((error) => {
          console.error("Error placing order:", error);
        });
    }
  };

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(name);
  };

  const validateContact = (contact) => {
    const regex = /^[0-9]{11}$/;
    return regex.test(contact);
  };

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    const { name, contact } = userInfo;
    const nameError = validateName(name) ? '' : 'Name should not contain numbers';
    const contactError = validateContact(contact) ? '' : 'Contact should be exactly 11 digits';

    if (nameError || contactError) {
      setErrors({ name: nameError, contact: contactError });
    } else {
      setErrors({ name: '', contact: '' });
      setUserInfo({ name, contact });
      setIsUserInfoOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Menu</h1>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-gray-500 hover:text-gray-700 relative"
          >
            <ShoppingCart size={24} />
            {selectedItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {selectedItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search menu..."
              value={order.search}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={order.fitem}
              onChange={(e) => setOrder({ ...order, fitem: e.target.value })}
              className="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category, index) => (
                <option value={category} key={index}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterMenu.map((item, index) => (
            <Card
              key={item.id || index}
              image={item.image}
              name={item.name}
              category={item.category}
              description={item.description}
              price={item.price}
            >
              <button
                onClick={() => AddToCartHandler(item)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={() => OrderNowHandler(item)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Order Now
              </button>
            </Card>
          ))}
        </div>
      </main>

      <Modal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title="Your Cart"
      >
        {selectedItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {selectedItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => minus(item)}
                    className="p-1 bg-gray-200 rounded-full"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mx-2">{item.total_items}</span>
                  <button
                    onClick={() => addquantity(item)}
                    className="p-1 bg-gray-200 rounded-full"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => DeleteOrdeHandler(item)}
                    className="p-1 bg-red-200 rounded-full ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 border-t pt-4">
              <p className="font-semibold">Total: ${GrandTotal().toFixed(2)}</p>
              <button
                onClick={handleContinue}
                className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </Modal>

      <Modal
        isOpen={isUserInfoOpen}
        onClose={() => setIsUserInfoOpen(false)}
        title="Your Information"
        closable={false}
      >
        <form onSubmit={handleUserInfoSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              type="text"
              id="contact"
              value={userInfo.contact}
              onChange={(e) => setUserInfo({ ...userInfo, contact: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
}