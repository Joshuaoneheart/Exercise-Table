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
  CRow
} from "@coreui/react";
import {
  CChartBar, CChartPie
} from "@coreui/react-chartjs";
import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";
import { firebase } from "db/firebase";
import { AccountContext } from "hooks/context";
import { useCallback, useContext, useEffect, useState } from "react";
import { GetWeeklyBase } from "utils/date";

// TODO:
// 1. Set a function that takes input from firebase and renders the charts accordingly

const colors = [
  "rgba(255,99,132,1)",
  "rgba(75,192,192,1)",
  "rgba(255,206,86,1)",
  "rgba(231,233,237,1)",
  "rgba(54,162,235,1)",
];
const a_colors = [
  "rgba(255,99,132,0.4)",
  "rgba(75,192,192,0.4)",
  "rgba(255,206,86,0.4)",
  "rgba(231,233,237,0.4)",
  "rgba(54,162,235,0.4)",
];
const aa_colors = [
  "rgba(255,99,132,0.2)",
  "rgba(75,192,192,0.2)",
  "rgba(255,206,86,0.2)",
  "rgba(231,233,237,0.2)",
  "rgba(54,162,235,0.2)",
];

// FIXME:
// Same as before
const RenderBarChart = ({ title, titles, labels, data }) => {
  let datasets = [];
  for (let i = 0; i < data.length; i++) {
    datasets.push({
      label: titles[i],
      backgroundColor: aa_colors[i],
      borderColor: colors[i],
      borderWidth: 1,
      hoverBackgroundColor: a_colors[i],
      hoverBorderColor: colors[i],
      data: data[i],
    });
  }
  const bar = {
    labels,
    datasets,
  };
  return (
    <CRow className="col-md-6">
      <CCol>
        <h4>{title}</h4>
        <div className="chart-wrapper">
          <CChartBar datasets={bar.datasets} labels={bar.labels} />
        </div>
        <hr />
      </CCol>
    </CRow>
  );
};

const RenderPieChart = ({ title, labels, data }) => {
  const pie = {
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
          <CChartPie datasets={pie.datasets} labels={pie.labels} />
        </div>
        <hr />
      </CCol>
    </CRow>
  );
};

const ProblemChart = ({ problem, data }) => {
  let options;
  let suboptions;
  if (problem.type === "MultiChoice") {
    options = problem["選項"].split(";");
    let polar_area = [];
    for (let i = 0; i < options.length; i++) polar_area.push(0);
    for (let i = 0; i < data.length; i++) {
      if (
        data[i][problem.id] &&
        options.indexOf(data[i][problem.id].ans) !== -1
      )
        polar_area[options.indexOf(data[i][problem.id].ans)]++;
    }
    return (
      <RenderPieChart
        title={problem.title}
        labels={options}
        data={polar_area}
      />
    );
  } else if (problem.type === "MultiAnswer") {
    suboptions = problem["子選項"].split(";");
    let h_bar_data = [];
    for (let i = 0; i < suboptions.length; i++) h_bar_data.push(0);
    for (let i = 0; i < data.length; i++) {
      if (data[i][problem.id]) {
        for (let j = 0; j < data[i][problem.id].ans.length; j++) {
          if (suboptions.indexOf(data[i][problem.id].ans[j]) !== -1)
            h_bar_data[suboptions.indexOf(data[i][problem.id].ans[j])]++;
        }
      }
    }
    return (
      <RenderPieChart
        data={h_bar_data}
        labels={suboptions}
        title={problem.title}
      />
    );
  } else if (problem.type === "Grid") {
    suboptions = problem["子選項"].split(";");
    options = problem["選項"].split(";");
    let bar_data = [];
    for (let i = 0; i < suboptions.length; i++) {
      bar_data.push([]);
      for (let j = 0; j < options.length; j++) bar_data[i].push(0);
      for (let j = 0; j < data.length; j++) {
        if (
          data[j][problem.id] &&
          data[j][problem.id][suboptions[i]] &&
          options.indexOf(data[j][problem.id][suboptions[i]].ans) !== -1
        )
          bar_data[i][
            options.indexOf(data[j][problem.id][suboptions[i]].ans)
          ]++;
      }
    }
    return (
      <RenderBarChart
        title={problem.title}
        titles={options}
        labels={suboptions}
        data={bar_data}
      />
    );
  }
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
  }, [activeGroup, groups]);
  useEffect(() => {
    FetchData();
  }, [FetchData]);
  for (let i = 0; i < problems.ids.length; i++) {
    problems.value[i].id = problems.ids[i];
    charts.push(<ProblemChart problem={problems.value[i]} data={data} />);
  }
  return <CRow>{charts}</CRow>;
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
