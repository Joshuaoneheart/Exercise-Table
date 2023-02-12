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
    CSelect
} from "@coreui/react";
import { useRef, useState } from "react";
/*
format of show
{
  title: title of modal
  type: section/problem,
  index: index of section
}
*/
const AddModal = ({ show, data, setData, sections, setSections, setModal }) => {
  var [type, setType] = useState("MultiChoice");
  var form = useRef();
  if (show == null) {
    return null;
  }
  var writeData = () => {
    var new_data = data;
    switch (show.type) {
      case "problem":
        var tmp = {};
        tmp["title"] = form.current.elements.title.value;
        tmp["type"] = form.current.elements.type.value;
        tmp["score"] = form.current.elements.score.value;
        if (tmp["type"] !== "MultiAnswer")
          tmp["選項"] = form.current.elements.option.value;
        if (tmp["type"] !== "MultiChoice")
          tmp["子選項"] = form.current.elements.suboption.value;
        tmp["section"] = sections[show.index];
        tmp["id"] = "new";
        new_data.value.push(tmp);
        break;
      case "section":
        sections.push(form.current.elements.name.value);
        setSections(sections);
        break;
      default:
        break;
    }
    setData(new_data);
    setModal(null);
    setType("MultiChoice");
  };
  return (
    <CModal
      show={show !== null}
      onClose={() => {
        setModal(null);
        setType("MultiChoice");
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
          {show.type === "problem" && (
            <>
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>標題</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="title" required />
                </CCol>
              </CFormGroup>
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>類型</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect
                    onChange={function (type, setType, event) {
                      if (type !== event.target.value)
                        setType(event.target.value);
                    }.bind(null, type, setType)}
                    name="type"
                    defaultValue="MultiChoice"
                  >
                    <option value="MultiChoice">單選題</option>
                    <option value="MultiAnswer">多選題</option>
                    <option value="Grid">單選網格題</option>
                  </CSelect>
                </CCol>
              </CFormGroup>
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>分數</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="score" required />
                </CCol>
              </CFormGroup>
              {type !== "MultiAnswer" && (
                <CFormGroup row inline>
                  <CCol md="3">
                    <CLabel>選項</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput name="option" required />
                  </CCol>
                </CFormGroup>
              )}
              {type !== "MultiChoice" && (
                <CFormGroup row inline>
                  <CCol md="3">
                    <CLabel>子選項</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput name="suboption" required />
                  </CCol>
                </CFormGroup>
              )}
            </>
          )}
          {show.type === "section" && (
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>區塊名稱</CLabel>
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
            setType("MultiChoice");
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
  data,
  group_members,
  groups,
  setModal,
  setData,
  setGroups,
}) => {
  if (show === null) return null;
  var deleteData = () => {
    switch (show.type) {
      case "problem":
        data.value[show.index].old_id = `${data.value[show.index].id}`;
        data.value[show.index].id = "deleted";
        setData(data);
        break;
      case "group":
        if (group_members[show.index].length !== 0) {
          alert("區塊內尚有問題，請將所有問題刪除後再刪除區塊");
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

const ModifyModal = ({ show, data, setData, setModal }) => {
  var form = useRef();
  let [type, setType] = useState("MultiChoice");
  if (show === null) return null;
  var writeData = () => {
    var tmp = {};
    tmp["title"] = form.current.elements.title.value;
    tmp["type"] = form.current.elements.type.value;
    tmp["score"] = form.current.elements.score.value;
    if (tmp["type"] !== "MultiAnswer")
      tmp["選項"] = form.current.elements.option.value;
    if (tmp["type"] !== "MultiChoice")
      tmp["子選項"] = form.current.elements.suboption.value;
    data.value[show] = tmp;
    setData(data);
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
                <CLabel>標題</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="title" defaultValue={data.value[show]["title"]} />
              </CCol>
            </CFormGroup>
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>類型</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CSelect
                  onChange={function (type, setType, event) {
                    if (type !== event.target.value)
                      setType(event.target.value);
                  }.bind(null, type, setType)}
                  name="type"
                  defaultValue={data["type"]}
                >
                  <option value="MultiChoice">單選題</option>
                  <option value="MultiAnswer">多選題</option>
                  <option value="Grid">單選網格題</option>
                </CSelect>
              </CCol>
            </CFormGroup>
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>分數</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="score" defaultValue={data.value[show]["score"]} />
              </CCol>
            </CFormGroup>
            {type !== "MultiAnswer" && (
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>選項</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput
                    name="option"
                    defaultValue={data.value[show]["選項"]}
                  />
                </CCol>
              </CFormGroup>
            )}
            {type !== "MultiChoice" && (
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>子選項</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput
                    name="suboption"
                    defaultValue={data.value[show]["子選項"]}
                  />
                </CCol>
              </CFormGroup>
            )}
          </CForm>
        )}
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
export { AddModal, DeleteModal, ModifyModal };
