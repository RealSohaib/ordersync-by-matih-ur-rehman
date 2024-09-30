import Navbar from '../../components/Navbar';
import { EmployeesNavbar } from '../../constants/index';
import { Link } from 'react-router-dom';

const Layout= ({children}) => {
  return (
    <>
    <div className='flex '>
    <Navbar>
      <div>
        <div className="text-white flex justify-between items-center p-4 md:hidden">
          <h1 className="text-xl font-bold">Employees Panel</h1>
        </div>
        <div className="flex flex-col">
            {EmployeesNavbar.map((item, index) => (
              <div
                key={index}
                className="text-white m-2 hover:bg-gray-900 p-7 font-bold hover:border-l-4 transition-all hover:translate-x-2 flex"
              >
                <Link to={item.link} className="ml-2">
                  {item.label}
                </Link>
              </div>
            ))}
        </div>
      </div>
      <div>
      </div>
    </Navbar>
    <div className='border-3 border-black w-full'>
    {children}
    </div>
    </div>
    </>
  );
};

export default Layout;