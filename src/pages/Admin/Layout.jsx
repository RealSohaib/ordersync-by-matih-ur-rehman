import Navbar from '../../components/Navbar';
import {Link} from "react-router-dom";
import {AdminNavbar} from "../../constants"
const Layout = ({children}) => {
  return (
    <div className='flex w-screen capitalize'>
      <Navbar>
        {AdminNavbar.map((item, index) => (
        <div
        key={index}
        className="text-white m-2 hover:bg-gray-900 p-7 font-bold hover:border-l-4 transition-all hover:translate-x-2 flex"
      >
        <Link to={item.link} className="">
          {item.icon}{item.label}
        </Link>
      </div>
        ))}
      </Navbar>
      <div className='  border-3 border-black w-screen flex flex-col items-center '>
      {children}
      </div>
    </div>
  )
}

export default Layout
