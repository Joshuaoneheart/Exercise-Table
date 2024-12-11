import CIcon from "@coreui/icons-react";
import { AccountContext } from "hooks/context";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18n";

const TheHeaderDropdown = (props) => {
  var account = useContext(AccountContext);
  const { t, i18n: i18next } = useTranslation("translation", { i18n });
  if (!account) return null;
  return (
    <div
      className="c-subheader-nav-link"
      onClick={() => {
        if (i18next.language === "zh-tw") i18next.changeLanguage("en");
        else i18next.changeLanguage("zh-tw");
      }}
    >
      {i18next.language !== "zh-tw" ? (
        <CIcon size="lg" name="cif-tw" className="mfe-2" />
      ) : (
        <CIcon size="lg" name="cif-us" className="mfe-2" />
      )}
    </div>
  );
};

export default TheHeaderDropdown;
