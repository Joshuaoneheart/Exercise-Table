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
import {
  AccountContext,
  AccountsMapContext,
  GroupContext,
  ResidenceContext,
} from "hooks/context";
import Account from "Models/Account";
import { history } from "utils/history";
import { GetWeeklyBase } from "utils/date";
import { GF_GRADE_NEXT } from "const/GF";
// Containers
const TheLayout = lazy(() => import("containers/TheLayout"));

// Pages
const Login = lazy(() => import("views/pages/login/Login"));
const Register = lazy(() => import("views/pages/register/Register"));
const Page404 = lazy(() => import("views/pages/page404/Page404"));
const Page500 = lazy(() => import("views/pages/page500/Page500"));

const SignedIn = (props) => {
  var [account, setAccount] = useState(null);
  var [accountsMap, setAccountsMap] = useState({});
  var [groupMap, setGroupMap] = useState({});
  var [residenceMap, setResidenceMap] = useState({});
  // fetch account data
  let FetchAccount = async () => {
    if (!account && props.user) {
      account = new Account({ id: props.user.uid });
      await account.fetch();
      setAccount(account);
    }
  };
  let FetchAccountsMap = async () => {
    let tmp = {};
    let accounts = await DB.getByUrl("/accounts");
    await accounts.forEach((doc) => {
      tmp[doc.id] = doc.data().displayName;
    });
    setAccountsMap(tmp);
  };
  let FetchGroupMap = async () => {
    let tmp = {};
    let group = await DB.getByUrl("/group");
    await group.forEach((doc) => {
      tmp[doc.id] = doc.data().name;
    });
    setGroupMap(tmp);
  };
  let FetchResidenceMap = async () => {
    let tmp = {};
    let residence = await DB.getByUrl("/residence");
    await residence.forEach((doc) => {
      tmp[doc.id] = doc.data().name;
    });
    setResidenceMap(tmp);
  };
  useEffect(() => {
    // fetch server data
    FetchAccount();
    FetchAccountsMap();
    FetchGroupMap();
    FetchResidenceMap();
    const UpdateData = async () => {
      let counter = await DB.getByUrl("/info/counter");
      let accounts = await DB.getByUrl("/accounts");
      let GFs = await DB.getByUrl("/GF");
      let this_year_pass = false;
      const now_year = new Date().getFullYear();
      if (now_year !== counter.year_counter) {
        // 更新 GF 年級
        let GF = await DB.getByUrl("/GF");
        for (let i = counter.year_counter; i < now_year - 1; i++) {
          await GF.forEach((doc) => {
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
          await GF.forEach((doc) => {
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
        let group_score = {};
        let group_lord_table = {};
        let account_score = {};
        let account_revival = {};
        let account_data = [];
        let GF_data = [];
        let GF_account_map = {};
        let GF_stats = {};
        const lord_table_id = "0it0L8KlnfUVO1i4VUqi";
        const revival_id = "aKCafr0M2nYzoRSUmSni";
        await accounts.forEach((doc) => {
          account_data.push(Object.assign({ id: doc.id }, doc.data()));
        });
        await GFs.forEach((doc) => {
          GF_data.push(Object.assign({ id: doc.id }, doc.data()));
        });
        for (let i = 0; i < GF_data.length; i++) {
          GF_account_map[GF_data[i].id] = GF_data[i].shepherd
            ? GF_data[i].shepherd
            : [];
          GF_stats[GF_data[i].id] = {
            主日聚會: GF_data[i]["主日聚會"] ? GF_data[i]["主日聚會"] : 0,
            家聚會: GF_data[i]["家聚會"] ? GF_data[i]["家聚會"] : 0,
            小排: GF_data[i]["小排"] ? GF_data[i]["小排"] : 0,
          };
        }
        for (let i = counter.week_counter; i < GetWeeklyBase(); i++) {
          for (let j = 0; j < account_data.length; j++) {
            let GF_data = await DB.getByUrl(
              "/accounts/" + account_data[j].id + "/GF/" + i
            );
            if (GF_data)
              for (let [k, v] of Object.entries(GF_data)) {
                for (let GF_id of v) {
                  if (!GF_account_map[GF_id].includes(account_data[j].id))
                    GF_account_map[GF_id].push(account_data[j].id);
                  GF_stats[GF_id][k]++;
                }
              }
          }
        }
        for (let [GF_id, stats] of Object.entries(GF_stats)) {
          await firebase
            .firestore()
            .collection("GF")
            .doc(GF_id)
            .update(Object.assign({ shepherd: GF_account_map[GF_id] }, stats));
        }
        // fetch last week data
        for (let i = 0; i < account_data.length; i++) {
          let data = await DB.getByUrl(
            "/accounts/" + account_data[i].id + "/data/" + (GetWeeklyBase() - 1)
          );
          if (data) {
            //統計活力組總分與上週主日情形
            if (!(account_data[i].group in group_score)) {
              group_score[account_data[i].group] = data.scores;
              group_lord_table[account_data[i].group] =
                data[lord_table_id].ans === "有" ? 1 : 0;
            } else {
              group_score[account_data[i].group] += data.scores;
              group_lord_table[account_data[i].group] +=
                data[lord_table_id].ans === "有" ? 1 : 0;
            }
            account_score[account_data[i].id] = data.scores;
            account_revival[account_data[i].id] = data[revival_id].ans.length;
          }
        }
        for (let [group_id, score] of Object.entries(group_score)) {
          await firebase.firestore().collection("group").doc(group_id).update({
            table: group_lord_table[group_id],
            score,
          });
        }
        for (let [account_id, score] of Object.entries(account_score)) {
          await firebase
            .firestore()
            .collection("accounts")
            .doc(account_id)
            .update({
              score,
              revival: account_revival[account_id],
            });
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
    };
    UpdateData();
    setInterval(() => {
      FetchAccount();
      FetchAccountsMap();
      FetchGroupMap();
      FetchResidenceMap();
    }, 1000 * 60 * 15);
  }, []);
  if (account) {
    account.id = props.user.uid;
    return (
      <AccountsMapContext.Provider value={accountsMap}>
        <GroupContext.Provider value={groupMap}>
          <ResidenceContext.Provider value={residenceMap}>
            <AccountContext.Provider value={account}>
              <TheLayout firebase={firebase} />
            </AccountContext.Provider>
          </ResidenceContext.Provider>
        </GroupContext.Provider>
      </AccountsMapContext.Provider>
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
                      if (isSignedIn) {
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
