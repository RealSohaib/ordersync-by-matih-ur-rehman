import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';

const Layout = ({ children }) => {
  useEffect(() => {
    document.title = "Admin Panel"; // Update the document title dynamically
  }, []); // Add an empty dependency array to ensure this runs only once

  return (
    <div className='flex w-screen h-screen'>
      <Navbar />
      <div className='flex-1 p-4 overflow-auto'>
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;