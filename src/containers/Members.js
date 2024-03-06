import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import Select from "react-select";
import { CChartLine } from "@coreui/react-chartjs";
import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";
import { AccountContext, AccountsMapContext } from "hooks/context";
import { useContext, useState } from "react";
import { WeeklyBase2String } from "utils/date";

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
const AdminCardHeader = ({ is_admin, activeAccount, setActiveAccount }) => {
  const accountsMap = useContext(AccountsMapContext);
  let menu = [];
  if (is_admin) {
    for (let [k, v] of Object.entries(accountsMap)) {
      menu.push({
        id: k,
        name: v,
        value: k + "|" + v,
        label: <span style={{ whiteSpace: "pre" }}>{v}</span>,
      });
    }
  }
  return (
    <CCardHeader>
      <CRow className="align-items-center">
        {is_admin ? (
          <CCol md={3} xs={3}>
            <Select
              value={{
                id: activeAccount.id,
                name: activeAccount.displayName,
                value: activeAccount.id + "|" + activeAccount.displayName,
                label: (
                  <span style={{ whiteSpace: "pre" }}>
                    {activeAccount.displayName}
                  </span>
                ),
              }}
              isSearchable
              options={menu}
              onChange={(v) => {
                setActiveAccount({ id: v.id, displayName: v.name });
              }}
            />
          </CCol>
        ) : (
          <CCol xs="5" md="7" lg="7" xl="8">
            個人操練情況查詢
          </CCol>
        )}
      </CRow>
    </CCardHeader>
  );
};

// FIXME:
// May need to add the necessary hooks
const StatisticCard = () => {
  const account = useContext(AccountContext);
  const [activeAccount, setActiveAccount] = useState({
    id: account.id,
    displayName: account.displayName,
  });
  return (
    <FirestoreCollection path={"/accounts/" + activeAccount.id + "/data/"}>
      {(data) => {
        if (data.isLoading) return loading;
        if (data && data.value) {
          return (
            <CCard>
              <AdminCardHeader
                is_admin={account.role === "Admin"}
                activeAccount={activeAccount}
                setActiveAccount={setActiveAccount}
              />
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
  );
};
// FIXME:
// Need to add hooks for each dropdown item
// Also needed for search
const Members = () => {
  return (
    <CRow>
      <CCol>
        <StatisticCard />
      </CCol>
    </CRow>
  );
};

export default Members;
