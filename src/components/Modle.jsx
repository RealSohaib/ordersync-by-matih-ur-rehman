
const Modal = ({ isOpen, onClose, title, children, btnTitle,onClick  }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {children}
          <div className=" flex justify-between w-full">
            <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            onClick={onClick}>
              {btnTitle}
            </button>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
            Close
          </button>
            </div>
        </div>
      </div>
    );
  };
  export default Modal