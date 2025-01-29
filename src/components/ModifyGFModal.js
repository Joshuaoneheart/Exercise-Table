import { useContext, useState } from "react";
import { firebase } from "db/firebase";
import {
  GF_SCHOOL,
  GF_NTUST_DEPARTMENT,
  GF_NTU_DEPARTMENT,
  GF_GRADE,
  GF_TYPE,
} from "const/GF";
import Modal from "./Modal";
import Select from "./Select";
import Input from "./Input";
import Row from "./Row";
import Col from "./Col";
import { AccountContext } from "hooks/context";
const ModifyGFModal = ({ data, show, setData, setModal }) => {
  const account = useContext(AccountContext);
  const [name, setName] = useState(data.name);
  const [school, setSchool] = useState(data.school);
  const [department, setDepartment] = useState(data.department);
  const [grade, setGrade] = useState(data.grade);
  const [gender, setGender] = useState(data.gender);
  const [note, setNote] = useState(data.note);
  const [type, setType] = useState(data.type);
  if (!show) {
    return null;
  }
  var writeData = async () => {
    let cur_data = data;
    let tmp = {};
    tmp["name"] = name;
    tmp["school"] = school;
    tmp["department"] = department;
    tmp["grade"] = grade;
    tmp["gender"] = gender;
    tmp["type"] = type;
    tmp["note"] = note;
    await firebase.firestore().collection("GF").doc(data.__id).update(tmp);
    Object.assign(cur_data, tmp);
    setData(cur_data);
    setModal(false);
  };
  let schools = GF_SCHOOL.map((x) => {
    return { key: x, label: x };
  });
  let departments;
  if (school === "台大") {
    departments = GF_NTU_DEPARTMENT.map((x) => {
      return {
        key: x,
        label: x,
      };
    });
  } else if (school === "台科大")
    departments = GF_NTUST_DEPARTMENT.map((x) => {
      return {
        key: x,
        label: x,
      };
    });
  let grades = GF_GRADE.map((x) => {
    return { key: x, label: x };
  });
  let types = GF_TYPE.map((x) => {
    return { key: x, label: x };
  });
  return (
    <Modal show={show} setShow={setModal} title="編輯牧養對象">
      <Row style={{ marginBottom: "16px" }}>
        <Col>
          <span style={{ marginBottom: "4px" }}>姓名</span>
          <Input
            onChange={(v) => setName(v)}
            defaultValue={data.name}
            style={{ border: "1px solid var(--n-200)" }}
          />
        </Col>
        <Col style={{ marginLeft: "12px" }}>
          <span style={{ marginBottom: "4px" }}>學校</span>
          <Select
            style={{ border: "1px solid var(--n-200)" }}
            menu_style={{ border: "1px solid var(--n-200)" }}
            options={schools}
            value={school}
            onChange={(v) => {
              setSchool(v);
              if (v === "台大") setDepartment(GF_NTU_DEPARTMENT[0]);
              else if (v.value === "台科大")
                setDepartment(GF_NTUST_DEPARTMENT[0]);
            }}
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: "16px" }}>
        <Col>
          <span style={{ marginBottom: "4px" }}>科系</span>
          <Select
            value={department}
            style={{ border: "1px solid var(--n-200)" }}
            menu_style={{ border: "1px solid var(--n-200)" }}
            isSearchable
            options={departments}
            onChange={(v) => {
              setDepartment(v);
            }}
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: "16px" }}>
        <Col>
          <span style={{ marginBottom: "4px" }}>年級</span>
          <Select
            value={grade}
            style={{ border: "1px solid var(--n-200)" }}
            menu_style={{ border: "1px solid var(--n-200)" }}
            isSearchable
            options={grades}
            onChange={(v) => {
              setGrade(v);
            }}
          />
        </Col>
        <Col style={{ marginLeft: "12px" }}>
          <span style={{ marginBottom: "4px" }}>身份</span>
          <Select
            value={type}
            style={{ border: "1px solid var(--n-200)" }}
            menu_style={{ border: "1px solid var(--n-200)" }}
            options={types}
            onChange={(v) => {
              setType(v);
            }}
          />
        </Col>
      </Row>
      {account.role === "Admin" && (
        <Row style={{ marginBottom: "16px" }}>
          <Col>
            <span style={{ marginBottom: "4px" }}>性別</span>
            <Select
              value={gender}
              style={{ border: "1px solid var(--n-200)" }}
              menu_style={{ border: "1px solid var(--n-200)" }}
              isSearchable
              options={[
                {
                  label: "男",
                  key: "男",
                },
                {
                  label: "女",
                  key: "女",
                },
              ]}
              onChange={(v) => {
                setGender(v);
              }}
            />
          </Col>
        </Row>
      )}
      <Row style={{ marginBottom: "16px" }}>
        <Col>
          <span style={{ marginBottom: "4px" }}>備註</span>
          <Input
            onChange={(v) => setNote(v)}
            style={{ border: "1px solid var(--n-200)" }}
          />
        </Col>
      </Row>
      <Row
        style={{
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <button
          style={{
            backgroundColor: "var(--white)",
            borderColor: "var(--p-300)",
            color: "var(--dark-blue)",
            borderWidth: "1.5px",
            borderStyle: "solid",
          }}
          className="modal-button primary-medium"
          onClick={() => {
            setModal(false);
          }}
        >
          取消
        </button>
        <button
          style={{
            marginLeft: "8px",
            color: "var(--white)",
            backgroundColor: "var(--dark-blue)",
          }}
          className="modal-button primary-medium"
          onClick={writeData}
        >
          修改
        </button>
      </Row>
    </Modal>
  );
};

export default ModifyGFModal;
