import {
    CButton, CCol, CForm,
    CFormGroup,
    CInput,
    CLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CSelect
} from "@coreui/react";
import { useRef } from "react";

const AddModal = ({
  show,
  data,
  groups,
  names,
  setModal,
  setData,
  setGroups,
}) => {
  var form = useRef();
  if (show == null) return null;
  var writeData = () => {
    switch (show.type) {
      case "resident":
        // add a new resident
        var new_data = data;
        new_data.value[form.current.elements.name.value].group =
          groups[form.current.elements.group.value];
        new_data.value[form.current.elements.name.value].isChanged = true;
        setData(new_data);
        break;
      case "group":
        // add a new group
        groups.push(form.current.elements.name.value);
        setGroups(groups);
        break;
      default:
        break;
    }
    setModal(null);
  };
  var options = [];
  for (var i in groups) {
    options.push(
      <option value={i} key={i}>
        {groups[i]}
      </option>
    );
  }
  return (
    <CModal
      show={show !== null}
      onClose={() => {
        setModal(null);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>新增{show.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          innerRef={form}
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
        >
          {show.type === "resident" && (
            <>
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>姓名</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect name="name">{names}</CSelect>
                </CCol>
              </CFormGroup>
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>活力組</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect name="group">{options}</CSelect>
                </CCol>
              </CFormGroup>
            </>
          )}
          {show.type === "group" && (
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>活力組名稱</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="name" required />
              </CCol>
            </CFormGroup>
          )}
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

const DeleteModal = ({show, data, group_members, groups, setModal, setData, setGroups}) => {
  if (show === null) return null;
  var deleteData = () => {
    switch (show.type) {
      case "resident":
        delete data.value[show.index].group;
        data.value[show.index].isChanged = true;
        setData(data);
        break;
      case "group":
        if (group_members[show.index].length !== 0) {
          alert("活力組內尚有住戶，請將所有住戶刪除後再刪除活力組");
          break;
        }
        groups.splice(show.index, 1);
        setGroups(groups);
        break;
      default:
        break;
    }
    setModal(null);
  };
  return (
    <CModal
      show={show !== null}
      onClose={() => {
        setModal(null);
      }}
      color="danger"
    >
      <CModalHeader closeButton>
        <CModalTitle>刪除{show.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        確認刪除{show.title} {show.name} 嗎？
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={deleteData}>
          確認
        </CButton>{" "}
        <CButton color="secondary" onClick={() => setModal(null)}>
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

const TransferModal = (props) => {
  var data = props.data;
  var form = useRef();
  if (props.show == null) return null;
  var writeData = () => {
    props.data.value[props.show.resident].group =
      props.groups[form.current.elements.group.value];
    props.data.value[props.show.resident].isChanged = true;
    props.setData(props.data);
    props.setModal(null);
  };
  var groups_option = [];
  for (let i = 0; i < props.groups.length; i++) {
    if (i !== props.show.group)
      groups_option.push(
        <option value={i} key={i}>
          {props.groups[i]}
        </option>
      );
  }

  return (
    <CModal
      show={props.show !== null}
      onClose={() => {
        props.setModal(null);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>修改問題</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {data !== null && (
          <CForm
            innerRef={form}
            action=""
            method="post"
            encType="multipart/form-data"
            className="form-horizontal"
          >
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>移動至</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CSelect name="group">{groups_option}</CSelect>
              </CCol>
            </CFormGroup>
          </CForm>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={writeData}>
          儲存修改
        </CButton>{" "}
        <CButton color="secondary" onClick={() => props.setModal(null)}>
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};
export { AddModal, DeleteModal, TransferModal };
