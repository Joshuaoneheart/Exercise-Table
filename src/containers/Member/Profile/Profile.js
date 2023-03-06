import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import { AccountContext } from "hooks/context";
import { useContext } from "react";

const ModifyCard = () => {
  var account = useContext(AccountContext);
  if (!account) return null;
  return (
    <CCardBody>
      <CRow>
        <CCol style={{ fontSize: "18px" }}>
          <h3>{account.displayName}</h3>
          <hr />
          <div width="20%">
            <CRow>
              <CCol lg="3">
                <b>Email</b>
              </CCol>
              <CCol>{account.email}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>Role</b>
              </CCol>
              <CCol>{account.is_admin? "Admin":"Member"}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>Status</b>
              </CCol>
              <CCol>{account.is_active? "Active":"Pending"}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>Registered</b>
              </CCol>
              <CCol>{account.registered}</CCol>
            </CRow>
          </div>
        </CCol>
      </CRow>
    </CCardBody>
  );
};

const Profile = () => {
  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol>個人資料</CCol>
          </CRow>
        </CCardHeader>
        <ModifyCard />
      </CCard>
    </>
  );
};

export default Profile;
