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
import { WeeklyBase2String } from "utils/date";
import { DB } from "db/firebase";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { GetProblems, SummaryScore } from "utils/problem";
import { GetSemesterData } from "utils/account";

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
    const GetProblemData = async () => {
      let problems = await GetProblems();
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
      let { items, result } = await SummaryScore(data, problems, id);
      items = items.reverse();
      await DB.updateByUrl("/accounts/" + id, result);
      setItems(items);
      setColumns(columns);
    };
    GetProblemData();
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
      const semester = await DB.getByUrl("/info/semester");
      let res = await DB.getByUrl("/accounts/" + id);
      setAccount(res);
      setData(await GetSemesterData(id, semester));
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
