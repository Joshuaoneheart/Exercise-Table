import React from "react";

//Members
const Members = React.lazy(() => import("./views/member/members/Members"));
const Profile = React.lazy(() => import("./views/admin/profile/Profile"));
const Form = React.lazy(() => import("./views/member/form/Form"));
const GFForm = React.lazy(() => import("./views/member/GFform/GFform"));
const BibleGroup = React.lazy(() =>
  import("./views/member/biblegroup/BibleGroup")
);

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/form", exact: true, name: "Form", component: Form },
  { path: "/GFform", exact: true, name: "GFForm", component: GFForm },
  { path: "/profile", exact: true, name: "Profile", component: Profile },
  {
    path: "/biblegroup",
    exact: true,
    name: "BibleGroup",
    component: BibleGroup,
  },
  { path: "/members", exact: true, name: "Members", component: Members },
];

export default routes;
