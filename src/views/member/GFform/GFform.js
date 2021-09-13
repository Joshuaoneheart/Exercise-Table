import React, { useState } from "react";
import {
  CButton,
  CCol,
  CCardHeader,
  CRow,
  CCard,
  CCardBody,
  CCardFooter,
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

const AddModal = (props) => {
  if (props.show == null) {
    return null;
  }
  var form = React.createRef();
  var writeData = () => {
    var data = props.data;
    var tmp = {};
    tmp["name"] = form.current.elements.name.value;
    tmp["note"] = form.current.elements.note.value;
    data.push(tmp);
    props.setData(data);
    props.setModal(null);
  };
  return (
    <CModal
      show={props.show !== null}
      onClose={() => {
        props.setModal(null);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>新增牧養對象</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          innerRef={form}
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
        >
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>姓名</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CInput name="name" required />
            </CCol>
          </CFormGroup>
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>備註</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CInput name="note" required />
            </CCol>
          </CFormGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={writeData}>
          新增
        </CButton>{" "}
        <CButton
          color="secondary"
          onClick={() => {
            props.setModal(null);
          }}
        >
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

const demo_GFs = [{ name: "GospelFriend1", note: "台北人 台大 資工系" }];

const GFForm = () => {
  const titles = ["家聚會", "小排", "主日聚會"];
  let default_selected = [];
  for (var i in titles) default_selected.push([]);
  var [selected, set_selected] = useState(default_selected);
  const [addModal, setAddModal] = useState(null);
  const [GFs, setGFs] = useState(demo_GFs);
  var inputs = [];
  console.log(selected);
  for (i in titles) {
    var selected_options = [];
    var GF_options = [];
    for (var j in GFs) {
      if (selected[i].includes(parseInt(j))) {
        GF_options.push({
          value: GFs[j].name,
          label: (
            <span style={{ whiteSpace: "pre" }}>
              <b>{GFs[j].name}</b>
            </span>
          ),
          id: j,
        });
        selected_options.push({
          value: GFs[j].name,
          label: (
            <span style={{ whiteSpace: "pre" }}>
              <b>{GFs[j].name}</b>
            </span>
          ),
          id: j,
        });
      } else
        GF_options.push({
          value: GFs[j].name,
          label: (
            <span style={{ whiteSpace: "pre" }}>
              <b>{GFs[j].name}</b> <span>{"      " + GFs[j].note}</span>
            </span>
          ),
          id: j,
        });
    }
    inputs.push(
      <CFormGroup>
        <CLabel>{titles[i]}</CLabel>
        <Select
          value={selected_options}
          isMulti
          autoFocus
          options={GF_options}
          onChange={function (set_selected, selected, i, value) {
            var tmp = [];
            for (let v of value) {
              tmp.push(parseInt(v.id));
            }
            selected[i] = tmp;
            set_selected(Array.from(selected));
          }.bind(null, set_selected, selected, i)}
        />
      </CFormGroup>
    );
  }
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <CRow className="align-items-center">
              <CCol style={{ fontSize: "30px" }}>牧養對象邀約</CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CForm>{inputs}</CForm>
            <AddModal
              data={GFs}
              setData={setGFs}
              show={addModal}
              setModal={setAddModal}
            />
          </CCardBody>
          <CCardFooter>
            <CButton
              variant="ghost"
              color="primary"
              onClick={function (setAddModal) {
                setAddModal(true);
              }.bind(null, setAddModal)}
            >
              新增牧養對象
            </CButton>
            <CButton variant="ghost" color="dark">
              提交表單
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default GFForm;
