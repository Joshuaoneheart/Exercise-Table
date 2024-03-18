import { DB } from "db/firebase";
import { useState, useEffect } from "react";
import { GetSemesterData } from "utils/account";
import { GetProblems, SummaryScore } from "utils/problem";
import { DataFrame } from "pandas-js";
import { loading } from "components";

const {
  CRow,
  CCard,
  CCol,
  CCardHeader,
  CCardBody,
  CDataTable,
} = require("@coreui/react");

const Summary = () => {
  const [raw, setRaw] = useState(null);
  useEffect(() => {
    const getRaw = async () => {
      let tmp = [];
      let accounts = await DB.getByUrl("/accounts");
      let accountsMap = {};
      let semester = await DB.getByUrl("/info/semester");
      let problems = await GetProblems();
      await accounts.forEach((doc) => {
        if (doc.data().role === "Admin") return;
        accountsMap[doc.id] = doc.data().displayName;
      });
      for (let id of Object.keys(accountsMap)) {
        let weeks = await GetSemesterData(id, semester);
        let { items, result } = await SummaryScore(weeks, problems, id);
        tmp.push(
          Object.assign(
            { name: accountsMap[id], dataframe: new DataFrame(items) },
            result
          )
        );
      }
      setRaw(tmp);
    };
    getRaw();
  }, []);
  if (raw === null) return loading;
  let items = [];
  for (let item of raw) {
    items.push({
      name: item.name,
      福音牧養操練: item["福音牧養操練"] + item["cur_福音牧養操練"],
      神人生活操練: item["神人生活操練"] + item["cur_神人生活操練"],
      召會生活操練: item["召會生活操練"] + item["cur_召會生活操練"],
      score: item.score + item.total_score,
    });
  }
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol>學期結算</CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={items}
              fields={[
                {
                  key: "name",
                  label: "Name",
                  _style: { minWidth: "100px", flexWrap: "nowrap" },
                },
                {
                  key: "福音牧養操練",
                  label: "福音牧養操練",
                  _style: { minWidth: "100px", flexWrap: "nowrap" },
                },
                {
                  key: "神人生活操練",
                  label: "神人生活操練",
                  _style: { minWidth: "100px", flexWrap: "nowrap" },
                },
                {
                  key: "召會生活操練",
                  label: "召會生活操練",
                  _style: { minWidth: "100px", flexWrap: "nowrap" },
                },
                {
                  key: "score",
                  label: "分數",
                  _style: { minWidth: "100px", flexWrap: "nowrap" },
                },
              ]}
              itemsPerPage={10}
              sorter
              pagination
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default Summary;
