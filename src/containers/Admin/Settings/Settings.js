import { React, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import "firebase/firestore";
import { firebase } from "db/firebase";
import { GetWeeklyBase, WeeklyBase2String } from "utils/date";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import CustomDatePicker from "components/CustomDatePicker";

const ModifyCard = () => {
  const [SystemState, setSystemState] = useState(false);
  const flipState = () => setSystemState(!SystemState);

  return (
    <CCardBody>
      <CCol>
        <CRow className="align-items-center">
          <CButton
            color={SystemState ? "success" : "danger"}
            onClick={() => flipState()}
          >
            {SystemState ? "開啓" : "關閉"}
          </CButton>
        </CRow>
      </CCol>
    </CCardBody>
  );
};

class Workbook {
  constructor() {
    // 使用單例模式，產生唯一的 workbook
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};

    this.wopts = {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
    };
  }

  appendSheet(sheet, name = `sheet${this.SheetNames.length + 1}`) {
    this.SheetNames = [...this.SheetNames, name];
    this.Sheets[name] = sheet;
  }

  toBlob(option = this.wopts) {
    // 字串轉 ArrayBuffer
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    var wbout = XLSX.write(this, option);
    var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    return blob;
  }

  isEmpty() {
    return !this.SheetNames.length && JSON.stringify(this.Sheets === "{}");
  }
}

const DownloadCard = () => {
  const max_d_week_num = 6;
  const this_week = GetWeeklyBase();
  var download_list = [];
  for (let i = this_week; i >= 0 && this_week - i < max_d_week_num; i--) {
    let title = i === this_week ? "本週" : WeeklyBase2String(i);
    download_list.push(
      <CDropdownItem
        key={i}
        onClick={function (base, title) {
          var sheets = {};
          firebase
            .firestore()
            .collection("form")
            .get()
            .then((d) => {
              // Build problem id to title map
              var problem_map = {};
              d.forEach((doc) => {
                problem_map[doc.id] = doc.data().title;
              });
              var problem_list = Object.keys(problem_map);
              firebase
                .firestore()
                .collection("accounts")
                .get()
                .then((d) => {
                  var account_list = [];
                  d.forEach((d) => {
                    var item = d.data();
                    item.id = d.id;
                    account_list.push(item);
                  });
                  let promise_list = [];
                  for (let account of account_list) {
                    promise_list.push(
                      firebase
                        .firestore()
                        .collection("accounts")
                        .doc(account.id)
                        .collection("data")
                        .where(
                          firebase.firestore.FieldPath.documentId(),
                          "==",
                          base.toString()
                        )
                        .get()
                    );
                    promise_list.push(
                      firebase
                        .firestore()
                        .collection("accounts")
                        .doc(account.id)
                        .collection("GF")
                        .where(
                          firebase.firestore.FieldPath.documentId(),
                          "==",
                          base.toString()
                        )
                        .get()
                    );
                  }
                  Promise.all(promise_list).then((result) => {
                    result = result.map((x) => {
                      return x.docs;
                    });
                    //Build GF id to name map
                    var GF_querys = [];
                    var GF_map = {};
                    for (let i = 0; i < result.length; i++) {
                      if (!result[i].length) continue;
                      let tmp_data = result[i][0].data();
                      // 0: data, 1, GF
                      let person = account_list[Math.floor(i / 2)];

                      if (i % 2) {
                        for (let k in tmp_data) {
                          GF_querys = GF_querys.concat(tmp_data[k]);
                          for (let j = 0; j < tmp_data[k].length; j++) {
                            if (!(tmp_data[k][j] in GF_map))
                              GF_map[tmp_data[k][j]] = [];
                            GF_map[tmp_data[k][j]].push(k);
                          }
                        }
                      } else if (person.residence) {
                        if (!(person.residence in sheets))
                          sheets[person.residence] = [
                            ["姓名"].concat(
                              problem_list.map((x) => problem_map[x])
                            ),
                          ];
                        let tmp_list = new Array(
                          sheets[person.residence][0].length
                        );
                        tmp_list[0] = person.displayName;
                        for (let k in tmp_data) {
                          if (
                            tmp_data[k].ans === "有" &&
                            problem_list.indexOf(k) >= 0
                          )
                            tmp_list[problem_list.indexOf(k) + 1] = "O";
                        }
                        sheets[person.residence].push(tmp_list);
                      }
                    }
                    GF_querys = Array.from(new Set(GF_querys));
                    Promise.all(
                      GF_querys.map((id) => {
                        return firebase
                          .firestore()
                          .collection("GF")
                          .doc(id)
                          .get();
                      })
                    ).then((GF_meta) => {
                      sheets["牧養對象"] = [];
                      sheets["牧養對象"].push(["姓名"]);
                      for (let i = 0; i < GF_querys.length; i++) {
                        if (GF_meta[i].data()) {
                          var tmp = new Array(sheets["牧養對象"][0].length);
                          tmp[0] = GF_meta[i].data().name;
                          for (let p of GF_map[GF_querys[i]]) {
                            let idx = sheets["牧養對象"][0].indexOf(p);
                            if (idx === -1) {
                              sheets["牧養對象"][0].push(p);
                              tmp.push("O");
                            } else tmp[idx] = "O";
                          }
                          sheets["牧養對象"].push(tmp);
                        }
                      }
                      const workbook = new Workbook();
                      for (let s in sheets) {
                        workbook.appendSheet(
                          XLSX.utils.aoa_to_sheet(sheets[s]),
                          s
                        );
                      }
                      FileSaver.saveAs(workbook.toBlob(), title + ".xlsx");
                    });
                  });
                });
            });
        }.bind(null, i, title)}
      >
        {title}
      </CDropdownItem>
    );
  }
  return (
    <CCard>
      <CCardHeader>
        <CCol>
          <CRow className="align-items-center">操練表數據下載</CRow>
        </CCol>
      </CCardHeader>
      <CCardBody>
        <CCol>
          <CRow className="align-items-center">
            <CDropdown>
              <CDropdownToggle caret color="info">
                <CIcon name="cil-cloud-download" /> 下載數據
              </CDropdownToggle>
              <CDropdownMenu>{download_list}</CDropdownMenu>
            </CDropdown>
          </CRow>
        </CCol>
      </CCardBody>
    </CCard>
  );
};

const Settings = () => {
  return (
    <>
      {/* <CCard> */}
      {/*   <CCardHeader> */}
      {/*     <CCol> */}
      {/*       <CRow className="align-items-center">接受表單回應</CRow> */}
      {/*     </CCol> */}
      {/*   </CCardHeader> */}
      {/*   <ModifyCard /> */}
      {/* </CCard> */}
      <DownloadCard />
      <CCard>
        <CCardHeader>
          <CCol>
            <CRow className="align-items-center">學期時間設定</CRow>
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CustomDatePicker
            semesterID="123-1"
            presetStart={new Date()}
            presetEnd={new Date()}
          />
        </CCardBody>
      </CCard>
    </>
  );
};

export default Settings;
