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
import { GetWeeklyBase, WeeklyBase2String } from "utils/date";
import { DB } from "db/firebase";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useContext, useEffect, useState } from "react";
import { GetProblems, SummaryScore } from "utils/problem";
import { GetSemesterData } from "utils/account";
import TrackingTable from "components/TrackingTable";
import { useTranslation } from "react-i18next";
import i18n from "i18n";
import SemesterContext from "hooks/semester";

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
  const { t } = useTranslation("translation", { i18n });
  const [items, setItems] = useState(null);
  const [columns, setColumns] = useState(null);
  useEffect(() => {
    const GetProblemData = async () => {
      let problems = await GetProblems(null, false);
      let columns = [
        {
          key: "week_base",
          label: "Week",
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        },
      ];

      let { items, result, column_keys, column_labels } =
        await SummaryScore(data, problems, id);
      items = items.reverse();
      for (let i = 0; i < column_keys.length; i++) {
        columns.push({
          key: column_keys[i],
          label: t(column_labels[i]),
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        });
      }
      columns.push(
        {
          key: "召會生活操練",
          label: t("召會生活操練"),
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        },
        {
          key: "神人生活操練",
          label: t("神人生活操練"),
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        },
        {
          key: "福音牧養操練",
          label: t("福音牧養操練"),
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        },
        {
          key: "score",
          label: t("總分"),
          _style: { minWidth: "100px", flexWrap: "nowrap" },
        }
      );
      await DB.updateByUrl("/accounts/" + id, result);
      setItems(items);
      setColumns(columns);
    };
    GetProblemData();
  }, [id, data, t]);
  if (items === null) return loading;
  return (
    <CDataTable
      style={{ flexWrap: "nowrap" }}
      pagination
      itemsPerPage={20}
      fields={columns}
      items={items}
    />
  );
};

const Member = () => {
  const { t } = useTranslation("translation", { i18n });
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [account, setAccount] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const { semester } = useContext(SemesterContext);
  useEffect(() => {
    const GetData = async () => {
      let res = await DB.getByUrl("/accounts/" + id);
      setAccount(res);
      setData(await GetSemesterData(id, semester));
      setSchedule(
        await DB.getByUrl(
          "/accounts/" + id + "/schedule/" + (GetWeeklyBase() - 1)
        )
      );
    };
    if (semester) GetData();
  }, [id, semester]);
  if (data === null || account === null || schedule === null) return loading;
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            {t("個人操練情況查詢")}-{account.displayName}
          </CCardHeader>
          <CCardBody>
            <CRow>
              <RenderLineChart data={data} />
            </CRow>
            <CRow style={{ overflowX: "scroll", flexWrap: "nowrap" }}>
              <MemberTable data={data} id={id} />
            </CRow>
            <CRow>
              <TrackingTable
                default_data={schedule}
                isChangeable={false}
                account_id={account.id}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Member;
