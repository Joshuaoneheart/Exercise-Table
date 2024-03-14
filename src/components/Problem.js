import {
  CCol,
  CFormGroup,
  CInputCheckbox,
  CInputRadio,
  CLabel,
  CRow,
} from "@coreui/react";
import { InputNumber } from "antd";

const Problem = ({ data, default_data }) => {
  var frame = [];
  var option_style = { color: "#000000", fontSize: "20px" };
  var title_style = { color: "#636f83" };
  var button_style = { height: "20px", width: "20px" };
  switch (data.type) {
    case "Number":
      frame.push(
        <InputNumber
          name={data.id}
          max={data.max}
          min={0}
          defaultValue={default_data ? default_data.ans : 0}
        />
      );
      break;
    case "MultiGrid":
      var option_row = [];
      var row = [];
      option_row.push(<CCol xs="4" md="2"></CCol>);
      let options = data["選項"];
      for (let i = 0; i < options.length; i++) {
        let option = options[i];
        option_row.push(
          <CCol
            xs="4"
            md="2"
            key={i}
            style={Object.assign({}, option_style, { textAlign: "center" })}
          >
            {option}
          </CCol>
        );
      }
      let suboptions = data["子選項"];
      for (let j = 0; j < suboptions.length; j++) {
        let suboption = suboptions[j];
        let subframe = [];
        subframe.push(
          <CCol xs="4" md="2" style={option_style}>
            {suboption}
          </CCol>
        );
        for (var option of options) {
          subframe.push(
            <CCol
              xs="4"
              md="2"
              key={j}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CInputCheckbox
                className="form-check-input"
                name={data.id + "-" + option}
                value={suboption}
                style={Object.assign({}, button_style, { marginLeft: "2px" })}
                defaultChecked={
                  default_data &&
                  option in default_data &&
                  default_data[option].ans.includes(suboption)
                }
              />
            </CCol>
          );
        }
        row.push(<CRow style={{ flexWrap: "nowrap" }}>{subframe}</CRow>);
      }
      frame.push(
        <>
          <CRow style={{ flexWrap: "nowrap" }}>{option_row}</CRow>
          {row}
        </>
      );
      break;
    case "Grid":
      option_row = [];
      row = [];
      option_row.push(<CCol xs="4" md="2"></CCol>);
      options = data["選項"];
      for (let i = 0; i < options.length; i++) {
        let option = options[i];
        option_row.push(
          <CCol
            xs="4"
            md="2"
            key={i}
            style={Object.assign({}, option_style, { textAlign: "center" })}
          >
            {option}
          </CCol>
        );
      }
      suboptions = data["子選項"];
      for (let j = 0; j < suboptions.length; j++) {
        let suboption = suboptions[j];
        var subframe = [];
        subframe.push(
          <CCol xs="4" md="2" style={option_style}>
            {suboption}
          </CCol>
        );
        for (option of options) {
          subframe.push(
            <CCol
              xs="4"
              md="2"
              key={j}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CInputRadio
                className="form-check-input"
                name={data.id + "-" + suboption}
                value={option}
                style={Object.assign({}, button_style, { marginLeft: "2px" })}
                defaultChecked={
                  default_data &&
                  suboption in default_data &&
                  default_data[suboption].ans === option
                }
              />
            </CCol>
          );
        }
        row.push(<CRow style={{ flexWrap: "nowrap" }}>{subframe}</CRow>);
      }
      frame.push(
        <>
          <CRow style={{ flexWrap: "nowrap" }}>{option_row}</CRow>
          {row}
        </>
      );
      break;
    case "MultiChoice":
      options = data["選項"];
      for (let i = 0; i < options.length; i++) {
        let option = options[i];
        frame.push(
          <CFormGroup variant="checkbox" key={i}>
            <CInputRadio
              className="form-check-input"
              name={data.id}
              value={option}
              style={button_style}
              defaultChecked={default_data && default_data.ans === option}
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
      options = data["子選項"];
      for (let i = 0; i < options.length; i++) {
        frame.push(
          <CFormGroup variant="checkbox" key={i}>
            <CInputCheckbox
              className="form-check-input"
              name={data.id}
              value={options[i]}
              style={button_style}
              defaultChecked={
                default_data && default_data.ans.includes(options[i])
              }
            />
            <CLabel
              variant="checkbox"
              style={Object.assign({}, option_style, { marginLeft: "10px" })}
            >
              {options[i]}
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
        <h4 style={title_style}>{data.title}</h4>
        <hr />
        <CCol style={{ overflowX: "scroll" }}>{frame}</CCol>
      </CFormGroup>
    </>
  );
};

export default Problem;
