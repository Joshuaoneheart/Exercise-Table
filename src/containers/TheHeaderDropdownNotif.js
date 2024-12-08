import React, { useContext, useEffect, useState } from "react";
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { AccountContext } from "hooks/context";
import { firebase } from "db/firebase";

const TheHeaderDropdownNotif = () => {
  const account = useContext(AccountContext);
  const [refresh, setRefresh] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
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
      <CDropdownItem
        key={i}
        tag={CLink}
        to={`/Announcement/${announcements[i].id}`}
        onClick={() => {
          setRefresh((old_refresh) => {
            return !old_refresh;
          });
        }}
      >
        <strong>{announcements[i].title}</strong>
      </CDropdownItem>
    );
  }
  return (
    <CDropdown inNav className="c-header-nav-item mx-2">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon size="lg" name="cil-bell" />
        {announcements.length > 0 && (
          <CBadge shape="pill" color="danger">
            {announcements.length}
          </CBadge>
        )}
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end" className="pt-0">
        <CDropdownItem header tag="div" className="text-center" color="light">
          <strong>You have {announcements.length} notifications</strong>
        </CDropdownItem>
        {announcement_list}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdownNotif;
