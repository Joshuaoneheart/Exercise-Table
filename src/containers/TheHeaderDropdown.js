import CIcon from "@coreui/icons-react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
  CLink
} from "@coreui/react";
import { DB } from "db/firebase";
import { AccountContext } from "hooks/context";
import { useContext } from "react";

const TheHeaderDropdown = (props) => {
  var account = useContext(AccountContext);
  if (!account) return null;
  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={process.env.PUBLIC_URL + "/favicon.ico"}
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
              to="/users"
            >
              <CIcon name="cil-people" className="mfe-2" />
              Users
            </CDropdownItem>
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
        <CDropdownItem onClick={async () => DB.signOut()}>
          <CIcon name="cil-account-logout" className="mfe-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
