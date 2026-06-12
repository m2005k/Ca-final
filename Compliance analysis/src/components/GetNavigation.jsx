import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PolicyIcon from "@mui/icons-material/Policy";
import CategoryIcon from "@mui/icons-material/Category";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LogoutIcon from "@mui/icons-material/Logout";

export const GetNavigation = (user) => [
  {
    segment: "",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "organization",
    title: "Organizations",
    icon: <ApartmentIcon />,
  },
  {
    segment: "products",
    title: "Products",
    icon: <CategoryIcon />,
  },
  {
    segment: "rules-and-policies",
    title: "Rules & Policies",
    icon: <PolicyIcon />,
  },
  {
    segment: "compliance-engine",
    title: "Compliance Engine",
    icon: <EngineeringIcon />,
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <AssessmentIcon />,
  },
  {
    kind: "divider",
  },
  ...(!user
    ? [
        {
          segment: "signup",
          title: "Register",
          icon: <LoginIcon />,
        },
      ]
    : [
        {
          segment: "logout",
          title: "Logout",
          icon: <LogoutIcon />,
        },
      ]),
];

export default GetNavigation;