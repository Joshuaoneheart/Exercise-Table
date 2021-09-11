import React, {useContext} from "react";
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

// sidebar nav config
import admin_navigation from "./_nav";
import member_navigation from "./_nav_member"

const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);
  var account = useContext(AccountContext);
  if(typeof(account) == "undefined") return null;
  var navigation;
  if(account.role == "Admin") navigation = admin_navigation;
  else navigation = member_navigation;
  console.log(account);
  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/" style={{textDecoration:"none"}}>
	  	<CImg src={"./favicon.ico"} style={{width:"32px", marginRight:"15px"}}/>
	  	<span style={{fontSize:"23px", fontFamily:"sans-serif"}}>Exercise Table</span>
      </CSidebarBrand>
      <CSidebarNav>
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
