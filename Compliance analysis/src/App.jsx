import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Organizations from "./pages/Organizations";
import Product from "./pages/Product";
import RuleAndPolicies from "./pages/RuleAndPolicies";
import ComplianceEngine from "./pages/ComplianceEngine";
import Reports from "./pages/Reports";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeContextProvider } from "./context/ThemeContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Logout from "./pages/auth/Logout.jsx";
import { ToastContainer } from "react-toastify";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "/organization",
              element: <Organizations />,
            },
            {
              path: "/products",
              element: <Product />,
            },
            {
              path: "/rules-and-policies",
              element: <RuleAndPolicies />,
            },
            {
              path: "/compliance-engine",
              element: <ComplianceEngine />,
            },
            {
              path: "/reports",
              element: <Reports />,
            },
          ],
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/signin",
          element: <Signin />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
      ],
    },
  ]);

  return (
    <>
      <AuthProvider>
        <ThemeContextProvider>
          <RouterProvider router={router} />
          <ToastContainer position="top-center" autoClose={3000} />
        </ThemeContextProvider>
      </AuthProvider>
    </>
  );
}

export default App;