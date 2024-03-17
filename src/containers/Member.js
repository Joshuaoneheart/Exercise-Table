import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import { loading } from "components";
import { GetWeeklyBase, WeeklyBase2String } from "utils/date";
import { DB, firebase } from "db/firebase";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";

const RenderLineChart = ({ data }) => {
  let labels = [];
  let chart_data = [];
  let ids = data.ids.map((x) => parseInt(x));
  let lower = Math.min(...ids);
  let upper = Math.max(...ids);
  for (let i = lower; i <= upper; i++) {
    labels.push(WeeklyBase2String(i));
    if (ids.includes(i)) {
      chart_data.push(data.value[ids.indexOf(i)].scores);
    } else chart_data.push(null);
  }
  const line = {
    labels,
    datasets: [
      {
        label: "Total Score",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        cubicInterpolationMode: "default",
        data: chart_data,
        spanGaps: true,
      },
    ],
  };
  return (
    <CRow className="col-md-6">
      <CCol>
        <h4>Total Score Curve</h4>
        <div className="chart-wrapper">
          <CChartLine datasets={line.datasets} labels={line.labels} />
        </div>
        <hr />
      </CCol>
    </CRow>
  );
};

const MemberTable = ({ data, id }) => {
  const [items, setItems] = useState(null);
  const [columns, setColumns] = useState(null);
  useEffect(() => {
    const GetProblems = async () => {
      let docs = await DB.getByUrl("/form");
      let problems = [];
      await docs.forEach((doc) => {
        problems.push(Object.assign({ id: doc.id }, doc.data()));
      });
      let columns = [
        {
          key: "week_base",
          label: "Week",
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        },
      ];
      for (let problem of problems) {
        if (problem.type === "Grid") {
          for (let suboption of problem["子選項"]) {
            columns.push({
              key: problem.id + "-" + suboption,
              label: problem.title + "-" + suboption,
              _style: { minWidth: "100px", flexWrap: "nowrap" },
            });
          }
        } else if (problem.type === "MultiGrid") {
          for (let option of problem["選項"]) {
            columns.push({
              key: problem.id + "-" + option,
              label: problem.title + "-" + option,
              _style: { minWidth: "100px", flexWrap: "nowrap" },
            });
          }
        } else
          columns.push({
            key: problem.id,
            label: problem.title,
            _style: { minWidth: "100px", flexWrap: "nowrap" },
          });
      }
      columns.push(
        {
          key: "召會生活操練",
          label: "召會生活操練",
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        },
        {
          key: "神人生活操練",
          label: "神人生活操練",
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        },
        {
          key: "福音牧養操練",
          label: "福音牧養操練",
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        },
        {
          key: "score",
          label: "總分",
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        }
      );

      let items = [];
      let result = {
        total_score: 0,
        召會生活操練: 0,
        神人生活操練: 0,
        福音牧養操練: 0,
        lord_table: 0,
        score: 0,
        cur_召會生活操練: 0,
        cur_神人生活操練: 0,
        cur_福音牧養操練: 0,
        cur_lord_table: 0,
      };
      const lord_table_id = "0it0L8KlnfUVO1i4VUqi";
      for (let i = 0; i < data.value.length; i++) {
        items.push({
          week_base: WeeklyBase2String(parseInt(data.ids[i])),
          score: 0,
        });
        for (let problem of problems) {
          items[i][problem.id] = 0;
          if (!(problem.section in items[i])) items[i][problem.section] = 0;
          if (problem.type === "Grid") {
            for (let suboption of problem["子選項"]) {
              items[i][problem.id + "-" + suboption] = "";
            }
          } else if (problem.type === "MultiGrid") {
            for (let option of problem["選項"]) {
              items[i][problem.id + "-" + option] = 0;
            }
          } else if (problem.type === "MultiChoice") items[i][problem.id] = "";
          else if (problem.type === "Number" || problem.type === "MultiAnswer")
            items[i][problem.id] = 0;
          if (!(problem.id in data.value[i])) continue;
          let score = 0;
          if (problem.type === "MultiChoice") {
            items[i][problem.id] = data.value[i][problem.id].ans;
            score = parseInt(
              problem.score[
                problem["選項"].indexOf(data.value[i][problem.id].ans)
              ]
            );
          } else if (problem.type === "MultiAnswer") {
            items[i][problem.id] = data.value[i][problem.id].ans.length;
            score =
              parseInt(problem.score[0]) * data.value[i][problem.id].ans.length;
          } else if (problem.type === "Grid") {
            for (let suboption of problem["子選項"]) {
              if (suboption in data.value[i][problem.id]) {
                items[i][problem.id + "-" + suboption] =
                  data.value[i][problem.id][suboption].ans;
                score += parseInt(
                  problem.score[
                    problem["選項"].indexOf(
                      data.value[i][problem.id][suboption].ans
                    )
                  ]
                );
              }
            }
          } else if (problem.type === "MultiGrid") {
            for (let option of problem["選項"]) {
              if (option in data.value[i][problem.id]) {
                items[i][problem.id + "-" + option] =
                  data.value[i][problem.id][option].ans.length;
                score +=
                  parseInt(problem.score[problem["選項"].indexOf(option)]) *
                  data.value[i][problem.id][option].ans.length;
              }
            }
          } else if (problem.type === "Number") {
            items[i][problem.id] = data.value[i][problem.id].ans;
            score +=
              parseInt(problem.score[0]) *
              parseInt(data.value[i][problem.id].ans);
          }
          items[i][problem.section] += score;
          items[i].score += score;
        }
        if (
          data.value[i].scores !== items[i].score ||
          data.value[i]["召會生活操練"] !== items[i]["召會生活操練"] ||
          data.value[i]["神人生活操練"] !== items[i]["神人生活操練"] ||
          data.value[i]["福音牧養操練"] !== items[i]["福音牧養操練"]
        )
          await DB.updateByUrl("/accounts/" + id + "/data/" + data.ids[i], {
            scores: items[i].score,
            召會生活操練: items[i]["召會生活操練"]
              ? items[i]["召會生活操練"]
              : 0,
            神人生活操練: items[i]["神人生活操練"]
              ? items[i]["神人生活操練"]
              : 0,
            福音牧養操練: items[i]["福音牧養操練"]
              ? items[i]["福音牧養操練"]
              : 0,
          });
        if (parseInt(data.ids[i]) !== GetWeeklyBase()) {
          result.total_score += items[i].score;
          if ("召會生活操練" in items[i])
            result["召會生活操練"] += items[i]["召會生活操練"];
          if ("神人生活操練" in items[i])
            result["神人生活操練"] += items[i]["神人生活操練"];
          if ("福音牧養操練" in items[i])
            result["福音牧養操練"] += items[i]["福音牧養操練"];
          if (data.value[i][lord_table_id])
            result.lord_table += data.value[i][lord_table_id].ans === "有";
        } else {
          result.score = items[i].score;
          if ("召會生活操練" in items[i])
            result["cur_召會生活操練"] = items[i]["召會生活操練"];
          if ("神人生活操練" in items[i])
            result["cur_神人生活操練"] = items[i]["神人生活操練"];
          if ("福音牧養操練" in items[i])
            result["cur_福音牧養操練"] = items[i]["福音牧養操練"];
          if (data.value[i][lord_table_id])
            result.cur_lord_table = data.value[i][lord_table_id].ans === "有";
        }
      }
      items = items.reverse();
      await DB.updateByUrl("/accounts/" + id, result);
      setItems(items);
      setColumns(columns);
    };
    GetProblems();
  }, [id, data]);
  if (items === null) return loading;
  return (
    <CDataTable
      style={{ flexWrap: "nowrap" }}
      pagination
      fields={columns}
      items={items}
    />
  );
};

const Member = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [account, setAccount] = useState(null);
  useEffect(() => {
    const GetData = async () => {
      let data = { value: [], ids: [] };
      const tmp = await firebase
        .firestore()
        .collection("accounts")
        .doc(id)
        .collection("data")
        .where("week_base", ">=", 127)
        .get();
      await tmp.forEach((doc) => {
        data.value.push(doc.data());
        data.ids.push(doc.id);
      });
      let res = await DB.getByUrl("/accounts/" + id);
      setAccount(res);
      setData(data);
    };
    GetData();
  }, [id]);
  if (data === null || account === null) return loading;
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>個人操練情況查詢-{account.displayName}</CCardHeader>
          <CCardBody>
            <CRow>
              <RenderLineChart data={data} />
            </CRow>
            <CRow style={{ overflowX: "scroll", flexWrap: "nowrap" }}>
              <MemberTable data={data} id={id} />
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Member;
