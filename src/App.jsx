import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Client from './pages/Client/index';
import AdminHome from './pages/Admin/home';
import EmployeeHome from './pages/Employees/home';
import Resciept from './pages/Client/Resciept';
import Login from './components/Login';
import Manageemployees from './pages/Admin/ManageEmployees';
import ManageProfile from './pages/Admin/ManageProfile';
import OrderDetials from './pages/Admin/orderDetails';
// import OrderDetials from './pages/Admin';
import ManageInventory from './pages/Admin/ManageInventory.jsx';
import Error from './components/404';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies] = useCookies(['admin','employee']);
  const admin= cookies.admin;
  const employee= cookies.employee;
// console.log(user)
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Client />} />
          <Route path="/resciept" element={<Resciept />} />
          {admin ? (
            <>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/manageemployees" element={<Manageemployees />} />
              <Route path="/orderdetails" element={<OrderDetials />} />
              <Route path="/profile" element={<ManageProfile />} />
              <Route path="/manageinventory" element={<ManageInventory />} />
            </>
          ) : (
            <Route path="/login" element={<Login />} />
          )}
          {employee  ? (
            <Route path="/employee" element={<EmployeeHome />} />
          ) : (
            <Route path="/login" element={<Login />} />
          )}
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;