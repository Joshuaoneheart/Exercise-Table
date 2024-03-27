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
import { useRef, useState } from "react";
import Problem from "./Problem";
import { DB } from "db/firebase";
import { GetWeeklyBase } from "utils/date";

const DataTabs = ({ data, account, default_data }) => {
  const [section, setSection] = useState(0);
  var form = useRef();
  var tabs = [];
  var tabpanes = [];
  const calculateScore = async () => {
    if (account) {
      let form_data = await DB.getByUrl(
        "/accounts/" + account.id + "/data/" + GetWeeklyBase()
      );
      var v = { scores: 0 };
      for (let i = 0; i < data.sections.length; i++) {
        v[data.sections[i]] = 0;
        for (var j = 0; j < data.value[i].length; j++) {
          let problem = data.value[i][j];
          if (!form_data[problem.id]) continue;
          let score = 0;
          switch (problem.type) {
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
