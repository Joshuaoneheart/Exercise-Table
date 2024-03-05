
const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "公告",
    to: "/announcementList",
    icon: "cil-bell",
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["操練情形查詢"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "個人",
    to: "/members",
    icon: "cil-user",
  },
  {
    _tag: "CSidebarNavItem",
    name: "活力組",
    to: "/biblegroup",
    icon: "cil-bar-chart",
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["管理功能"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "住戶管理",
    to: "/modifyresidence",
    icon: "cil-house",
  },
  {
    _tag: "CSidebarNavItem",
    name: "活力組管理",
    to: "/modifygroup",
    icon: "cil-group",
  },
  {
    _tag: "CSidebarNavItem",
    name: "修改表單",
    to: "/modifyform",
    icon: "cil-pencil",
  },
  {
    _tag: "CSidebarNavItem",
    name: "表單預覽",
    to: "/form",
    icon: "cil-spreadsheet",
  },
  {
    _tag: "CSidebarNavItem",
    name: "福音朋友列表",
    to: "/GFList",
    icon: "cil-list",
  },
  {
    _tag: "CSidebarNavDivider",
  },
  {
    _tag: "CSidebarNavDivider",
    className: "m-2",
  },
];

export default _nav;
