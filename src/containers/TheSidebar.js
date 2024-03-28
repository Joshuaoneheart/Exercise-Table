import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarMinimizer,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CSidebarNavTitle,
} from "@coreui/react";
import { memo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Brand } from "components";
import { AccountContext } from "hooks/context";
import { history } from "utils/history";

var error_num = 0;

const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);
  var account = useContext(AccountContext);
  if (account == null) error_num++;
  if (account == null && error_num >= 3) alert("連線錯誤");
  if (!account) return null;
  var navigation;
  if (account.is_admin)
    navigation = [
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
        to: "/memberList",
        icon: "cil-user",
      },
      {
        _tag: "CSidebarNavItem",
        name: "活力組",
        to: "/biblegroupList",
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
        name: "牧養對象列表",
        to: "/GFList",
        icon: "cil-list",
      },
      {
        _tag: "CSidebarNavItem",
        name: "學期結算",
        to: "/summary",
        icon: "cil-calculator",
      },
      {
        _tag: "CSidebarNavDivider",
      },
      {
        _tag: "CSidebarNavDivider",
        className: "m-2",
      },
    ];
  else {
    navigation = [
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
        to: "/member/" + account.id,
        icon: "cil-user",
      },
      {
        _tag: "CSidebarNavItem",
        name: "牧養對象列表",
        to: "/GFList",
        icon: "cil-list",
      },
      {
        _tag: "CSidebarNavTitle",
        _children: ["表單"],
      },
      {
        _tag: "CSidebarNavItem",
        to: "/form",
        name: "操練表填寫",
        icon: "cil-spreadsheet",
      },
      {
        _tag: "CSidebarNavItem",
        name: "時間表",
        to: "/schedule",
        icon: "cil-alarm",
      },
      {
        _tag: "CSidebarNavDivider",
      },
      {
        _tag: "CSidebarNavDivider",
        className: "m-2",
      },
    ];
  }
  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand
        className="d-md-down-none"
        to="/"
        style={{ textDecoration: "none" }}
      >
        <Brand />
      </CSidebarBrand>
      <CSidebarNav
        onClick={(event) => {
          if (!event.target) return;
          if (!event.target.href) return;
          const not_implemented = [];
          for (let n of not_implemented)
            if (event.target.href.includes(n)) {
              alert("此功能尚未開放");
              history.push("/");
              break;
            }
        }}
      >
        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default memo(TheSidebar);
