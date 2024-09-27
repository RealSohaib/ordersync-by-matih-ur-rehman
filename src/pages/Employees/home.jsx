// import Navbar from '../../components/Navbar'
import {EmployeesNavbar} from '../../constants/index'
import {Link} from "react-router-dom"
const home = () => {
  return (
    <div>
      <div>
      {/* <Navbar>
        <div className="text-white flex justify-between items-center p-4 md:hidden">
        <h1 className="text-xl font-bold">Employees Panal</h1>
        {EmployeesNavbar.length > 0 ? (
          EmployeesNavbar.map((item, index) => (
            <div key={index} className="text-white m-2 hover:bg-gray-900 p-7 font-bold hover:border-l-4 transition-all hover:translate-x-2 flex">
              <Link to={item.link} className="ml-2">
                {item.label} {item.icon}
              </Link>
            </div>
          ))
        ) : (
          <div>No data available</div>
        )}
      </div>
      </Navbar> */}
      </div>
    </div>
  )
}

export default home
