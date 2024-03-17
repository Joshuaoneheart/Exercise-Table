// the footer of a form handling answer parsing

import { CButton, CCardFooter } from "@coreui/react";
import { FirestoreBatchedWrite } from "@react-firebase/firestore";
import { DB } from "db/firebase";
import { useEffect, useState } from "react";
import { GetWeeklyBase, GetWeeklyBaseFromTime } from "utils/date";

const FormFooter = ({ form, account, metadata }) => {
  const [semester, setSemester] = useState(null);
  useEffect(() => {
    const FetchSemester = async () => {
      let tmp = await DB.getByUrl("/info/semester");
      setSemester(tmp);
    };
    FetchSemester();
  }, []);
  return (
    <CCardFooter align="right">
      <FirestoreBatchedWrite>
        {({ addMutationToBatch, commit }) => {
          return (
            <CButton
              variant="outline"
              color="dark"
              disabled={
                semester !== null &&
                GetWeeklyBaseFromTime(semester.end.toDate()) >=
                  GetWeeklyBase() &&
                GetWeeklyBaseFromTime(semester.start.toDate()) <=
                  GetWeeklyBase()
              }
              onClick={(event) => {
                event.target.disabled = true;
                if (!form.current) {
                  alert("請稍後再試");
                  event.target.disabled = false;
                  return;
                }
                var v = {};
                var total_score = 0;
                for (let i = 0; i < metadata.value.length; i++) {
                  var problem = metadata.value[i];
                  switch (problem.type) {
                    case "Number":
                      let score =
                        form.current.elements[metadata.ids[i]].value *
                        parseInt(metadata.value[i].score[0]);
                      v[metadata.ids[i]] = {
                        ans: form.current.elements[metadata.ids[i]].value,
                        score,
                      };
                      if (!(problem.section in v)) v[problem.section] = 0;
                      v[problem.section] += score;
                      total_score += score;
                      break;
                    case "MultiGrid":
                      let options = metadata.value[i]["選項"];
                      v[metadata.ids[i]] = {};
                      for (let j = 0; j < options.length; j++) {
                        let nodeList =
                          form.current.elements[
                            metadata.ids[i] + "-" + options[j]
                          ];
                        for (let k = 0; k < nodeList.length; k++) {
                          if (nodeList[k].checked) {
                            if (!(options[j] in v[metadata.ids[i]]))
                              v[metadata.ids[i]][options[j]] = {
                                ans: [],
                                score: 0,
                              };
                            v[metadata.ids[i]][options[j]].ans.push(
                              nodeList[k].value
                            );
                            v[metadata.ids[i]][options[j]].score += parseInt(
                              problem.score[j]
                            );
                            if (!(problem.section in v)) v[problem.section] = 0;
                            v[problem.section] += parseInt(problem.score[j]);
                            total_score += parseInt(problem.score[j]);
                          }
                        }
                      }
                      break;
                    case "Grid":
                      let suboptions = problem["子選項"];
                      v[problem.id] = {};
                      for (let j = 0; j < suboptions.length; j++) {
                        let ans =
                          form.current.elements[
                            problem.id + "-" + suboptions[j]
                          ].value;
                        if (ans) {
                          v[problem.id][suboptions[j]] = {
                            ans: ans,
                            score: problem.score[problem["選項"].indexOf(ans)],
                          };
                          total_score += parseInt(
                            problem.score[problem["選項"].indexOf(ans)]
                          );
                          if (!(problem.section in v)) v[problem.section] = 0;
                          v[problem.section] += parseInt(
                            problem.score[problem["選項"].indexOf(ans)]
                          );
                        }
                      }
                      break;
                    case "MultiChoice":
                      let ans = form.current.elements[metadata.ids[i]].value;
                      if (ans) {
                        v[problem.id] = {
                          ans: ans,
                          score: problem.score[problem["選項"].indexOf(ans)],
                        };
                        total_score += parseInt(
                          problem.score[problem["選項"].indexOf(ans)]
                        );
                        if (!(problem.section in v)) v[problem.section] = 0;
                        v[problem.section] += parseInt(
                          problem.score[problem["選項"].indexOf(ans)]
                        );
                      }
                      break;
                    case "MultiAnswer":
                      let nodeList = form.current.elements[metadata.ids[i]];
                      for (let j = 0; j < nodeList.length; j++) {
                        if (nodeList[j].checked) {
                          if (!(metadata.ids[i] in v))
                            v[metadata.ids[i]] = { ans: [], score: 0 };
                          v[metadata.ids[i]].ans.push(nodeList[j].value);
                          v[metadata.ids[i]].score += parseInt(
                            problem.score[0]
                          );
                          total_score += parseInt(problem.score);
                          if (!(problem.section in v)) v[problem.section] = 0;
                          v[problem.section] += parseInt(problem.score);
                        }
                      }
                      break;
                    default:
                      break;
                  }
                }
                v.scores = total_score;
                v.week_base = GetWeeklyBase();
                addMutationToBatch({
                  path: "/accounts/" + account.id + "/data/" + GetWeeklyBase(),
                  value: v,
                  type: "set",
                });
                addMutationToBatch({
                  path: "/accounts/" + account.id,
                  value: {
                    score: v.scores,
                    cur_召會生活操練: v["召會生活操練"] ? v["召會生活操練"] : 0,
                    cur_神人生活操練: v["神人生活操練"] ? v["神人生活操練"] : 0,
                    cur_福音牧養操練: v["福音牧養操練"] ? v["福音牧養操練"] : 0,
                    cur_lord_table:
                      v["0it0L8KlnfUVO1i4VUqi"] &&
                      v["0it0L8KlnfUVO1i4VUqi"].ans === "有"
                        ? 1
                        : 0,
                  },
                  type: "update",
                });
                commit()
                  .then(() => {
                    alert("儲存完成");
                    event.target.disabled = false;
                  })
                  .catch((error) => {
                    alert(error.message);
                    event.target.disabled = false;
                  });
              }}
            >
              提交表單
            </CButton>
          );
        }}
      </FirestoreBatchedWrite>
    </CCardFooter>
  );
};

export default FormFooter;
