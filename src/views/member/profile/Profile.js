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
      <CRow>
      我其實不知道要放啥呢？
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
