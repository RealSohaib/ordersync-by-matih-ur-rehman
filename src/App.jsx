
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Client from './pages/Client/index';
import AdminHome from './pages/Admin/home'
import EmployeeHome from './pages/Employees/home'
import Resciept from './pages/Client/Resciept';
import Login from './components/Login'
import Manageemployees from './pages/Admin/ManageEmployees';
import ManageProfile from './pages/Admin/ManageProfile';
const App = () => {
  // const [user,setUser]=useUser()
  return (
    <div>
      <Router>
        <Routes>

          <Route path="/" element={<Client />} />
          <Route path="/resciept" element={<Resciept />} />
          <Route path="/login" element={<Login />} />
          {/*  in follwing conditions we have applied conditional rendering if the user role is admin then
          enable admin pages but if the user is employee then enable employee pages
          */}

    <Route path="/admin" element={<AdminHome />} />
    <Route path="/manageemployees" element={<Manageemployees />} />
    <Route path="/profile" element={<ManageProfile />} />

    <Route path="/employee" element={<EmployeeHome />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
