import { CRow, CCol } from "@coreui/react";
import { DB } from "db/firebase";
import { AccountContext } from "hooks/context";
import SemesterContext from "hooks/semester";
import i18n from "i18n";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { GetWeeklyBaseFromTime } from "utils/date";

const Dashboard = () => {
  const { t } = useTranslation("translation", { i18n });
  const [ranks, setRanks] = useState([]);
  const [myRank, setMyRank] = useState(0);
  const [myLSNum, setMyLSNum] = useState(0);
  const [myImage, setMyImage] = useState("");
  const input_ref = useRef();
  const account = useContext(AccountContext);
  const [isFocus, setFocus] = useState(false);
  const [nickname, setNickname] = useState(
    account.nickname ? account.nickname : ""
  );
  const { semester } = useContext(SemesterContext);
  const history = useHistory();
  useEffect(() => {
    const getImage = async () => {
      const image = await DB.getByUrl("/info/dashboard");
      setMyImage(image.img_url);
    };
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
          break;
        }
      }
      for (let i = 0; i < 5; i++) tmp[i].rank = i + 1;
      setRanks(tmp.slice(0, 5).filter((x) => x.number > 10));
    };
    if (semester && account) getAccounts();
    if (myImage === "") getImage();
  }, [account, t, semester, nickname, myImage]);
  if (!account || !semester) return null;
  let after_3 = [
    <div
      key={1}
      style={{ height: "56px", display: "flex", flexDirection: "row" }}
    >
      <div
        className="primary-bold after-3-num"
        style={{ marginTop: "18px", marginRight: "15px", marginLeft: "15px" }}
      >
        4
      </div>
      <div
        className="secondary-medium"
        style={{
          marginTop: "20px",
          width: "124.5px",
          textOverflow: "ellipsis",
          marginRight: "85px",
        }}
      >
        --
      </div>
      <div className="content-medium after-3-badge">-- 篇</div>
    </div>,
    <div
      key={2}
      style={{ height: "56px", display: "flex", flexDirection: "row" }}
    >
      <div
        className="primary-bold after-3-num"
        style={{ marginTop: "18px", marginRight: "15px", marginLeft: "15px" }}
      >
        5
      </div>
      <div
        className="secondary-medium"
        style={{
          marginTop: "20px",
          width: "124.5px",
          textOverflow: "ellipsis",
          marginRight: "85px",
        }}
      >
        --
      </div>
      <div className="content-medium text-n-500 after-3-badge">-- 篇</div>
    </div>,
  ];
  for (let i = 5; i < ranks.length; i++) after_3.push(undefined);
  for (let i = 3; i < ranks.length; i++) {
    after_3[i - 3] = (
      <div
        key={i}
        style={{ height: "56px", display: "flex", flexDirection: "row" }}
      >
        <div
          className="primary-bold text-n-500"
          style={{ marginTop: "18px", marginRight: "15px", marginLeft: "15px" }}
        >
          {i + 1}
        </div>
        <div
          className="secondary-medium"
          style={{
            marginTop: "20px",
            width: "124.5px",
            textOverflow: "ellipsis",
            marginRight: "85px",
          }}
        >
          {ranks[i].identity}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "54px",
          }}
        >
          <div className="content-medium text-n-500 after-3-badge">
            {ranks[i].number} 篇
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="dashboard">
        <div
          style={{
            marginLeft: "-15px",
            marginRight: "-15px",
            paddingLeft: "calc(50% - 187.5px)",
            width: "100vw",
            backgroundImage: "url(Images/bg.svg)",
            backgroundPositionX: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1280 307px",
            marginBottom: "-30px",
            overflow: "clip",
            backgroundPosition: "top center",
          }}
        >
          <img
            src={process.env.PUBLIC_URL + "/Images/banner.png"}
            alt="banner"
            className="banner"
            style={{
              width: "288px",
              height: "60px",
              marginTop: "23px",
              marginLeft: "46.5px",
              marginRight: "46.5px",
              marginBottom: "47px",
            }}
          />
          <CRow>
            <CCol
              className="winner-badge"
              style={{
                marginLeft: "45px",
                marginRight: "12px",
              }}
            >
              <img
                src={process.env.PUBLIC_URL + "/Images/medal_2.png"}
                alt="medal_2"
                className="winner-medal"
              />
              <p className="winner-name primary-bold">
                {ranks.length >= 2 ? ranks[1].identity : "--"}
              </p>
              <p className="winner-number content-medium">
                {ranks.length >= 2 ? ranks[1].number : "--"} 篇
              </p>
            </CCol>
            <CCol className="winner-badge">
              <img
                src={process.env.PUBLIC_URL + "Images/medal_1.png"}
                alt="medal_1"
                className="winner-medal-large"
              />
              <p
                className="winner-name primary-bold"
                style={{ marginTop: "2px " }}
              >
                {ranks.length >= 1 ? ranks[0].identity : "--"}
              </p>
              <p className="winner-number content-medium">
                {ranks.length >= 1 ? ranks[0].number : "--"} 篇
              </p>
            </CCol>
            <CCol
              className="winner-badge"
              style={{
                marginLeft: "12px",
                marginRight: "30px",
              }}
            >
              <img
                src={process.env.PUBLIC_URL + "Images/medal_3.svg"}
                alt="medal_3"
                className="winner-medal"
              />
              <p className="winner-name primary-bold">
                {ranks.length >= 3 ? ranks[2].identity : "--"}
              </p>
              <p className="winner-number content-medium">
                {ranks.length >= 3 ? ranks[2].number : "--"} 篇
              </p>
            </CCol>
          </CRow>
          <div className="nickname-container">
            <div className="rank heading3-bold">{myRank}</div>
            <input
              ref={input_ref}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              defaultValue={account.nickname ? account.nickname : ""}
              placeholder={t("請輸入暱稱")}
              className="nickname-input primary-medium"
              onChange={async (e) => {
                await DB.updateByUrl("/accounts/" + account.id, {
                  nickname: e.target.value,
                });
                setNickname(e.target.value);
              }}
            />
            {isFocus ? (
              <img
                onMouseDown={(e) => {
                  e.preventDefault();
                  input_ref.current.value = "";
                }}
                src={process.env.PUBLIC_URL + "/Images/clear.png"}
                alt="clear"
                className="input-icon"
              />
            ) : (
              <img
                onClick={() => {
                  input_ref.current.focus();
                }}
                src={process.env.PUBLIC_URL + "/Images/edit.png"}
                alt="edit"
                className="input-icon"
              />
            )}
            <div className="LSNum content-medium">{myLSNum} 篇</div>
          </div>
          <div
            style={{
              position: "relative",
              backgroundColor: "#FFFFFF",
              paddingTop: "30px",
              zIndex: 0,
              top: "-30px",
              left: "0px",
              marginBottom: 0,
              marginLeft: "calc(187.5px - 50vw)",
              paddingLeft: "calc(50vw - 187.5px)",
            }}
          >
            <CCol style={{ paddingLeft: "36px", paddingRight: "36px" }}>
              {after_3.map((x, i) => {
                if (i + 3 !== ranks.length - 1 && x !== undefined) {
                  return (
                    <>
                      {x}
                      <hr style={{ margin: 0, width: "303px" }} />
                    </>
                  );
                }
                return x;
              })}
            </CCol>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            marginTop: "8px",
            width: "100vw",
            paddingBottom: "48px",
          }}
        >
          <p
            className="heading2-bold"
            style={{
              marginLeft: "16px",
              marginTop: "24px",
              marginBottom: "16px",
            }}
          >
            {t("生命讀經進度")}
          </p>
          <CCol
            style={{
              width: "100%",
              overflowX: "scroll",
              overflowY: "visible",
              paddingLeft: "16px",
              paddingRight: "16px",
              alignItems: "flex-start",
              display: "flex",
            }}
          >
            <img
              src={myImage}
              alt="lifestudy"
              border="0"
              style={{ maxWidth: "800px" }}
            />
          </CCol>
        </div>
      </div>
      <div className="dashboard-footer">
        <div
          style={{
            position: "fixed",
            height: "98px",
            backgroundColor: "#FFFFFF",
            width: "100%",
            marginLeft: "-15px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              marginTop: "12px",
              backgroundColor: "#005371",
              borderRadius: "8px",
              height: "44px",
              width: "343px",
              color: "#FFFFFF",
              border: 0,
            }}
            onClick={() => {
              history.push(`/form`);
            }}
          >
            填寫操練表
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
