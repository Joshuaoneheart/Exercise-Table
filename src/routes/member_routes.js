import { lazy } from "react";

//Members
const Members = lazy(() => import("../containers/Member"));
const Form = lazy(() => import("../containers/Member/SubmitForm/SubmitForm"));
const GF = lazy(() => import("../containers/GF"));
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
  { path: "/member/:id", name: "members", component: Members },
];

export default routes;
