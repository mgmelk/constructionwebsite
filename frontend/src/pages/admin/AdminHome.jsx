import AdminTopbar from "../../components/Admin/AdminTopbar/AdminTopbar";
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
          <div className="admin-create-actions">
            <p>Create accounts for staff:</p>
            <div className="admin-create-buttons">
              <a href="/admin/create-hr" className="admin-action-button">Create HR Manager</a>
              <a href="/admin/create-engineer" className="admin-action-button">Create Engineer</a>
              <a href="/admin/create-employee" className="admin-action-button">Create Employee</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
