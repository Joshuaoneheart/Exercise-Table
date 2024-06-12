import {
  CButton,
  CCol,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import { firebase } from "db/firebase";
import { useState } from "react";
import { message } from "antd";

const AddFormModal = ({ show, setModal }) => {
  const [name, setName] = useState("");
  if (!show) {
    return null;
  }
  var writeData = async () => {
    await firebase
      .firestore()
      .collection("forms")
      .add({ name, problems: [] })
      .then(() => {
        message.success("新增完成");
      })
      .catch((error) => {
        message.error(error.message);
      });
    setModal(false);
  };
  return (
    <CModal
      show={show}
      size="lg"
      onClose={() => {
        setModal(false);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>新增表單</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol md="3">
            <CLabel>名稱</CLabel>
          </CCol>
          <CCol xs="12" md="9">
            <CInput
              name="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={writeData}>
          新增
        </CButton>{" "}
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

export default AddFormModal;
