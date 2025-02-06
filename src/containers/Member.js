import { CCol, CDataTable, CRow } from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import { loading } from "components";
import {
  GetWeeklyBase,
  GetWeeklyBaseFromTime,
  WeeklyBase2String,
} from "utils/date";
import { DB } from "db/firebase";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useContext, useEffect, useState } from "react";
import { GetProblems, SummaryScore } from "utils/problem";
import { GetSemesterData } from "utils/account";
import { useTranslation } from "react-i18next";
import i18n from "i18n";
import SemesterContext from "hooks/semester";
import Row from "components/Row";
import { registFormat } from "utils/date";
import Col from "components/Col";
import Tab from "components/Tab";
import RadarChart from "components/RadarChart";
import VerticalBarChart from "components/VerticalBarChart";
const RenderLineChart = ({ data, semester }) => {
  let labels = [];
  let chart_data = [];
  let ids = data.ids.map((x) => parseInt(x));
  let lower = GetWeeklyBaseFromTime(semester.start.toDate());
  let upper = Math.max(
    GetWeeklyBaseFromTime(semester.start.toDate()),
    Math.min(GetWeeklyBase(), GetWeeklyBaseFromTime(semester.end.toDate()))
  );
  for (let i = lower; i <= upper; i++) {
    labels.push(WeeklyBase2String(i));
    if (ids.includes(i)) {
      chart_data.push(data.value[ids.indexOf(i)].scores);
    } else chart_data.push(0);
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
  const { t } = useTranslation("translation", { i18n });
  const [items, setItems] = useState(null);
  const [columns, setColumns] = useState(null);
  useEffect(() => {
    const GetProblemData = async () => {
      let problems = await GetProblems(null, false);
      let columns = [
        {
          key: "week_base",
          label: "Week",
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        },
      ];

      let { items, result, column_keys, column_labels } = await SummaryScore(
        data,
        problems,
        id
      );
      items = items.reverse();
      for (let i = 0; i < column_keys.length; i++) {
        columns.push({
          key: column_keys[i],
          label: t(column_labels[i]),
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        });
      }
      columns.push(
        {
          key: "召會生活操練",
          label: t("召會生活操練"),
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        },
        {
          key: "神人生活操練",
          label: t("神人生活操練"),
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        },
        {
          key: "福音牧養操練",
          label: t("福音牧養操練"),
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        },
        {
          key: "score",
          label: t("總分"),
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        }
      );
      await DB.updateByUrl("/accounts/" + id, result);
      setItems(items);
      setColumns(columns);
    };
    GetProblemData();
  }, [id, data, t]);
  if (items === null) return loading;
  return (
    <CDataTable
      style={{ flexWrap: "nowrap" }}
      pagination
      itemsPerPage={20}
      fields={columns}
      items={items}
    />
  );
};

const Member = () => {
  const { t } = useTranslation("translation", { i18n });
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [account, setAccount] = useState(null);
  const { semester } = useContext(SemesterContext);
  const [active, setActive] = useState(0);
  const [curChart, setCurChart] = useState(0);
  useEffect(() => {
    const GetData = async () => {
      let res = await DB.getByUrl("/accounts/" + id);
      setAccount(res);
      let tmp = await GetSemesterData(id, semester);
      let problems = await GetProblems(null, false);
      setData(await SummaryScore(tmp, problems, id));
    };
    if (semester) GetData();
  }, [id, semester]);
  if (data === null || account === null) return loading;
  const weekBase = Math.min(
    GetWeeklyBase(),
    GetWeeklyBaseFromTime(semester.end.toDate())
  );
  const isValidDate = (week) => {
    return GetWeeklyBaseFromTime(semester.start.toDate()) <= week;
  };
  let dataset = {
    group: [0, 0, 0, 1, 1],
    color: ["#0055CC1A", "#22B6EC1A", "#82E5FF1A", "#EFAD611A", "#A69A751A"],
    stroke: ["#1E3D68", "#008ABD", "#48D3F4", "#EFAD61", "#B1A48D"],
    legend: [
      WeeklyBase2String(weekBase),
      WeeklyBase2String(weekBase - 1),
      WeeklyBase2String(weekBase - 2),
      "三週平均",
      "學期平均",
    ],
    disabled: [
      false,
      !isValidDate(weekBase - 1),
      !isValidDate(weekBase - 2),
      false,
      false,
    ],
    data: [[], [], [], [], []],
    label: [[], [], [], [], []],
  };
  let bar_chart_data = [];
  const bar_color = ["#1E3D68", "var(--main-blue)", "#48D3F4"];
  let max_bar = 0;
  let semester_score = 0;
  let score_3 = 0;
  // 召會生活, 神人生活, 福音牧養
  let all_mean = [0, 0, 0];
  let mean_3 = [0, 0, 0];
  const max_total_score = [0, 0, 0];
  let cnt = 0;
  for (let item of data.items) {
    all_mean[0] += item["召會生活操練"];
    all_mean[1] += item["神人生活操練"];
    all_mean[2] += item["福音牧養操練"];
    let score = isNaN(item.score) ? 0 : item.score;
    semester_score += score;
    console.log(score)
    max_bar = Math.max(max_bar, score);
    if (dataset.legend.includes(item.week_base)) {
      score_3 += score;
      mean_3[0] += item["召會生活操練"];
      mean_3[1] += item["神人生活操練"];
      mean_3[2] += item["福音牧養操練"];
      cnt += 1;
      let idx = dataset.legend.indexOf(item.week_base);
      bar_chart_data.push({
        label: item.week_base,
        value: score,
        color: bar_color[idx],
        text_color: "#000000",
      });
      let total_score = item.total_score;
      if (!total_score) total_score = item;
      else
        max_bar = Math.max(
          Object.values(total_score).reduce((a, b) => a + b, 0),
          max_bar
        );

      dataset.label[idx] = [
        [
          "召會生活",
          `分數:${item["召會生活操練"]}/${total_score["召會生活操練"]}`,
        ],
        [
          "神人生活",
          `分數:${item["神人生活操練"]}/${total_score["神人生活操練"]}`,
        ],
        [
          "福音牧養",
          `分數:${item["福音牧養操練"]}/${total_score["福音牧養操練"]}`,
        ],
      ];
      dataset.data[idx] = [
        item["召會生活操練"] / (total_score["召會生活操練"] + 0.01),
        item["神人生活操練"] / (total_score["神人生活操練"] + 0.01),
        item["福音牧養操練"] / (total_score["福音牧養操練"] + 0.01),
      ];
      max_total_score[0] = Math.max(
        total_score["召會生活操練"],
        max_total_score[0]
      );
      max_total_score[1] = Math.max(
        total_score["神人生活操練"],
        max_total_score[1]
      );
      max_total_score[2] = Math.max(
        total_score["福音牧養操練"],
        max_total_score[2]
      );
    } else
      bar_chart_data.push({
        label: item.week_base,
        value: score,
        color: "rgb(0 0 0 / 10%)",
        text_color: "rgb(0 0 0 / 10%)",
      });
  }
  score_3 = Math.round((score_3 / cnt) * 100) / 100;
  semester_score = Math.round((semester_score / data.items.length) * 100) / 100;

  dataset.label[3] = [
    [
      "召會生活",
      `分數:${Math.round((mean_3[0] / cnt) * 100) / 100}/${max_total_score[0]}`,
    ],
    [
      "神人生活",
      `分數:${Math.round((mean_3[1] / cnt) * 100) / 100}/${max_total_score[1]}`,
    ],
    [
      "福音牧養",
      `分數:${Math.round((mean_3[2] / cnt) * 100) / 100}/${max_total_score[2]}`,
    ],
  ];
  dataset.data[3] = [
    mean_3[0] / cnt / max_total_score[0],
    mean_3[1] / cnt / max_total_score[1],
    mean_3[2] / cnt / max_total_score[2],
  ];
  dataset.label[4] = [
    [
      "召會生活",
      `分數:${Math.round((all_mean[0] / data.items.length) * 100) / 100}/${
        max_total_score[0]
      }`,
    ],
    [
      "神人生活",
      `分數:${Math.round((all_mean[1] / data.items.length) * 100) / 100}/${
        max_total_score[1]
      }`,
    ],
    [
      "福音牧養",
      `分數:${Math.round((all_mean[2] / data.items.length) * 100) / 100}/${
        max_total_score[2]
      }`,
    ],
  ];
  dataset.data[4] = [
    all_mean[0] / data.items.length / max_total_score[0],
    all_mean[1] / data.items.length / max_total_score[1],
    all_mean[2] / data.items.length / max_total_score[2],
  ];
  return (
    <>
      <div style={{ backgroundColor: "var(--white)", paddingTop: "8px" }}>
        <Row>
          <img
            style={{ marginLeft: "12px", marginRight: "16px" }}
            src={process.env.PUBLIC_URL + "/Images/lion.svg"}
            alt="head"
          />
          <Col style={{ paddingTop: "11px", paddingBottom: "11px" }}>
            <span className="heading2-medium">{account.displayName}</span>
            <span
              className="secondary-medium"
              style={{ color: "rgb(0 0 0 / 60%)" }}
            >{`(暱稱:${
              account.nickname && account.nickname !== ""
                ? account.nickname
                : "未設置"
            })`}</span>
          </Col>
        </Row>
        <div
          style={{
            marginLeft: "16px",
            paddingTop: "8px",
            paddingBottom: "8px",
          }}
        >
          <span className="secondary-medium">{`Email: ${account.email}`}</span>
          <br />
          <span className="secondary-medium">{`Registered time: ${registFormat(
            account
          )}`}</span>
          <br />
          <span className="secondary-medium">{`Role: ${
            account.is_admin ? "Admin" : "Member"
          }`}</span>
          <br />
        </div>
      </div>
      <Tab
        setActive={setActive}
        active={active}
        titles={["圖表分析", "分數紀錄"]}
        tabStyle={{ position: "sticky", top: "0px", zIndex: 90 }}
      />
      {active === 0 ? (
        <Row
          style={{
            flexWrap: "wrap",
            backgroundColor: "var(--white)",
          }}
        >
          <Col>
            <span
              style={{
                paddingTop: "10px",
                paddingBottom: "10px",
                marginLeft: "16px",
              }}
              className="primary-regular"
            >
              各項操練分析
            </span>
            <RadarChart
              width={375}
              height={290}
              num_points={3}
              dataset={dataset}
              curChart={curChart}
              setCurChart={setCurChart}
            />
          </Col>
          <Col>
            {" "}
            <span
              style={{
                paddingTop: "8px",
                paddingBottom: "8px",
                marginLeft: "16px",
              }}
              className="primary-regular"
            >
              各週總分記錄
            </span>
            <VerticalBarChart
              width={375}
              height={336}
              max_bar={max_bar}
              data={bar_chart_data.reverse()}
              top_data={[
                {
                  label: "三週平均分數",
                  value: score_3,
                  color: "#FFBA6B",
                  text_color: "#000000",
                },
                {
                  label: "學期平均分數",
                  value: semester_score,
                  color: "#B1A48D",
                  text_color: "#000000",
                },
              ]}
            />
          </Col>
        </Row>
      ) : null}
    </>
  );
};

export default Member;
