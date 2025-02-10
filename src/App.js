import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
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
import { GetWeeklyBase } from "utils/date";
import { GF_GRADE_NEXT } from "const/GF";
import { message } from "antd";
import SemesterContext from "hooks/semester";
// Containers
const TheLayout = lazy(() => import("containers/TheLayout"));

// Pages
const Login = lazy(() => import("containers/Login"));
const Register = lazy(() => import("containers/Register"));

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
        if (tmp.status === "Pending") {
          message.error("經過後台驗證後才會開通帳戶，請稍等");
          DB.signOut();
        } else setAccount(tmp);
      }
    };
    FetchAccount();
  }, [account, props]);
  useEffect(() => {
    if (semesters === null && account) {
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
  }, [semesters, account]);
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
        let this_year_pass = new Date().getMonth() >= 8;
        const now_year = new Date().getFullYear();
        if (now_year !== counter.year_counter) {
          // 更新 GF 年級
          let GFs = [];
          if (counter.year_counter < now_year - 1 || this_year_pass)
            GFs = await DB.getByUrl("/GF");
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
          if (this_year_pass) {
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
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setWidth(window.innerWidth);
      });
    };
  }, []);
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <FirebaseAuthProvider {...config} firebase={firebase}>
          <Switch>
            <Route
              exact
              path="/register"
              name="Register Page"
              render={(props) => {
                return (
                  <Register firebase={firebase} width={width} {...props} />
                );
              }}
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
                      } else return <Login firebase={firebase} width={width}/>;
                    }}
                  </FirebaseAuthConsumer>
                </FirestoreProvider>
              )}
            />
          </Switch>
        </FirebaseAuthProvider>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
