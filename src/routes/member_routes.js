import { lazy } from "react";

//Members
const Members = lazy(() => import("../containers/Member"));
const Profile = lazy(() => import("../containers/Member/Profile/Profile"));
const Form = lazy(() => import("../containers/Member/SubmitForm/SubmitForm"));
const GFForm = lazy(() => import("../containers/Member/GFform/GFform"));
const GF = lazy(() => import("../containers/GF"));
const AnnouncementList = lazy(() => import("../containers/AnnouncementList"));
const Announcement = lazy(() => import("../containers/Announcement"));

const routes = [
  { path: "/", exact: true, name: "Home", component: Form },
  { path: "/form", exact: true, name: "Form", component: Form },
  { path: "/GFform", exact: true, name: "GFForm", component: GFForm },
  { path: "/profile", exact: true, name: "Profile", component: Profile },
  { path: "/GF/:id", exact: true, name: "GF", component: GF },
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
  { path: "/member/:id", exact: true, name: "members", component: Members },
];

export default routes;
