import { useContext, useRef, useEffect, useState } from "react";
import { AccountContext } from "hooks/context";
import { firebase } from "db/firebase";
import { history } from "utils/history";
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
        className="primary-bold"
        onClick={() => {
          setShow(false);
          setRefresh((old_refresh) => {
            return !old_refresh;
          });
          history.push(`/Announcement/${announcements[i].id}`);
        }}
      >
        {announcements[i].title}
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
          paddingRight: "18px",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "Images/bell.svg"}
          alt="notification"
        />
        {announcements.length > 0 && (
          <div
            style={{
              width: 0,
              overflow: "visible",
            }}
          >
            <span
              style={{
                position: "relative",
                right: "13px",
                bottom: "11px",
                paddingLeft: "8px",
                paddingRight: "8px",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--white)",
                height: "8px",
                backgroundColor: "var(--red)",
              }}
            >
              {announcements.length}
            </span>
          </div>
        )}
      </div>
      <ul
        style={{
          display: show ? "block" : "none",
          listStyle: "none",
          position: "fixed",
          top: "30px",
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
            backgroundColor: "#E8E8E8",
            paddingBottom: "9px",
            paddingLeft: "16px",
            paddingRight: "16px",
            borderRadius:
              "8px 8px " + (announcements.length === 0 ? "8px 8px" : "0px 0px"),
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
