import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ServiceDetail from "./pages/ServiceDetail";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import AdminClients from "./pages/admin/Clients";
import AdminEngineers from "./pages/admin/Engineers";
import AdminEmployees from "./pages/admin/Employees";
import AdminHRManagers from "./pages/admin/HRManagers";
import Admins from "./pages/admin/Admins";
import AdminHome from "./pages/admin/AdminHome";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import CreateHRManager from "./pages/admin/CreateHRManager";
import CreateEngineer from "./pages/admin/CreateEngineer";
import CreateEmployee from "./pages/admin/CreateEmployee";
import Quotes from "./pages/admin/Quotes";
import Quote from "./pages/Quote";
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
                <Route path="/quote" element={<Quote />} />
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/admins" element={<Admins />} />
                <Route path="/admin/clients" element={<AdminClients />} />
                <Route path="/admin/engineers" element={<AdminEngineers />} />
                <Route path="/admin/employees" element={<AdminEmployees />} />
                <Route path="/admin/hr-managers" element={<AdminHRManagers />} />
                <Route path="/admin/quotes" element={<Quotes />} />
                <Route path="/admin/create-hr" element={<CreateHRManager />} />
                <Route path="/admin/create-engineer" element={<CreateEngineer />} />
                <Route path="/admin/create-employee" element={<CreateEmployee />} />
                <Route path="/hr/dashboard" element={<HRDashboard />} />
                <Route path="/engineer/dashboard" element={<EngineerDashboard />} />
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/client/dashboard" element={<ClientDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;