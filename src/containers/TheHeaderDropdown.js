import { React, useContext } from "react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
  CLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { AccountContext } from "../App";

const TheHeaderDropdown = (props) => {
  var account = useContext(AccountContext);
  if (!account) return null;
  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={"favicon.ico"}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>Account</strong>
        </CDropdownItem>
        <CDropdownItem
          className="c-subheader-nav-link"
          tag={CLink}
          to="/profile"
        >
          <CIcon name="cil-user" className="mfe-2" />
          Profile
        </CDropdownItem>
        {account.role === "Admin" && (
          <>
            <CDropdownItem
              tag={CLink}
              className="c-subheader-nav-link"
              to="/settings"
            >
              <CIcon name="cil-settings" className="mfe-2" />
              Settings
            </CDropdownItem>
          </>
        )}
        <CDropdownItem divider />
        <CDropdownItem
          onClick={() =>
            props.firebase
              .auth()
              .signOut()
              .catch((error) => {
                window.alert("Error : " + error.message);
              })
          }
        >
          <CIcon name="cil-account-logout" className="mfe-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
