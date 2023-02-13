import React from "react";

//Admin
const ModifyResident = React.lazy(() =>
  import("../Containers/Admin/ModifyResidence/ModifyResidence")
);
const ModifyGroup = React.lazy(() => import("../Containers/Admin/ModifyGroup/ModifyGroup"));
const ModifyForm = React.lazy(() => import("../Containers/Admin/ModifyForm/ModifyForm"));
const Members = React.lazy(() => import("../Containers/Admin/Members/Members"));
const Profile = React.lazy(() => import("../Containers/Admin/Profile/Profile"));
const Settings = React.lazy(() => import("../Containers/Admin/Settings/Settings"));
const Form = React.lazy(() => import("../Containers/Admin/ReviewForm/ReviewForm"));
const Dashboard = React.lazy(() => import("../views/dashboard/Dashboard"));
const Users = React.lazy(() => import("../views/users/Users"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/users", exact: true, name: "Users", component: Users },
  {
    path: "/modifyresident",
    exact: true,
    name: "Modify Residents",
    component: ModifyResident,
  },
  {
    path: "/modifygroup",
    exact: true,
    name: "Modify Groups",
    component: ModifyGroup,
  },
  {
    path: "/modifyform",
    exact: true,
    name: "Modify Form",
    component: ModifyForm,
  },
  { path: "/members", exact: true, name: "Members", component: Members },
  { path: "/form", exact: true, name: "Form", component: Form },
  { path: "/settings", exact: true, name: "Settings", component: Settings },
  { path: "/profile", exact: true, name: "Profile", component: Profile },
];

export default routes;
