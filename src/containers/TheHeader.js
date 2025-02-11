import { useContext } from "react";

// routes config
import { Brand } from "components";
import { AccountContext } from "hooks/context";

import { TheHeaderDropdown } from "./index";
import TheHeaderDropdownNotif from "./TheHeaderDropdownNotif";

const TheHeader = ({ props, setShow }) => {
  var account = useContext(AccountContext);
  if (!account) return null;
  return (
    <div className="header">
      <img
        onClick={() => setShow(true)}
        style={{
          padding: "8px",
          webkitUserSelect: "none",
          mozUserSelect: "none",
          msSserSelect: "none",
          userSelect: "none",
        }}
        src={"/Images/burger.svg"}
        alt="sidebar"
      />
      <Brand />
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          paddingTop: "10px",
          paddingRight: "16px",
        }}
      >
        <TheHeaderDropdownNotif />
        <TheHeaderDropdown {...props} />
      </div>
    </div>
  );
};

export default TheHeader;
