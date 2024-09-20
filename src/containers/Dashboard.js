import { CCard, CCardBody, CDataTable, CRow, CCol, CInput } from "@coreui/react";
import { DB } from "db/firebase";
import { AccountContext } from "hooks/context";
import SemesterContext from "hooks/semester";
import i18n from "i18n";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GetWeeklyBaseFromTime } from "utils/date";
import Gold from "Images/Medal_1.png";
import Silver from "Images/Medal_2.png";
import Brozen from "Images/Medal_3.png";

const Dashboard = () => {
  const { t } = useTranslation("translation", { i18n });
  const [ranks, setRanks] = useState([]);
  const [myRank, setMyRank] = useState(0);
  const [myLSNum, setMyLSNum] = useState(0);
  const [myImage, setMyImage] = useState("");
  const account = useContext(AccountContext);
  const [nickname, setNickname] = useState(account.nickname ? account.nickname : "");
  const { semester } = useContext(SemesterContext);
  const fields = [
    { key: "rank", label: t("名次") },
    { key: "number", label: t("次數") },
    { key: "identity", label: t("暱稱") },
  ];
  useEffect(() => {
    const getImage = async () => {
      const image = await DB.getByUrl("/info/dashboard");
      setMyImage(image.img_url);
    }
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
        if (doc.id === account.id) {
          identity = t("就是你");
          setMyLSNum(life_study);
        }
        if (doc.data()["nickname"]) identity = doc.data()["nickname"];
        tmp.push({ id: doc.id, number: life_study, identity });
      });
      tmp.sort((a, b) => {
        if (a.number < b.number) return 1;
        if (a.number > b.number) return -1;
        return 0;
      });
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].id === account.id) {
          setMyRank(i + 1);
          break
        }
      }
      for (let i = 0; i < 5; i++)
        tmp[i].rank = i + 1;
      setRanks(tmp.slice(0, 5).filter((x) => x.number > 10));
    };
    if (semester && account) getAccounts();
    if (myImage === "") getImage();
  }, [account, t, semester, nickname]);
  if (!account || !semester) return null;
  return (
    <CCard>
      <CCardBody>
        <h2>{t("生命讀經排名")}</h2> <hr />
        <CRow>
          <CCol lg={4} md={4} xs={6}>
            <CInput defaultValue={account.nickname ? account.nickname : ""} style={{ width: "100%", marginBottom: "15px" }} placeholder={t("請輸入暱稱")} onChange={async (e) => {
              await DB.updateByUrl("/accounts/" + account.id, { "nickname": e.target.value });
              setNickname(e.target.value)
            }} />
          </CCol>
          <CCol>
            <CRow alignHorizontal="end" style={{ marginRight: "5px", marginTop: "5px" }}>
              {t("你的排名")}: {myRank}<br/>{t("你的篇數")}: {myLSNum}
            </CRow>
          </CCol>
        </CRow>
        <CDataTable scopedSlots={{
          "rank": (item) => {
            if (item.rank === 1) return <td><img src={Gold} alt="第一名" style={{ width: "25px" }} /></td>;
            if (item.rank === 2) return <td><img src={Silver} alt="第二名" style={{ width: "25px" }} /></td>;
            if (item.rank === 3) return <td><img src={Brozen} alt="第三名" style={{ width: "25px" }} /></td>;
            if (item.rank === 4) return <td>{t("第四名")}</td>;
            if (item.rank === 5) return <td>{t("第五名")}</td>;
          },
          "number": (item) => {
            return <td style={{ paddingLeft: "17px" }}>{item.number}</td>
          }
        }} items={ranks} fields={fields} itemsPerPage={5} />
        <h2>{t("生命讀經進度")}</h2> <hr />
        <CCol style={{ width: "100%", overflowX: "scroll", overflowY: "visible" }}>
          <CRow alignHorizontal="center">
            <img
              src={myImage}
              alt="lifestudy"
              border="0"
              style={{maxWidth: "800px"}}
            />
          </CRow>
        </CCol>
      </CCardBody>
    </CCard>
  );
};

export default Dashboard;
