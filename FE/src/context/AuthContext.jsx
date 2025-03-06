import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/me`, { withCredentials: true })
      .then((data) => {
        // console.log(data.data);
        setUser(data.data)
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signup = async ({ name, email, password }) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      return true;
    } catch (error) {
      console.error("Failed to signup", error);
      return false;
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log(res.data);
      setUser(res.data);
      return true;
    } catch (error) {
      console.error("Failed to login", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("failed to logout!");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
