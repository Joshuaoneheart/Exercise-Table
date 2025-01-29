import { useState } from "react";
import { TheContent, TheSidebar, TheHeader } from "./index";

const TheLayout = (props) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <TheSidebar setShow={setShow} show={show} />
      <TheHeader {...props} setShow={setShow} />
      <TheContent />
    </div>
  );
};

export default TheLayout;
