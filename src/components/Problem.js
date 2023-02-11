import {
    CCol,
    CFormGroup,
    CInputCheckbox,
    CInputRadio,
    CLabel,
    CRow
} from "@coreui/react";

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

export default Problem;
