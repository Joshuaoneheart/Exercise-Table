import React, { useContext, useState } from "react";
import {
  CCol,
  CRow,
  CTabContent,
  CTabPane,
  CCard,
  CCardBody,
  CCardFooter,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormGroup,
  CInputRadio,
  CInputCheckbox,
  CLabel,
  CTabs,
  CCardHeader,
  CButton,
} from "@coreui/react";
import { loading } from "src/reusable";
import { AccountContext, GetWeeklyBase } from "src/App.js";
import {
  FirestoreDocument,
  FirestoreCollection,
  FirestoreBatchedWrite,
} from "@react-firebase/firestore";
const Problem = (props) => {
  var frame = [];
  var option_style = { color: "#000000", fontSize: "20px" };
  var title_style = { color: "#636f83" };
  var button_style = { height: "20px", width: "20px" };
  console.log(props.default_data);
  switch (props.data.type) {
    case "Grid":
      var option_row = [];
      var row = [];
      option_row.push(<CCol></CCol>);
      let options = props.data["選項"].split(";");
      for (let i = 0; i < options.length; i++) {
        let option = options[i];
        option_row.push(
          <CCol
            key={i}
            style={Object.assign({}, option_style, { textAlign: "center" })}
          >
            {option}
          </CCol>
        );
      }
      let suboptions = props.data["子選項"].split(";");
      for (let j = 0; j < suboptions.length; j++) {
        let suboption = suboptions[j];
        var subframe = [];
        subframe.push(<CCol style={option_style}>{suboption}</CCol>);
        for (var option of props.data["選項"].split(";")) {
          subframe.push(
            <CCol
              key={j}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CInputRadio
                className="form-check-input"
                name={props.data.id + "-" + suboption}
                value={option}
                style={Object.assign({}, button_style, { marginLeft: "2px" })}
                defaultChecked={
                  props.default_data &&
                  suboption in props.default_data &&
                  props.default_data["suboption"].ans === option
                }
              />
            </CCol>
          );
        }
        row.push(<CRow>{subframe}</CRow>);
      }
      frame.push(
        <>
          <CRow>{option_row}</CRow>
          {row}
        </>
      );
      break;
    case "MultiChoice":
      options = props.data["選項"].split(";");
      for (let i = 0; i < options.length; i++) {
        let option = options[i];
        frame.push(
          <CFormGroup variant="checkbox" key={i}>
            <CInputRadio
              className="form-check-input"
              name={props.data.id}
              value={option}
              style={button_style}
              defaultChecked={
                props.default_data && props.default_data.ans === option
              }
            />
            <CLabel
              variant="checkbox"
              style={Object.assign({}, option_style, { marginLeft: "10px" })}
            >
              {option}
            </CLabel>
          </CFormGroup>
        );
      }
      break;
    case "MultiAnswer":
      options = props.data["子選項"].split(";");
      for (let i = 0; i < options.length; i++) {
        let option = options[i];
        frame.push(
          <CFormGroup variant="checkbox" key={i}>
            <CInputCheckbox
              className="form-check-input"
              name={props.data.id}
              value={option}
              style={button_style}
              defaultChecked={
                typeof props.default_data && option in props.default_data.ans
              }
            />
            <CLabel
              variant="checkbox"
              style={Object.assign({}, option_style, { marginLeft: "10px" })}
            >
              {option}
            </CLabel>
          </CFormGroup>
        );
      }
      break;
    default:
      break;
  }
  return (
    <>
      <CFormGroup style={{ marginBottom: "25px" }}>
        <h4 style={title_style}>{props.data.title}</h4>
        <hr />
        <CCol>{frame}</CCol>
      </CFormGroup>
    </>
  );
};

const DataTabs = (props) => {
  var data = props.data;
  var account = props.account;
  const [section, setSection] = useState(0);
  var form = React.useRef();
  var tabs = [];
  var tabpanes = [];
  for (var i = 0; i < data.ids.length; i++) {
    tabs.push(
      <CDropdownItem
        key={i}
        onClick={function (i) {
          setSection(i);
        }.bind(null, i)}
      >
        {data.ids[i]}
      </CDropdownItem>
    );
    var tabContents = [];
    for (var j = 0; j < data.value[i].length; j++) {
      var problem = data.value[i][j];
      tabContents.push(
        <Problem
          name={data.value[i].id}
          data={problem}
          key={j}
          default_data={
            props.default_data && props.default_data.value
              ? props.default_data.value[problem.id]
              : undefined
          }
        />
      );
    }
    tabpanes.push(<CTabPane key={i}>{tabContents}</CTabPane>);
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol style={{ fontSize: "30px" }}>表單</CCol>
          <CCol align="end">
            <CDropdown>
              <CDropdownToggle color="info">
                {data.ids[section]}
              </CDropdownToggle>
              <CDropdownMenu>{tabs}</CDropdownMenu>
            </CDropdown>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CForm innerRef={form}>
          <CTabs activeTab={section}>
            <CTabContent>{tabpanes}</CTabContent>
          </CTabs>
        </CForm>
      </CCardBody>
      <CCardFooter>
        <FirestoreBatchedWrite>
          {({ addMutationToBatch, commit }) => {
            return (
              <CButton
                variant="ghost"
                color="dark"
                onClick={(event) => {
                  event.target.disabled = true;
                  if (!form.current) {
                    alert("請稍後再試");
                    event.target.disabled = false;
                    return;
                  }
                  var v = {};
                  for (let i = 0; i < props.metadata.value.length; i++) {
                    var problem = props.metadata.value[i];
                    switch (problem.type) {
                      case "Grid":
                        var suboptions = problem["子選項"].split(";");
                        for (let j = 0; j < suboptions.length; j++) {
                          let ans =
                            form.current.elements[
                              problem.id + "-" + suboptions[i]
                            ].value;
                          if (ans) {
                            if (!(problem.id in v)) v[problem.id] = {};
                            v[problem.id][suboptions[j]] = {
                              ans: ans,
                              score:
                                problem.score.split(";")[
                                  problem["選項"].split(";").indexOf(ans)
                                ],
                            };
                          }
                        }
                        break;
                      case "MultiChoice":
                        let ans =
                          form.current.elements[props.metadata.ids[i]].value;
                        if (ans)
                          v[problem.id] = {
                            ans: ans,
                            score:
                              problem.score.split(";")[
                                problem["選項"].split(";").indexOf(ans)
                              ],
                          };
                        break;
                      case "MultiAnswer":
                        var nodeList =
                          form.current.elements[props.metadata.ids[i]];
                        for (let j = 0; j < nodeList.length; j++) {
                          if (nodeList[j].checked) {
                            if (!(props.metadata.ids[i] in v))
                              v[props.metadata.ids[i]] = { ans: [], score: 0 };
                            v[props.metadata.ids[i]].ans.push(
                              nodeList[j].value
                            );
                            v[props.metadata.ids[i]].score += parseInt(
                              props.metadata.score
                            );
                          }
                        }
                        break;
                      default:
                        break;
                    }
                  }
                  addMutationToBatch({
                    path:
                      "/accounts/" + account.id + "/data/" + GetWeeklyBase(),
                    value: v,
                    type: "set",
                  });
                  commit()
                    .then(() => {
                      alert("儲存完成");
                      event.target.disabled = false;
                    })
                    .catch((error) => {
                      alert(error.message);
                      event.target.disabled = false;
                    });
                }}
              >
                提交表單
              </CButton>
            );
          }}
        </FirestoreBatchedWrite>
      </CCardFooter>
    </CCard>
  );
};

const Form = () => {
  const account = useContext(AccountContext);
  return (
    <CRow>
      <FirestoreDocument
        path={"/accounts/" + account.id + "/data/" + GetWeeklyBase()}
      >
        {(default_data) => {
          if (default_data.isLoading) return loading;
          return (
            <FirestoreCollection path="/form/">
              {(d) => {
                if (d.isLoading) return loading;
                if (d && d.value) {
                  var data = { value: [], ids: [] };
                  for (var i = 0; i < d.value.length; i++) {
                    d.value[i].id = d.ids[i];
                    if (!data.ids.includes(d.value[i].section)) {
                      data.ids.push(d.value[i].section);
                      data.value.push([]);
                    }
                    data.value[data.ids.indexOf(d.value[i].section)].push(
                      d.value[i]
                    );
                  }
                  return (
                    <CCol>
                      <DataTabs
                        data={data}
                        metadata={d}
                        account={account}
                        default_data={default_data}
                      />
                    </CCol>
                  );
                } else return null;
              }}
            </FirestoreCollection>
          );
        }}
      </FirestoreDocument>
    </CRow>
  );
};

export default Form;
