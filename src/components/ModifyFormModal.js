import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCol,
  CRow,
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
import { useEffect, useRef, useState } from "react";

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
  if (options) options = options.split(";");
  if (scores) scores = scores.split(";");
  if (suboptions) suboptions = suboptions.split(";");

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
        alert("分數須皆為數字");
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
    default:
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
  var [optionCnt, setOptionCnt] = useState(1);
  var [suboptionCnt, setSuboptionCnt] = useState(1);
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
        tmp["score"] = "";
        if (tmp["type"] !== "MultiAnswer") tmp["選項"] = "";
        for (let i = 0; i < optionCnt; i++) {
          tmp["score"] += form.current.elements["score" + i].value;
          if (i !== optionCnt - 1) tmp["score"] += ";";
          if (tmp["type"] !== "MultiAnswer") {
            tmp["選項"] += form.current.elements["option" + i].value;
            if (i !== optionCnt - 1) tmp["選項"] += ";";
          }
        }
        if (tmp["type"] !== "MultiChoice") {
          tmp["子選項"] = "";
          for (let i = 0; i < suboptionCnt; i++) {
            tmp["子選項"] += form.current.elements["suboption" + i].value;
            if (i !== suboptionCnt - 1) tmp["子選項"] += ";";
          }
        }
        tmp["section"] = sections[show.index];
        tmp["id"] = "new";
        if (!ProblemFormatChecking(tmp)) return;
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
  let scores = [];
  let options = [];
  for (let i = 0; i < optionCnt; i++) {
    scores.push(
      <CCol
        xs={type !== "MultiAnswer" ? "4" : "12"}
        md={type !== "MultiAnswer" ? "4" : "12"}
        style={{ paddingBottom: "2vh" }}
      >
        <CInput name={"score" + i} required />
      </CCol>
    );
    options.push(
      <CCol xs="4" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput name={"option" + i} required />
      </CCol>
    );
  }
  let suboptions = [];
  for (let i = 0; i < suboptionCnt; i++) {
    suboptions.push(
      <CCol xs="4" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput name={"suboption" + i} required />
      </CCol>
    );
  }
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
                      if (type !== event.target.value) {
                        setOptionCnt(1);
                        setSuboptionCnt(1);
                        setType(event.target.value);
                      }
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
              <CRow>
                <CCol>
                  <CFormGroup row inline>
                    <CCol md="3">
                      <CLabel>分數</CLabel>
                    </CCol>
                    <CCol
                      md={type !== "MultiAnswer" ? "7" : "9"}
                      xs={type !== "MultiAnswer" ? "7" : "9"}
                      style={{
                        marginLeft: type !== "MultiAnswer" ? "1vw" : "0",
                      }}
                    >
                      <CRow>{scores}</CRow>
                    </CCol>
                  </CFormGroup>
                  {type !== "MultiAnswer" && (
                    <CFormGroup row inline>
                      <CCol md="3">
                        <CLabel>選項</CLabel>
                      </CCol>
                      <CCol md="7" xs="7" style={{ marginLeft: "1vw" }}>
                        <CRow>{options}</CRow>
                      </CCol>
                    </CFormGroup>
                  )}
                </CCol>
                {type !== "MultiAnswer" && (
                  <div style={{ width: "4vw" }}>
                    <CButton
                      variant="ghost"
                      color="dark"
                      onClick={() => {
                        if (optionCnt === 5) return;
                        setOptionCnt(optionCnt + 1);
                      }}
                    >
                      <CIcon alt="新增分數、選項" name="cil-plus" />
                    </CButton>
                    <CButton
                      variant="ghost"
                      color="danger"
                      onClick={() => {
                        if (optionCnt === 1) return;
                        setOptionCnt(optionCnt - 1);
                      }}
                    >
                      <CIcon alt="刪除分數、選項" name="cil-minus" />
                    </CButton>
                  </div>
                )}
              </CRow>
              {type !== "MultiChoice" && (
                <CRow>
                  <CCol>
                    <CFormGroup row inline>
                      <CCol md="3">
                        <CLabel>子選項</CLabel>
                      </CCol>
                      <CCol md="7" xs="7" style={{ marginLeft: "1vw" }}>
                        <CRow>{suboptions}</CRow>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <div style={{ width: "4vw" }}>
                    <CButton
                      variant="ghost"
                      color="dark"
                      onClick={() => {
                        setSuboptionCnt(suboptionCnt + 1);
                      }}
                    >
                      <CIcon alt="新增分數、選項" name="cil-plus" />
                    </CButton>
                    <CButton
                      variant="ghost"
                      color="danger"
                      onClick={() => {
                        if (suboptionCnt === 1) return;
                        setSuboptionCnt(suboptionCnt - 1);
                      }}
                    >
                      <CIcon alt="刪除分數、選項" name="cil-minus" />
                    </CButton>
                  </div>
                </CRow>
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
  console.log(show);
  var [optionCnt, setOptionCnt] = useState(0);
  var [suboptionCnt, setSuboptionCnt] = useState(0);
  // format of type: [type name, 0 indicates the first open of modal, 1 is otherwise]
  let [type, setType] = useState("MultiChoice");
  var writeData = () => {
    var tmp = {};
    tmp["title"] = form.current.elements.title.value;
    tmp["type"] = form.current.elements.type.value;
    tmp["score"] = "";
    if (tmp["type"] !== "MultiAnswer") tmp["選項"] = "";
    for (let i = 0; i < optionCnt; i++) {
      tmp["score"] += form.current.elements["score" + i].value;
      if (i !== optionCnt - 1) tmp["score"] += ";";
      if (tmp["type"] !== "MultiAnswer") {
        tmp["選項"] += form.current.elements["option" + i].value;
        if (i !== optionCnt - 1) tmp["選項"] += ";";
      }
    }
    if (tmp["type"] !== "MultiChoice") {
      tmp["子選項"] = "";
      for (let i = 0; i < suboptionCnt; i++) {
        tmp["子選項"] += form.current.elements["suboption" + i].value;
        if (i !== suboptionCnt - 1) tmp["子選項"] += ";";
      }
    }
    tmp["id"] = data.value[show].id;
    tmp["section"] = data.value[show].section;
    if (!ProblemFormatChecking(tmp)) return;
    data.value[show] = tmp;
    setData(data);
    setType("MultiChoice");
    setModal(null);
  };

  useEffect(() => {
    if (show) {
      setType(data.value[show].type);
      setOptionCnt(
        "選項" in data.value[show]
          ? data.value[show]["選項"].split(";").length
          : 0
      );
      setSuboptionCnt(
        "子選項" in data.value[show]
          ? data.value[show]["子選項"].split(";").length
          : 0
      );
    }
  }, [show, data.value]);
  if (show === null) return null;
  let scores = [];
  let options = [];
  for (let i = 0; i < optionCnt; i++) {
    scores.push(
      <CCol
        xs={type !== "MultiAnswer" ? "4" : "12"}
        md={type !== "MultiAnswer" ? "4" : "12"}
        style={{ paddingBottom: "2vh" }}
      >
        <CInput
          defaultValue={
            type === data.value[show].type
              ? data.value[show]["score"].split(";")[i]
              : ""
          }
          name={"score" + i}
          required
        />
      </CCol>
    );
    options.push(
      <CCol xs="4" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput
          defaultValue={
            type === data.value[show].type
              ? data.value[show]["選項"].split(";")[i]
              : ""
          }
          name={"option" + i}
          required
        />
      </CCol>
    );
  }
  let suboptions = [];
  for (let i = 0; i < suboptionCnt; i++) {
    suboptions.push(
      <CCol xs="4" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput
          defaultValue={
            type === data.value[show].type
              ? data.value[show]["子選項"].split(";")[i]
              : ""
          }
          name={"suboption" + i}
          required
        />
      </CCol>
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
                    if (type !== event.target.value) {
                      setOptionCnt(1);
                      setSuboptionCnt(1);
                      setType(event.target.value);
                    }
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
            <CRow>
              <CCol>
                <CFormGroup row inline>
                  <CCol md="3">
                    <CLabel>分數</CLabel>
                  </CCol>
                  <CCol
                    md={type !== "MultiAnswer" ? "7" : "9"}
                    xs={type !== "MultiAnswer" ? "7" : "9"}
                    style={{
                      marginLeft: type !== "MultiAnswer" ? "1vw" : "0",
                    }}
                  >
                    <CRow>{scores}</CRow>
                  </CCol>
                </CFormGroup>
                {type !== "MultiAnswer" && (
                  <CFormGroup row inline>
                    <CCol md="3">
                      <CLabel>選項</CLabel>
                    </CCol>
                    <CCol
                      md="7"
                      xs="7"
                      style={{
                        marginLeft: type !== "MultiAnswer" ? "1vw" : "0",
                      }}
                    >
                      <CRow>{options}</CRow>
                    </CCol>
                  </CFormGroup>
                )}
              </CCol>
              {type !== "MultiAnswer" && (
                <div style={{ width: "4vw" }}>
                  <CButton
                    variant="ghost"
                    color="dark"
                    onClick={() => {
                      if (optionCnt === 5) return;
                      setOptionCnt(optionCnt + 1);
                    }}
                  >
                    <CIcon alt="新增分數、選項" name="cil-plus" />
                  </CButton>
                  <CButton
                    variant="ghost"
                    color="danger"
                    onClick={() => {
                      if (optionCnt === 1) return;
                      setOptionCnt(optionCnt - 1);
                    }}
                  >
                    <CIcon alt="刪除分數、選項" name="cil-minus" />
                  </CButton>
                </div>
              )}
            </CRow>
            {type !== "MultiChoice" && (
              <CRow>
                <CCol>
                  <CFormGroup row inline>
                    <CCol md="3">
                      <CLabel>子選項</CLabel>
                    </CCol>
                    <CCol md="7" xs="7" style={{ marginLeft: "1vw" }}>
                      <CRow>{suboptions}</CRow>
                    </CCol>
                  </CFormGroup>
                </CCol>
                <div style={{ width: "4vw" }}>
                  <CButton
                    variant="ghost"
                    color="dark"
                    onClick={() => {
                      setSuboptionCnt(suboptionCnt + 1);
                    }}
                  >
                    <CIcon alt="新增分數、選項" name="cil-plus" />
                  </CButton>
                  <CButton
                    variant="ghost"
                    color="danger"
                    onClick={() => {
                      if (suboptionCnt === 1) return;
                      setSuboptionCnt(suboptionCnt - 1);
                    }}
                  >
                    <CIcon alt="刪除分數、選項" name="cil-minus" />
                  </CButton>
                </div>
              </CRow>
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
