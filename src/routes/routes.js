//Admin
import ModifyResidence from "../containers/Admin/ModifyResidence/ModifyResidence";

import ModifyGroup from "../containers/Admin/ModifyGroup/ModifyGroup";

import FormList from "../containers/Admin/FormList/FormList";

import Dashboard from "../containers/Dashboard";
import ModifyForm from "../containers/Admin/ModifyForm/ModifyForm";

import Member from "../containers/Member";
import MemberList from "../containers/Admin/MemberList/MemberList";

import BibleGroup from "../containers/BibleGroup";
import BibleGroupList from "../containers/Admin/BibleGroupList/BibleGroupList";

import Residence from "../containers/Residence";
import ResidenceList from "../containers/Admin/ResidenceList/ResidenceList";

import Settings from "../containers/Admin/Settings/Settings";
import Form from "../containers/Admin/ReviewForm/ReviewForm";
import Users from "../containers/Admin/Users/Users";
import GF from "../containers/GF";
import GFList from "../containers/GFList";
import AnnouncementList from "../containers/AnnouncementList";
import Announcement from "../containers/Announcement";
import Summary from "../containers/Admin/Summary/Summary";

const routes = [
  { path: "/", exact: true, name: "Home", component: AnnouncementList },
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
    path: "/formList",
    exact: true,
    name: "Form List",
    component: FormList,
  },
  { path: "/form/:id", exact: true, name: "ModifyForm", component: ModifyForm },
  { path: "/form", exact: true, name: "Form", component: Form },
  { path: "/dashboard", exact: true, name: "Dashboard", component: Dashboard },
  { path: "/settings", exact: true, name: "Settings", component: Settings },
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
  {
    path: "/memberList",
    exact: true,
    name: "member list",
    component: MemberList,
  },
  { path: "/member/:id", exact: true, name: "member", component: Member },
  {
    path: "/biblegroupList",
    exact: true,
    name: "biblegroup list",
    component: BibleGroupList,
  },
  {
    path: "/residenceList",
    exact: true,
    name: "residence list",
    component: ResidenceList,
  },
  {
    path: "/biblegroup/:id",
    exact: true,
    name: "biblegroup",
    component: BibleGroup,
  },
  {
    path: "/residence/:id",
    exact: true,
    name: "residence",
    component: Residence,
  },
  {
    path: "/summary",
    exact: true,
    name: "summary",
    component: Summary,
  },
];

export default routes;
