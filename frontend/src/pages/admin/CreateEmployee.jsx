import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminForm.css";


function CreateEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    position: "",
    department: "Engineering",
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
        `/api/users`,
        {
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          password: form.password,
          role: "employee",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userId = userResp.data.user.id;

      await axios.post(
        `/api/employees`,
        {
          user: userId,
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          position: form.position,
          department: form.department,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Employee created successfully.");
      setForm({ fullName: "", email: "", phone: "", password: "", position: "", department: "Engineering" });
    } catch (err) {
      setError(err.response?.data?.message || "Creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page">
      <div className="admin-form-card">
        <h2>Create Employee</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <input required placeholder="Full name" value={form.fullName} onChange={(e)=>setForm({...form, fullName:e.target.value})} />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
          <input required placeholder="Phone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} />
          <input required placeholder="Position" value={form.position} onChange={(e)=>setForm({...form, position:e.target.value})} />
          <select value={form.department} onChange={(e)=>setForm({...form, department:e.target.value})}>
            <option>Engineering</option>
            <option>Architecture</option>
            <option>Construction</option>
            <option>Finance</option>
            <option>HR</option>
            <option>Management</option>
          </select>
          {error ? <p className="admin-error">{error}</p> : null}
          {message ? <p className="admin-success">{message}</p> : null}
          <button type="submit" disabled={loading}>{loading?"Creating...":"Create Employee"}</button>
        </form>
      </div>
    </div>
  );
}

export default CreateEmployee;
