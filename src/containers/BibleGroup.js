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
  CChartPie,
  // CChartPie,
  CChartPolarArea,
  // CChartDoughnut,
  CChartRadar
} from "@coreui/react-chartjs";
import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";
import { firebase } from "db/firebase";
import { AccountContext } from "hooks/context";
import { useCallback, useContext, useEffect, useState } from "react";
import { GetWeeklyBase, WeeklyBase2String } from "utils/date";
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
const RenderPolarArea = ({ title, labels, data }) => {
  const polar = {
    datasets: [
      {
        data,
        backgroundColor: [
          "#FF6384",
          "#4BC0C0",
          "#FFCE56",
          "#E7E9ED",
          "#36A2EB",
        ],
        label: title, // for legend
      },
    ],
    labels,
  };
  return (
    <CRow className="col-md-6">
      <CCol>
        <h4>{title}</h4>
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

const RenderPieChart = ({ title, labels, data }) => {
  const bar = {
    labels,
    datasets: [
      {
        label: title,
        backgroundColor: [
          "#FF6384",
          "#4BC0C0",
          "#FFCE56",
          "#E7E9ED",
          "#36A2EB",
        ],
        borderColor: ["#FF6384", "#4BC0C0", "#FFCE56", "#E7E9ED", "#36A2EB"],
        borderWidth: 1,
        hoverBackgroundColor: [
          "rgba(255,99,132,0.4)",
          "rgba(75,192,192,0.4)",
          "rgba(255,206,86,0.4)",
          "rgba(231,233,237,0.4)",
          "rgba(54,162,235,0.4)",
        ],
        hoverBorderColor: [
          "#FF6384",
          "#4BC0C0",
          "#FFCE56",
          "#E7E9ED",
          "#36A2EB",
        ],
        data,
      },
    ],
  };
  return (
    <CRow className="col-md-6">
      <CCol>
        <h4>{title}</h4>
        <div className="chart-wrapper">
          <CChartPie datasets={bar.datasets} labels={bar.labels} />
        </div>
        <hr />
      </CCol>
    </CRow>
  );
};

const AdminCardHeader = ({ is_admin, groups, activeGroup, setActiveGroup }) => {
  let menu = [];
  if (is_admin) {
    for (let i = 0; i < groups.ids.length; i++) {
      menu.push(
        <CDropdownItem onClick={() => setActiveGroup(i)}>
          {" "}
          {groups.ids[i]}{" "}
        </CDropdownItem>
      );
    }
  }
  return (
    <CCardHeader>
      <CRow className="align-items-center">
        {is_admin ? (
          <CCol>
            <CDropdown>
              <CDropdownToggle caret color="info">
                <CIcon name="cil-group" /> {groups.ids[activeGroup]}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem header> List of Groups</CDropdownItem>
                {menu}
              </CDropdownMenu>
            </CDropdown>
          </CCol>
        ) : (
          <CCol xs="5" md="7" lg="7" xl="8">
            活力組操練情況查詢
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

const ProblemChart = ({ problem, data }) => {
  let options;
  if (problem.type === "MultiChoice") {
    options = problem["選項"].split(";");
    let polar_area = [];
    for (let i = 0; i < options.length; i++) polar_area.push(0);
    for (let i = 0; i < data.length; i++) {
      if (data[i][problem.id] && options.indexOf(data[i][problem.id].ans) != -1)
        polar_area[options.indexOf(data[i][problem.id].ans)]++;
    }
    return (
      <RenderPieChart
        title={problem.title}
        labels={options}
        data={polar_area}
      />
    );
  } else if (problem.type === "MultiAnswer") return null;
  else if (problem.type === "Grid") return null;
  return null;
};

const ProblemStatistic = ({ problems, groups, activeGroup }) => {
  const [data, setData] = useState([]);
  let charts = [];
  const FetchData = useCallback(async () => {
    let accounts = groups[activeGroup];
    let tmpData = [];
    let now = GetWeeklyBase();
    for (let i = 0; i < accounts.length; i++) {
      let user_data = {};
      try {
        let collection = await firebase
          .firestore()
          .collection("accounts")
          .doc(accounts[i].id)
          .collection("data")
          .get();
        collection.forEach((doc) => {
          if (doc.exists && parseInt(doc.id) === now) {
            user_data = doc.data();
          }
        });
      } catch (e) {
        console.log(e);
      }
      tmpData.push(user_data);
    }
    setData(tmpData);
  }, [activeGroup]);
  useEffect(() => {
    FetchData();
  }, [activeGroup]);
  for (let i = 0; i < problems.ids.length; i++) {
    problems.value[i].id = problems.ids[i];
    charts.push(<ProblemChart problem={problems.value[i]} data={data} />);
  }
  return <CRow>{charts}</CRow>;
};

const GatherAccountsByGroup = (accounts) => {
  let res = { value: [], ids: [] };
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].group && !res.ids.includes(accounts[i].group)) {
      res.ids.push(accounts[i].group);
      res.value.push([]);
    }
    if (accounts[i].group)
      res.value[res.ids.indexOf(accounts[i].group)].push(accounts[i]);
  }
  return res;
};

// FIXME:
// May need to add the necessary hooks
const StatisticCard = ({ is_admin, account, accounts }) => {
  let groups = GatherAccountsByGroup(accounts);
  let [activeGroup, setActiveGroup] = useState(
    groups.ids.indexOf(account.group) === -1
      ? 0
      : groups.ids.indexOf(account.group)
  );
  return (
    <CCard>
      <AdminCardHeader
        is_admin={is_admin}
        groups={groups}
        activeGroup={activeGroup}
        setActiveGroup={setActiveGroup}
      />
      <CCardBody>
        <FirestoreCollection path="/form/">
          {(d) => {
            if (d && d.value)
              return (
                <ProblemStatistic
                  problems={d}
                  groups={groups.value}
                  activeGroup={activeGroup}
                />
              );
            else return loading;
          }}
        </FirestoreCollection>
      </CCardBody>
    </CCard>
  );
};
// FIXME:
// Need to add hooks for each dropdown item
// Also needed for search
const BibleGroup = () => {
  const account = useContext(AccountContext);
  let is_admin = account.role === "Admin";
  return (
    <CRow>
      <FirestoreCollection path="/accounts/">
        {(d) => {
          if (d && d.value) {
            for (let i = 0; i < d.value.length; i++) d.value[i].id = d.ids[i];
            return (
              <CCol>
                <StatisticCard
                  account={is_admin ? d.value[0] : account}
                  accounts={d.value}
                  is_admin={is_admin}
                />
              </CCol>
            );
          } else return loading;
        }}
      </FirestoreCollection>
    </CRow>
  );
};

export default BibleGroup;
