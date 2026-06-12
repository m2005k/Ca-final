import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
//  create context:
const AuthContext = createContext();
//  create function that provide the context to whole application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/get-users");
      setUser(response.data);
    } catch (err) {
      console.log(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const login = async (credentials) => {
    const response = await api.post("/auth/signin", credentials);
    setUser(response.data.data);
    return response;
  };

  const logout = async () => {
    await api.post("/auth/signout");
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, loading, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("context must be initiallized");
  }
  return context;
};