import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CToggler,
} from "@coreui/react";

const ModifyCard = () => {
  return (
    <CCardBody>
      <CRow>
        <CToggler></CToggler>
      </CRow>
    </CCardBody>
  );
};

const Profile = () => {
  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">個人資料</CRow>
        </CCardHeader>
        <ModifyCard />
      </CCard>
    </>
  );
};

export default Profile;
