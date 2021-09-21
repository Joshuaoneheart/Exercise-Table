import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";

const ModifyCard = () => {
  return (
    <CCardBody>
      <CRow>我其實不知道要放啥呢？</CRow>
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
