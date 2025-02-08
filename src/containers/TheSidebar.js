import { memo, useContext, useState } from "react";

import { AccountContext } from "hooks/context";
import { DB } from "db/firebase";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import i18n from "i18n";
import { useLocation, useHistory } from "react-router-dom";

var error_num = 0;

const TheSidebar = ({ show, setShow }) => {
  const location = useLocation();
  var account = useContext(AccountContext);
  const history = useHistory();
  const { t } = useTranslation("translation", { i18n });
  var navigation;
  if (account.is_admin)
    navigation = [
      {
        name: t("公告"),
        to: "/announcementList",
        icon: "reminder.svg",
      },
      {
        name: t("操練表"),
        to: "/dashboard",
        icon: "table.svg",
      },
      {
        name: t("個人"),
        to: "/memberList",
        icon: "personal.svg",
      },
      {
        name: t("牧養對象"),
        to: "/GFList",
        icon: "smile.svg",
      },
      "hr",
      {
        name: t("活力組狀態"),
        to: "/biblegroupList",
      },
      {
        name: t("住處狀態"),
        to: "/residenceList",
      },
      {
        name: t("住戶管理"),
        to: "/modifyresidence",
      },
      {
        name: t("活力組管理"),
        to: "/modifygroup",
      },
      {
        name: t("修改表單"),
        to: "/formList",
      },
      {
        name: t("學期結算"),
        to: "/summary",
      },
      {
        name: t("使用者"),
        to: "/users",
      },
      {
        name: t("設定"),
        to: "/settings",
      },
    ];
  else {
    navigation = [
      {
        name: t("公告"),
        to: "/announcementList",
        icon: "reminder.svg",
      },
      {
        to: "/dashboard",
        name: t("操練表"),
        icon: "table.svg",
      },
      {
        name: t("個人"),
        to: "/member/" + account.id,
        icon: "personal.svg",
      },
      {
        name: t("牧養對象"),
        to: "/GFList",
        icon: "smile.svg",
      },
    ];
  }
  let start_page = 1;
  for (let i = 0; i < navigation.length; i++) {
    if (typeof navigation[i] === "string") continue;
    if (location.pathname.split("/")[1] === navigation[i].to.split("/")[1]) {
      start_page = i;
      break;
    }
  }
  const [active, setActive] = useState(start_page);
  if (account == null) error_num++;
  if (account == null && error_num >= 3) message.error("連線錯誤");
  if (!account) return null;
  let item_list = [];
  for (let i = 0; i < navigation.length; i++) {
    let item = navigation[i];
    item_list.push(
      item === "hr" ? (
        <hr
          style={{
            marginLeft: "16px",
            marginRight: "16px",
            marginTop: "16px",
            marginBottom: "16px",
          }}
        />
      ) : (
        <li
          className={
            "primary-medium sidebar-list-item " + (active === i ? "active" : "")
          }
          onClick={() => {
            setActive(i);
            history.push(item.to);
          }}
        >
          {item.icon && (
            <img
              src={process.env.PUBLIC_URL + "/Images/" + item.icon}
              alt={item.icon}
              style={{
                marginRight: "16px",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            />
          )}
          <span style={{ paddingTop: "10px", paddingBottom: "10px" }}>
            {item.name}
          </span>
        </li>
      )
    );
  }
  return (
    <>
      <div
        className="sidebar background-white"
        style={{
          display: show ? "block" : "none",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/Images/close.svg"}
          alt="close"
          style={{
            marginTop: "24px",
            marginLeft: "24px",
            marginBottom: "24px",
          }}
          onClick={() => setShow(false)}
        />
        <ul style={{ listStyle: "none", padding: 0 }}>{item_list}</ul>
        <hr
          style={{
            marginLeft: "16px",
            marginRight: "16px",
            marginTop: "16px",
            marginBottom: "16px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            cursor: "default",
          }}
          className="primary-medium text-dark-blue"
          onClick={async () => DB.signOut()}
        >
          {t("登出")}
        </div>
      </div>
      <div
        className="sidebar-mask"
        style={{
          display: show ? "block" : "none",
        }}
        onClick={() => setShow(false)}
      />
    </>
  );
};

export default memo(TheSidebar);
