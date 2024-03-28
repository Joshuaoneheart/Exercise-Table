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
      for (let i = 0; i < data.sections.length; i++) {
        v[data.sections[i]] = 0;
        for (var j = 0; j < data.value[i].length; j++) {
          let problem = data.value[i][j];
          if (!form_data[problem.id]) continue;
          let score = 0;
          switch (problem.type) {
            case "GF":
              score =
                parseInt(problem.score) *
                Math.min(GF_data[problem.title].length, problem.max);
              break;
            case "Number":
              score =
                parseInt(problem.score) * parseInt(form_data[problem.id].ans);
              break;
            case "MultiGrid":
              let options = problem["選項"];
              for (let k = 0; k < options.length; k++) {
                if (form_data[problem.id][options[k]])
                  score +=
                    parseInt(problem.score[k]) *
                    form_data[problem.id][options[k]].ans.length;
              }
              break;
            case "Grid":
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
              score = parseInt(
                problem.score[
                  problem["選項"].indexOf(form_data[problem.id].ans)
                ]
              );
              break;
            case "MultiAnswer":
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
