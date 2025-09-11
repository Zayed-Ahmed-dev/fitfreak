import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login"; // ✅ Added Login

import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

// Keep PrivateRoute commented until we enable protected routes
// function PrivateRoute({ children }) {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" />;
// }

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} /> {/* ✅ Added Login */}

              {/* Keep others commented until ready */}
              {/* <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} /> */}
              {/* <Route path="/plans" element={<PrivateRoute><Plans /></PrivateRoute>} /> */}
              {/* <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} /> */}
              {/* <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} /> */}
              {/* <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
