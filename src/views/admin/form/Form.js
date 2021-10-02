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
        <Problem name={data.value[i].id} data={problem} key={j} />
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
    </CCard>
  );
};

const Form = () => {
  return (
    <CRow>
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
              data.value[data.ids.indexOf(d.value[i].section)].push(d.value[i]);
            }
            return (
              <CCol>
                <DataTabs data={data} metadata={d} />
              </CCol>
            );
          } else return null;
        }}
      </FirestoreCollection>
    </CRow>
  );
};

export default Form;
