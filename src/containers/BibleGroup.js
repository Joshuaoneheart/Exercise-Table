import { CCard, CCardBody, CCol, CRow } from "@coreui/react";
import { CChartBar, CChartPie } from "@coreui/react-chartjs";
import { FirestoreCollection } from "@react-firebase/firestore";
import Groups from "Models/Groups";
import { loading } from "components";
import { DB } from "db/firebase";
import { AccountsMapContext, GroupContext } from "hooks/context";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { GetWeeklyBase } from "utils/date";

// TODO:
// 1. Set a function that takes input from firebase and renders the charts accordingly

const colors = [
  "rgba(255,99,132,1)",
  "rgba(75,192,192,1)",
  "rgba(255,206,86,1)",
  "rgba(88,25,8,1)",
  "rgba(54,162,235,1)",
  "rgba(46,14,2,1)",
  "rgba(226,174,221,1)",
  "rgba(255,232,194,1)",
  "rgba(228,255,225,1)",
  "rgba(161,134,158,1)",
];
const a_colors = [
  "rgba(255,99,132,0.4)",
  "rgba(75,192,192,0.4)",
  "rgba(255,206,86,0.4)",
  "rgba(88,25,8,0.4)",
  "rgba(54,162,235,0.4)",
  "rgba(46,14,2,0.4)",
  "rgba(226,174,221,0.4)",
  "rgba(255,232,194,0.4)",
  "rgba(228,255,225,0.4)",
  "rgba(161,134,158,0.4)",
];
const aa_colors = [
  "rgba(255,99,132,0.2)",
  "rgba(75,192,192,0.2)",
  "rgba(255,206,86,0.2)",
  "rgba(88,25,8,0.2)",
  "rgba(54,162,235,0.2)",
  "rgba(46,14,2,0.2)",
  "rgba(226,174,221,0.2)",
  "rgba(255,232,194,0.2)",
  "rgba(228,255,225,0.2)",
  "rgba(161,134,158,0.2)",
];

// FIXME:
// Same as before
const RenderBarChart = ({ title, titles, labels, data }) => {
  let datasets = [];
  for (let i = 0; i < titles.length; i++) {
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
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        hoverBackgroundColor: a_colors,
        hoverBorderColor: colors,
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
  const accountsMap = useContext(AccountsMapContext);
  if (problem.type === "MultiChoice") {
    options = problem["選項"];
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
    suboptions = problem["子選項"];
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
    suboptions = problem["子選項"];
    options = problem["選項"];
    let bar_data = [];
    for (let i = 0; i < suboptions.length; i++) {
      bar_data.push([]);
      for (let j = 0; j < options.length; j++) bar_data[i].push(0);
      for (let j = 0; j < data.length; j++) {
        if (
          data[j][problem.id] &&
          data[j][problem.id][suboptions[i]] &&
          options.includes(data[j][problem.id][suboptions[i]].ans)
        )
          bar_data[i][
            options.indexOf(data[j][problem.id][suboptions[i]].ans)
          ]++;
      }
    }
    return (
      <RenderBarChart
        title={problem.title}
        titles={suboptions}
        labels={options}
        data={bar_data}
      />
    );
  } else if (problem.type === "MultiGrid") {
    suboptions = problem["子選項"];
    options = problem["選項"];
    let bar_data = [];
    for (let i = 0; i < options.length; i++) {
      bar_data.push([]);
      for (let j = 0; j < suboptions.length; j++) bar_data[i].push(0);
      for (let j = 0; j < data.length; j++) {
        if (data[j][problem.id] && data[j][problem.id][options[i]])
          for (let k = 0; k < data[j][problem.id][options[i]].ans.length; k++) {
            if (suboptions.includes(data[j][problem.id][options[i]].ans[k]))
              bar_data[i][
                suboptions.indexOf(data[j][problem.id][options[i]].ans[k])
              ]++;
          }
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
  } else if (problem.type == "Number") {
    let bar_data = [
      data.map((x) => (x[problem.id] ? parseInt(x[problem.id].ans) : 0)),
    ];
    return (
      <RenderBarChart
        title={problem.title}
        titles={[problem.title]}
        labels={data.map((x) => accountsMap[x.id])}
        data={bar_data}
      />
    );
  }
  return null;
};

const ProblemStatistic = ({ problems, groups, group_id }) => {
  const [data, setData] = useState([]);
  let charts = [];
  const FetchData = useCallback(async () => {
    let accounts = groups.list[groups.indexOf(group_id)];
    let tmpData = [];
    let now = GetWeeklyBase();
    for (let i = 0; i < accounts.length; i++) {
      let user_data = { id: accounts.list[i].id };
      try {
        let collection = await DB.getByUrl(
          "/accounts/" + accounts.list[i].id + "/data"
        );
        collection.forEach((doc) => {
          if (doc.exists && parseInt(doc.id) === now) {
            user_data = Object.assign(user_data, doc.data());
          }
        });
      } catch (e) {
        console.log(e);
      }
      tmpData.push(user_data);
    }
    setData(tmpData);
  }, [group_id, groups]);
  useEffect(() => {
    FetchData();
  }, [FetchData]);
  for (let i = 0; i < problems.ids.length; i++) {
    problems.value[i].id = problems.ids[i];
    charts.push(<ProblemChart problem={problems.value[i]} data={data} />);
  }
  return <CRow>{charts}</CRow>;
};

// FIXME:
// May need to add the necessary hooks
const StatisticCard = ({ group_id, groups }) => {
  groups.groupBy("group");
  return (
    <CCard>
      <CCardBody>
        <FirestoreCollection path="/form/">
          {(d) => {
            if (d && d.value)
              return (
                <ProblemStatistic
                  problems={d}
                  group_id={group_id}
                  groups={groups}
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
  const { id } = useParams();
  const groupMap = useContext(GroupContext);
  return (
    <CRow>
      <FirestoreCollection path="/accounts/">
        {(d) => {
          if (d && d.value) {
            return (
              <CCol>
                <StatisticCard
                  group_id={id}
                  groups={new Groups(d.value, d.ids, groupMap)}
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
