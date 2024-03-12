// the footer of a form handling answer parsing

import { CButton, CCardFooter } from "@coreui/react";
import { FirestoreBatchedWrite } from "@react-firebase/firestore";
import { GetWeeklyBase } from "utils/date";

const FormFooter = ({ form, account, metadata }) => {
  return (
    <CCardFooter align="right">
      <FirestoreBatchedWrite>
        {({ addMutationToBatch, commit }) => {
          return (
            <CButton
              variant="outline"
              color="dark"
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
                    case "Grid":
                      var suboptions = problem["子選項"].split(";");
                      v[problem.id] = {};
                      for (let j = 0; j < suboptions.length; j++) {
                        let ans =
                          form.current.elements[
                            problem.id + "-" + suboptions[j]
                          ].value;
                        if (ans) {
                          v[problem.id][suboptions[j]] = {
                            ans: ans,
                            score:
                              problem.score.split(";")[
                                problem["選項"].split(";").indexOf(ans)
                              ],
                          };
                          total_score += parseInt(
                            problem.score.split(";")[
                              problem["選項"].split(";").indexOf(ans)
                            ]
                          );
                        }
                      }
                      break;
                    case "MultiChoice":
                      let ans = form.current.elements[metadata.ids[i]].value;
                      if (ans) {
                        v[problem.id] = {
                          ans: ans,
                          score:
                            problem.score.split(";")[
                              problem["選項"].split(";").indexOf(ans)
                            ],
                        };
                        total_score += parseInt(
                          problem.score.split(";")[
                            problem["選項"].split(";").indexOf(ans)
                          ]
                        );
                      }
                      break;
                    case "MultiAnswer":
                      var nodeList = form.current.elements[metadata.ids[i]];
                      for (let j = 0; j < nodeList.length; j++) {
                        if (nodeList[j].checked) {
                          if (!(metadata.ids[i] in v))
                            v[metadata.ids[i]] = { ans: [], score: 0 };
                          v[metadata.ids[i]].ans.push(nodeList[j].value);
                          v[metadata.ids[i]].score += parseInt(problem.score);
                          total_score += parseInt(problem.score);
                        }
                      }
                      break;
                    default:
                      break;
                  }
                }
                v.scores = total_score;
                addMutationToBatch({
                  path: "/accounts/" + account.id + "/data/" + GetWeeklyBase(),
                  value: v,
                  type: "set",
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
