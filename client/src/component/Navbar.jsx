import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-logo">FitnessApp</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        {user && (
          <>
            <li><Link to="/goals">Goals</Link></li>
            <li><Link to="/plans">Plans</Link></li>
            <li><Link to="/progress">Progress</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </>
        )}
      </ul>
      <div className="navbar-auth">
        {user ? (
          <button className="logout-btn" onClick={logout}>Logout</button>
        ) : (
          <>
            <Link className="login-btn" to="/login">Login</Link>
            <Link className="register-btn" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
