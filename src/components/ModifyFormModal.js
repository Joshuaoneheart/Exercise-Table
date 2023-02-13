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

const ProblemFormatChecking = (problem) => {

  const is_numeric = (s) => {
    return !isNaN(s - parseFloat(s));
  };

  const is_unique = (value, index, array) => {
    return array.indexOf(value) === index;
  };
  let options = problem["選項"];
  let scores = problem["score"];
  let suboptions = problem["子選項"];
  if(options) options = options.split(";");
  if(scores) scores = scores.split(";");
  if(suboptions) suboptions = suboptions.split(";");

  switch (problem.type) {
    case "MultiChoice":
    case "Grid":
      // 分數與選項數量需匹配（以分號隔開）
      if (options.length !== scores.length) {
        alert("分數與選項數量需相同");
        return false;
      }

      // 分數以分號區隔後須為數字
      if (!scores.every(is_numeric)) {
        alert("分數以分號區隔後須為數字");
        return false;
      }

      // 子選項不可同名
      if (suboptions) {
        if (!suboptions.every(is_unique)) {
          alert("子選項不可同名");
          return false;
        }
      }

      break;
    case "MultiAnswer":
      // 複選分數為單一數字
      if (!is_numeric(problem["score"])) {
        alert("分數須為單一數字");
        return false;
      }

      // 子選項不可同名
      if (!suboptions.every(is_unique)) {
        alert("子選項不可同名");
        return false;
      }
      break;
  }
  return true;
};

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
        if(!ProblemFormatChecking(tmp)) return;
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
  // format of type: [type name, 0 indicates the first open of modal, 1 is otherwise]
  let [type, setType] = useState(["MultiChoice", 0]);
  if (show === null) return null;
  if(type[1] === 0) type = [data.value[show].type, 1];
  console.log(type);
  var writeData = () => {
    var tmp = {};
    tmp["title"] = form.current.elements.title.value;
    tmp["type"] = form.current.elements.type.value;
    tmp["score"] = form.current.elements.score.value;
    if (tmp["type"] !== "MultiAnswer")
      tmp["選項"] = form.current.elements.option.value;
    if (tmp["type"] !== "MultiChoice")
      tmp["子選項"] = form.current.elements.suboption.value;
    tmp["id"] = data.value[show].id;
    tmp["section"] = data.value[show].section;
    if(!ProblemFormatChecking(tmp)) return;
    data.value[show] = tmp;
    setData(data);
    setType(["MultiChoice", 0]);
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
                      setType([event.target.value, 1]);
                  }.bind(null, type, setType)}
                  name="type"
                  defaultValue={data.value[show]["type"]}
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
            {type[0] !== "MultiAnswer" && (
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
            {type[0] !== "MultiChoice" && (
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
