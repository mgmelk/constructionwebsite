import { Link } from "react-router-dom";
import "./AuthBar.css";

function AuthBar() {
  return (
    <div className="auth-bar">
      <Link to="/login" className="auth-link login-link">
        Login
      </Link>
      <Link to="/register" className="auth-link register-link">
        Register
      </Link>
    </div>
  );
}

export default AuthBar;
