import { CCol, CForm, CRow, CButton } from "@coreui/react";
import { useEffect, useRef, useState, useContext } from "react";
import Problem from "./Problem";
import { DB, firebase } from "db/firebase";
import {
  GetWeeklyBase,
  WeeklyBase2String,
  GetWeeklyBaseFromTime,
} from "utils/date";
import loading from "./loading";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import i18n from "i18n";
import SemesterContext from "hooks/semester";

const DataTabs = ({ data, account, default_data, thisWeek, setThisWeek }) => {
  const { t } = useTranslation("translation", { i18n });
  const [GF, setGF] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [GF_data, setGFData] = useState(null);
  const { semester } = useContext(SemesterContext);
  const [api, ContextHolder] = message.useMessage();
  useEffect(() => {
    if (GF !== null) setLoading(true);
  }, [GF]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isLoading]);
  useEffect(() => {
    const GetGF = async () => {
      const docs = await DB.getByUrl("/GF");
      let tmp = [];
      docs.forEach((doc) => {
        if (!account || doc.data().gender === account.gender)
          tmp.push(Object.assign(doc.data(), { id: doc.id }));
      });
      setGF(tmp);
      if (account) {
        setGFData(
          await DB.getByUrl(
            "/accounts/" +
              account.id +
              "/GF/" +
              (thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1)
          )
        );
      }
    };
    GetGF();
  }, [account, thisWeek]);
  var form = useRef();
  if (GF === null) return loading;
  var tabpanes = [];
  const calculateScore = async () => {
    if (account) {
      api
        .open({
          type: "loading",
          content: "儲存中",
          duration: 0,
          key: "saving",
        })
        .then(() => message.success("儲存成功", 1.5));
      let form_data = await DB.getByUrl(
        "/accounts/" +
          account.id +
          "/data/" +
          (thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1)
      );
      let GF_data = await DB.getByUrl(
        "/accounts/" +
          account.id +
          "/GF/" +
          (thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1)
      );
      var v = { scores: 0 };
      let lord_table = 0;
      let life_study = 0;
      for (let i = 0; i < data.sections.length; i++) {
        v[data.sections[i]] = 0;
        for (var j = 0; j < data.value[i].length; j++) {
          let problem = data.value[i][j];
          if (
            problem.id === "rBYQGR0oC9kiwXjkvZxS" &&
            form_data &&
            form_data[problem.id]
          )
            life_study = form_data[problem.id].ans;
          if (
            problem.id === "0it0L8KlnfUVO1i4VUqi" &&
            form_data &&
            form_data[problem.id]
          )
            lord_table = form_data[problem.id].ans === "有";
          let score = 0;
          switch (problem.type) {
            case "GF":
              if (!GF_data || !GF_data[problem.title]) continue;
              score =
                parseInt(problem.score) *
                Math.min(GF_data[problem.title].length, problem.max);
              break;
            case "Number":
              if (!form_data || !form_data[problem.id]) continue;
              score =
                parseInt(problem.score) * parseInt(form_data[problem.id].ans);
              break;
            case "MultiGrid":
              if (!form_data || !form_data[problem.id]) continue;
              let options = problem["選項"];
              for (let k = 0; k < options.length; k++) {
                if (form_data[problem.id][options[k]])
                  score +=
                    parseInt(problem.score[k]) *
                    form_data[problem.id][options[k]].ans.length;
              }
              break;
            case "Grid":
              if (!form_data || !form_data[problem.id]) continue;
              let suboptions = problem["子選項"];
              for (let k = 0; k < suboptions.length; k++) {
                if (form_data[problem.id][suboptions[k]])
                  score += parseInt(
                    problem.score[
                      problem["選項"].indexOf(
                        form_data[problem.id][suboptions[k]].ans
                      )
                    ]
                  );
              }
              break;
            case "MultiChoice":
              if (!form_data || !form_data[problem.id]) continue;
              score = parseInt(
                problem.score[
                  problem["選項"].indexOf(form_data[problem.id].ans)
                ]
              );
              break;
            case "MultiAnswer":
              if (!form_data || !form_data[problem.id]) continue;
              score =
                parseInt(problem.score) * form_data[problem.id].ans.length;
              break;
            default:
              break;
          }
          v[data.sections[i]] += score;
          v.scores += score;
        }
      }
      v.week_base = thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1;
      await DB.OnDemandUpdate(
        "/accounts/" +
          account.id +
          "/data/" +
          (thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1),
        v
      );
      await DB.updateByUrl("/info/week", {
        submitted: firebase.firestore.FieldValue.arrayUnion(account.id),
      });
      let tmp = {};
      tmp[(thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1) + "_score"] =
        v.scores;
      tmp[
        (thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1) + "_召會生活操練"
      ] = v["召會生活操練"] ? v["召會生活操練"] : 0;
      tmp[
        (thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1) + "_神人生活操練"
      ] = v["神人生活操練"] ? v["神人生活操練"] : 0;
      tmp[
        (thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1) + "_福音牧養操練"
      ] = v["福音牧養操練"] ? v["福音牧養操練"] : 0;
      tmp[(thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1) + "_lord_table"] =
        lord_table;
      tmp[(thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1) + "_生命讀經"] =
        life_study;
      await DB.updateByUrl("/accounts/" + account.id, tmp);
      api.destroy("saving");
    }
  };
  for (var i = 0; i < data.sections.length; i++) {
    var contents = [];
    for (var j = 0; j < data.value[i].length; j++) {
      var problem = data.value[i][j];
      contents.push(
        <Problem
          calculateScore={calculateScore}
          account_id={account ? account.id : null}
          name={data.value[i].id}
          data={problem}
          week={thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1}
          GF={GF}
          GF_data={GF_data}
          default_data={
            default_data && default_data.value
              ? default_data.value[problem.id]
              : undefined
          }
          key={j}
        />
      );
    }
    tabpanes.push(contents);
  }
  return (
    <div className="form">
      <div
        style={{
          backgroundColor: "#CCEAF3",
        }}
      >
        {ContextHolder}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "24px",
            paddingLeft: "16px",
            paddingRight: "16px",
            marginBottom: "16px",
          }}
        >
          <div className="heading2-bold" style={{ width: "50%" }}>
            {t("操練表")}
          </div>
          <div
            style={{
              fontFamily: "PingFang Semibold",
              fontSize: "20px",
              lineHeight: "28px",
              letterSpacing: "0em",
              justifyContent: "flex-end",
              display: "flex",
              width: "50%",
            }}
          >
            {WeeklyBase2String(
              thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1
            )}
          </div>
        </div>
        <CRow className="align-items-center">
          <CCol>
            <CRow
              className="align-items-center"
              style={{ justifyContent: "center" }}
            >
              <CButton
                className="week-button text-dark-blue primary-medium"
                variant="outline"
                active={!thisWeek}
                onClick={() => setThisWeek(false)}
                disabled={
                  GetWeeklyBase() - 1 ===
                  GetWeeklyBaseFromTime(semester.end.toDate())
                }
              >
                {t("上週")}
              </CButton>
              <CButton
                className="week-button text-dark-blue primary-medium"
                style={{ marginLeft: "16px" }}
                variant="outline"
                active={thisWeek}
                onClick={() => setThisWeek(true)}
              >
                {t("本週")}
              </CButton>
            </CRow>
          </CCol>
        </CRow>
      </div>
      <CForm
        innerRef={form}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {tabpanes.map((x, i) => (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              paddingTop: "24px",
              marginBottom: "8px",
            }}
          >
            <p className="heading3-medium section-title">
              {t(data.sections[i])}
            </p>
            {GF && x}
          </div>
        ))}
      </CForm>
    </div>
  );
};

export default DataTabs;
