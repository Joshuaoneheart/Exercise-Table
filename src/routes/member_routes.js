import { lazy } from "react";
import GF from "containers/GF";
import Member from "containers/Member";
//Members
const Form = lazy(() => import("../containers/Member/SubmitForm/SubmitForm"));

const Dashboard = lazy(() => import("../containers/Dashboard"));
const AnnouncementList = lazy(() => import("../containers/AnnouncementList"));
const GFList = lazy(() => import("../containers/GFList"));

const routes = [
  { path: "/", exact: true, name: "Home", component: Dashboard },
  { path: "/dashboard", exact: true, name: "Dashboard", component: Dashboard },
  { path: "/form", exact: true, name: "Form", component: Form },
  { path: "/GF/:id", name: "GF", component: GF },
  {
    path: "/announcementList",
    exact: true,
    name: "announcement list",
    component: AnnouncementList,
  },
  { path: "/GFList", exact: true, name: "GFList", component: GFList },
  { path: "/member/:id", name: "members", component: Member },
];

export default routes;
