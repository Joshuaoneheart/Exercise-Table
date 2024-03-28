import { lazy } from "react";

//Members
const Members = lazy(() => import("../containers/Member"));
const Profile = lazy(() => import("../containers/Member/Profile/Profile"));
const Form = lazy(() => import("../containers/Member/SubmitForm/SubmitForm"));
const GF = lazy(() => import("../containers/GF"));
const AnnouncementList = lazy(() => import("../containers/AnnouncementList"));
const Announcement = lazy(() => import("../containers/Announcement"));
const GFList = lazy(() => import("../containers/GFList"));
const Schedule = lazy(() => import("../containers/Schedule"));

const routes = [
  { path: "/", exact: true, name: "Home", component: Form },
  { path: "/form", exact: true, name: "Form", component: Form },
  { path: "/profile", exact: true, name: "Profile", component: Profile },
  { path: "/GF/:id", exact: true, name: "GF", component: GF },
  {
    path: "/schedule",
    exact: true,
    name: "schedule",
    component: Schedule,
  },
  {
    path: "/announcementList",
    exact: true,
    name: "announcement list",
    component: AnnouncementList,
  },
  {
    path: "/announcement/:id",
    exact: true,
    name: "announcement",
    component: Announcement,
  },
  { path: "/GFList", exact: true, name: "GFList", component: GFList },
  { path: "/member/:id", exact: true, name: "members", component: Members },
];

export default routes;
