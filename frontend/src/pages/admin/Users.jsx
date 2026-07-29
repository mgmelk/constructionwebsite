import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaUserPlus, FaUsers, FaTimes } from "react-icons/fa";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Topbar from "../../components/Admin/Topbar/Topbar";
import "./Users.css";

function Users() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "employee",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "employee",
    password: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`/api/users`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(response.data.message || "User created successfully.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "employee",
      });
      loadUsers();
    } catch (err) {
      const serverMessage = err.response?.data?.message || "Unable to create user.";
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  // Open Edit User Modal
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditError("");
    setEditFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "employee",
      password: "", // Empty unless admin wants to reset password
    });
  };

  // Submit User Edit Changes
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setSavingEdit(true);
    setEditError("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `/api/users/${editingUser._id}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = res.data.user || res.data;

      setMessage(`User "${updatedUser.fullName || editingUser.fullName}" updated successfully!`);

      // Update table state
      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? { ...u, ...editFormData } : u))
      );

      setEditingUser(null);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update user.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete User
  const handleDeleteClick = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.fullName || user.email}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(`User "${user.fullName || user.email}" deleted successfully.`);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <>
      <Sidebar />
      <Topbar adminName={localStorage.getItem("adminName") || "Admin"} />

      <div className="admin-users-page">
        <div className="admin-users-card">
          <div className="admin-users-header">
            <div>
              <p className="admin-users-eyebrow">Admin panel</p>
              <h2>User Management & Registration</h2>
              <p>Create, edit, or manage user accounts across all roles (Admins, Engineers, Employees, Clients, HR Managers).</p>
            </div>
          </div>

          {/* CREATE USER FORM */}
          <form className="admin-users-form" onSubmit={handleSubmit}>
            <h4 style={{ margin: "0 0 10px", fontSize: "16px", color: "#081924", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaUserPlus style={{ color: "#f7b500" }} /> Create New User Account
            </h4>
            <div className="form-grid">
              <label>
                Full Name
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder="e.g. Dawit Tadesse"
                />
              </label>

              <label>
                Email Address
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="e.g. dawit@wemaster.com"
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="e.g. +251911223344"
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Set initial password"
                />
              </label>

              <label>
                User Role
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="hr_manager">HR Manager</option>
                  <option value="engineer">Engineer</option>
                  <option value="employee">Employee</option>
                  <option value="client">Client</option>
                </select>
              </label>
            </div>

            {error ? <p className="admin-users-error">{error}</p> : null}
            {message ? <p className="admin-users-success">{message}</p> : null}

            <button type="submit" disabled={loading}>
              {loading ? "Registering User..." : "Register User"}
            </button>
          </form>

          {/* ALL USERS TABLE WITH EDIT & DELETE */}
          <div className="admin-users-table-section">
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaUsers style={{ color: "#f7b500" }} /> All Registered Users ({users.length})
            </h3>
            {loadingUsers ? (
              <p>Loading users from database...</p>
            ) : users.length === 0 ? (
              <p>No users found in database.</p>
            ) : (
              <div className="admin-users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td><strong>{user.fullName || "-"}</strong></td>
                        <td>{user.email || "-"}</td>
                        <td>{user.phone || "-"}</td>
                        <td>
                          <span className={`role-badge role-${user.role || 'client'}`}>
                            {user.role ? user.role.replace("_", " ") : "Client"}
                          </span>
                        </td>
                        <td>
                          <div className="user-actions">
                            <button
                              className="btn-action-edit"
                              onClick={() => handleEditClick(user)}
                              title="Edit User Data"
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              className="btn-action-delete"
                              onClick={() => handleDeleteClick(user)}
                              title="Delete User Account"
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="edit-modal-backdrop" onClick={() => setEditingUser(null)}>
          <div className="edit-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FaEdit style={{ color: "#f7b500" }} /> Edit User Account Data</h3>
              <button className="modal-close-btn" onClick={() => setEditingUser(null)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleEditSubmit}>
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                />
              </div>

              <div>
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>

              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  required
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>

              <div>
                <label>User Role</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="hr_manager">HR Manager</option>
                  <option value="engineer">Engineer</option>
                  <option value="employee">Employee</option>
                  <option value="client">Client</option>
                </select>
              </div>

              <div>
                <label>New Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep existing password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                />
              </div>

              {editError && <p className="admin-users-error">{editError}</p>}

              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={savingEdit}>
                  {savingEdit ? "Saving Changes..." : "Save User Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;
