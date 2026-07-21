import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminForm.css";


function CreateHRManager() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    employeeId: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/admin/login");

      // 1. Create User with role hr_manager via admin users endpoint
      const userResp = await axios.post(
        `/api/users`,
        {
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          password: form.password,
          role: "hr_manager",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userId = userResp.data.user.id;

      // 2. Create HRManager profile
      await axios.post(
        `/api/hr-managers`,
        {
          user: userId,
          employeeId: form.employeeId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("HR Manager created successfully.");
      setForm({ fullName: "", email: "", phone: "", password: "", employeeId: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page">
      <div className="admin-form-card">
        <h2>Create HR Manager</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <input required placeholder="Full name" value={form.fullName} onChange={(e)=>setForm({...form, fullName:e.target.value})} />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
          <input required placeholder="Phone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} />
          <input required placeholder="Employee ID" value={form.employeeId} onChange={(e)=>setForm({...form, employeeId:e.target.value})} />
          {error ? <p className="admin-error">{error}</p> : null}
          {message ? <p className="admin-success">{message}</p> : null}
          <button type="submit" disabled={loading}>{loading?"Creating...":"Create HR Manager"}</button>
        </form>
      </div>
    </div>
  );
}

export default CreateHRManager;
