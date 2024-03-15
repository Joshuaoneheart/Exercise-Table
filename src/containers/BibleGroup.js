import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import { CChartBar, CChartPie } from "@coreui/react-chartjs";
import { FirestoreCollection } from "@react-firebase/firestore";
import Groups from "Models/Groups";
import { loading } from "components";
import { DB } from "db/firebase";
import { AccountsMapContext, GroupContext } from "hooks/context";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { GetWeeklyBase, WeeklyBase2String } from "utils/date";
import Select from "react-select";

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
const RenderBarChart = ({ title, titles, labels, data, tooltip_label }) => {
  let datasets = [];
  let options = {};
  if (tooltip_label) {
    options = {
      tooltips: {
        intersect: true,
        mode: "index",
        position: "nearest",
        callbacks: {
          title: (tooltipItem, data) => {
            return data["labels"][tooltipItem[0]["index"]];
          },
          label: (tooltipItem, data) => {
            return (
              data["datasets"][tooltipItem.datasetIndex].label +
              " " +
              tooltip_label[tooltipItem.datasetIndex][tooltipItem.index].join(
                ","
              )
            );
          },
          labelColor(tooltipItem, chart) {
            function getValue(prop) {
              return typeof prop === "object" ? prop[tooltipItem.index] : prop;
            }

            const dataset = chart.data.datasets[tooltipItem.datasetIndex];
            //tooltipLabelColor is coreUI custom prop used only here
            const backgroundColor = getValue(
              dataset.tooltipLabelColor ||
                dataset.pointHoverBackgroundColor ||
                dataset.borderColor ||
                dataset.backgroundColor
            );
            return {
              backgroundColor,
            };
          },
        },
      },
    };
  }

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
          <CChartBar
            datasets={bar.datasets}
            labels={bar.labels}
            options={options}
          />
        </div>
        <hr />
      </CCol>
    </CRow>
  );
};

const RenderPieChart = ({ title, labels, data, tooltip_label }) => {
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
  let options = {};
  if (tooltip_label) {
    options = {
      tooltips: {
        intersect: true,
        mode: "index",
        position: "nearest",
        callbacks: {
          title: (tooltipItem, data) => {
            return data["labels"][tooltipItem[0]["index"]];
          },
          label: (tooltipItem, data) => {
            return tooltip_label[tooltipItem.index].join(",");
          },
          labelColor(tooltipItem, chart) {
            function getValue(prop) {
              return typeof prop === "object" ? prop[tooltipItem.index] : prop;
            }

            const dataset = chart.data.datasets[tooltipItem.datasetIndex];
            //tooltipLabelColor is coreUI custom prop used only here
            const backgroundColor = getValue(
              dataset.tooltipLabelColor ||
                dataset.pointHoverBackgroundColor ||
                dataset.borderColor ||
                dataset.backgroundColor
            );
            return {
              backgroundColor,
            };
          },
        },
      },
    };
  }
  return (
    <CRow className="col-md-6">
      <CCol>
        <h4>{title}</h4>
        <div className="chart-wrapper">
          <CChartPie
            datasets={pie.datasets}
            labels={pie.labels}
            options={options}
          />
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
    let tooltip_label = [];
    for (let i = 0; i < options.length; i++) {
      polar_area.push(0);
      tooltip_label.push([]);
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i][problem.id] && options.includes(data[i][problem.id].ans)) {
        polar_area[options.indexOf(data[i][problem.id].ans)]++;
        tooltip_label[options.indexOf(data[i][problem.id].ans)].push(
          accountsMap[data[i].id]
        );
      }
    }
    return (
      <RenderPieChart
        title={problem.title}
        labels={options}
        data={polar_area}
        tooltip_label={tooltip_label}
      />
    );
  } else if (problem.type === "MultiAnswer") {
    suboptions = problem["子選項"];
    let h_bar_data = [];
    let tooltip_label = [];
    for (let i = 0; i < suboptions.length; i++) {
      h_bar_data.push(0);
      tooltip_label.push([]);
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i][problem.id]) {
        for (let j = 0; j < data[i][problem.id].ans.length; j++) {
          if (suboptions.includes(data[i][problem.id].ans[j])) {
            h_bar_data[suboptions.indexOf(data[i][problem.id].ans[j])]++;
            tooltip_label[suboptions.indexOf(data[i][problem.id].ans[j])].push(
              accountsMap[data[i].id]
            );
          }
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
    let tooltip_label = [];
    for (let i = 0; i < suboptions.length; i++) {
      bar_data.push([]);
      tooltip_label.push([]);
      for (let j = 0; j < options.length; j++) {
        bar_data[i].push(0);
        tooltip_label[i].push([]);
      }
      for (let j = 0; j < data.length; j++) {
        if (
          data[j][problem.id] &&
          data[j][problem.id][suboptions[i]] &&
          options.includes(data[j][problem.id][suboptions[i]].ans)
        ) {
          bar_data[i][
            options.indexOf(data[j][problem.id][suboptions[i]].ans)
          ]++;
          tooltip_label[i][
            [options.indexOf(data[j][problem.id][suboptions[i]].ans)]
          ].push(accountsMap[data[j].id]);
        }
      }
    }
    return (
      <RenderBarChart
        title={problem.title}
        titles={suboptions}
        labels={options}
        data={bar_data}
        tooltip_label={tooltip_label}
      />
    );
  } else if (problem.type === "MultiGrid") {
    suboptions = problem["子選項"];
    options = problem["選項"];
    let bar_data = [];
    let tooltip_label = [];
    for (let i = 0; i < options.length; i++) {
      bar_data.push([]);
      tooltip_label.push([]);
      for (let j = 0; j < suboptions.length; j++) {
        bar_data[i].push(0);
        tooltip_label[i].push([]);
      }
      for (let j = 0; j < data.length; j++) {
        if (data[j][problem.id] && data[j][problem.id][options[i]])
          for (let k = 0; k < data[j][problem.id][options[i]].ans.length; k++) {
            if (suboptions.includes(data[j][problem.id][options[i]].ans[k])) {
              bar_data[i][
                suboptions.indexOf(data[j][problem.id][options[i]].ans[k])
              ]++;
              tooltip_label[i][
                [suboptions.indexOf(data[j][problem.id][options[i]].ans[k])]
              ].push(accountsMap[data[j].id]);
            }
          }
      }
    }
    return (
      <RenderBarChart
        title={problem.title}
        titles={options}
        labels={suboptions}
        data={bar_data}
        tooltip_label={tooltip_label}
      />
    );
  } else if (problem.type === "Number") {
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

const ProblemStatistic = ({ problems, groups, group_id, week_base }) => {
  const [data, setData] = useState([]);
  let charts = [];
  const FetchData = useCallback(async () => {
    let accounts = groups.list[groups.indexOf(group_id)];
    let tmpData = [];
    let now = week_base;
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
  }, [group_id, groups, week_base]);
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
  const [week_base, setWeekBase] = useState({
    id: GetWeeklyBase(),
    value: WeeklyBase2String(GetWeeklyBase()),
    label: (
      <span style={{ whiteSpace: "pre" }}>
        {WeeklyBase2String(GetWeeklyBase())}
      </span>
    ),
  });
  let week_bases = [];
  for (let i = 0; i <= GetWeeklyBase(); i++) {
    week_bases.push({
      id: i,
      value: WeeklyBase2String(i),
      label: <span style={{ whiteSpace: "pre" }}>{WeeklyBase2String(i)}</span>,
    });
  }
  week_bases = week_bases.reverse();
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol xs="4" md="7" lg="7" xl="8">
            活力組操練情形
          </CCol>
          <CCol>
            <Select
              value={week_base}
              isSearchable
              options={week_bases}
              onChange={(v) => {
                setWeekBase(v);
              }}
            />
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <FirestoreCollection path="/form/">
          {(d) => {
            if (d && d.value)
              return (
                <ProblemStatistic
                  problems={d}
                  group_id={group_id}
                  groups={groups}
                  week_base={week_base.id}
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
