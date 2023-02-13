import CIcon from "@coreui/icons-react";
import {
  CBreadcrumbRouter, CHeader, CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink, CLink, CSubheader, CToggler
} from "@coreui/react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

// routes config
import { Brand } from "components";
import { AccountContext } from "hooks/context";
import routes from "routes/routes";

import {
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks
} from "./index";

const TheHeader = (props) => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  var account = useContext(AccountContext);
  if (!account) return null;

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <Brand />
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        {account.role === "Admin" && (
          <>
            <CHeaderNavItem className="px-3">
              <CHeaderNavLink to="/dashboard">Dashboard</CHeaderNavLink>
            </CHeaderNavItem>
            <CHeaderNavItem className="px-3">
              <CHeaderNavLink to="/users">Users</CHeaderNavLink>
            </CHeaderNavItem>
            <CHeaderNavItem className="px-3">
              <CHeaderNavLink to="/settings">Settings</CHeaderNavLink>
            </CHeaderNavItem>
          </>
        )}
      </CHeaderNav>

      <CHeaderNav className="px-3">
        {account.role === "Admin" && (
          <>
            <TheHeaderDropdownNotif />
            <TheHeaderDropdownTasks />
            <TheHeaderDropdownMssg />
          </>
        )}
        <TheHeaderDropdown {...props} />
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
        <div className="d-md-down-none mfe-2 c-subheader-nav">
          {account.role === "Admin" && (
            <>
              <CLink className="c-subheader-nav-link" to="/settings">
                <CIcon name="cil-speech" alt="Settings" />
              </CLink>
              <CLink
                className="c-subheader-nav-link"
                aria-current="page"
                to="/"
              >
                <CIcon name="cil-graph" alt="Dashboard" />
                &nbsp;Dashboard
              </CLink>
              <CLink className="c-subheader-nav-link" to="/settings">
                <CIcon name="cil-settings" alt="Settings" />
                &nbsp;Settings
              </CLink>
            </>
          )}
        </div>
      </CSubheader>
    </CHeader>
  );
};

export default TheHeader;
