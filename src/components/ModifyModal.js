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
  CSelect,
} from "@coreui/react";
import { useRef } from "react";

/* format of show
  {
    title: title of the modal,
    type: resident or group,
    index: index of group while resident type
  }
  format of page
  string(group or residence)
*/
const AddModal = ({ show, page, groups, names, setModal, setGroups }) => {
  var form = useRef();
  if (show == null) return null;
  var writeData = () => {
    switch (show.type) {
      case "resident":
        // add a new resident
        groups
          .getAccount(0, form.current.elements.name.value)
          .update(page, groups.ids[show.index]);
        groups.groupBy(page);
        setGroups(groups.clone());
        break;
      case "group":
        // add a new group
        groups.addGroup(form.current.elements.name.value);
        setGroups(groups.clone());
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
            </>
          )}
          {show.type === "group" && (
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>{page === "group" ? "活力組" : "住處"}名稱</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput
                  name="name"
                  required
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      writeData();
                    }
                  }}
                />
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

/* format of show
  {
    title: title of the modal,
    type: resident/group,
    name: identity,
    index: index in data(for resident type) or groups(for group type)
  }
  format of page
  string(group or residence)
*/
const DeleteModal = ({
  show,
  page,
  group_members,
  groups,
  setModal,
  setGroups,
}) => {
  if (show === null) return null;
  var deleteData = () => {
    switch (show.type) {
      case "resident":
        groups.getAccount(show.index[0], show.index[1]).update(page, undefined);
        groups.groupBy(page);
        setGroups(groups.clone());
        break;
      case "group":
        if (group_members[show.index].length !== 0) {
          if (page === "group") {
            alert("活力組內尚有住戶，請將所有住戶刪除後再刪除活力組");
          }
          if (page === "residence")
            alert("住處內尚有住戶，請將所有住戶刪除後再刪除住處");
          break;
        }
        groups.deleteGroup(show.id);
        setGroups(groups.clone());
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
        確認刪除{show.title} {groups.names[groups.indexOf(show.id)]} 嗎？
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

const TransferModal = ({ show, page, groups, setModal, setGroups }) => {
  var form = useRef();
  if (show == null) return null;
  var writeData = () => {
    groups
      .getAccount(show.index[0], show.index[1])
      .update(page, form.current.elements.group.value);
    groups.groupBy(page);
    setGroups(groups.clone());
    setModal(null);
  };
  var groups_option = [];
  for (let i = 1; i < groups.names.length; i++) {
    if (i !== show.group)
      groups_option.push(
        <option value={groups.ids[i]} key={i}>
          {groups.names[i]}
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
        <CModalTitle>修改住處</CModalTitle>
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
              <CLabel>移動至</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CSelect name="group">{groups_option}</CSelect>
            </CCol>
          </CFormGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={writeData}>
          儲存修改
        </CButton>{" "}
        <CButton color="secondary" onClick={() => setModal(null)}>
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};
export { AddModal, DeleteModal, TransferModal };
