import { lazy } from "react";

//Members
const Members = lazy(() => import("../Containers/Member/Members/Members"));
const Profile = lazy(() => import("../Containers/Member/Profile/Profile"));
const Form = lazy(() => import("../Containers/Member/SubmitForm/SubmitForm"));
const GFForm = lazy(() => import("../Containers/Member/GFform/GFform"));
const BibleGroup = lazy(() => import("../Containers/Member/Biblegroup/BibleGroup"));

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
