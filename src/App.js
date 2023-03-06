import { lazy, Suspense, useEffect, useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import "scss/style.scss";

import {
  FirebaseAuthConsumer, FirebaseAuthProvider
} from "@react-firebase/auth";
import { FirestoreProvider } from "@react-firebase/firestore";
import { loading } from "components";
import { config, firebase } from "db/firebase";
import { AccountContext } from "hooks/context";
import Account from "Models/Account";
import { history } from "utils/history";

// Containers
const TheLayout = lazy(() => import("containers/TheLayout"));

// Pages
const Login = lazy(() => import("views/pages/login/Login"));
const Register = lazy(() => import("views/pages/register/Register"));
const Page404 = lazy(() => import("views/pages/page404/Page404"));
const Page500 = lazy(() => import("views/pages/page500/Page500"));

const SignedIn = (props) => {
  var [account, setAccount] = useState(null);
  // fetch account data
  let FetchAccount = async () => {
	  if(!account && props.user){
		  account = new Account({id: props.user.uid});
		  await account.fetch();
		  setAccount(account);
	  }
  }
  useEffect(() => {
	  FetchAccount();
  }, []);
  if (account) {
    account.id = props.user.uid;
    return (
      <AccountContext.Provider value={account}>
        <TheLayout firebase={firebase} />
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
