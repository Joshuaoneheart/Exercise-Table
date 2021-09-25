import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCreateElement,
  CImg,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";

import { AccountContext } from "../App.js";
import Brand from "src/reusable/brand";

// sidebar nav config
import admin_navigation from "./_nav";
import member_navigation from "./_nav_member";

var account_num = 0;

const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);
  var account = useContext(AccountContext);
  if (account == null) account_num++;
  if (account == null && account_num >= 3) alert("連線錯誤");
  if (!account) return null;
  var navigation;
  if (account.role === "Admin") navigation = admin_navigation;
  else navigation = member_navigation;
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
		  if(!event.target) return;
		  if(!event.target.href) return;
          const not_implemented = ["members", "biblegroup"];
          for (let n of not_implemented)
            if (event.target.href.includes(n)) {
              alert("此功能尚未開放");
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

export default React.memo(TheSidebar);
