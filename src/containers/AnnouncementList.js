import CIcon from "@coreui/icons-react";
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CDataTable,
  CButton,
} from "@coreui/react";
import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";
import AddAnnouncementModal from "components/AddAnnouncementModal";
import { DB } from "db/firebase";
import { AccountContext } from "hooks/context";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
const AnnouncementListBody = ({ data, account, addModal, setAddModal }) => {
  const [announcements, setAnnouncements] = useState(data);
  const [accountsMap, setAccountsMap] = useState(null);
  useEffect(() => {
    let FetchAccountsMap = async () => {
      let tmp = {};
      let accounts = await DB.getByUrl("/accounts");
      await accounts.forEach((doc) => {
        tmp[doc.id] = doc.data().displayName;
      });
      setAccountsMap(tmp);
    };
    FetchAccountsMap();
  }, []);
  useEffect(() => {
    setAnnouncements(Array.from(data));
  }, [data]);
  if (accountsMap === null) return loading;
  const fields = [
    { key: "title", label: "主題", _style: { width: "7%" } },
    { key: "timestamp", label: "發佈時間", _style: { width: "20%" } },
    { key: "posted_by", label: "發佈人", _style: { width: "7%" } },
    { key: "content", label: "內容預覽", _style: { width: "50%" } },
    {
      key: "show_details",
      label: "",
      _style: { width: "1%" },
      sorter: false,
      filter: false,
    },
  ];

  return (
    <CCardBody>
      <AddAnnouncementModal
        show={addModal}
        data={announcements}
        account={account}
        setModal={setAddModal}
        setData={setAnnouncements}
      />

      <CDataTable
        sorterValue={{ column: "timestamp", asc: false }}
        items={announcements}
        fields={fields}
        columnFilter
        tableFilter
        itemsPerPage={10}
        hover
        sorter
        pagination
        scopedSlots={{
          posted_by: (item) => {
            return <td>{accountsMap[item.posted_by]}</td>;
          },
          timestamp: (item) => {
            if (!item.timestamp) return <td></td>;
            if (item.timestamp.toDate)
              return <td>{item.timestamp.toDate().toString()}</td>;
            else return <td>{item.timestamp.toString()}</td>;
          },
          content: (item) => {
            let tmp = item.content;
            if (tmp.length >= 50) {
              tmp = tmp.substring(0, 100);
              tmp += " ...";
            }
            return (
              <td>
                <div dangerouslySetInnerHTML={{ __html: tmp }} />
              </td>
            );
          },
          show_details: (item) => {
            return (
              <Link to={"/Announcement/" + item.id}>
                <CIcon name="cil-info" style={{ marginTop: "40%" }} />
              </Link>
            );
          },
        }}
      />
    </CCardBody>
  );
};
const AnnouncementList = () => {
  const account = useContext(AccountContext);
  const [addModal, setAddModal] = useState(false);
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol xs="10" md="11">
                公告
              </CCol>
              {account.role === "Admin" && (
                <CCol xs="1" md="1">
                  <CButton
                    variant="ghost"
                    color="primary"
                    onClick={() => {
                      setAddModal(true);
                    }}
                  >
                    <CIcon name="cil-plus" />
                  </CButton>
                </CCol>
              )}
            </CRow>
          </CCardHeader>
          <FirestoreCollection path="/announcement/">
            {(d) => {
              if (d.isLoading) return loading;
              if (d && d.value) {
                // add "id" to data
                for (var i = 0; i < d.value.length; i++) {
                  d.value[i]["id"] = d.ids[i];
                }
                return (
                  <AnnouncementListBody
                    account={account}
                    data={d.value}
                    addModal={addModal}
                    setAddModal={setAddModal}
                  />
                );
              } else return null;
            }}
          </FirestoreCollection>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default AnnouncementList;
