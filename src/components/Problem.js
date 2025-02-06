import { InputNumber } from "antd";
import { DB, firebase } from "db/firebase";
import { Select, Row, Input, Col } from ".";
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
  week,
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
          if (typeof x === "string") {
            if (!id_to_v[x]) return undefined;
            return {
              value: id_to_v[x],
              label: (
                <span style={{ whiteSpace: "pre" }}>
                  <b>{id_to_v[x].split("|")[2]}</b>
                </span>
              ),
            };
          } else {
            if (!id_to_v[x.id]) return undefined;
            return {
              value: id_to_v[x.id],
              label: (
                <span style={{ whiteSpace: "pre" }}>
                  <b>{id_to_v[x.id].split("|")[2]}</b>
                </span>
              ),
            };
          }
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
          if (typeof x === "string") {
            if (!id_to_v[x]) return undefined;
            return {
              value: id_to_v[x],
              label: (
                <span style={{ whiteSpace: "pre" }}>
                  <b>{id_to_v[x].split("|")[2]}</b>
                </span>
              ),
            };
          } else {
            if (!id_to_v[x.id]) return undefined;
            return {
              value: id_to_v[x.id],
              label: (
                <span style={{ whiteSpace: "pre" }}>
                  <b>{id_to_v[x.id].split("|")[2]}</b>
                </span>
              ),
            };
          }
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
      <Row>
        <Select
          container_style={{ width: "100%", marginRight: "16px" }}
          style={{ border: "1px solid var(--n-200)" }}
          menu_style={{ border: "1px solid var(--n-200)" }}
          placeholder="選擇牧養對象"
          value={options}
          defaultValue={options}
          isMulti={true}
          isSearchable={true}
          autoFocus={true}
          options={GF_options}
          onChange={async (v) => {
            setOptions(
              v.map((x) => {
                x.label = x.value.split("|")[2];
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
      </Row>
      {note &&
        options.map((x, i) => {
          if (!x) return undefined;
          return (
            <Row
              key={`row-${i}`}
              className="primary-regular"
              style={{ marginTop: "8px" }}
            >
              <Col
                style={{
                  width: "20%",
                  paddingTop: "12px",
                  paddingLeft: "16px",
                }}
              >
                {x.value.split("|")[2]}
              </Col>
              <Col style={{ width: "calc(80% - 16px)" }}>
                <Input
                  style={{ width: "100%", border: "1px solid var(--n-200)" }}
                  defaultValue={
                    notes[x.value.split("|")[1]]
                      ? notes[x.value.split("|")[1]]
                      : ""
                  }
                  onChange={(v) => {
                    let new_notes = Object.assign({}, notes);
                    new_notes[x.value.split("|")[1]] = v;
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
              </Col>
            </Row>
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
  const [scrollLeft, setScrollLeft] = useState(0);
  const { t } = useTranslation("translation", { i18n });
  var frame = [];
  switch (data.type) {
    case "GF":
      frame.push(
        GF && (
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
        )
      );
      break;
    case "Number":
      frame.push(
        <Input
          style={{
            border: "1px solid var(--n-200)",
            marginRight: "16px",
            width: "calc(100vw - 32px)",
          }}
          type="number"
          defaultValue={default_data ? default_data.ans : 0}
          onChange={async (v) => {
            if (account_id) {
              let tmp = {};
              tmp[[data.id + ".ans"]] = Math.min(Math.max(v, 0), data.max);
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
      var suboption_col = [];
      let options = data["選項"];
      let suboptions = data["子選項"];
      let columns = [];
      suboption_col.push(
        <div style={{ height: "40px" }} className="background-white"></div>
      );
      for (let i = 0; i < suboptions.length; i++) {
        let suboption = suboptions[i];
        suboption_col.push(
          <div
            className={
              "suboption-col primary-regular " +
              (i % 2 === 0 ? "background-p-50" : "background-white")
            }
            style={{
              height: "46px",
              boxShadow:
                scrollLeft !== 0 ? "2px 0px 2px 0px rgb(0 0 0 /10%)" : "none",
            }}
          >
            {t(suboption)}
          </div>
        );
      }
      columns.push(
        <div
          style={{
            minWidth: "82px",
            width: "fit-content",
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            left: "0px",
          }}
        >
          {suboption_col}
        </div>
      );
      let padding_col = [
        <div style={{ height: "40px" }} className="background-white"></div>,
      ];
      for (let i = 0; i < suboptions.length; i++) {
        padding_col.push(
          <div
            className={i % 2 === 0 ? "background-p-50" : "background-white"}
            style={{ height: "46px" }}
          ></div>
        );
      }
      columns.push(
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {padding_col}
        </div>
      );
      for (let i = 0; i < options.length; i++) {
        let tmp_col = [];
        let option = options[i];
        tmp_col.push(
          <div key={i} className="content-regular option-row">
            {t(option)}
          </div>
        );

        for (let j = 0; j < suboptions.length; j++) {
          let suboption = suboptions[i];
          tmp_col.push(
            <div
              key={j}
              className={
                "form-row-container " +
                (j % 2 === 0 ? "background-p-50" : "background-white")
              }
            >
              <input
                type="checkbox"
                className="input-checkbox"
                name={data.id + "-" + option}
                value={suboption}
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
            </div>
          );
        }
        columns.push(
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              flexDirection: "column",
              minWidth: "fit-content",
            }}
          >
            {tmp_col}
          </div>
        );
      }
      frame.push(
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            paddingRight: "16px",
            minWidth: "100%",
            width: "fit-content",
          }}
        >
          {columns}
        </div>
      );
      break;
    case "Grid":
      suboption_col = [];
      options = data["選項"];
      suboptions = data["子選項"];
      columns = [];
      suboption_col.push(
        <div
          style={{
            height: "40px",
          }}
          className="background-white"
        ></div>
      );
      for (let i = 0; i < suboptions.length; i++) {
        let suboption = suboptions[i];
        suboption_col.push(
          <div
            className={
              "primary-regular suboption-col " +
              (i % 2 === 0 ? "background-p-50" : "background-white")
            }
            style={{
              boxShadow:
                scrollLeft !== 0 ? "2px 0px 2px 0px rgb(0 0 0 /10%)" : "none",
            }}
          >
            {t(suboption)}
          </div>
        );
      }
      columns.push(
        <div
          style={{
            minWidth: "82px",
            width: "fit-content",
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            left: "0px",
          }}
        >
          {suboption_col}
        </div>
      );
      padding_col = [
        <div style={{ height: "40px" }} className="background-white"></div>,
      ];
      for (let i = 0; i < suboptions.length; i++) {
        padding_col.push(
          <div
            className={i % 2 === 0 ? "background-p-50" : "background-white"}
            style={{ height: "46px" }}
          ></div>
        );
      }
      columns.push(
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {padding_col}
        </div>
      );
      for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let tmp_col = [];
        tmp_col.push(
          <div key={i} className="content-regular option-row">
            {t(option)}
          </div>
        );
        for (let i = 0; i < suboptions.length; i++) {
          let suboption = suboptions[i];
          tmp_col.push(
            <div
              key={i}
              className={
                "form-row-container " +
                (i % 2 === 0 ? "background-p-50" : "background-white")
              }
            >
              <input
                type="radio"
                className="input-radio"
                name={data.id + "-" + suboption}
                value={option}
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
            </div>
          );
        }

        columns.push(
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              flexDirection: "column",
              minWidth: "fit-content",
            }}
          >
            {tmp_col}
          </div>
        );
      }
      frame.push(
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            paddingRight: "16px",
            minWidth: "100%",
            width: "fit-content",
          }}
        >
          {columns}
        </div>
      );
      break;
    default:
      break;
  }
  return (
    <>
      <Row style={{ minWidth: "100%", paddingBottom: "16px", marginBottom: 0 }}>
        <Col>
          {data && data.showTitle && (
            <p className="primary-regular problem-title">{t(data.title)}</p>
          )}
          <div
            onScroll={(e) => {
              setScrollLeft(e.target.scrollLeft);
            }}
            style={{
              overflowX: "scroll",
              overflowY: "visible",
              marginLeft: "16px",
            }}
          >
            {frame}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Problem;
