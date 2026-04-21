import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 24px",
      background: "#4f46e5",
      color: "white"
    }}>
     <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold" }}>
        <img src="/logo.svg" alt="Logo" style={{ width: "30px", height: "30px" }} />
        RideShareX
      </div>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link
  to="/"
  style={{ color: "white", textDecoration: "none", opacity: 0.9 }}
>
  Home
</Link>

        {!token && <Link to="/login" style={{ color: "white", textDecoration: "none", opacity: 0.9 }}>Login</Link>}
        {!token && <Link to="/register" style={{ color: "white", textDecoration: "none", opacity: 0.9 }}>Register</Link>}

        {token && <Link to="/create-ride" style={{ color: "white", textDecoration: "none", opacity: 0.9 }}>Create</Link>}
        {token && <Link to="/my-requests" style={{ color: "white", textDecoration: "none", opacity: 0.9 }}>My Requests</Link>}
        {token && <Link to="/driver" style={{ color: "white", textDecoration: "none", opacity: 0.9 }}>Driver</Link>}
        {token && <Link to="/fare" style={{ color: "white", textDecoration: "none", opacity: 0.9 }}>Fare</Link>}
        
        {token && username && (
  <Link to={`/driver-map/${username}`} style={{ color: "white", textDecoration: "none", opacity: 0.9 }}>
    Driver Map
  </Link>
)}
        
        {token && <span>{username}</span>}
        {token && (
          <button
            onClick={handleLogout}
            style={{
              background: "white",
              color: "#4f46e5",
              border: "none",
              padding: "6px 10px",
              borderRadius: "6px"
            }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;