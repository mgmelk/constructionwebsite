import "./Sidebar.css";
import { Link } from "react-router-dom";

import {
    FaTachometerAlt,
    FaUsers,
    FaProjectDiagram,
    FaUserTie,
    FaHardHat,
    FaUserCog,
    FaClipboardList,
    FaMoneyBillWave,
    FaEnvelope,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {

    return (

        <div className="sidebar">

            <div className="sidebar-logo">

                <h2>WEMASTER</h2>

                <span>Construction</span>

            </div>

            <ul>

                <li className="active">

                    <FaTachometerAlt />

                    <Link to="/admin/dashboard">Dashboard</Link>

                </li>

                <li>

                    <FaUsers />

                    <Link to="/admin/users">Users</Link>

                </li>

                <li>

                    <FaProjectDiagram />

                    <Link to="/admin/admins">Admins</Link>

                </li>

                <li>

                    <FaProjectDiagram />

                    Projects

                </li>

                <li>

                    <FaUserTie />

                    <Link to="/admin/clients">Clients</Link>

                </li>

                <li>

                    <FaHardHat />

                    <Link to="/admin/engineers">Engineers</Link>

                </li>

                <li>

                    <FaUserCog />

                    <Link to="/admin/employees">Employees</Link>

                </li>

                <li>

                    <FaClipboardList />

                    <Link to="/admin/hr-managers">HR Managers</Link>

                </li>

                <li>

                    <FaEnvelope />

                    <Link to="/admin/quotes">Quotes</Link>

                </li>

                <li>

                    <FaMoneyBillWave />

                    Finance

                </li>

                <li>

                    <FaEnvelope />

                    Messages

                </li>

                <li>

                    <FaCog />

                    Settings

                </li>

            </ul>

            <button>

                <FaSignOutAlt />

                Logout

            </button>

        </div>

    );

}

export default Sidebar;