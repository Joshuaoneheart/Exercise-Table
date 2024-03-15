import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import { FirestoreCollection } from "@react-firebase/firestore";
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

const MemberTable = ({ data }) => {
  let ids = data.ids.map((x) => parseInt(x));
  const [problems, setProblems] = useState(null);
  useEffect(() => {
    const getProblems = async () => {
      let docs = await DB.getByUrl("/form");
      let tmp = [];
      await docs.forEach((doc) => {
        tmp.push(Object.assign({ id: doc.id }, doc.data()));
      });
      setProblems(tmp);
    };
    getProblems();
  }, []);
  if (problems === null) return loading;
  let columns = [{ key: "week_base", label: "Week" }];
  for (let problem of problems) {
    if (problem.type === "Grid") {
      for (let suboption of problem["子選項"]) {
        columns.push({
          key: problem.id + "-" + suboption,
          label: problem.title + "-" + suboption,
        });
      }
    } else if (problem.type === "MultiGrid") {
      for (let option of problem["選項"]) {
        columns.push({
          key: problem.id + "-" + option,
          label: problem.title + "-" + option,
        });
      }
    } else columns.push({ key: problem.id, label: problem.title });
  }
  let items = [];
  for (let i = 0; i < data.value.length; i++) {
    items.push({ week_base: WeeklyBase2String(parseInt(data.ids[i])) });
    for (let problem of problems) {
      if (!(problem.id in data.value[i])) continue;
      if (problem.type === "MultiChoice")
        items[i][problem.id] = data.value[i][problem.id].ans;
      else if (problem.type === "MultiAnswer")
        items[i][problem.id] = data.value[i][problem.id].ans.length;
      else if (problem.type === "Grid") {
        for (let suboption of problem["子選項"]) {
          items[i][problem.id + "-" + suboption] =
            data.value[i][problem.id][suboption].ans;
        }
      } else if (problem.type == "MultiGrid") {
        for (let option of problem["選項"]) {
          items[i][problem.id + "-" + option] =
            data.value[i][problem.id][option].ans.length;
        }
      } else if (problem.type == "Number")
        items[i][problem.id] = data.value[i][problem.id].ans;
    }
  }
  return <CDataTable pagination fields={columns} items={items} />;
};

const Member = () => {
  const { id } = useParams();
  return (
    <CRow>
      <CCol>
        <FirestoreCollection
          path={"/accounts/" + id + "/data/"}
          where={{
            field: "week_base",
            operator: ">=",
            value: 127,
          }}
        >
          {(data) => {
            if (data.isLoading) return loading;
            if (data && data.value) {
              return (
                <CCard>
                  <CCardHeader>個人操練情況查詢</CCardHeader>
                  <CCardBody>
                    <CRow>
                      <RenderLineChart data={data} />
                    </CRow>
                    <CRow style={{ overflowX: "scroll", flexWrap: "nowrap" }}>
                      <MemberTable data={data} />
                    </CRow>
                  </CCardBody>
                </CCard>
              );
            }
          }}
        </FirestoreCollection>
      </CCol>
    </CRow>
  );
};

export default Member;
