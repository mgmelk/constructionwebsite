import { Link } from "react-router-dom";
import "./AdminTopbar.css";

function AdminTopbar() {
  return (
    <div className="admin-topbar">
      <div className="admin-topbar-left">
        <span>Admin Area</span>
      </div>
      <div className="admin-topbar-right">
        <Link to="/admin/login" className="admin-topbar-link">
          Login
        </Link>
        <Link to="/admin/register" className="admin-topbar-link admin-topbar-link-primary">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default AdminTopbar;
