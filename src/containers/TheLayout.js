import React from "react";
import { TheContent, TheSidebar, TheFooter, TheHeader } from "./index";

const TheLayout = (props) => {
  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
      <div className="c-wrapper">
        <TheHeader {...props} />
        <div className="c-body">
          <TheContent />
        </div>
      </div>
    </div>
  );
};

export default TheLayout;
