import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { FaBars, FaTimes } from "react-icons/fa";
const Navbar = ({ children,title}) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    console.log("navItems in Navbar:"); // Debugging: Check if navItems are received correctly
  }, []);

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 z-50 flex items-center p-4 bg-matte-black text-white w-full">
          <button onClick={toggleMenu} className="text-white text-2xl focus:outline-none">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      )}
      <div
        className={`fixed z-40 top-0 left-0 h-screen bg-matte-black text-white w-64 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isMobile ? "pt-16" : ""}`}
      >
        <div className="p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
          {children}
        </div>
      </div>
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

Navbar.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ).isRequired,
};

export default Navbar;