import { loading } from "components";
import { useParams } from "react-router-dom";
import { FirestoreDocument } from "@react-firebase/firestore";

import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";

const GFCardBody = ({ data }) => {
  return (
    <CCardBody>
      {" "}
      <CRow>
        <CCol style={{ fontSize: "18px" }}>
          <h3>{data.name}</h3>
          <hr />
          <div width="20%">
          <CRow>
              <CCol lg="3">
                <b>學校</b>
              </CCol>
              <CCol>{data.school}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>科系</b>
              </CCol>
              <CCol>{data.department}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>年級</b>
              </CCol>
              <CCol>{data.grade}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>備註</b>
              </CCol>
              <CCol>{data.note}</CCol>
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
          <CCardHeader>福音朋友資料</CCardHeader>

          <FirestoreDocument path={"/GF/" + id}>
            {(d) => {
              if (d && d.value) {
                for (let i = 0; i < d.value.length; i++)
                  d.value[i].id = d.ids[i];
                return (
                  <CCol>
                    <GFCardBody data={d.value} />
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
