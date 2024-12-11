import {
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CToggler
} from "@coreui/react";
import { useContext } from "react";

// routes config
import { Brand } from "components";
import { AccountContext } from "hooks/context";

import {
  TheHeaderDropdown,
  TheHeaderDropdownNotif
} from "./index";

const TheHeader = ({props, setShow}) => {
  var account = useContext(AccountContext);
  if (!account) return null;
  return (
    <CHeader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={() => setShow(true)}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={() => setShow(true)}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <Brand />
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        {account.is_admin && (
          <>
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
        <TheHeaderDropdownNotif />
        <TheHeaderDropdown {...props} />
      </CHeaderNav>
    </CHeader>
  );
};

export default TheHeader;
