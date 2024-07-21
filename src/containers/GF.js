import { loading } from "components";
import { useParams } from "react-router-dom";
import { FirestoreDocument } from "@react-firebase/firestore";

import {
  CCol,
  CButton,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CTooltip,
  CDataTable,
  CLink,
} from "@coreui/react";
import { useContext, useEffect, useState } from "react";
import {
  WeeklyBase2YearString,
} from "utils/date";
import { firebase } from "db/firebase";
import ModifyGFModal from "components/ModifyGFModal";
import CIcon from "@coreui/icons-react";
import { GetAccountsMap } from "utils/account";
import { useTranslation } from "react-i18next";
import i18n from "i18n";
import SemesterContext from "hooks/semester";

const GFCardBody = ({ init_data }) => {
  const { t } = useTranslation("translation", { i18n });
  const [modifyModal, setModifyModal] = useState(false);
  const [data, setData] = useState(init_data);
  const [accountsMap, setAccountsMap] = useState(null);
  const [tableData, setTableData] = useState(null);
  const { semester } = useContext(SemesterContext);
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
            week: parseInt(doc.id),
            主日聚會: [],
            小排: [],
            家聚會: [],
          };
        if (
          doc_data["主日聚會"] &&
          doc_data["主日聚會"].includes(init_data.id)
        ) {
          lord_table++;
          data_by_week[doc.id]["主日聚會"].push(shepherd_id);
          shepherd.push(shepherd_id);
        } else if (
          doc_data["小排"] &&
          doc_data["小排"].includes(init_data.id)
        ) {
          group_meeting++;
          data_by_week[doc.id]["小排"].push(shepherd_id);
          shepherd.push(shepherd_id);
        } else if (
          doc_data["家聚會"] &&
          doc_data["家聚會"].includes(init_data.id)
        ) {
          home_meeting++;
          data_by_week[doc.id]["家聚會"].push(shepherd_id);
          shepherd.push(shepherd_id);
        } else {
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
      data.sort((x) => -x.week);
      setTableData(data);
    };
    if (semester) getData(init_data);
  }, [init_data, semester]);
  if (accountsMap === null) return loading;
  let columns = [
    {
      key: "week",
      label: "Week",
      _style: { minWidth: "100px", flexWrap: "nowrap" },
    },
    {
      key: "主日聚會",
      label: t("主日聚會"),
      _style: { minWidth: "100px", flexWrap: "nowrap" },
    },
    {
      key: "家聚會",
      label: t("家聚會"),
      _style: { minWidth: "100px", flexWrap: "nowrap" },
    },
    {
      key: "小排",
      label: t("小排"),
      _style: { minWidth: "100px", flexWrap: "nowrap" },
    },
  ];
  return (
    <CCardBody>
      <ModifyGFModal
        data={data}
        setData={setData}
        show={modifyModal}
        setModal={setModifyModal}
      />
      <CRow>
        <CCol style={{ fontSize: "18px" }}>
          <CRow className="align-items-center">
            <CCol xs="10" md="11">
              <h3>{data.name}</h3>
            </CCol>
            <CCol xs="1" md="1">
              <CButton
                variant="outline"
                color="primary"
                className="end"
                onClick={() => {
                  setModifyModal(true);
                }}
              >
                <CIcon alt="修改" name="cil-pencil" />
              </CButton>
            </CCol>
          </CRow>
          <hr />
          <div width="20%">
            <CRow>
              <CCol lg="3">
                <b>{t("學校")}</b>
              </CCol>
              <CCol>{data.school}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>{t("科系")}</b>
              </CCol>
              <CCol>{data.department}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>{t("年級")}</b>
              </CCol>
              <CCol>{data.grade}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>{t("身份")}</b>
              </CCol>
              <CCol>{data.type}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>{t("牧養人")}</b>
              </CCol>
              <CCol>
                {data.shepherd &&
                  data.shepherd.map((x) => accountsMap[x]).join(",")}
              </CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>{t("累計主日聚會")}</b>
              </CCol>
              <CCol>{data["主日聚會"] && data["主日聚會"]}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>{t("累計家聚會")}</b>
              </CCol>
              <CCol>{data["家聚會"] && data["家聚會"]}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>{t("累計小排")}</b>
              </CCol>
              <CCol>{data["小排"] && data["小排"]}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>{t("備註")}</b>
              </CCol>
              <CCol>{data.note}</CCol>
            </CRow>
          </div>
        </CCol>
      </CRow>
      <CDataTable
        style={{ flexWrap: "nowrap" }}
        pagination
        fields={columns}
        items={tableData}
        scopedSlots={{
          week: (item) => {
            return <td>{WeeklyBase2YearString(item.week)}</td>;
          },
          主日聚會: (item) => {
            return (
              <td>
                {item["主日聚會"]
                  .map((x) => accountsMap[x])
                  .filter((x) => x)
                  .join(",")}
              </td>
            );
          },
          家聚會: (item) => {
            let tmp = [];
            let i = 0;
            for (let d of item["家聚會"]) {
              if (i !== 0) tmp.push(",");
              if (typeof d === "string" && accountsMap[d])
                tmp.push(accountsMap[d]);
              else if (accountsMap[d.id]) {
                tmp.push(
                  <CTooltip key={i} placement="top" content={d.note}>
                    <CLink>{accountsMap[d.id]}</CLink>
                  </CTooltip>
                );
              }
              i++;
            }
            return <td>{tmp}</td>;
          },
          小排: (item) => {
            return (
              <td>
                {item["小排"]
                  .map((x) => accountsMap[x])
                  .filter((x) => x)
                  .join(",")}
              </td>
            );
          },
        }}
      />
    </CCardBody>
  );
};
const GF = () => {
  const { t } = useTranslation("translation", { i18n });
  let { id } = useParams();
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>{t("福音朋友資料")}</CCardHeader>

          <FirestoreDocument path={"/GF/" + id}>
            {(d) => {
              if (d && d.value) {
                d.value.id = id;
                return (
                  <CCol>
                    <GFCardBody init_data={d.value} />
                  </CCol>
                );
              } else return loading;
            }}
          </FirestoreDocument>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default GF;
