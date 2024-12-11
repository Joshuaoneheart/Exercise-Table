import { useContext, useRef, useEffect, useState } from "react";
import { CBadge, CLink } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { AccountContext } from "hooks/context";
import { firebase } from "db/firebase";
function useOuterClick(callback) {
  const callbackRef = useRef(); // initialize mutable ref, which stores callback
  const innerRef = useRef(); // returned to client, who marks "border" element

  // update cb on each render, so second useEffect has access to current value
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    function handleClick(e) {
      if (
        innerRef.current &&
        callbackRef.current &&
        !innerRef.current.contains(e.target)
      )
        callbackRef.current(e);
    }
  }, []); // no dependencies -> stable click listener

  return innerRef; // convenience for client (doesn't need to init ref himself)
}

const TheHeaderDropdownNotif = () => {
  const account = useContext(AccountContext);
  const [refresh, setRefresh] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [show, setShow] = useState(false);
  const ref = useOuterClick(() => setShow(false));
  useEffect(() => {
    firebase
      .firestore()
      .collection("announcement")
      .onSnapshot((querySnapshot) => {
        let tmp = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.id = doc.id;
          if (!data.checked || !data.checked.split(";").includes(account.id))
            tmp.push(data);
        });
        setAnnouncements(tmp);
      });
  }, [account, refresh]);
  let announcement_list = [];
  for (let i = 0; i < announcements.length; i++) {
    announcement_list.push(
      <li
        key={i}
        style={{
          alignItems: "center",
          textAlign: "center",
          paddingTop: "9px",
          paddingBottom: "9px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
        onClick={() => {
          setShow(false);
          setRefresh((old_refresh) => {
            return !old_refresh;
          });
        }}
      >
        <CLink
          className="text-dark-blue"
          to={`/Announcement/${announcements[i].id}`}
        >
          <strong>{announcements[i].title}</strong>
        </CLink>
      </li>
    );
    if (i !== announcements.length - 1)
      announcement_list.push(<hr style={{ margin: 0 }} />);
  }
  return (
    <div ref={ref}>
      <div
        onClick={() => {
          setShow((v) => !v);
        }}
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          paddingRight: announcements.length > 0 ? "0" : "19px",
        }}
      >
        <CIcon size="lg" name="cil-bell" />
        {announcements.length > 0 && (
          <CBadge
            style={{ position: "relative", right: "11px", bottom: "11px" }}
            shape="pill"
            color="danger"
          >
            {announcements.length}
          </CBadge>
        )}
      </div>
      <ul
        style={{
          display: show ? "block" : "none",
          listStyle: "none",
          position: "fixed",
          top: "44px",
          right: "30px",
          borderRadius: "8px",
          backgroundColor: "#FFFFFF",
          padding: 0,
        }}
      >
        <li
          style={{
            alignItems: "center",
            textAlign: "center",
            paddingTop: "9px",
            backgroundColor: "#E7E7E7",
            paddingBottom: "9px",
            paddingLeft: "16px",
            paddingRight: "16px",
            borderRadius: "8px 8px 0px 0px",
          }}
        >
          <strong>You have {announcements.length} notifications</strong>
        </li>
        {announcement_list}
      </ul>
    </div>
  );
};

export default TheHeaderDropdownNotif;
