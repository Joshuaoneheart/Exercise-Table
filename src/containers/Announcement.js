import { loading } from "components";
import { useParams } from "react-router-dom";
import { FirestoreDocument } from "@react-firebase/firestore";

import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import { useEffect, useState } from "react";
import { DB } from "db/firebase";

const AnnouncementCardBody = ({ data }) => {
  const [postedBy, setPostedBy] = useState("");
  useEffect(() => {
    const getPostByName = async (id) => {
      let tmp = await DB.getByUrl("/accounts/" + id);
      if (tmp) setPostedBy(tmp.displayName);
      else setPostedBy("undefined");
    };
    getPostByName(data.posted_by);
  }, [data]);
  return (
    <CCardBody>
      {" "}
      <CRow>
        <CCol style={{ fontSize: "18px" }}>
          <h3>{data.title}</h3>
          <hr />
          <div width="20%">
            <CRow>
              <CCol lg="3">
                <b>發佈人</b>
              </CCol>
              <CCol>{postedBy}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>發布時間</b>
              </CCol>
              <CCol>{data.timestamp.toDate().toString()}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>內容</b>
              </CCol>
              <CCol>{data.content}</CCol>
            </CRow>
          </div>
        </CCol>
      </CRow>{" "}
    </CCardBody>
  );
};
const GF = () => {
  let { id } = useParams();
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>公告</CCardHeader>

          <FirestoreDocument path={"/announcement/" + id}>
            {(d) => {
              if (d && d.value) {
                for (let i = 0; i < d.value.length; i++)
                  d.value[i].id = d.ids[i];
                return (
                  <CCol>
                    <AnnouncementCardBody data={d.value} />
                  </CCol>
                );
              } else return loading;
            }}
          </FirestoreDocument>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default GF;
