import React from "react";

//Admin
const ModifyResident = React.lazy(() =>
  import("./views/admin/modifyresident/ModifyResident")
);
const ModifyGroup = React.lazy(() =>
  import("./views/admin/modifygroup/ModifyGroup")
);
const ModifyForm = React.lazy(() =>
  import("./views/admin/modifyform/ModifyForm")
);
const Members = React.lazy(() => import("./views/admin/members/Members"));
const Profile = React.lazy(() => import("./views/admin/profile/Profile"));
const Settings = React.lazy(() => import("./views/admin/settings/Settings"));
const Form = React.lazy(() => import("./views/admin/form/Form"));
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Users = React.lazy(() => import("./views/users/Users"));

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
