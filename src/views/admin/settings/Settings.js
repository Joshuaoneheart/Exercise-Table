import { React, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

const ModifyCard = () => {
  const [SystemState, setSystemState] = useState(false);
  const flipState = () => setSystemState(!SystemState);

  return (
    <CCardBody>
      <CRow className="align-items-center">
        <CButton
          color={SystemState ? "success" : "danger"}
          onClick={() => flipState()}
        >
          {SystemState ? "開啓" : "關閉"}
        </CButton>
      </CRow>
      <CRow className="align-items-center">
        <CCol>
          <CDropdown>
            <CDropdownToggle caret color="info">
              <CIcon name="cil-cloud-download" /> 下載數據
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem> 上周 </CDropdownItem>
              <CDropdownItem> 9/10-17 </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CCol>
      </CRow>
    </CCardBody>
  );
};

const Settings = () => {
  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">接受表單回應</CRow>
        </CCardHeader>
        <ModifyCard />
      </CCard>
    </>
  );
};

export default Settings;
