import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <>
        <div>
          <h1>Loading...</h1>
        </div>
      </>
    );
  }
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;