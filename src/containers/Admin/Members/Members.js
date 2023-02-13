import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CInput,
  // CListGroup,
  // CListGroupItem,
  CRow
} from "@coreui/react";
import {
  // CChart,
  CChartBar,
  // CChartHorizontalBar,
  CChartLine,
  // CChartPie,
  CChartPolarArea,
  // CChartDoughnut,
  CChartRadar
} from "@coreui/react-chartjs";
import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";
import { AccountContext } from "hooks/context";
import { useContext, useState } from "react";
import { WeeklyBase2String } from "utils/date";
// import { FirestoreCollection } from "@react-firebase/firestore";

// TODO:
// 1. Set a function that takes input from firebase and renders the charts accordingly

// FIXME:
// Please do not forget to modify me for your own purposes
const RenderRadarChart = () => {
  // This servers purely as an example
  const radar = {
    labels: [
      "Eating",
      "Drinking",
      "Sleeping",
      "Designing",
      "Coding",
      "Cycling",
      "Running",
    ],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgba(179,181,198,0.2)",
        borderColor: "rgba(179,181,198,1)",
        pointBackgroundColor: "rgba(179,181,198,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179,181,198,1)",
        data: [65, 59, 90, 81, 56, 55, 40],
      },
      {
        label: "My Second dataset",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        pointBackgroundColor: "rgba(255,99,132,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255,99,132,1)",
        data: [28, 48, 40, 19, 96, 27, 100],
      },
    ],
  };
  return (
    <CRow className="col-md-6">
      <CCol>
        <h4>Radar</h4>
        <div className="chart-wrapper">
          <CChartRadar datasets={radar.datasets} labels={radar.labels} />
        </div>
        <hr />
      </CCol>
    </CRow>
  );
};

// FIXME:
// Please do not forget to modify me for your own purposes
const RenderPolarArea = () => {
  const polar = {
    datasets: [
      {
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          "#FF6384",
          "#4BC0C0",
          "#FFCE56",
          "#E7E9ED",
          "#36A2EB",
        ],
        label: "My dataset", // for legend
      },
    ],
    labels: ["Red", "Green", "Yellow", "Grey", "Blue"],
  };
  return (
    <CRow className="col-md-6">
      <CCol>
        <h4>Polar Area</h4>
        <div className="chart-wrapper">
          <CChartPolarArea datasets={polar.datasets} labels={polar.labels} />
        </div>
        <hr />
      </CCol>
    </CRow>
  );
};

// FIXME:
// Same as before
const RenderBarChart = () => {
  const bar = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };
  return (
    <CRow className="col-md-6">
      <CCol>
        <h4>Bar</h4>
        <div className="chart-wrapper">
          <CChartBar datasets={bar.datasets} labels={bar.labels} />
        </div>
        <hr />
      </CCol>
    </CRow>
  );
};

// FIXME:
// Saaaaaaaaaaaameeeeeeeeeeeeeee
const RenderLineChart = ({data}) => {
  let labels = [];
  let chart_data = [];
  let ids = data.ids.map((x) => parseInt(x));
  let lower = Math.min(...ids);
  let upper = Math.max(...ids);
  console.log(lower, upper)
  for(let i = lower;i <= upper;i++){
    labels.push(WeeklyBase2String(i));
    if(ids.includes(i)){
      console.log(data.value[ids.indexOf(i)])
      chart_data.push(data.value[ids.indexOf(i)].scores);
    } else chart_data.push(null);
  }
  console.log(labels)
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
        spanGaps:true
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
const AdminCardHeader = ({
  is_admin,
  accounts,
  activeAccount,
  setActiveAccount,
}) => {
  let menu = [];
  if (is_admin) {
    for (let i = 0;i < accounts.length;i++) {
      menu.push(<CDropdownItem onClick={() => setActiveAccount(accounts[i])}> {accounts[i].displayName} </CDropdownItem>);
    }
  }
  return (
    <CCardHeader>
      <CRow className="align-items-center">
        {is_admin ? (
          <CCol>
            <CDropdown>
              <CDropdownToggle caret color="info">
                <CIcon name="cil-user" /> {activeAccount.displayName}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem header> List of Users</CDropdownItem>
                {menu}
              </CDropdownMenu>
            </CDropdown>
          </CCol>
        ) : (
          <CCol xs="5" md="7" lg="7" xl="8">
            個人操練情況查詢
          </CCol>
        )}
        <CForm inline style={{ visibility: is_admin ? "visible" : "hidden" }}>
          <CInput className="mr-sm-2" placeholder="Search" size="sm" />
          <CButton color="dark" type="submit" size="sm">
            <CIcon name="cil-search" size="sm" />
          </CButton>
        </CForm>
      </CRow>
    </CCardHeader>
  );
};

// FIXME:
// May need to add the necessary hooks
const StatisticCard = ({ is_admin, account, accounts }) => {
  const [activeAccount, setActiveAccount] = useState(account);
  return (
    <FirestoreCollection path={"/accounts/" + activeAccount.id + "/data/"}>
      {(data) => {
        if (data.isLoading) return loading;
        return (
          <CCard>
            <AdminCardHeader
              is_admin={is_admin}
              accounts={accounts}
              activeAccount={activeAccount}
              setActiveAccount={setActiveAccount}
            />
            <CCardBody>
              <CRow>
                <RenderRadarChart />
                <RenderPolarArea />
                <RenderBarChart />
                <RenderLineChart data={data}/>
              </CRow>
            </CCardBody>
          </CCard>
        );
      }}
    </FirestoreCollection>
  );
};
// FIXME:
// Need to add hooks for each dropdown item
// Also needed for search
const Members = () => {
  const account = useContext(AccountContext);
  if (account.role === "Admin") {
    return (
      <CRow>
        <FirestoreCollection path="/accounts/">
          {(d) => {
            if (d && d.value) {
              for(let i = 0;i < d.value.length;i++) d.value[i].id = d.ids[i]
              return (
                <CCol>
                  <StatisticCard
                    account={d.value[0]}
                    accounts={d.value}
                    is_admin={true}
                  />
                </CCol>
              );
            } else return loading;
          }}
        </FirestoreCollection>
      </CRow>
    );
  } else {
    return (
      <CRow>
        <StatisticCard account={account} is_admin={false} />
      </CRow>
    );
  }
};

export default Members;
