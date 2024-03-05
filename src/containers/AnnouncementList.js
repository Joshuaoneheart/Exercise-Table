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
import { AccountContext } from "hooks/context";
import { useContext } from "react";
import { Link } from "react-router-dom";
const AnnouncementListBody = ({ data }) => {
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
      <CDataTable
        items={data}
        fields={fields}
        columnFilter
        tableFilter
        itemsPerPage={10}
        hover
        sorter
        pagination
        scopedSlots={{
          timestamp: (item) => {
            return <td>{item.timestamp.toDate().toString()}</td>;
          },
          content: (item) => {
            let tmp = item.content;
            if (tmp.length >= 50) {
              tmp = tmp.substring(0, 100);
              tmp += " ...";
            }
            return <td>{tmp}</td>;
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
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol md="11">公告</CCol>
              <CCol md="1">
                <CButton variant="ghost" color="primary">
                  <CIcon name="cil-plus" />
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <FirestoreCollection path="/公告/">
            {(d) => {
              if (d.isLoading) return loading;
              if (d && d.value) {
                // add "id" to data
                for (var i = 0; i < d.value.length; i++) {
                  d.value[i]["id"] = d.ids[i];
                }
                return <AnnouncementListBody data={d.value} />;
              } else return null;
            }}
          </FirestoreCollection>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default AnnouncementList;
