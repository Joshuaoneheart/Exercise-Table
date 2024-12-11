import { useState } from "react";
import { TheContent, TheSidebar, TheHeader } from "./index";

const TheLayout = (props) => {
  const [show, setShow] = useState(false);
  return (
    <div className="c-app c-default-layout">
      <TheSidebar setShow={setShow} show={show}/>
      <div className="c-wrapper">
        <TheHeader {...props} setShow={setShow} />
        <div className="c-body">
          <TheContent />
        </div>
      </div>
    </div>
  );
};

export default TheLayout;
