import React, { Component, createContext } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import "./scss/style.scss";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
} from "@react-firebase/auth";
import {
  FirestoreProvider,
  FirestoreDocument,
} from "@react-firebase/firestore";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { loading } from "src/reusable";
const AccountContext = createContext({});
const BaseDate = new Date(2021, 8, 19, 24).getTime();
const GetWeeklyBase = () => {
  var now = new Date().getTime();
  return Math.floor((now - BaseDate) / 86400000);
};

var config = {
  apiKey: "AIzaSyBRYT6ipwBqNlt8xqkU2NfPV5XpU0PXxsE",
  authDomain: "exercising-table-data.firebaseapp.com",
  databaseURL: "https://exercising-table-data-default-rtdb.firebaseio.com",
  projectId: "exercising-table-data",
  storageBucket: "exercising-table-data.appspot.com",
  messagingSenderId: "820908125256",
  appId: "1:820908125256:web:dbd81b7b5fcadf7c743c7d",
  measurementId: "G-TJ2TJXC3N7",
};

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

class App extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          <FirebaseAuthProvider {...config} firebase={firebase}>
            <Switch>
              <Route
                exact
                path="/register"
                name="Register Page"
                render={(props) => <Register {...props} />}
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
                        if (user !== null) console.log(user.uid);
                        if (isSignedIn)
                          return (
                            <FirestoreDocument path={"/accounts/" + user.uid}>
                              {(d) => {
                                console.log(d);
                                if (d.isLoading) return loading;
                                if (
                                  typeof d != "undefined" &&
                                  typeof d.value != "undefined" &&
                                  d != null
                                ) {
                                  d.value.id = user.uid;
                                  return (
                                    <AccountContext.Provider value={d.value}>
                                      <TheLayout firebase={firebase} />
                                    </AccountContext.Provider>
                                  );
                                } else return null;
                              }}
                            </FirestoreDocument>
                          );
                        else return <Login firebase={firebase} />;
                      }}
                    </FirebaseAuthConsumer>
                  </FirestoreProvider>
                )}
              />
            </Switch>
          </FirebaseAuthProvider>
        </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
export { AccountContext, BaseDate, GetWeeklyBase };
