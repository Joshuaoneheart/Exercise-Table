import CIcon from "@coreui/icons-react";
import { CButton, CCol, CFormGroup, CInput, CLabel, CRow } from "@coreui/react";
import { useEffect, useState } from "react";

const MultiChoiceFields = ({ data }) => {
  var [optionCnt, setOptionCnt] = useState(1);
  useEffect(() => {
    if (data) {
      setOptionCnt(data.type === "MultiChoice" ? data["選項"].length : 1);
    }
  }, [data]);
  let scores = [];
  let options = [];
  for (let i = 0; i < optionCnt; i++) {
    scores.push(
      <CCol xs="6" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput
          name={"score" + i}
          defaultValue={
            data && data.type === "MultiChoice" ? data.score[i] : ""
          }
          required
        />
      </CCol>
    );
    options.push(
      <CCol xs="6" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput
          name={"option" + i}
          defaultValue={
            data && data.type === "MultiChoice" ? data["選項"][i] : ""
          }
          required
        />
      </CCol>
    );
  }
  return (
    <CRow>
      <CCol xs="9" md="10">
        <CFormGroup row inline>
          <CCol md="3">
            <CLabel>分數</CLabel>
          </CCol>
          <CCol
            md="7"
            xs="7"
            style={{
              marginLeft: "1vw",
            }}
          >
            <CRow>{scores}</CRow>
          </CCol>
        </CFormGroup>
        <CFormGroup row inline>
          <CCol md="3">
            <CLabel>選項</CLabel>
          </CCol>
          <CCol md="7" xs="7" style={{ marginLeft: "1vw" }}>
            <CRow>{options}</CRow>
          </CCol>
        </CFormGroup>
      </CCol>
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
    </CRow>
  );
};

const MultiAnswerFields = ({ data }) => {
  var [suboptionCnt, setSuboptionCnt] = useState(1);
  useEffect(() => {
    if (data) {
      setSuboptionCnt(data.type === "MultiAnswer" ? data["子選項"].length : 1);
    }
  }, [data]);
  let suboptions = [];
  let scores = [];
  scores.push(
    <CCol xs="12" md="12" style={{ paddingBottom: "2vh" }}>
      <CInput
        name={"score0"}
        required
        defaultValue={data && data.type === "MultiAnswer" ? data.score[0] : ""}
      />
    </CCol>
  );
  for (let i = 0; i < suboptionCnt; i++) {
    suboptions.push(
      <CCol xs="6" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput
          defaultValue={
            data && data.type === "MultiAnswer" ? data["子選項"][i] : ""
          }
          name={"suboption" + i}
          required
        />
      </CCol>
    );
  }
  return (
    <>
      <CRow>
        <CCol>
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>分數</CLabel>
            </CCol>
            <CCol md="9" xs="9">
              <CRow>{scores}</CRow>
            </CCol>
          </CFormGroup>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs="9" md="10">
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
    </>
  );
};

const GridFields = ({ data }) => {
  var [optionCnt, setOptionCnt] = useState(1);
  var [suboptionCnt, setSuboptionCnt] = useState(1);
  useEffect(() => {
    if (data) {
      setOptionCnt(data.type === "Grid" ? data["選項"].length : 1);
      setSuboptionCnt(data.type === "Grid" ? data["子選項"].length : 1);
    }
  }, [data]);
  let scores = [];
  let options = [];
  let suboptions = [];
  for (let i = 0; i < optionCnt; i++) {
    scores.push(
      <CCol xs="6" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput
          name={"score" + i}
          defaultValue={data && data.type === "Grid" ? data.score[i] : ""}
          required
        />
      </CCol>
    );
    options.push(
      <CCol xs="6" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput
          name={"option" + i}
          defaultValue={data && data.type === "Grid" ? data["選項"][i] : ""}
          required
        />
      </CCol>
    );
  }
  for (let i = 0; i < suboptionCnt; i++) {
    suboptions.push(
      <CCol xs="6" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput
          defaultValue={data && data.type === "Grid" ? data["子選項"][i] : ""}
          name={"suboption" + i}
          required
        />
      </CCol>
    );
  }
  return (
    <>
      <CRow>
        <CCol xs="9" md="10">
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>分數</CLabel>
            </CCol>
            <CCol
              md="7"
              xs="7"
              style={{
                marginLeft: "1vw",
              }}
            >
              <CRow>{scores}</CRow>
            </CCol>
          </CFormGroup>
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>選項</CLabel>
            </CCol>
            <CCol md="7" xs="7" style={{ marginLeft: "1vw" }}>
              <CRow>{options}</CRow>
            </CCol>
          </CFormGroup>
        </CCol>
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
      </CRow>
      <CRow>
        <CCol xs="9" md="10">
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
    </>
  );
};

const MultiGridFields = ({ data }) => {
  var [optionCnt, setOptionCnt] = useState(1);
  var [suboptionCnt, setSuboptionCnt] = useState(1);
  useEffect(() => {
    if (data) {
      setOptionCnt(data.type === "MultiGrid" ? data["選項"].length : 1);
      setSuboptionCnt(data.type === "MultiGrid" ? data["子選項"].length : 1);
    }
  }, [data]);
  let scores = [];
  let options = [];
  let suboptions = [];
  for (let i = 0; i < optionCnt; i++) {
    scores.push(
      <CCol xs="6" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput
          name={"score" + i}
          defaultValue={data && data.type === "MultiGrid" ? data.score[i] : ""}
          required
        />
      </CCol>
    );
    options.push(
      <CCol xs="6" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput
          name={"option" + i}
          defaultValue={
            data && data.type === "MultiGrid" ? data["選項"][i] : ""
          }
          required
        />
      </CCol>
    );
  }
  for (let i = 0; i < suboptionCnt; i++) {
    suboptions.push(
      <CCol xs="6" md="4" style={{ paddingBottom: "2vh" }}>
        <CInput
          defaultValue={
            data && data.type === "MultiGrid" ? data["子選項"][i] : ""
          }
          name={"suboption" + i}
          required
        />
      </CCol>
    );
  }
  return (
    <>
      <CRow>
        <CCol xs="9" md="10">
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>分數</CLabel>
            </CCol>
            <CCol
              md="7"
              xs="7"
              style={{
                marginLeft: "1vw",
              }}
            >
              <CRow>{scores}</CRow>
            </CCol>
          </CFormGroup>
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>選項</CLabel>
            </CCol>
            <CCol md="7" xs="7" style={{ marginLeft: "1vw" }}>
              <CRow>{options}</CRow>
            </CCol>
          </CFormGroup>
        </CCol>
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
      </CRow>
      <CRow>
        <CCol xs="9" md="10">
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
    </>
  );
};

const NumberFields = ({ data }) => {};
export {
  MultiChoiceFields,
  MultiAnswerFields,
  GridFields,
  MultiGridFields,
  NumberFields,
};
