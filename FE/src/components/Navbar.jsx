import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";

const Navbar = () => {
  const { user, logout } = useAuth();
  console.log("Navbar",user)
  return (
    <div>
      <nav className="flex items-center justify-between px-3 py-2 bg-amber-300 font-bold ">
        <h1>TODO</h1>
        <div className="flex gap-2">
          {user ? (
            <>
              <Link to="/" className="">
                Home
              </Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/signup">Signup</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
