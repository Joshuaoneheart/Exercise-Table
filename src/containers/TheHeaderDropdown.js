import { AccountContext } from "hooks/context";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18n";

const TheHeaderDropdown = (props) => {
  var account = useContext(AccountContext);
  const { i18n: i18next } = useTranslation("translation", { i18n });
  if (!account) return null;
  return (
    <div
      onClick={() => {
        if (i18next.language === "zh-tw") i18next.changeLanguage("en");
        else i18next.changeLanguage("zh-tw");
      }}
      style={{
        webkitUserSelect: "none",
        mozUserSelect: "none",
        msSserSelect: "none",
        userSelect: "none",
      }}
    >
      {i18next.language !== "zh-tw" ? (
        <img
          src={process.env.PUBLIC_URL + "/Images/flag_US.svg"}
          alt="flag_US"
        />
      ) : (
        <img
          src={process.env.PUBLIC_URL + "/Images/flag_TW.svg"}
          alt="flag_TW"
        />
      )}
    </div>
  );
};

export default TheHeaderDropdown;
