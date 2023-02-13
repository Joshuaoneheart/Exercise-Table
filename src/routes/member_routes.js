import { lazy } from "react";

//Members
const Members = lazy(() => import("../containers/Members"));
const Profile = lazy(() => import("../containers/Member/Profile/Profile"));
const Form = lazy(() => import("../containers/Member/SubmitForm/SubmitForm"));
const GFForm = lazy(() => import("../containers/Member/GFform/GFform"));
const BibleGroup = lazy(() => import("../containers/Member/Biblegroup/BibleGroup"));

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
