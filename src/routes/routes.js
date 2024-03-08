import { lazy } from "react";

//Admin
const ModifyResidence = lazy(() =>
  import("../containers/Admin/ModifyResidence/ModifyResidence")
);
const ModifyGroup = lazy(() =>
  import("../containers/Admin/ModifyGroup/ModifyGroup")
);
const ModifyForm = lazy(() =>
  import("../containers/Admin/ModifyForm/ModifyForm")
);
const Member = lazy(() => import("../containers/Member"));
const MemberList = lazy(() =>
  import("../containers/Admin/MemberList/MemberList")
);
const BibleGroup = lazy(() => import("../containers/BibleGroup"));
const BibleGroupList = lazy(() =>
  import("../containers/Admin/BibleGroupList/BibleGroupList")
);

const Profile = lazy(() => import("../containers/Admin/Profile/Profile"));
const Settings = lazy(() => import("../containers/Admin/Settings/Settings"));
const Form = lazy(() => import("../containers/Admin/ReviewForm/ReviewForm"));
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
const Users = lazy(() => import("../views/users/Users"));
const GF = lazy(() => import("../containers/GF"));
const GFList = lazy(() => import("../containers/Admin/GFList/GFList"));
const AnnouncementList = lazy(() => import("../containers/AnnouncementList"));
const Announcement = lazy(() => import("../containers/Announcement"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/users", exact: true, name: "Users", component: Users },
  {
    path: "/modifyresidence",
    exact: true,
    name: "Modify Residence",
    component: ModifyResidence,
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
  { path: "/form", exact: true, name: "Form", component: Form },
  { path: "/settings", exact: true, name: "Settings", component: Settings },
  { path: "/profile", exact: true, name: "Profile", component: Profile },
  { path: "/GFList", exact: true, name: "GFList", component: GFList },
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
  { path: "/memberList", exact: true, name: "member list", component: MemberList },
  { path: "/member/:id", exact: true, name: "member", component: Member },
  {
    path: "/biblegroupList",
    exact: true,
    name: "biblegroup list",
    component: BibleGroupList,
  },
  {
    path: "/biblegroup/:id",
    exact: true,
    name: "biblegroup",
    component: BibleGroup,
  },
];

export default routes;
