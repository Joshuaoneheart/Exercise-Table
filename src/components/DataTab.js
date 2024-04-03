import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CRow,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import { useEffect, useRef, useState } from "react";
import Problem from "./Problem";
import { DB } from "db/firebase";
import { GetWeeklyBase } from "utils/date";
import loading from "./loading";

const DataTabs = ({ data, account, default_data }) => {
  const [section, setSection] = useState(0);
  const [GF, setGF] = useState(null);
  const [GF_data, setGFData] = useState(null);
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
            "/accounts/" + account.id + "/GF/" + GetWeeklyBase()
          )
        );
      }
    };
    GetGF();
  }, [account]);
  var form = useRef();
  if (GF === null) return loading;
  var tabs = [];
  var tabpanes = [];
  const calculateScore = async () => {
    if (account) {
      let form_data = await DB.getByUrl(
        "/accounts/" + account.id + "/data/" + GetWeeklyBase()
      );
      let GF_data = await DB.getByUrl(
        "/accounts/" + account.id + "/GF/" + GetWeeklyBase()
      );
      var v = { scores: 0 };
      let lord_table = 0;
      for (let i = 0; i < data.sections.length; i++) {
        v[data.sections[i]] = 0;
        for (var j = 0; j < data.value[i].length; j++) {
          let problem = data.value[i][j];
          if (problem.id === "0it0L8KlnfUVO1i4VUqi")
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
      v.week_base = GetWeeklyBase();
      await DB.updateByUrl(
        "/accounts/" + account.id + "/data/" + GetWeeklyBase(),
        v
      );
      await DB.updateByUrl("/accounts/" + account.id, {
        score: v.scores,
        cur_召會生活操練: v["召會生活操練"] ? v["召會生活操練"] : 0,
        cur_神人生活操練: v["神人生活操練"] ? v["神人生活操練"] : 0,
        cur_福音牧養操練: v["福音牧養操練"] ? v["福音牧養操練"] : 0,
        cur_lord_table: lord_table,
      });
    }
  };
  for (var i = 0; i < data.sections.length; i++) {
    tabs.push(
      <CDropdownItem
        key={i}
        onClick={function (i) {
          setSection(i);
        }.bind(null, i)}
      >
        {data.sections[i]}
      </CDropdownItem>
    );
    var tabContents = [];
    for (var j = 0; j < data.value[i].length; j++) {
      var problem = data.value[i][j];
      tabContents.push(
        <Problem
          calculateScore={calculateScore}
          account_id={account ? account.id : null}
          name={data.value[i].id}
          data={problem}
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
    tabpanes.push(<CTabPane key={i}>{tabContents}</CTabPane>);
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol style={{ fontSize: "30px" }}>表單</CCol>
          <CCol align="end">
            <CDropdown>
              <CDropdownToggle color="info">
                {data.sections[section]}
              </CDropdownToggle>
              <CDropdownMenu>{tabs}</CDropdownMenu>
            </CDropdown>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CForm
          innerRef={form}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CTabs activeTab={section}>
            <CTabContent>{tabpanes}</CTabContent>
          </CTabs>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default DataTabs;
