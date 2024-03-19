import { DB } from "db/firebase";
import { useState, useEffect } from "react";
import { GetSemesterData } from "utils/account";
import { GetProblems, SummaryScore } from "utils/problem";
import { DataFrame } from "pandas-js";
import { loading } from "components";
import Select from "react-select";
import {
  CRow,
  CCard,
  CCol,
  CCardHeader,
  CCardBody,
  CDataTable,
  CInputCheckbox,
  CButton,
  CLabel,
} from "@coreui/react";
import { GetWeeklyBaseFromTime, WeeklyBase2String } from "utils/date";
import { InputNumber } from "antd";

const Summary = () => {
  const [raw, setRaw] = useState(null);
  const [problems, setProblems] = useState(null);
  const [total_num, setTotalNum] = useState(0);
  const [conditions, setConditions] = useState([]);
  useEffect(() => {
    const getRaw = async () => {
      let tmp = [];
      let accounts = await DB.getByUrl("/accounts");
      let accountsMap = {};
      let semester = await DB.getByUrl("/info/semester");
      let problems = await GetProblems();
      await accounts.forEach((doc) => {
        if (doc.data().role === "Admin") return;
        accountsMap[doc.id] = doc.data().displayName;
      });
      // generate empty row
      for (let id of Object.keys(accountsMap)) {
        let weeks = await GetSemesterData(id, semester);
        let { items, result } = await SummaryScore(weeks, problems, id);
        let df = new DataFrame(items);
        let week = null;
        if (df.columns.includes("week_base")) week = df.get("week_base");
        let empty_row = [];
        for (
          let i = GetWeeklyBaseFromTime(semester.start.toDate());
          i <= GetWeeklyBaseFromTime(semester.end.toDate());
          i++
        ) {
          if (!week || !week.values.includes(WeeklyBase2String(i))) {
            empty_row.push({
              week_base: WeeklyBase2String(i),
              score: 0,
              召會生活操練: 0,
              神人生活操練: 0,
              福音牧養操練: 0,
            });
          }
        }
        df = df.append(new DataFrame(empty_row));
        tmp.push(
          Object.assign({ name: accountsMap[id], dataframe: df }, result)
        );
      }
      setTotalNum(
        GetWeeklyBaseFromTime(semester.end.toDate()) -
          GetWeeklyBaseFromTime(semester.start.toDate()) +
          1
      );
      setProblems(problems);
      setRaw(tmp);
    };
    getRaw();
  }, []);
  if (raw === null || problems === null) return loading;
  let list_items = [];
  let options = [];
  for (let problem of problems) {
    if (problem.type === "Grid") {
      for (let suboption of problem["子選項"]) {
        options.push({
          id: problem.id + "-" + suboption,
          data: problem,
          value: problem.title + "-" + suboption,
          label: (
            <span style={{ whiteSpace: "pre" }}>
              {problem.title + "-" + suboption}
            </span>
          ),
        });
      }
    } else if (problem.type === "MultiGrid") {
      for (let option of problem["選項"]) {
        options.push({
          id: problem.id + "-" + option,
          data: problem,
          value: problem.title + "-" + option,
          label: (
            <span style={{ whiteSpace: "pre" }}>
              {problem.title + "-" + option}
            </span>
          ),
        });
      }
    } else
      options.push({
        id: problem.id,
        data: problem,
        value: problem.title,
        label: <span style={{ whiteSpace: "pre" }}>{problem.title}</span>,
      });
  }
  for (let i = 0; i < conditions.length; i++) {
    if (i !== 0) list_items.push(<hr />);
    let choice_select = null;
    let include_nan = null;
    if (
      conditions[i].c === ">=" ||
      conditions[i].c === "<=" ||
      conditions[i].c === "all"
    )
      include_nan = (
        <CCol xs="2" md="2">
          <CLabel style={{ width: "100%" }}>包含未交</CLabel>
          <CInputCheckbox
            style={{ width: "20px", height: "20px" }}
            onChange={(e) => {
              let tmp = Array.from(conditions);
              tmp[i].include_nan = e.target.checked;
              setConditions(tmp);
            }}
          />
        </CCol>
      );
    if (
      conditions[i].data &&
      (conditions[i].data.type === "Grid" ||
        conditions[i].data.type === "MultiChoice")
    ) {
      let choices = [];
      for (let choice of conditions[i].data["選項"]) {
        choices.push({
          value: choice,
          label: <span style={{ whiteSpace: "pre" }}>{choice}</span>,
        });
      }
      choice_select = (
        <CCol>
          <CLabel style={{ width: "100%" }}>選項</CLabel>
          <Select
            options={choices}
            onChange={(v) => {
              let tmp = Array.from(conditions);
              tmp[i].choice = v.value;
              setConditions(tmp);
            }}
          />
        </CCol>
      );
    } else if (conditions[i].data) {
      choice_select = (
        <>
          <CCol>
            <CLabel style={{ width: "100%" }}>次條件</CLabel>
            <Select
              options={[
                {
                  value: ">=",
                  label: <span style={{ whiteSpace: "pre" }}>{">="}</span>,
                },
                {
                  value: "<=",
                  label: <span style={{ whiteSpace: "pre" }}>{"<="}</span>,
                },
              ]}
              onChange={(v) => {
                let tmp = Array.from(conditions);
                tmp[i].small_c = v.value;
                setConditions(tmp);
              }}
            />
          </CCol>
          <CCol xs="4" md="2">
            <CLabel style={{ width: "100%" }}>幾次</CLabel>
            <InputNumber
              max={
                conditions[i].data.type === "Number"
                  ? conditions[i].data.max
                  : conditions[i].data["子選項"].length
              }
              min={0}
              onChange={(v) => {
                let tmp = Array.from(conditions);
                tmp[i].small_c_n = v;
                setConditions(tmp);
              }}
            />
          </CCol>
        </>
      );
    }
    list_items.push(
      <CRow key={i} style={{ paddingLeft: "inherit", paddingRight: "inherit" }}>
        <CCol xs="1" md="1">
          <CInputCheckbox
            style={{ width: "20px", height: "20px" }}
            onChange={(e) => {
              let tmp = Array.from(conditions);
              tmp[i].active = e.target.checked;
              setConditions(tmp);
            }}
          />
        </CCol>
        <CCol>
          <CLabel style={{ width: "100%" }}>題目</CLabel>
          <Select
            options={options}
            onChange={(v) => {
              let tmp = Array.from(conditions);
              tmp[i].problem = v.id;
              tmp[i].data = v.data;
              setConditions(tmp);
            }}
          />
        </CCol>
        {choice_select}
        <CCol>
          <CLabel style={{ width: "100%" }}>週條件</CLabel>
          <Select
            options={[
              {
                value: ">=",
                label: <span style={{ whiteSpace: "pre" }}>{">="}</span>,
              },
              {
                value: "<=",
                label: <span style={{ whiteSpace: "pre" }}>{"<="}</span>,
              },
              {
                value: "all",
                label: <span style={{ whiteSpace: "pre" }}>{"all"}</span>,
              },
              {
                value: "none",
                label: <span style={{ whiteSpace: "pre" }}>{"none"}</span>,
              },
            ]}
            onChange={(v) => {
              let tmp = Array.from(conditions);
              tmp[i].c = v.value;
              setConditions(tmp);
            }}
          />
        </CCol>
        {(conditions[i].c === "<=" || conditions[i].c === ">=") && (
          <CCol>
            <CLabel style={{ width: "100%" }}>幾週</CLabel>
            <InputNumber
              min={0}
              max={total_num}
              onChange={(v) => {
                let tmp = Array.from(conditions);
                tmp[i].c_n = v;
                setConditions(tmp);
              }}
            />
          </CCol>
        )}
        {include_nan}
      </CRow>
    );
  }
  let items = [];
  for (let item of raw) {
    let flag = true;
    let df = item.dataframe;
    for (let condition of conditions) {
      if (!condition.active) continue;
      if (!condition.problem || !condition.data || !condition.c) continue;
      if (
        (condition.c === ">=" || condition.c === "<=") &&
        (condition.c_n === null || condition.c_n === undefined)
      )
        continue;
      if (
        (condition.data.type === "Grid" ||
          condition.data.type === "MultiChoice") &&
        !condition.choice
      )
        continue;
      if (
        condition.data.type !== "Grid" &&
        condition.data.type !== "MultiChoice" &&
        (!condition.small_c ||
          condition.small_c_n === null ||
          condition.small_c_n === undefined)
      )
        continue;
      let problem_data = null;
      let nan_cnt = 0;
      if (df.columns.includes(condition.problem))
        problem_data = df.get(condition.problem);
      else nan_cnt = total_num;
      let cnt = 0;
      if (problem_data !== null) {
        if (
          condition.data.type === "Grid" ||
          condition.data.type === "MultiChoice"
        ) {
          cnt = problem_data.filter(problem_data.eq(condition.choice)).length;
          nan_cnt = problem_data.filter(
            problem_data.map((x) => {
              if (typeof x === "string") return false;
              return isNaN(x);
            })
          ).length;
        } else {
          let non_nan = problem_data.filter(
            problem_data.map((x) => {
              if (typeof x === "string") return true;
              return !isNaN(x);
            })
          );
          if (condition.small_c === "<=")
            cnt = non_nan.filter(non_nan.lte(condition.small_c_n)).length;
          else if (condition.small_c_n === ">=")
            cnt = non_nan.filter(non_nan.gte(condition.small_c_n)).length;
          nan_cnt = problem_data.filter(
            problem_data.map((x) => {
              if (typeof x === "string") return false;
              return isNaN(x);
            })
          ).length;
        }
      }
      if (condition.c === "<=") {
        if (condition.include_nan) cnt += nan_cnt;
        flag &= cnt <= condition.c_n;
      } else if (condition.c === ">=") {
        if (condition.include_nan) cnt += nan_cnt;
        flag &= cnt >= condition.c_n;
      } else if (condition.c === "all") {
        if (condition.include_nan) cnt += nan_cnt;
        flag &= cnt === total_num;
      } else if (condition.c === "none") {
        flag &= cnt === 0;
      }
    }
    if (flag)
      items.push({
        name: item.name,
        福音牧養操練: item["福音牧養操練"] + item["cur_福音牧養操練"],
        神人生活操練: item["神人生活操練"] + item["cur_神人生活操練"],
        召會生活操練: item["召會生活操練"] + item["cur_召會生活操練"],
        score: item.score + item.total_score,
      });
  }
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol>學期結算</CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            {!!conditions.length && list_items}
            <CButton
              variant="outline"
              color="dark"
              style={{ marginTop: "10px", marginBottom: "10px" }}
              onClick={() => {
                let tmp = Array.from(conditions);
                tmp.push({ active: false });
                setConditions(tmp);
              }}
            >
              新增篩選條件
            </CButton>
            <CDataTable
              items={items}
              fields={[
                {
                  key: "name",
                  label: "Name",
                  _style: { minWidth: "100px", flexWrap: "nowrap" },
                },
                {
                  key: "福音牧養操練",
                  label: "福音牧養操練",
                  _style: { minWidth: "100px", flexWrap: "nowrap" },
                },
                {
                  key: "神人生活操練",
                  label: "神人生活操練",
                  _style: { minWidth: "100px", flexWrap: "nowrap" },
                },
                {
                  key: "召會生活操練",
                  label: "召會生活操練",
                  _style: { minWidth: "100px", flexWrap: "nowrap" },
                },
                {
                  key: "score",
                  label: "分數",
                  _style: { minWidth: "100px", flexWrap: "nowrap" },
                },
              ]}
              itemsPerPage={10}
              sorter
              pagination
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default Summary;
