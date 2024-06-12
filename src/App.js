import { lazy, Suspense, useEffect, useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import "scss/style.scss";

import {
  FirebaseAuthConsumer,
  FirebaseAuthProvider,
} from "@react-firebase/auth";
import { FirestoreProvider } from "@react-firebase/firestore";
import { loading } from "components";
import { config, DB, firebase } from "db/firebase";
import { AccountContext } from "hooks/context";
import Account from "Models/Account";
import { history } from "utils/history";
import { GetWeeklyBase } from "utils/date";
import { GF_GRADE_NEXT } from "const/GF";
import { message } from "antd";
import SemesterContext from "hooks/semester";
import { GetSemesterByWeeklyBase } from "utils/semester";
// Containers
const TheLayout = lazy(() => import("containers/TheLayout"));

// Pages
const Login = lazy(() => import("views/pages/login/Login"));
const Register = lazy(() => import("views/pages/register/Register"));
const Page404 = lazy(() => import("views/pages/page404/Page404"));
const Page500 = lazy(() => import("views/pages/page500/Page500"));

const GatherProblemsBySection = (d) => {
  var data = { value: [], sections: [] };
  for (var i = 0; i < d.value.length; i++) {
    // assign unique id to problem
    d.value[i].id = d.ids[i];
    if (!data.sections.includes(d.value[i].section)) {
      data.sections.push(d.value[i].section);
      data.value.push([]);
    }
    data.value[data.sections.indexOf(d.value[i].section)].push(d.value[i]);
  }
  return data;
};

const SignedIn = (props) => {
  var [account, setAccount] = useState(null);
  const [api, ContextHolder] = message.useMessage();
  const [hasUpdate, setUpdate] = useState(false);
  const [semester, setSemester] = useState(null);
  const [semesters, setSemesters] = useState(null);
  // fetch account data
  useEffect(() => {
    // fetch server data
    let FetchAccount = async () => {
      if (!account && props.user) {
        let tmp = new Account({ id: props.user.uid });
        await tmp.fetch();
        if (tmp.status === "Pending") DB.signOut();
        setAccount(tmp);
      }
    };
    FetchAccount();
  }, [account, props]);
  useEffect(() => {
    if (semesters === null) {
      const getSemester = async () => {
        const data = await DB.getByUrl("/info/semester");
        setSemesters(data.semesters);
        let current = new Date();
        let tmp = null;
        for (let s of data.semesters) {
          if (current < s.start.toDate()) break;
          tmp = s;
          if (current <= s.end.toDate() && current >= s.start.toDate()) break;
        }
        setSemester(tmp);
      };
      getSemester();
    }
  }, [semesters]);
  useEffect(() => {
    if (account && !hasUpdate) {
      api
        .open({
          type: "loading",
          content: "更新資料中",
          duration: 0,
          key: "update_data",
        })
        .then(() => message.success("更新成功", 1.5));
      const UpdateData = async () => {
        let counter = await DB.getByUrl("/info/counter");
        if (!counter || !semesters) return;
        let this_year_pass = false;
        const now_year = new Date().getFullYear();
        if (
          now_year !== counter.year_counter ||
          (counter.year_counter === now_year - 1 &&
            new Date().getMonth() >= 8) ||
          GetWeeklyBase() !== counter.week_counter
        ) {
          let GFs = await DB.getByUrl("/GF");
          if (
            now_year !== counter.year_counter ||
            (counter.year_counter === now_year - 1 &&
              new Date().getMonth() >= 8)
          ) {
            // 更新 GF 年級
            for (let i = counter.year_counter; i < now_year - 1; i++) {
              await GFs.forEach((doc) => {
                if (doc.data().grade)
                  firebase
                    .firestore()
                    .collection("GF")
                    .doc(doc.id)
                    .update({ grade: GF_GRADE_NEXT[doc.data().grade] });
              });
            }
            if (new Date().getMonth() >= 8) {
              this_year_pass = true;
              await GFs.forEach((doc) => {
                if (doc.data().grade)
                  firebase
                    .firestore()
                    .collection("GF")
                    .doc(doc.id)
                    .update({ grade: GF_GRADE_NEXT[doc.data().grade] });
              });
            }
          }
          if (GetWeeklyBase() !== counter.week_counter) {
            let problem_docs = await DB.getByUrl("/form");
            let accounts = await DB.getByUrl("/accounts");
            let problems = { value: [], ids: [] };
            await problem_docs.forEach((doc) => {
              problems.value.push(doc.data());
              problems.ids.push(doc.id);
            });
            let account_data = [];
            let GF_data = [];
            let GF_account_map = {};
            let GF_stats = {};
            const lord_table_id = "0it0L8KlnfUVO1i4VUqi";
            // Get sections
            problems = GatherProblemsBySection(problems);
            await accounts.forEach((doc) => {
              account_data.push(Object.assign(doc.data(), { id: doc.id }));
            });
            await GFs.forEach((doc) => {
              GF_data.push(Object.assign(doc.data(), { id: doc.id }));
            });
            for (let i = 0; i < GF_data.length; i++) {
              GF_account_map[GF_data[i].id] = GF_data[i].shepherd
                ? GF_data[i].shepherd
                : [];
              GF_stats[GF_data[i].id] = {};
            }
            for (let i = counter.week_counter; i < GetWeeklyBase(); i++) {
              const semester = GetSemesterByWeeklyBase(i, semesters);
              if (!semester) continue;
              for (let i = 0; i < GF_data.length; i++) {
                if (!(semester.name + "|主日聚會" in GF_stats[GF_data[i].id]))
                  GF_stats[GF_data[i].id][semester.name + "|主日聚會"] =
                    GF_data[i][semester.name + "|主日聚會"]
                      ? GF_data[i][semester.name + "|主日聚會"]
                      : 0;
                if (!(semester.name + "|家聚會" in GF_stats[GF_data[i].id]))
                  GF_stats[GF_data[i].id][semester.name + "|家聚會"] = GF_data[
                    i
                  ][semester.name + "|家聚會"]
                    ? GF_data[i][semester.name + "|家聚會"]
                    : 0;
                if (!(semester.name + "|小排" in GF_stats[GF_data[i].id]))
                  GF_stats[GF_data[i].id][semester.name + "|小排"] = GF_data[i][
                    semester.name + "|小排"
                  ]
                    ? GF_data[i][semester.name + "|小排"]
                    : 0;
              }
              for (let j = 0; j < account_data.length; j++) {
                let GF_data = await DB.getByUrl(
                  "/accounts/" + account_data[j].id + "/GF/" + i
                );
                let data = await DB.getByUrl(
                  "/accounts/" + account_data[j].id + "/data/" + i
                );
                if (data) {
                  if (!(semester.name + "|total_score" in account_data[j]))
                    account_data[j][semester.name + "|total_score"] = 0;
                  if (!(semester.name + "|lord_table" in account_data[j]))
                    account_data[j][semester.name + "|lord_table"] = 0;
                  account_data[j][semester.name + "|lord_table"] +=
                    data[lord_table_id] && data[lord_table_id].ans === "有"
                      ? 1
                      : 0;
                  if (data.scores)
                    account_data[j][semester.name + "|total_score"] +=
                      data.scores;
                  for (let section of problems.sections) {
                    if (!(semester.name + "|" + section in account_data[j]))
                      account_data[j][semester.name + "|" + section] = 0;
                    if (!data[section]) continue;
                    account_data[j][semester.name + "|" + section] +=
                      data[section];
                  }
                }
                if (GF_data)
                  for (let [k, v] of Object.entries(GF_data)) {
                    if (k === "week_base") continue;
                    for (let GF_id of v) {
                      let id;
                      if (typeof GF_id === "string") id = GF_id;
                      else id = GF_id.id;
                      if (!GF_account_map[id].includes(account_data[j].id))
                        GF_account_map[id].push(account_data[j].id);
                      GF_stats[id][semester.name + "|" + k]++;
                    }
                  }
              }
            }
            for (let [GF_id, stats] of Object.entries(GF_stats)) {
              await firebase
                .firestore()
                .collection("GF")
                .doc(GF_id)
                .update(
                  Object.assign({ shepherd: GF_account_map[GF_id] }, stats)
                );
            }
            for (let i = 0; i < account_data.length; i++) {
              let data = await DB.getByUrl(
                "/accounts/" + account_data[i].id + "/data/" + GetWeeklyBase()
              );
              let tmp = {
                score: 0,
                cur_召會生活操練: 0,
                cur_神人生活操練: 0,
                cur_福音牧養操練: 0,
                cur_lord_table: 0,
              };
              if (data) {
                tmp.score = data.scores ? data.scores : 0;
                tmp["cur_召會生活操練"] = data["召會生活操練"]
                  ? data["召會生活操練"]
                  : 0;
                tmp["cur_神人生活操練"] = data["神人生活操練"]
                  ? data["神人生活操練"]
                  : 0;
                tmp["cur_福音牧養操練"] = data["福音牧養操練"]
                  ? data["福音牧養操練"]
                  : 0;
                tmp["cur_lord_table"] =
                  data[lord_table_id] && data[lord_table_id].ans === "有"
                    ? 1
                    : 0;
              }
              for (let [k, v] of Object.entries(account_data[i])) {
                for (let section of problems.sections) {
                  if (k.includes(section)) tmp[k] = v;
                }
                if (k.includes("lord_table") || k.includes("total_score"))
                  tmp[k] = v;
              }
              await firebase
                .firestore()
                .collection("accounts")
                .doc(account_data[i].id)
                .update(tmp);
            }
          }
        }
        await firebase
          .firestore()
          .collection("info")
          .doc("counter")
          .update({
            week_counter: GetWeeklyBase(),
            year_counter: now_year - !this_year_pass,
          });
        api.destroy("update_data");
        setUpdate(true);
      };
      UpdateData();
    }
  });
  if (account) {
    account.id = props.user.uid;
    return (
      <AccountContext.Provider value={account}>
        <SemesterContext.Provider
          value={{ semester, setSemester, semesters, setSemesters }}
        >
          {ContextHolder}
          <TheLayout firebase={firebase} />
        </SemesterContext.Provider>
      </AccountContext.Provider>
    );
  } else return loading;
};

const App = () => {
  return (
    <HashRouter history={history}>
      <Suspense fallback={loading}>
        <FirebaseAuthProvider {...config} firebase={firebase}>
          <Switch>
            <Route
              exact
              path="/register"
              name="Register Page"
              render={(props) => {
                return <Register firebase={firebase} {...props} />;
              }}
            />
            <Route
              exact
              path="/404"
              name="Page 404"
              render={(props) => <Page404 {...props} />}
            />
            <Route
              exact
              path="/500"
              name="Page 500"
              render={(props) => <Page500 {...props} />}
            />
            <Route
              path="/"
              name="Home"
              render={(props) => (
                <FirestoreProvider {...config} firebase={firebase}>
                  <FirebaseAuthConsumer>
                    {({ isSignedIn, user, providerId }) => {
                      if (
                        isSignedIn &&
                        !user.emailVerified &&
                        user.email !== "admin@hall19.com"
                      ) {
                        DB.signOut();
                        message.error("信箱未驗證");
                      }
                      if (
                        isSignedIn &&
                        (user.emailVerified ||
                          user.email === "admin@hall19.com")
                      ) {
                        return <SignedIn user={user} />;
                      } else return <Login firebase={firebase} />;
                    }}
                  </FirebaseAuthConsumer>
                </FirestoreProvider>
              )}
            />
          </Switch>
        </FirebaseAuthProvider>
      </Suspense>
    </HashRouter>
  );
};

export default App;
