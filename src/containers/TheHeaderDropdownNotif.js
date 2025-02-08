import { useContext, useEffect, useState } from "react";
import { AccountContext } from "hooks/context";
import { firebase } from "db/firebase";
import { useHistory } from "react-router-dom";
import useOuterClick from "hooks/outerClick";
const TheHeaderDropdownNotif = () => {
  const account = useContext(AccountContext);
  const [refresh, setRefresh] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [show, setShow] = useState(false);
  const history = useHistory();

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
        key={`notification-${i}`}
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
          history.push(`/AnnouncementList?id=${announcements[i].id}`);
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
          webkitUserSelect: "none",
          mozUserSelect: "none",
          msSserSelect: "none",
          userSelect: "none",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/Images/bell.svg"}
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
          top: "36px",
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
