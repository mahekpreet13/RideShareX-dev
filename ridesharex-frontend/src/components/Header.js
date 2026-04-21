import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-foreground/70 hover:text-foreground hover:bg-muted"
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={token ? "/rides" : "/"} className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight text-primary">RideShareX</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {!token && (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}

          {token && (
            <>
              <NavLink to="/rides">Dashboard</NavLink>
              <NavLink to="/create-ride">Create</NavLink>
              <NavLink to="/my-requests">My Requests</NavLink>
              <NavLink to="/driver">Driver Panel</NavLink>
              <NavLink to="/fare">Fare</NavLink>
              {username && (
                <NavLink to={`/driver-map/${username}`}>Driver Map</NavLink>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {token && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground/80">
                Hi, <span className="text-primary font-bold">{username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;