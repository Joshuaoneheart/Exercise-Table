import {
  CCol,
  CFormGroup,
  CInput,
  CInputCheckbox,
  CInputRadio,
  CLabel,
  CRow,
} from "@coreui/react";
import { InputNumber } from "antd";
import { DB, firebase } from "db/firebase";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18n";

const GFSelect = ({
  GF,
  default_data,
  account_id,
  title,
  note,
  calculateScore,
  week
}) => {
  let id_to_v = {};
  for (let i = 0; i < GF.length; i++) {
    id_to_v[GF[i].id] =
      i +
      "|" +
      GF[i].id +
      "|" +
      GF[i].name +
      "|" +
      GF[i].school +
      "|" +
      GF[i].department +
      "|" +
      GF[i].grade +
      "|" +
      GF[i].type +
      "|" +
      GF[i].note;
  }
  const [options, setOptions] = useState(
    default_data
      ? default_data.map((x) => {
          if (typeof x === "string")
            return {
              value: id_to_v[x],
              label: (
                <span style={{ whiteSpace: "pre" }}>
                  <b>{id_to_v[x].split("|")[2]}</b>
                </span>
              ),
            };
          else
            return {
              value: id_to_v[x.id],
              label: (
                <span style={{ whiteSpace: "pre" }}>
                  <b>{id_to_v[x.id].split("|")[2]}</b>
                </span>
              ),
            };
        })
      : []
  );
  let default_note = {};
  if (default_data) {
    for (let x of default_data) {
      if (typeof x !== "string") default_note[x.id] = x.note;
    }
  }
  const [notes, setNotes] = useState(default_note);
  useEffect(() => {
    if (default_data) {
      let id_to_v = {};
      for (let i = 0; i < GF.length; i++) {
        id_to_v[GF[i].id] =
          i +
          "|" +
          GF[i].id +
          "|" +
          GF[i].name +
          "|" +
          GF[i].school +
          "|" +
          GF[i].department +
          "|" +
          GF[i].grade +
          "|" +
          GF[i].type +
          "|" +
          GF[i].note;
      }
      setOptions(
        default_data.map((x) => {
          if (typeof x === "string")
            return {
              value: id_to_v[x],
              label: (
                <span style={{ whiteSpace: "pre" }}>
                  <b>{id_to_v[x].split("|")[2]}</b>
                </span>
              ),
            };
          else
            return {
              value: id_to_v[x.id],
              label: (
                <span style={{ whiteSpace: "pre" }}>
                  <b>{id_to_v[x.id].split("|")[2]}</b>
                </span>
              ),
            };
        })
      );
      let tmp = {};
      for (let x of default_data) {
        if (typeof x !== "string") tmp[x.id] = x.note;
      }
      setNotes(tmp);
    }
  }, [default_data, GF]);

  let GF_options = [];
  for (let i = 0; i < GF.length; i++) {
    if (!(default_data && default_data.includes(GF[i].id)))
      GF_options.push({
        value: id_to_v[GF[i].id],
        label: (
          <span style={{ whiteSpace: "pre" }}>
            <b>{GF[i].name}</b>{" "}
            <span>
              {"      " +
                GF[i].school +
                " " +
                GF[i].department +
                " " +
                GF[i].grade +
                " " +
                GF[i].type +
                " " +
                GF[i].note +
                " "}
            </span>
          </span>
        ),
      });
  }
  return (
    <>
      <CFormGroup>
        <Select
          value={options}
          defaultValue={options}
          isMulti
          isSearchable
          autoFocus
          options={GF_options}
          defaultMenuIsOpen={false}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          onChange={async (v) => {
            setOptions(
              v.map((x) => {
                x.label = (
                  <span style={{ whiteSpace: "pre" }}>
                    <b>{x.value.split("|")[2]}</b>
                  </span>
                );
                return x;
              })
            );
            if (account_id) {
              let tmp = {};
              tmp[title] = v.map((x) => {
                if (x.value.split("|")[1] in notes)
                  return {
                    id: x.value.split("|")[1],
                    note: notes[x.value.split("|")[1]],
                  };
                else return x.value.split("|")[1];
              });
              tmp.week_base = week;
              await DB.OnDemandUpdate(
                "/accounts/" + account_id + "/GF/" + week,
                tmp
              );
              calculateScore();
            }
          }}
        />
      </CFormGroup>
      {note &&
        options.map((x, i) => {
          return (
            <CRow
              key={i}
              className="align-items-center"
              style={{ marginBottom: "10px" }}
            >
              <CCol xs="3" md="2">
                <CLabel>{x.value.split("|")[2]}</CLabel>
              </CCol>
              <CCol xs="9" md="10">
                <CInput
                  defaultValue={
                    notes[x.value.split("|")[1]]
                      ? notes[x.value.split("|")[1]]
                      : ""
                  }
                  onChange={(e) => {
                    let new_notes = Object.assign({}, notes);
                    new_notes[x.value.split("|")[1]] = e.target.value;
                    let tmp = {};
                    tmp[title] = Array.from(
                      options.map((x) => {
                        if (x.value.split("|")[1] in new_notes)
                          return {
                            id: x.value.split("|")[1],
                            note: new_notes[x.value.split("|")[1]],
                          };
                        else return x.value.split("|")[1];
                      })
                    );
                    setNotes(new_notes);
                    tmp.week_base = week;
                    DB.OnDemandUpdate(
                      "/accounts/" + account_id + "/GF/" + week,
                      tmp
                    );
                  }}
                />
              </CCol>
            </CRow>
          );
        })}
    </>
  );
};

const Problem = ({
  data,
  default_data,
  GF_data,
  account_id,
  calculateScore,
  week,
  GF,
}) => {
  const { t } = useTranslation("translation", { i18n });
  var frame = [];
  var option_style = { color: "#000000", fontSize: "16px" };
  var title_style = { color: "#636f83", fontSize: "22px" };
  var button_style = { height: "20px", width: "16px" };
  switch (data.type) {
    case "GF":
      frame.push(
        <GFSelect
          GF={GF}
          default_data={
            GF_data && GF_data[data.title] ? GF_data[data.title] : null
          }
          account_id={account_id}
          title={data.title}
          note={data.note}
          week={week}
          calculateScore={calculateScore}
        />
      );
      break;
    case "Number":
      frame.push(
        <InputNumber
          name={data.id}
          max={data.max}
          min={0}
          defaultValue={default_data ? default_data.ans : 0}
          onChange={async (v) => {
            if (account_id) {
              let tmp = {};
              tmp[[data.id + ".ans"]] = v;
              tmp[[data.id + ".score"]] = v * parseInt(data.score[0]);
              await DB.OnDemandUpdate(
                "/accounts/" + account_id + "/data/" + week,
                tmp
              );
              calculateScore();
            }
          }}
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
            {t(option)}
          </CCol>
        );
      }
      let suboptions = data["子選項"];
      for (let i = 0; i < suboptions.length; i++) {
        let suboption = suboptions[i];
        let subframe = [];
        subframe.push(
          <CCol xs="4" md="2" style={option_style}>
            {t(suboption)}
          </CCol>
        );
        for (var option of options) {
          subframe.push(
            <CCol
              xs="4"
              md="2"
              key={i}
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
                onChange={async function (
                  account_id,
                  suboption,
                  option,
                  data,
                  e
                ) {
                  if (account_id) {
                    if (e.target.checked) {
                      let tmp = {};
                      tmp[[data.id + "." + option + ".ans"]] =
                        firebase.firestore.FieldValue.arrayUnion(suboption);
                      await DB.OnDemandUpdate(
                        "/accounts/" + account_id + "/data/" + week,
                        tmp
                      );
                    } else {
                      let tmp = {};
                      tmp[[data.id + "." + option + ".ans"]] =
                        firebase.firestore.FieldValue.arrayRemove(suboption);
                      await DB.OnDemandUpdate(
                        "/accounts/" + account_id + "/data/" + week,
                        tmp
                      );
                    }
                    calculateScore();
                  }
                }.bind(null, account_id, suboption, option, data)}
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
            {t(option)}
          </CCol>
        );
      }
      suboptions = data["子選項"];
      for (let i = 0; i < suboptions.length; i++) {
        let suboption = suboptions[i];
        var subframe = [];
        subframe.push(
          <CCol xs="4" md="2" style={option_style}>
            {t(suboption)}
          </CCol>
        );
        for (option of options) {
          subframe.push(
            <CCol
              xs="4"
              md="2"
              key={i}
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
                onChange={async function (account_id, suboption, data, e) {
                  if (account_id) {
                    let tmp = {};
                    tmp[[data.id + "." + suboption + ".ans"]] = e.target.value;
                    await DB.OnDemandUpdate(
                      "/accounts/" + account_id + "/data/" + week,
                      tmp
                    );
                    calculateScore();
                  }
                }.bind(null, account_id, suboption, data)}
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
              onChange={async function (account_id, data, e) {
                if (account_id) {
                  let tmp = {};
                  tmp[[data.id + ".ans"]] = e.target.value;
                  await DB.OnDemandUpdate(
                    "/accounts/" + account_id + "/data/" + week,
                    tmp
                  );
                  calculateScore();
                }
              }.bind(null, account_id, data)}
            />
            <CLabel
              variant="checkbox"
              style={Object.assign({}, option_style, { marginLeft: "10px" })}
            >
              {t(option)}
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
              onChange={async (e) => {
                if (account_id) {
                  if (e.target.checked) {
                    let tmp = {};
                    tmp[[data.id + ".ans"]] =
                      firebase.firestore.FieldValue.arrayUnion(options[i]);
                    await DB.OnDemandUpdate(
                      "/accounts/" + account_id + "/data/" + week,
                      tmp
                    );
                  } else {
                    let tmp = {};
                    tmp[[data.id + ".ans"]] =
                      firebase.firestore.FieldValue.arrayRemove(options[i]);
                    await DB.OnDemandUpdate(
                      "/accounts/" + account_id + "/data/" + week,
                      tmp
                    );
                  }
                  calculateScore();
                }
              }}
            />
            <CLabel
              variant="checkbox"
              style={Object.assign({}, option_style, { marginLeft: "10px" })}
            >
              {t(options[i])}
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
        <h4 style={title_style}>{t(data.title)}</h4>
        <hr />
        <CCol style={{ overflowX: "scroll", overflowY: "visible" }}>
          {frame}
        </CCol>
      </CFormGroup>
    </>
  );
};

export default Problem;
