import GF from "containers/GF";
import Member from "containers/Member";
//Members
import Form from "../containers/Member/SubmitForm/SubmitForm";
import Dashboard from "../containers/Dashboard";
import AnnouncementList from "../containers/AnnouncementList";
import GFList from "../containers/GFList";

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
