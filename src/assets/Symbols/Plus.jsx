const Plus = ({ className, onClick }) => {
  return (
    <div
      className={`bg-matte-red text-white px-2 rounded-full flex items-center${className} w-10 h-10`}
    >
      <button
        onClick={onClick}
        className="font-bold text-2xl bg-transparent border-none cursor-pointer"
      >
        +
      </button>
    </div>
  );
};

export default Plus;
