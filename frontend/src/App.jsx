import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ServiceDetail from "./pages/ServiceDetail";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import AdminHome from "./pages/admin/AdminHome";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import HRDashboard from "./pages/hr/Dashboard";
import EngineerDashboard from "./pages/engineer/Dashboard";
import EmployeeDashboard from "./pages/employee/Dashboard";
import ClientDashboard from "./pages/client/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/hr/dashboard" element={<HRDashboard />} />
                <Route path="/engineer/dashboard" element={<EngineerDashboard />} />
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/client/dashboard" element={<ClientDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;