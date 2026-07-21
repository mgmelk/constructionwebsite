import "./Topbar.css";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";

function Topbar({ adminName }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("adminName");
        navigate("/admin/login", { replace: true });
    };

    return (
        <div className="topbar">
            <h2>Admin Dashboard</h2>

            <div className="topbar-right">
                {token && role === "admin" ? (
                    <>
                        <button className="admin-logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                        <span className="admin-name">{adminName}</span>
                        <FaBell className="icon" />
                        <FaUserCircle className="profile" />
                    </>
                ) : (
                    <div className="admin-auth-links">
                        <Link to="/admin/login" className="admin-auth-link">Login</Link>
                        <Link to="/admin/register" className="admin-auth-link admin-auth-link-primary">Sign Up</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Topbar;