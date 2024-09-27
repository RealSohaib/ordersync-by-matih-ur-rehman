const Minus = ({ className, onClick }) => {
  return (
    <div
      className={`bg-matte-red text-white px-2 rounded-full flex items-center${className} w-10 h-10`}
    >
      <button
        onClick={onClick}
        className="text-xl font-bold bg-transparent border-none cursor-pointer"
      >
        -
      </button>
    </div>
  );
};

export default Minus;
