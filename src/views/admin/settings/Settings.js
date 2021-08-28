import { React, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CToggler,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
const ModifyCard = () => {
  const [SystemState, setSystemState] = useState(false);
  const flipState = () => setSystemState(!SystemState);

  return (
    <CCardBody>
      <CRow className="align-items-center">
        <CButton
          variant="ghost"
          color={SystemState ? "primary" : "danger"}
          onClick={() => flipState()}
        >
          <CIcon name={SystemState ? "cil-media-stop" : "cil-media-play"} />
          {SystemState ? "On" : "Off"}
        </CButton>
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
