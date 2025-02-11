import {
  loading,
  Col,
  Tab,
  Select,
  RadarChart,
  VerticalBarChart,
  Datatable,
  Row,
  Portal,
} from "components";
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
import { registFormat } from "utils/date";

const HeadPicker = ({ account, show, setShow, setAccount, id }) => {
  const [head, setHead] = useState(account.head);
  useEffect(() => {
    if (!show && head !== account.head) setHead(account.head);
  }, [account, show, head]);
  const images = [
    "/Images/lion.svg",
    "/Images/rabbit_2.svg",
    "/Images/fox.svg",
    "/Images/giraffe.svg",
    "/Images/rabbit.svg",
    "/Images/elephant.svg",
    "/Images/panda.svg",
    "/Images/human.svg",
    "/Images/hedgehog.svg",
  ];
  return (
    <Portal customRootId="root">
      <div
        className="headpicker-container"
        style={{ display: show ? "grid" : "none" }}
      >
        {images.map((x, i) => (
          <div key={`headpicker-${i}`} className={head === x ? "active" : ""}>
            <img
              alt={x}
              src={x}
              onClick={() => setHead(x)}
            />
          </div>
        ))}
      </div>
      <div
        className="headpicker-mask"
        style={{ display: show ? "block" : "none" }}
      >
        <img
          style={{
            position: "fixed",
            bottom: "56px",
            left: "calc(50vw - 34px)",
          }}
          src={"/Images/check.svg"}
          alt="check"
          onClick={async () => {
            await DB.updateByUrl("/accounts/" + id, { head });
            account.head = head;
            setAccount(Object.assign({}, account));
            setShow(false);
          }}
        />
        <img
          style={{ position: "fixed", top: "52px", left: "36px" }}
          src={"/Images/close_2.svg"}
          alt="close"
          onClick={() => setShow(false)}
        />
      </div>
    </Portal>
  );
};
const Tab1 = ({ data, semester }) => {
  const weekBase = Math.min(
    GetWeeklyBase(),
    GetWeeklyBaseFromTime(semester.end.toDate())
  );
  const semester_span =
    weekBase - GetWeeklyBaseFromTime(semester.start.toDate()) + 1;
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
  for (let item of data.items) {
    all_mean[0] += item["召會生活操練"];
    all_mean[1] += item["神人生活操練"];
    all_mean[2] += item["福音牧養操練"];
    let score = isNaN(item.score) ? 0 : item.score;
    semester_score += score;
    max_bar = Math.max(max_bar, score);
    if (dataset.legend.includes(item.week_base)) {
      score_3 += score;
      mean_3[0] += item["召會生活操練"];
      mean_3[1] += item["神人生活操練"];
      mean_3[2] += item["福音牧養操練"];
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

  score_3 = Math.round((score_3 / 3) * 100) / 100;
  semester_score = Math.round((semester_score / semester_span) * 100) / 100;

  dataset.label[3] = [
    [
      "召會生活",
      `分數:${Math.round((mean_3[0] / 3) * 100) / 100}/${max_total_score[0]}`,
    ],
    [
      "神人生活",
      `分數:${Math.round((mean_3[1] / 3) * 100) / 100}/${max_total_score[1]}`,
    ],
    [
      "福音牧養",
      `分數:${Math.round((mean_3[2] / 3) * 100) / 100}/${max_total_score[2]}`,
    ],
  ];
  dataset.data[3] = [
    mean_3[0] / 3 / max_total_score[0],
    mean_3[1] / 3 / max_total_score[1],
    mean_3[2] / 3 / max_total_score[2],
  ];
  dataset.label[4] = [
    [
      "召會生活",
      `分數:${Math.round((all_mean[0] / semester_span) * 100) / 100}/${
        max_total_score[0]
      }`,
    ],
    [
      "神人生活",
      `分數:${Math.round((all_mean[1] / semester_span) * 100) / 100}/${
        max_total_score[1]
      }`,
    ],
    [
      "福音牧養",
      `分數:${Math.round((all_mean[2] / semester_span) * 100) / 100}/${
        max_total_score[2]
      }`,
    ],
  ];
  dataset.data[4] = [
    all_mean[0] / semester_span / max_total_score[0],
    all_mean[1] / semester_span / max_total_score[1],
    all_mean[2] / semester_span / max_total_score[2],
  ];
  let start_chart = 0;
  while (dataset.data[start_chart].length < 3 && start_chart < 5)
    start_chart += 1;
  const [curChart, setCurChart] = useState(start_chart);
  return (
    <Row
      style={{
        flexWrap: "wrap",
        backgroundColor: "var(--white)",
        minHeight: "calc(100vh - 248px)",
        width: "100%",
      }}
    >
      {data.items.length > 0 ? (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                paddingTop: "24px",
                paddingBottom: "16px",
                marginLeft: "24px",
              }}
              className="heading3-bold"
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
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {" "}
            <span
              style={{
                paddingTop: "36px",
                paddingBottom: "24px",
                marginLeft: "24px",
              }}
              className="heading3-bold"
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
          </div>
        </>
      ) : (
        <div
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            flexGrow: 1,
            height: "100%",
            width: "100%",
            display: "flex",
            marginTop: "80px",
            flexDirection: "column",
          }}
        >
          <img alt="empty" src={"/Images/empty.svg"} />
          <span className="heading3-regular">暫無資料</span>
        </div>
      )}
    </Row>
  );
};
const Tab2 = ({ data }) => {
  const [page, setPage] = useState({
    label: "召會生活操練",
    value: "召會生活操練",
  });
  let fields = [{ label: "日期", value: "week_base" }];
  if (page.value !== "總分") {
    for (let i = 0; i < data.column_keys.length; i++) {
      if (data.column_problems[i].section === page.value)
        fields.push({
          label: data.column_labels[i],
          value: data.column_keys[i],
        });
    }
  } else
    fields = [
      { label: "日期", value: "week_base" },
      { label: "召會生活操練", value: "召會生活操練" },
      { label: "神人生活操練", value: "神人生活操練" },
      { label: "福音牧養操練", value: "福音牧養操練" },
      { label: "總分", value: "score" },
    ];
  return (
    <div
      style={{
        backgroundColor: "var(--light-blue)",
        minHeight: "calc(100vh - 248px)",
        paddingBottom: "34px",
      }}
    >
      {data.items.length > 0 ? (
        <>
          <Row style={{ paddingTop: "20px", paddingBottom: "20px" }}>
            <Select
              style={{
                marginLeft: "16px",
                marginRight: "12px",
                width: "170px",
              }}
              value={page}
              onChange={(v) => setPage(v)}
              options={[
                { label: "召會生活操練", value: "召會生活操練" },
                { label: "神人生活操練", value: "神人生活操練" },
                { label: "福音牧養操練", value: "福音牧養操練" },
                { label: "總分", value: "總分" },
              ]}
            />
          </Row>
          <Datatable
            content={data.items.reverse()}
            maxDisplay={100}
            start={0}
            fields={fields}
          />
        </>
      ) : (
        <div
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            flexGrow: 1,
            height: "100%",
            width: "100%",
            display: "flex",
            paddingTop: "80px",
            flexDirection: "column",
          }}
        >
          <img alt="empty" src={"/Images/empty.svg"} />
          <span className="heading3-regular">暫無資料</span>
        </div>
      )}
    </div>
  );
};
const Member = () => {
  const { t } = useTranslation("translation", { i18n });
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [account, setAccount] = useState(null);
  const { semester } = useContext(SemesterContext);
  const [active, setActive] = useState(0);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const GetData = async () => {
      let res = await DB.getByUrl("/accounts/" + id);
      if (!res.head) res.head = "/Images/lion.svg";
      setAccount(res);
      let tmp = await GetSemesterData(id, semester);
      let problems = await GetProblems(null, false);
      setData(await SummaryScore(tmp, problems, id));
    };
    if (semester) GetData();
  }, [id, semester]);
  if (data === null || account === null) return loading;

  return (
    <>
      <HeadPicker
        id={id}
        account={account}
        show={show}
        setShow={setShow}
        setAccount={setAccount}
      />
      <div style={{ backgroundColor: "var(--white)", paddingTop: "8px" }}>
        <Row>
          <img
            style={{ marginLeft: "12px", marginRight: "16px" }}
            src={
              account.head.includes("/Images/")
                ? account.head
                : account.head
            }
            onClick={() => setShow(true)}
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
        <Tab1 data={data} semester={semester} />
      ) : (
        <Tab2 data={data} />
      )}
    </>
  );
};

export default Member;
