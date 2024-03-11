import {
  CButton,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import Select from "react-select";
import { useRef, useState } from "react";
import { firebase } from "db/firebase";
import {
  GF_SCHOOL,
  GF_NTUST_DEPARTMENT,
  GF_NTU_DEPARTMENT,
  GF_GRADE,
  GF_TYPE,
} from "const/GF";
const ModifyGFModal = ({ data, show, setData, setModal }) => {
  var form = useRef();
  var [school, setSchool] = useState({
    value: data.school,
    label: <span style={{ whiteSpace: "pre" }}>{data.school}</span>,
  });
  var [department, setDepartment] = useState({
    value: data.department,
    label: <span style={{ whiteSpace: "pre" }}>{data.department}</span>,
  });
  var [grade, setGrade] = useState({
    value: data.grade,
    label: <span style={{ whiteSpace: "pre" }}>{data.grade}</span>,
  });
  const [type, setType] = useState({
    value: data.type,
    label: <span style={{ whiteSpace: "pre" }}>{data.type}</span>,
  });
  if (!show) {
    return null;
  }
  var writeData = async () => {
    let cur_data = data;
    let tmp = {};
    tmp["name"] = form.current.elements.name.value;
    tmp["school"] = school.value;
    tmp["department"] = department.value;
    tmp["grade"] = grade.value;
    tmp["type"] = type.value;
    tmp["note"] = form.current.elements.note.value;
    await firebase.firestore().collection("GF").doc(data.__id).update(tmp);
    Object.assign(cur_data, tmp);
    setData(cur_data);
    setModal(false);
  };
  let schools = GF_SCHOOL.map((x) => {
    return { value: x, label: <span style={{ whiteSpace: "pre" }}>{x}</span> };
  });
  let departments;
  if (school.value === "台大") {
    departments = GF_NTU_DEPARTMENT.map((x) => {
      return {
        value: x,
        label: <span style={{ whiteSpace: "pre" }}>{x}</span>,
      };
    });
  } else if (school.value === "台科大")
    departments = GF_NTUST_DEPARTMENT.map((x) => {
      return {
        value: x,
        label: <span style={{ whiteSpace: "pre" }}>{x}</span>,
      };
    });
  let grades = GF_GRADE.map((x) => {
    return { value: x, label: <span style={{ whiteSpace: "pre" }}>{x}</span> };
  });
  let types = GF_TYPE.map((x) => {
    return { value: x, label: <span style={{ whiteSpace: "pre" }}>{x}</span> };
  });
  return (
    <CModal
      show={show}
      onClose={() => {
        setModal(false);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>編輯</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          innerRef={form}
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>姓名</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CInput name="name" defaultValue={data.name} required />
            </CCol>
          </CFormGroup>
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>學校</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <Select
                value={school}
                isSearchable
                options={schools}
                onChange={(v) => {
                  setSchool(v);
                  if (v.value === "台大")
                    setDepartment({
                      value: GF_NTU_DEPARTMENT[0],
                      label: (
                        <span style={{ whiteSpace: "pre" }}>
                          {GF_NTU_DEPARTMENT[0]}
                        </span>
                      ),
                    });
                  else if (v.value === "台科大")
                    setDepartment({
                      value: GF_NTUST_DEPARTMENT[0],
                      label: (
                        <span style={{ whiteSpace: "pre" }}>
                          {GF_NTUST_DEPARTMENT[0]}
                        </span>
                      ),
                    });
                }}
              />
            </CCol>
          </CFormGroup>
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>科系</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <Select
                value={department}
                isSearchable
                options={departments}
                onChange={(v) => {
                  setDepartment(v);
                }}
              />
            </CCol>
          </CFormGroup>
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>年級</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <Select
                value={grade}
                isSearchable
                options={grades}
                onChange={(v) => {
                  setGrade(v);
                }}
              />
            </CCol>
          </CFormGroup>
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>身份</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <Select
                value={type}
                isSearchable
                options={types}
                onChange={(v) => {
                  setType(v);
                }}
              />
            </CCol>
          </CFormGroup>
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>備註</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CInput name="note" defaultValue={data.note} required />
            </CCol>
          </CFormGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={writeData}>
          修改
        </CButton>
        <CButton
          color="secondary"
          onClick={() => {
            setModal(false);
          }}
        >
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ModifyGFModal;
