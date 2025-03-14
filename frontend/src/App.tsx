import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoleSelector from './pages/RoleSelector';
import CreateCustomer from './pages/customer/CreateCustomer';
import CreateDriver from './pages/driver/CreateDriver';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Service from './pages/Service';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/role-selector" element={<RoleSelector />} />
        <Route path="/customer/create" element={<CreateCustomer />} />
        <Route path="/driver/create" element={<CreateDriver />} />
        <Route path="/customer/*" element={<CustomerDashboard />}/>
        <Route path="/driver/*" element={<DriverDashboard />}  />
        <Route path="/services" element={<Service />} />
        <Route path="/admin/*" element={<AdminDashboard />}  />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
