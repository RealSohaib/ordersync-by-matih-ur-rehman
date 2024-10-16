import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for the toggle button

const Navbar = ({ children }) => {
  const [toggle, setToggle] = useState(false);

  const ToggleBtn = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <div className="relative top-0 left-0 z-50 flex items-center p-4 bg-black text-white w-full md:hidden">
        <button onClick={ToggleBtn} className="relative text-white text-2xl">
          {toggle ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <div
        className={`fixed top-0 left-0 h-screen bg-black text-white transition-transform transform ${
          toggle ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:w-64`}
      >
        <div className=" md:hidden">
          <button onClick={ToggleBtn} className="relative text-white text-2xl">
            {toggle ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </>
  );
};

export default Navbar;