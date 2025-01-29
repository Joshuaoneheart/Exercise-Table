import Select from "./Select";
import { useState } from "react";
import { firebase } from "db/firebase";
import {
  GF_SCHOOL,
  GF_NTUST_DEPARTMENT,
  GF_NTU_DEPARTMENT,
  GF_GRADE,
  GF_TYPE,
} from "const/GF";
import Modal from "./Modal";
import Col from "./Col";
import Row from "./Row";
import Input from "./Input";
import { message } from "antd";
const AddGFModal = ({ data, account, show, setData, setModal }) => {
  const [school, setSchool] = useState("台大");
  const [department, setDepartment] = useState(GF_NTU_DEPARTMENT[0]);
  const [grade, setGrade] = useState("大一");
  const [gender, setGender] = useState("男");
  const [type, setType] = useState("福音朋友");
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  var writeData = async () => {
    var cur_data = data;
    var tmp = {};
    if (name === "") {
      message.error("請輸入姓名");
      return;
    }
    tmp["name"] = name;
    tmp["school"] = school;
    tmp["department"] = department;
    tmp["grade"] = grade;
    if (account.role !== "Admin") tmp["gender"] = account.gender;
    else tmp["gender"] = gender;
    tmp["type"] = type;
    tmp["note"] = note;
    let res = await firebase.firestore().collection("GF").add(tmp);
    tmp.id = res.id;
    cur_data.push(tmp);
    setData(cur_data);
    setModal(false);
  };
  let schools = GF_SCHOOL.map((x) => {
    return { label: x, value: x };
  });
  let departments;
  if (school === "台大") {
    departments = GF_NTU_DEPARTMENT.map((x) => {
      return {
        label: x,
        value: x,
      };
    });
  } else if (school === "台科大")
    departments = GF_NTUST_DEPARTMENT.map((x) => {
      return {
        label: x,
        value: x,
      };
    });
  let grades = GF_GRADE.map((x) => {
    return { label: x, value: x };
  });
  let types = GF_TYPE.map((x) => {
    return { label: x, value: x };
  });
  return (
    <Modal show={show} title="新增牧養對象" setShow={setModal}>
      <Row style={{ marginBottom: "16px" }}>
        <Col>
          <span style={{ marginBottom: "4px" }}>姓名</span>
          <Input
            onChange={(v) => setName(v)}
            style={{ border: "1px solid var(--n-200)" }}
          />
        </Col>
        <Col style={{ marginLeft: "12px" }}>
          <span style={{ marginBottom: "4px" }}>學校</span>
          <Select
            style={{ border: "1px solid var(--n-200)" }}
            menu_style={{ border: "1px solid var(--n-200)" }}
            options={schools}
            value={{ value: school, label: school }}
            onChange={(v) => {
              setSchool(v);
              if (v === "台大") setDepartment(GF_NTU_DEPARTMENT[0]);
              else if (v === "台科大") setDepartment(GF_NTUST_DEPARTMENT[0]);
            }}
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: "16px" }}>
        <Col>
          <span style={{ marginBottom: "4px" }}>科系</span>
          <Select
            style={{ border: "1px solid var(--n-200)" }}
            menu_style={{ border: "1px solid var(--n-200)" }}
            isSearchable
            value={{ value: department, label: department }}
            options={departments}
            onChange={(v) => {
              setDepartment(v);
            }}
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: "16px" }}>
        <Col>
          {" "}
          <span style={{ marginBottom: "4px" }}>年級</span>
          <Select
            style={{ border: "1px solid var(--n-200)" }}
            menu_style={{ border: "1px solid var(--n-200)" }}
            isSearchable
            value={{ value: grade, label: grade }}
            options={grades}
            onChange={(v) => {
              setGrade(v);
            }}
          />
        </Col>
        <Col style={{ marginLeft: "12px" }}>
          <span style={{ marginBottom: "4px" }}>身份</span>
          <Select
            style={{ border: "1px solid var(--n-200)" }}
            menu_style={{ border: "1px solid var(--n-200)" }}
            options={types}
            value={{ value: type, label: type }}
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
              style={{ border: "1px solid var(--n-200)" }}
              menu_style={{ border: "1px solid var(--n-200)" }}
              isSearchable
              value={{ value: gender, label: gender }}
              options={[
                {
                  label: "男",
                  value: "男",
                },
                {
                  label: "女",
                  value: "女",
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
          新增
        </button>
      </Row>
    </Modal>
  );
};

export default AddGFModal;
