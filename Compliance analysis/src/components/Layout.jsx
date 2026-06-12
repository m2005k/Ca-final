// import DashboardIcon from "@mui/icons-material/Dashboard";
// import LoginIcon from "@mui/icons-material/Login";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import EngineeringIcon from "@mui/icons-material/Engineering";
// import PolicyIcon from "@mui/icons-material/Policy";
// import CategoryIcon from "@mui/icons-material/Category";
// import ApartmentIcon from "@mui/icons-material/Apartment";
// import { AppProvider } from "@toolpad/core/AppProvider";
// import { DashboardLayout } from "@toolpad/core/DashboardLayout";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// const NAVIGATION = [
//   {
//     segment: "",
//     title: "Dashboard",
//     icon: <DashboardIcon />,
//   },
//   {
//     segment: "organization",
//     title: "Organizations",
//     icon: <ApartmentIcon />,
//   },
//   {
//     segment: "products",
//     title: "Products",
//     icon: <CategoryIcon />,
//   },
//   {
//     segment: "rules-and-policies",
//     title: "Rules & Policies",
//     icon: <PolicyIcon />,
//   },
//   {
//     segment: "compliance-engine",
//     title: "Compliance Engine",
//     icon: <EngineeringIcon />,
//   },
//   {
//     segment: "reports",
//     title: "Reports",
//     icon: <AssessmentIcon />,
//   },
//   {
//     kind: "divider",
//   },
//   {
//     segment: "signup",
//     title: "Register",
//     icon: <LoginIcon />,
//   },
// ];
// function Layout() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const router = {
//     pathname: location.pathname,
//     navigate: (path) => navigate(path),
//   };
//   return (
//     <AppProvider
//       navigation={NAVIGATION}
//       router={router}
//       branding={{
//         title: "Compliance Analysis",
//         logo: <></>,
//       }}
//     >
//       <DashboardLayout>
//         <Outlet />
//       </DashboardLayout>
//     </AppProvider>
//   );
// }

// export default Layout;

import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

import { useAppTheme } from "../context/ThemeContext";
import GetNavigation from "./GetNavigation";
import { useAuth } from "../context/AuthContext";

function CustomThemeToggle() {
  const { mode, toggleTheme } = useAppTheme();
  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}

function Layout() {
  const { user } = useAuth();
  const { theme, mode } = useAppTheme();

  const NAVIGATION = GetNavigation(user);

  const location = useLocation();
  const navigate = useNavigate();
  const router = {
    pathname: location.pathname,
    navigate: (path) => navigate(path),
  };
  
  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={theme}
      branding={{
        title: "Compliance Analysis",
        logo: <></>,
      }}
    >
      <DashboardLayout slots={{ toolbarActions: CustomThemeToggle }}>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

export default Layout;