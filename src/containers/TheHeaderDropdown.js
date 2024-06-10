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
import { useTranslation } from "react-i18next";
import i18n from "i18n";

const TheHeaderDropdown = (props) => {
  var account = useContext(AccountContext);
  const { t, i18n: i18next } = useTranslation("translation", { i18n })
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
          {t("個人檔案")}
        </CDropdownItem>
        {account.role === "Admin" && (
          <>
            <CDropdownItem
              tag={CLink}
              className="c-subheader-nav-link"
              to="/users"
            >
              <CIcon name="cil-people" className="mfe-2" />
              {t("使用者")}
            </CDropdownItem>
            <CDropdownItem
              tag={CLink}
              className="c-subheader-nav-link"
              to="/settings"
            >
              <CIcon name="cil-settings" className="mfe-2" />
              {t("設定")}
            </CDropdownItem>
          </>
        )}
        <CDropdownItem
          className="c-subheader-nav-link"
          onClick={() => {
            if (i18next.language === "zh-tw")
              i18next.changeLanguage("en")
            else
              i18next.changeLanguage("zh-tw")
          }}
        >
          {i18next.language !== "zh-tw" ?
            <CIcon name="cif-tw" className="mfe-2" /> : <CIcon name="cif-us" className="mfe-2" />}
          {t("English")}
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem onClick={async () => DB.signOut()}>
          <CIcon name="cil-account-logout" className="mfe-2" />
          {t("登出")}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
