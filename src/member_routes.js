import { lazy } from "react";

//Members
const Members = lazy(() => import("./member/Members/Members"));
const Profile = lazy(() => import("./member/Profile/Profile"));
const Form = lazy(() => import("./member/Form/Form"));
const GFForm = lazy(() => import("./member/GFform/GFform"));
const BibleGroup = lazy(() => import("./member/Biblegroup/BibleGroup"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/form", exact: true, name: "Form", component: Form },
  { path: "/GFform", exact: true, name: "GFForm", component: GFForm },
  { path: "/profile", exact: true, name: "Profile", component: Profile },
  {
    path: "/biblegroup",
    exact: true,
    name: "BibleGroup",
    component: null,
  },
  { path: "/members", exact: true, name: "Members", component: null },
];

export default routes;
