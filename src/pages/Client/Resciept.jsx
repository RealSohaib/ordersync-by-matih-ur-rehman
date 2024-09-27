import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { useUser } from '../../Contaxt/contaxt';
import { FaCamera } from 'react-icons/fa';
import Popup from '../../components/Popup';
import Swal from 'sweetalert2';
const Resciept = () => {
  const { user, setUser } = useUser();
  const receiptRef = useRef(); // Create a ref to the receipt element
  const [instructions, setInstructions] = useState('');
  const [toggler, setToggler] = useState(false);

  useEffect(() => {
    // alert(user);
    console.log(user)
  }, [user]);

  const handleScreenshot = () => {
    Swal.fire({
      title: "Order Success",
      text: "Your Order is placed ",
      icon: "order"
    });
    const element = receiptRef.current; // Get the receipt element
    html2canvas(element).then((canvas) => {
      const screenshot = canvas.toDataURL('image/png');
      console.log("Screenshot:", screenshot);
      // Create a link element to download the screenshot
      const link = document.createElement('a');
      link.href = screenshot;
      link.download = `ordersync${user?.item}.png`; // Corrected template literal
      link.click();
    }).catch((error) => {
      console.error("Screenshot failed:", error);
    });
  };

  const handleTogglePopup = () => {
    setToggler(!toggler);
  };

  const handleCancelOrder = () => {
    setUser(null);
  };

  return (
    <div className="relative w-screen flex flex-col justify-center items-center container border backdrop-blur-sm rounded-lg shadow-lg p-6">
      {toggler && (
        <Popup cross onClick={handleTogglePopup}>
          <div>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              rows="4"
              cols="50"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2 border rounded-lg"
            ></textarea>
            <div className="flex justify-between mt-4">
              <button onClick={handleCancelOrder} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                Cancel
              </button>
              <button onClick={handleTogglePopup} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Continue
              </button>
            </div>
          </div>
        </Popup>
      )}
      <h1 className="text-3xl font-bold mb-4">Receipt</h1>
      <div ref={receiptRef} className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mt-4">
        {/* Add the rest of your receipt content here */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Order ID: {user?.clientName || "N/A"}</h2>
          <h2 className="text-xl font-semibold">Order Name: {user?.clientName || "N/A"}</h2>
          <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
          <p className="text-sm text-gray-600">Instructions</p>
          <p>{instructions}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Items:</h3>
          <ul className="list-disc list-inside">
            {user?.items?.map((item, index) => (
              <li key={index} className="text-sm">
                {item.name} - {item.total_items} x ${item.price.toFixed(2)} = ${item.total_bill.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Total Items: {user?.items?.reduce((acc, item) => acc + item.total_items, 0)}</h3>
          <h3 className="text-lg font-semibold">Total Bill: ${user?.items?.reduce((acc, item) => acc + item.total_bill, 0).toFixed(2)}</h3>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Delivery Status: {user?.delivery}</h3>
          <h3 className="text-lg font-semibold">Payment Status: {user?.payment_status}</h3>
        </div>
      </div>
      <div className='flex items-center justify-center mt-4'>
        <button onClick={handleCancelOrder} className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2">
          Cancel Order
        </button>
        <button onClick={handleTogglePopup} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
          Add Instructions
        </button>
        <button onClick={handleScreenshot} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FaCamera /> Place order take a screenshot        </button>
      </div>
    </div>
  );
};

export default Resciept;