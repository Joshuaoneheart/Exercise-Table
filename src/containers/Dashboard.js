import { CCard, CCardBody, CDataTable, CRow } from "@coreui/react";
import { DB } from "db/firebase";
import { AccountContext } from "hooks/context";
import SemesterContext from "hooks/semester";
import i18n from "i18n";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GetWeeklyBaseFromTime } from "utils/date";
const Dashboard = () => {
  const { t } = useTranslation("translation", { i18n });
  const [ranks, setRanks] = useState([]);
  const account = useContext(AccountContext);
  const { semester } = useContext(SemesterContext);
  const fields = [
    { key: "rank", label: t("名次") },
    { key: "number", label: t("次數") },
    { key: "identity", label: t("身份") },
  ];
  useEffect(() => {
    const getAccounts = async () => {
      const snapshot = await DB.getByUrl("/accounts");
      let tmp = [];
      await snapshot.forEach((doc) => {
        let life_study = 0;
        for (
          let i = GetWeeklyBaseFromTime(semester.start.toDate());
          i <= GetWeeklyBaseFromTime(semester.end.toDate());
          i++
        ) {
          if (doc.data()[i + "_生命讀經"])
            life_study += doc.data()[i + "_生命讀經"];
        }
        let identity = "";
        if (doc.id === account.id) identity = t("就是你");
        tmp.push({ id: doc.id, number: life_study, identity });
      });
      tmp.sort((a, b) => {
        if (a.number < b.number) return 1;
        if (a.number > b.number) return -1;
        return 0;
      });
      tmp[0].rank = t("第一名");
      tmp[1].rank = t("第二名");
      tmp[2].rank = t("第三名");
      tmp[3].rank = t("第四名");
      tmp[4].rank = t("第五名");
      setRanks(tmp.slice(0, 5).filter((x) => x.number > 10));
    };
    if (semester && account) getAccounts();
  }, [account, t, semester]);
  return (
    <CCard>
      <CCardBody>
        <h2>{t("生命讀經排名")}</h2> <hr />
        <CDataTable items={ranks} fields={fields} itemsPerPage={5} />
        <h2>{t("生命讀經進度")}</h2> <hr />
        <CRow alignHorizontal="center">
          <img
            src="https://i.ibb.co/WWTdDVH/timeline-20240722-222418.jpg"
            alt="timeline-20240722-222418"
            border="0"
          />
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default Dashboard;
