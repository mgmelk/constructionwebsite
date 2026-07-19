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

                    Projects

                </li>

                <li>

                    <FaUserTie />

                    Clients

                </li>

                <li>

                    <FaHardHat />

                    Engineers

                </li>

                <li>

                    <FaUserCog />

                    Employees

                </li>

                <li>

                    <FaClipboardList />

                    HR Managers

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