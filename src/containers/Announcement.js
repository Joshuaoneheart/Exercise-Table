import { loading } from "components";
import { useParams } from "react-router-dom";
import { FirestoreDocument } from "@react-firebase/firestore";

import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
} from "@coreui/react";
import { useContext, useEffect, useState } from "react";
import { DB } from "db/firebase";
import CIcon from "@coreui/icons-react";
import { AccountContext, AccountsMapContext } from "hooks/context";
import ModifyAnnouncementModal from "components/ModifyAnnouncementModal";

const AnnouncementCard = ({ init_data, id }) => {
  const account = useContext(AccountContext);
  const accountsMap = useContext(AccountsMapContext);
  const [data, setData] = useState(init_data);
  const [modifyModal, setModifyModal] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!data.checked) data.checked = account.id;
      else if (!data.checked.split(";").includes(account.id))
        data.checked += ";" + account.id;
      await DB.setByUrl("/announcement/" + id, data);
    };
    if (data) check();
  }, [account, data, id]);

  useEffect(() => {
    if (init_data) {
      setData(Object.assign({}, init_data));
    }
  }, [init_data]);
  return (
    <CCard>
      <CCardHeader>
        <ModifyAnnouncementModal
          id={id}
          show={modifyModal}
          account={account}
          data={data}
          setModal={setModifyModal}
          setData={setData}
        />
        <CRow>
          <CCol md="11">公告</CCol>
          {data && account.id === data.posted_by && (
            <CCol md="1">
              <CButton
                variant="ghost"
                color="primary"
                onClick={() => {
                  setModifyModal(true);
                }}
              >
                <CIcon name="cil-pencil" />
              </CButton>
            </CCol>
          )}
        </CRow>{" "}
      </CCardHeader>
      <CCardBody>
        {" "}
        <CRow>
          <CCol style={{ fontSize: "18px" }}>
            <h3>{data && data.title}</h3>
            <hr />
            <div width="20%">
              <CRow>
                <CCol lg="3">
                  <b>發佈人</b>
                </CCol>
                <CCol>{accountsMap[data.posted_by]}</CCol>
              </CRow>
              <CRow>
                <CCol lg="3">
                  <b>發布時間</b>
                </CCol>
                <CCol>
                  {data &&
                    data.timestamp &&
                    (data.timestamp.toDate
                      ? data.timestamp.toDate().toString()
                      : data.timestamp.toString())}
                </CCol>
              </CRow>
              <CRow>
                <CCol lg="3">
                  <b>內容</b>
                </CCol>
                <CCol>
                  <div
                    dangerouslySetInnerHTML={{ __html: data && data.content }}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol lg="3">
                  <b>已讀數</b>
                </CCol>
                <CCol>{data.checked.split(";").length}</CCol>
              </CRow>
              <CRow>
                <CCol lg="3">
                  <b>已讀</b>
                </CCol>
                <CCol>
                  {data.checked
                    .split(";")
                    .map((x) => accountsMap[x])
                    .join(",")}
                </CCol>
              </CRow>
            </div>
          </CCol>
        </CRow>{" "}
      </CCardBody>
    </CCard>
  );
};
const GF = () => {
  let { id } = useParams();
  return (
    <CRow>
      <CCol>
        <FirestoreDocument path={"/announcement/" + id}>
          {(d) => {
            if (d && d.value) {
              for (let i = 0; i < d.value.length; i++) d.value[i].id = d.ids[i];
              return (
                <CCol>
                  <AnnouncementCard init_data={d.value} id={id} />
                </CCol>
              );
            } else return loading;
          }}
        </FirestoreDocument>
      </CCol>
    </CRow>
  );
};
export default GF;
