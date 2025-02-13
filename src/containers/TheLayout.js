import { useEffect, useState } from "react";
import { TheContent, TheSidebar, TheHeader } from "./index";
import { useHistory } from "react-router-dom";
const TheLayout = (props) => {
  const [show, setShow] = useState(false);
  const history = useHistory();
  useEffect(() => {
    history.push("/");
  }, [history]);
  return (
    <>
      <TheSidebar setShow={setShow} show={show} />
      <TheHeader {...props} setShow={setShow} />
      <TheContent />
    </>
  );
};

export default TheLayout;
