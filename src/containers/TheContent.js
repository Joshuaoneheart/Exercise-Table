import { Suspense, useContext, memo } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { CContainer, CFade } from "@coreui/react";

import { AccountContext } from "hooks/context";
// routes config
import admin_routes from "routes/routes";
import member_routes from "routes/member_routes";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheContent = () => {
  var account = useContext(AccountContext);
  if (!account) return null;
  var routes;
  if (account.role === "Admin") routes = admin_routes;
  else routes = member_routes;
  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => (
                      <CFade>
                        <route.component {...props} />
                      </CFade>
                    )}
                  />
                )
              );
            })}
            <Redirect from="/" to="/form" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  );
};

export default memo(TheContent);
