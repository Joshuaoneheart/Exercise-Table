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
import { useEffect, useState } from "react";
import {
  GetWeeklyBase,
  GetWeeklyBaseFromTime,
  WeeklyBase2String,
} from "utils/date";
import { DB, firebase } from "db/firebase";
import ModifyGFModal from "components/ModifyGFModal";
import CIcon from "@coreui/icons-react";

const GFCardBody = ({ init_data }) => {
  const [modifyModal, setModifyModal] = useState(false);
  const [data, setData] = useState(init_data);
  const [accountsMap, setAccountsMap] = useState(null);
  const [tableData, setTableData] = useState(null);
  useEffect(() => {
    let getData = async () => {
      let accountsMap = {};
      let accounts = await DB.getByUrl("/accounts");
      await accounts.forEach((doc) => {
        accountsMap[doc.id] = doc.data().displayName;
      });
      setAccountsMap(accountsMap);
      let tmp = Object.assign({}, init_data);
      for (let i = 0; i < Object.keys(accountsMap).length; i++) {
        let GF_data = await DB.getByUrl(
          "/accounts/" + Object.keys(accountsMap)[i] + "/GF/" + GetWeeklyBase()
        );
        if (GF_data)
          for (let [k, v] of Object.entries(GF_data)) {
            if (k === "week_base") continue;
            for (let GF_id of v) {
              if (GF_id === init_data.id) {
                if (!tmp.shepherd) tmp.shepherd = [];
                if (!tmp.shepherd.includes(Object.keys(accountsMap)[i]))
                  tmp.shepherd.push(Object.keys(accountsMap)[i]);
                if (!tmp[k]) tmp[k] = 0;
                tmp[k]++;
              }
            }
          }
      }
      setData(tmp);
      let semester = await DB.getByUrl("/info/semester");
      let data_by_week = {};
      for (let shepherd of tmp.shepherd) {
        let docs = await firebase
          .firestore()
          .collection("accounts")
          .doc(shepherd)
          .collection("GF")
          .where(
            "week_base",
            ">=",
            GetWeeklyBaseFromTime(semester.start.toDate())
          )
          .get();
        if (docs)
          await docs.forEach((doc) => {
            if (!(parseInt(doc.id) in data_by_week))
              data_by_week[parseInt(doc.id)] = {
                week: parseInt(doc.id),
                主日聚會: [],
                家聚會: [],
                小排: [],
              };
            if (doc.data()["主日聚會"].includes(tmp.id))
              data_by_week[parseInt(doc.id)]["主日聚會"].push(shepherd);
            for (let d of doc.data()["家聚會"]) {
              if ((typeof d === "string" && d === tmp.id) || d.id === tmp.id) {
                data_by_week[parseInt(doc.id)]["家聚會"].push(shepherd);
                break;
              }
            }
            if (doc.data()["小排"].includes(tmp.id))
              data_by_week[parseInt(doc.id)]["小排"].push(shepherd);
          });
      }
      let data = [];
      for (let v of Object.values(data_by_week)) {
        data.push(v);
      }
      data.sort((x) => -x.week);
      setTableData(data);
    };
    getData(init_data);
  }, [init_data]);
  if (accountsMap === null) return loading;
  let columns = [
    {
      key: "week",
      label: "Week",
      _style: { minWidth: "100px", flexWrap: "nowrap" },
    },
    {
      key: "主日聚會",
      label: "主日聚會",
      _style: { minWidth: "100px", flexWrap: "nowrap" },
    },
    {
      key: "家聚會",
      label: "家聚會",
      _style: { minWidth: "100px", flexWrap: "nowrap" },
    },
    {
      key: "小排",
      label: "小排",
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
                <b>學校</b>
              </CCol>
              <CCol>{data.school}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>科系</b>
              </CCol>
              <CCol>{data.department}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>年級</b>
              </CCol>
              <CCol>{data.grade}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>身份</b>
              </CCol>
              <CCol>{data.type}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>牧養人</b>
              </CCol>
              <CCol>
                {data.shepherd &&
                  data.shepherd.map((x) => accountsMap[x]).join(",")}
              </CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>累計主日聚會</b>
              </CCol>
              <CCol>{data["主日聚會"] && data["主日聚會"]}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>累計家聚會</b>
              </CCol>
              <CCol>{data["家聚會"] && data["家聚會"]}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>累計小排</b>
              </CCol>
              <CCol>{data["小排"] && data["小排"]}</CCol>
            </CRow>
            <CRow>
              <CCol lg="3">
                <b>備註</b>
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
            return <td>{WeeklyBase2String(item.week)}</td>;
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
  let { id } = useParams();
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>福音朋友資料</CCardHeader>

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
