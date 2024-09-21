import { React, useContext, useEffect, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CInput,
  CRow,
} from "@coreui/react";

import "firebase/firestore";
import { DB } from "db/firebase";
import CustomDatePicker from "components/CustomDatePicker";
import Select from "react-select";
import SemesterContext from "hooks/semester";
import { GetLastSemester } from "utils/semester";
import { message } from "antd";

const SemesterSetting = () => {
  const { semester, semesters, setSemester } = useContext(SemesterContext);
  const [activeSemester, setActiveSemester] = useState(semester);
  let options = [];
  if (semesters) {
    for (let s of semesters) {
      options.push({
        value: s,
        label: <span style={{ whiteSpace: "pre" }}>{s.name}</span>,
      });
    }
  }
  useEffect(() => {
    setActiveSemester(semester);
  }, [semester]);
  if (!activeSemester) return null;
  return (
    <>
      <div style={{ width: "450px" }}>
        <Select
          value={{
            value: activeSemester,
            label: (
              <span style={{ whiteSpace: "pre" }}>{activeSemester.name}</span>
            ),
          }}
          isSearchable
          onChange={(v) => {
            setSemester(v.value);
          }}
          options={options}
        />
      </div>
      <br />
      <CustomDatePicker startTime={GetLastSemester(semesters)?.end.toDate()} />
    </>
  );
};
const Settings = () => {
  const [url, setUrl] = useState("");

  return (
    <>
      <CCard>
        <CCardHeader>
          <CCol>
            <CRow className="align-items-center">學期設定</CRow>
          </CCol>
        </CCardHeader>
        <CCardBody>
          <SemesterSetting />
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>
          <CCol>
            <CRow className="align-items-center">表單圖片連結</CRow>
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CCol>
            <CRow>
              <CInput onChange={(e) => { setUrl(e.target.value) }} placeholder="url" style={{ width: "70%", marginRight: "8px" }} />
              <CButton color="info" onClick={async () => { await DB.updateByUrl("/info/dashboard", { img_url: url }); message.success("儲存成功") }}>確認</CButton>
            </CRow>
          </CCol>
        </CCardBody>
      </CCard>
    </>
  );
};

export default Settings;
