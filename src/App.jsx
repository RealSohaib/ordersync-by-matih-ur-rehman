import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Client from './pages/Client/index';
import AdminHome from './pages/Admin/home';
import EmployeeHome from './pages/Employees/home';
import Resciept from './pages/Client/Resciept';
import Login from './components/Login';
import Manageemployees from './pages/Admin/ManageEmployees';
import ManageProfile from './pages/Admin/ManageProfile';
import Error from './components/404';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies] = useCookies(['user', 'client']);
  const user = cookies.user;

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Client />} />
          <Route path="/resciept" element={<Resciept />} />
          {user && user.role === 'admin' ? (
            <>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/manageemployees" element={<Manageemployees />} />
              <Route path="/profile" element={<ManageProfile />} />
            </>
          ) : (
            <Route path="/login" element={<Login />} />
          )}
          {user && user.role === 'employee' ? (
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