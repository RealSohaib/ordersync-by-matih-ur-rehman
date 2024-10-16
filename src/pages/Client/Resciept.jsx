import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Camera, X, Plus, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Receipt = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['client']);
  const [order, setOrder] = useState(cookies.client || null);
  const [instructions, setInstructions] = useState(order?.instructions || '');
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const receiptRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  const handleScreenshot = () => {
    Swal.fire({
      title: "Order Placed Successfully",
      text: "Your order has been placed. A screenshot of your receipt will be downloaded.",
      icon: "success",
    }).then(() => {
      if (receiptRef.current) {
        html2canvas(receiptRef.current).then((canvas) => {
          const screenshot = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = screenshot;
          link.download = `OrderSync_Receipt_${order.orderId}.png`;
          link.click();
        }).catch((error) => {
          console.error("Screenshot failed:", error);
          Swal.fire({
            title: "Screenshot Failed",
            text: "There was an error creating your receipt screenshot.",
            icon: "error",
          });
        });
      }
    });
  };

  const handleSaveInstructions = () => {
    setOrder((prevOrder) => ({ ...prevOrder, instructions }));
    setCookie('client', { ...order, instructions }, { path: '/' });
    setIsInstructionsModalOpen(false);
  };

  const handleCancelOrder = () => {
    removeCookie('client', { path: '/' });
    setOrder(null);
    navigate('/');
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <AlertTriangle className="mx-auto text-yellow-500 w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Order Found</h2>
          <p className="text-gray-600">Please select menu items to place an order.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div ref={receiptRef} className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-center mb-6">Order Receipt</h1>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Order ID: {order.orderId}</h2>
              <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-gray-600">Customer: {order.clientName}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Items:</h3>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <li key={index} className="py-2 flex justify-between">
                    <span>{item.name} x {item.total_items}</span>
                    <span>${(item.price * item.total_items).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <div className="flex justify-between font-semibold">
                <span>Total Items:</span>
                <span>{order.items.reduce((acc, item) => acc + item.total_items, 0)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Bill:</span>
                <span>${order.items.reduce((acc, item) => acc + item.total_bill, 0).toFixed(2)}</span>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Order Status:</h3>
              <p>Delivery: {order.delivery}</p>
              <p>Payment: {order.payment_status}</p>
            </div>
            {instructions && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Special Instructions:</h3>
                <p className="bg-gray-100 p-3 rounded">{instructions}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleCancelOrder}
            className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center"
          >
            <X className="mr-2" /> Cancel Order
          </button>
          <button
            onClick={() => setIsInstructionsModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
          >
            <Plus className="mr-2" /> Add Instructions
          </button>
          <button
            onClick={handleScreenshot}
            className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
          >
            <Camera className="mr-2" /> Place Order & Screenshot
          </button>
        </div>
      </div>

      {isInstructionsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Special Instructions</h2>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
              rows="4"
              placeholder="Enter any special instructions for your order..."
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsInstructionsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInstructions}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipt;