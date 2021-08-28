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

const Settings = () => {
  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">接受表單回音</CRow>
        </CCardHeader>
        <ModifyCard />
      </CCard>
    </>
  );
};

export default Settings;
