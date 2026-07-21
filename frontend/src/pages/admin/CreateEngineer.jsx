import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminForm.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function CreateEngineer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    employeeId: "",
    specialization: "Civil Engineer",
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

      const userResp = await axios.post(
        `${API_URL}/api/users`,
        {
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          password: form.password,
          role: "engineer",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userId = userResp.data.user.id;

      await axios.post(
        `${API_URL}/api/engineers`,
        {
          user: userId,
          employeeId: form.employeeId,
          specialization: form.specialization,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Engineer created successfully.");
      setForm({ fullName: "", email: "", phone: "", password: "", employeeId: "", specialization: "Civil Engineer" });
    } catch (err) {
      setError(err.response?.data?.message || "Creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page">
      <div className="admin-form-card">
        <h2>Create Engineer</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <input required placeholder="Full name" value={form.fullName} onChange={(e)=>setForm({...form, fullName:e.target.value})} />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
          <input required placeholder="Phone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} />
          <input required placeholder="Employee ID" value={form.employeeId} onChange={(e)=>setForm({...form, employeeId:e.target.value})} />
          <select value={form.specialization} onChange={(e)=>setForm({...form, specialization:e.target.value})}>
            <option>Civil Engineer</option>
            <option>Structural Engineer</option>
            <option>Electrical Engineer</option>
            <option>Mechanical Engineer</option>
            <option>Software Engineer</option>
          </select>
          {error ? <p className="admin-error">{error}</p> : null}
          {message ? <p className="admin-success">{message}</p> : null}
          <button type="submit" disabled={loading}>{loading?"Creating...":"Create Engineer"}</button>
        </form>
      </div>
    </div>
  );
}

export default CreateEngineer;
