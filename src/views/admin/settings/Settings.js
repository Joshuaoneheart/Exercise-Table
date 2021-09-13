import { React, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
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
      <CCol>
        <CRow className="align-items-center">
          <CButton
            color={SystemState ? "success" : "danger"}
            onClick={() => flipState()}
          >
            {SystemState ? "開啓" : "關閉"}
          </CButton>
        </CRow>
      </CCol>
    </CCardBody>
  );
};

const Settings = () => {
  return (
    <>
      <CCard>
        <CCardHeader>
          <CCol>
            <CRow className="align-items-center">接受表單回應</CRow>
          </CCol>
        </CCardHeader>
        <ModifyCard />
      </CCard>
      <CCard>
        <CCardHeader>
          <CCol>
            <CRow className="align-items-center">接受表單回應</CRow>
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CCol>
            <CRow className="align-items-center">
              <CDropdown>
                <CDropdownToggle caret color="info">
                  <CIcon name="cil-cloud-download" /> 下載數據
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem> 上周 </CDropdownItem>
                  <CDropdownItem> 9/10-17 </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CRow>
          </CCol>
        </CCardBody>
      </CCard>
    </>
  );
};

export default Settings;
