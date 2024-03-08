import { loading } from "components";
import { useParams } from "react-router-dom";
import { FirestoreDocument } from "@react-firebase/firestore";

import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import { useContext } from "react";
import { AccountsMapContext } from "hooks/context";

const GFCardBody = ({ data }) => {
  const accountsMap = useContext(AccountsMapContext);
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
                <b>牧養人</b>
              </CCol>
              <CCol>
                {data.shepherd &&
                  data.shepherd.map((x) => accountsMap[x]).join(",")}
              </CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>累計主日聚會</b>
              </CCol>
              <CCol>{data["主日聚會"] && data["主日聚會"]}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>累計家聚會</b>
              </CCol>
              <CCol>{data["家聚會"] && data["家聚會"]}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>累計小排</b>
              </CCol>
              <CCol>{data["小排"] && data["小排"]}</CCol>
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
