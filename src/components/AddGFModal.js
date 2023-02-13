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
    CModalTitle
} from "@coreui/react";
import { useRef } from "react";

const AddGFModal = ({ data, show, setData, setModal }) => {
  var form = useRef();
  if (show == null) {
    return null;
  }
  var writeData = async () => {
    var cur_data = data;
    var tmp = {};
    tmp["name"] = form.current.elements.name.value;
    tmp["note"] = form.current.elements.note.value;
    cur_data.push(tmp);
    setData(cur_data);
    setModal(null);
  };
  return (
    <CModal
      show={show !== null}
      onClose={() => {
        setModal(null);
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
            setModal(null);
          }}
        >
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AddGFModal;
