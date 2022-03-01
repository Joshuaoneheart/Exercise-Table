const _nav = [
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
    _children: ["表單"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "表單填寫",
    to: "/form",
    icon: "cil-spreadsheet",
  },
  {
    _tag: "CSidebarNavItem",
    name: "牧養對象邀約",
    to: "/GFform",
    icon: "cil-happy",
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
