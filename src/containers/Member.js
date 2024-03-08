import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";
import { WeeklyBase2String } from "utils/date";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

// TODO:
// 1. Set a function that takes input from firebase and renders the charts accordingly

// FIXME:
// Saaaaaaaaaaaameeeeeeeeeeeeeee
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

const Member = () => {
  const { id } = useParams();
  return (
    <CRow>
      <CCol>
        <FirestoreCollection path={"/accounts/" + id + "/data/"}>
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
