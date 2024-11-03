import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for the toggle button
import { Link } from "react-router-dom";
import { AdminNavbar } from "../constants"; // Import AdminNavbar

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  const ToggleBtn = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <div className="top-0 left-0 z-50 flex items-center p-4 bg-black text-white w-full md:hidden">
        <button onClick={ToggleBtn} className="relative text-white text-2xl">
          {toggle ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <div
        className={`stickey z-10 top-0 left-0 h-screen bg-black text-white transition-transform transform ${
          toggle ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:w-64`}
      >
        <div className="md:hidden p-4">
          <button onClick={ToggleBtn} className="relative text-white text-2xl">
            {toggle ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className="p-4">
          {AdminNavbar.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="flex items-center p-4 text-white hover:bg-gray-900 hover:border-l-4 transition-all"
              onClick={() => setToggle(false)} // Close the menu on link click
            >
              <item.icon className="mr-3" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;