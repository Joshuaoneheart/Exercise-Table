import { loading } from "components";
import { useParams } from "react-router-dom";
import { FirestoreDocument } from "@react-firebase/firestore";

import { useContext, useEffect, useState } from "react";
import { WeeklyBase2StartDate, WeeklyBase2String } from "utils/date";
import { firebase } from "db/firebase";
import ModifyGFModal from "components/ModifyGFModal";
import { GetAccountsMap } from "utils/account";
import { useTranslation } from "react-i18next";
import i18n from "i18n";
import SemesterContext from "hooks/semester";
import { Row, Col, Select, Datatable, Pagination, Tooltip } from "components";

const GFCard = ({ init_data }) => {
  const { t } = useTranslation("translation", { i18n });
  const [modifyModal, setModifyModal] = useState(false);
  const [data, setData] = useState(init_data);
  const [accountsMap, setAccountsMap] = useState(null);
  const [tableData, setTableData] = useState(null);
  const { semester } = useContext(SemesterContext);
  const [active, setActive] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    let getData = async () => {
      let accountsMap = await GetAccountsMap();
      setAccountsMap(accountsMap);
      let tmp = Object.assign({}, init_data);
      let shepherd = [];
      let data_by_week = {};
      let home_meeting = 0;
      let group_meeting = 0;
      let lord_table = 0;
      const GF_data = await firebase.firestore().collectionGroup("GF").get();
      for (let doc of GF_data.docs) {
        if (doc.ref.path.split("/")[0] !== "accounts") continue;
        let shepherd_id = doc.ref.path.split("/")[1];
        let doc_data = doc.data();
        if (!(parseInt(doc.id) in data_by_week))
          data_by_week[parseInt(doc.id)] = {
            week: WeeklyBase2String(parseInt(doc.id)),
            start_date: WeeklyBase2StartDate(parseInt(doc.id)),
            主日聚會: [],
            小排: [],
            家聚會: [],
          };
        if (
          doc_data["主日聚會&真理課程"] &&
          doc_data["主日聚會&真理課程"].includes(init_data.id)
        ) {
          lord_table++;
          data_by_week[doc.id]["主日聚會"].push(shepherd_id);
          shepherd.push(shepherd_id);
        }
        if (
          doc_data["小排"] &&
          doc_data["小排"].includes(init_data.id)
        ) {
          group_meeting++;
          data_by_week[doc.id]["小排"].push(shepherd_id);
          shepherd.push(shepherd_id);
        }
        if (
          doc_data["家聚會"] &&
          doc_data["家聚會"].includes(init_data.id)
        ) {
          home_meeting++;
          data_by_week[doc.id]["家聚會"].push(shepherd_id);
          shepherd.push(shepherd_id);
        } else {
          if (shepherd_id === "gtvGkq6kGvWUVvw7g09oRtMajt32")
            console.log(doc_data);
          if (!doc_data["家聚會"]) continue;
          for (let tmp of doc_data["家聚會"]) {
            if (typeof tmp !== "string" && tmp.id === init_data.id) {
              home_meeting++;
              data_by_week[doc.id]["家聚會"].push({
                id: shepherd_id,
                note: tmp.note,
              });
              shepherd.push(shepherd_id);
            }
          }
        }
      }
      // make shepherd unique
      tmp.shepherd = [...new Set(shepherd)];
      tmp["主日聚會"] = lord_table;
      tmp["小排"] = group_meeting;
      tmp["家聚會"] = home_meeting;
      setData(tmp);
      let data = [];
      for (let v of Object.values(data_by_week)) {
        data.push(v);
      }
      data.sort((x) => -x.week).reverse();
      for (let i = 0; i < data.length; i++) {
        if (data[i]["主日聚會"] && typeof data[i]["主日聚會"] !== "string")
          data[i]["主日聚會"] = data[i]["主日聚會"]
            .map((x) => accountsMap[x])
            .filter((x) => x)
            .join(",");
        if (data[i]["小排"] && typeof data[i]["小排"] !== "string")
          data[i]["小排"] = data[i]["小排"]
            .map((x) => accountsMap[x])
            .filter((x) => x)
            .join(",");
        let j = 0;
        let tmp = [];
        if (data[i]["家聚會"]) {
          for (let d of data[i]["家聚會"]) {
            if (j !== 0) tmp.push(",");
            if (typeof d === "string" && accountsMap[d])
              tmp.push(accountsMap[d]);
            else if (accountsMap[d.id]) {
              tmp.push(
                <>
                  <Tooltip
                    text={d.note}
                    span_style={{
                      whiteSpace: "nowrap",
                      textDecoration: "underline",
                    }}
                  >
                    {accountsMap[d.id]}
                  </Tooltip>
                </>
              );
            }
            j++;
          }
          data[i]["家聚會"] = tmp;
        }
      }
      setTableData(data);
    };
    if (semester) getData(init_data);
  }, [init_data, semester]);
  if (accountsMap === null) return loading;
  let fields = [
    {
      value: "week",
      label: t("日期"),
    },
    {
      value: "主日聚會",
      label: t("主日聚會"),
    },
    {
      value: "家聚會",
      label: t("家聚會"),
    },
    {
      value: "小排",
      label: t("小排"),
    },
  ];
  const maxDisplay = 10;
  let years = [year];
  let content = [];
  if (tableData) {
    years = [];
    for (let d of tableData.keys()) {
      if (!years.includes(tableData[d].start_date.getFullYear()))
        years.push(tableData[d].start_date.getFullYear());
    }
    years = years.sort().reverse();
    content = tableData.filter((x) => x.start_date.getFullYear() === year);
  }
  return (
    <Row
      className="GF-background"
      style={{
        paddingLeft: "16px",
        paddingRight: "16px",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "768px", width: "100%" }}>
        <div className="GF-banner">
          <span className="heading2-bold">{t("牧養對象資料")}</span>
          <img
            src={"/Images/edit.svg"}
            alt="編輯牧養對象"
            onClick={() => {
              setModifyModal(true);
            }}
            style={{
              width: "24px",
              height: "24px",
              marginTop: "2px",
              marginBottom: "2px",
            }}
          />
        </div>
        <ModifyGFModal
          data={data}
          setData={setData}
          show={modifyModal}
          setModal={setModifyModal}
        />

        <div className="secondary-medium">
          <Row className="GF-row">
            <Col>
              <Row className="GF-item">
                <span style={{ color: "var(--n-500)" }}>{t("姓名")}</span>
                <span>{data.name}</span>
              </Row>
            </Col>
            <Col style={{ marginLeft: "8px" }}>
              <Row className="GF-item">
                <span style={{ color: "var(--n-500)" }}>{t("學校")}</span>
                <span>{data.school}</span>
              </Row>
            </Col>
          </Row>
          <Row className="GF-row">
            <Col>
              <Row className="GF-item">
                <span style={{ color: "var(--n-500)" }}>{t("科系")}</span>
                <span>{data.department}</span>
              </Row>
            </Col>
          </Row>
          <Row className="GF-row">
            <Col>
              <Row className="GF-item">
                <span style={{ color: "var(--n-500)" }}>{t("年級")}</span>
                <span>{data.grade}</span>
              </Row>
            </Col>
          </Row>
          <Row className="GF-row">
            <Col>
              <Row className="GF-item">
                <span style={{ color: "var(--n-500)" }}>{t("身份")}</span>
                <span>{data.type}</span>
              </Row>
            </Col>
          </Row>
          <Row className="GF-row">
            <Col>
              <Row className="GF-item">
                <span style={{ color: "var(--n-500)" }}>{t("牧養人")}</span>
                <p
                  style={{
                    wordBreak: "break-all",
                    width: "60%",
                    textAlign: "end",
                    margin: 0,
                  }}
                >
                  {data.shepherd &&
                    data.shepherd.map((x) => accountsMap[x]).join(",")}
                </p>
              </Row>
            </Col>
          </Row>
          <Row className="GF-row">
            <Col>
              <Row className="GF-item">
                <span style={{ color: "var(--n-500)" }}>{t("備註")}</span>
                <span>{data.note}</span>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="heading2-bold" style={{ marginBottom: "16px" }}>
          {t("累計出席次數")}
        </div>
        <Row
          className="secondary-medium"
          style={{ justifyContent: "space-between", marginBottom: "40px" }}
        >
          <Col className="GF-attendance">
            <div className="GF-attendance-top">{t("主日聚會")}</div>
            <div className="GF-attendance-bottom">
              {data["主日聚會"] ? data["主日聚會"] : "--"}
            </div>
          </Col>
          <Col className="GF-attendance">
            <div className="GF-attendance-top">{t("家聚會")}</div>
            <div className="GF-attendance-bottom">
              {data["家聚會"] ? data["家聚會"] : "--"}
            </div>
          </Col>
          <Col className="GF-attendance">
            <div className="GF-attendance-top">{t("小排")}</div>
            <div className="GF-attendance-bottom">
              {data["小排"] ? data["小排"] : "--"}
            </div>
          </Col>
        </Row>
        <Row style={{ justifyContent: "space-between", marginBottom: "16px" }}>
          <Col style={{ width: "50%" }}>
            <Row className="heading3-medium">{t("牧養情況")}</Row>
            <Row className="secondary-medium" style={{ color: "var(--n-400)" }}>
              {t("欄位顯示邀約人名稱")}
            </Row>
          </Col>
          <Select
            options={years.map((x) => {
              return { value: x, label: x };
            })}
            value={{ value: year, label: year }}
            onChange={(v) => {
              setYear(v.value);
              setActive(0);
            }}
            container_style={{ width: "133px" }}
          />
        </Row>
        {content.length !== 0 ? (
          <>
            <Datatable
              tableClassName="rounded-table fixed-width-table"
              fields={fields}
              content={content}
              maxDisplay={maxDisplay}
              start={active * maxDisplay}
            />
            <Pagination
              totalPage={Math.ceil(content.length / maxDisplay)}
              active={active}
              setActive={setActive}
            />
          </>
        ) : (
          <div
            className="GFList-empty-container"
            style={{ marginBottom: "66px" }}
          >
            <img src={"/Images/empty.svg"} alt="empty" />
            <span className="heading3-regular">{t("暫無資料")}</span>
          </div>
        )}
      </div>
    </Row>
  );
};
const GF = () => {
  let { id } = useParams();
  return (
    <FirestoreDocument path={"/GF/" + id}>
      {(d) => {
        if (d && d.value) {
          d.value.id = id;
          return <GFCard init_data={d.value} />;
        } else return loading;
      }}
    </FirestoreDocument>
  );
};
export default GF;
