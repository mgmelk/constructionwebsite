import AdminTopbar from "../../components/admin/AdminTopbar/AdminTopbar";
import "./AdminHome.css";

function AdminHome() {
  return (
    <>
      <AdminTopbar />
      <div className="admin-home-page">
        <div className="admin-home-card">
          <h1>Admin Dashboard</h1>
          <p>
            Use the buttons in the top-right corner to sign in or create a new admin account.
          </p>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
