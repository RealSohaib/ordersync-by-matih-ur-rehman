import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar.jsx';
import { AdminNavbar } from '../../constants/index.jsx';
import {Link} from 'react-router-dom'

const Layout = ({ children }) => {
  const isMobile = window.innerWidth <= 768;
  useEffect(() => {
    document.title = "Admin Panel";
  }, []);

  useEffect(() => {
    console.log("navItems in Layout:"); // Debugging: Check if navItems are received correctly
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Navbar
      title="Admin panals">
      {AdminNavbar.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="flex items-center p-3 mb-2 text-white hover:bg-gray-700 rounded-lg transition-all"
              onClick={() => isMobile && setIsOpen(false)}
            >
              <item.icon className="mr-3 text-xl" />
              <span>{item.label}</span>
            </Link>
          ))}
      </Navbar>
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 md:ml-64">
        <div className="max-w-7xl mx-auto overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;