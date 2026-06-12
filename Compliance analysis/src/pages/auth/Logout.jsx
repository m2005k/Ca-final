import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const loggingOut = async () => {
      try {
        await logout();
        toast.success("Log out successfully");
        navigate("/");
      } catch (err) {
        console.log(err.message);
      }
    };
    loggingOut();
  }, []);
  return <div>Logging out...</div>;
};

export default Logout;