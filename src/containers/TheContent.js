import { CContainer, CFade } from "@coreui/react";
import { memo, Suspense, useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { AccountContext } from "hooks/context";
// routes config
import member_routes from "routes/member_routes";
import admin_routes from "routes/routes";
import { loading } from "components";

const TheContent = () => {
  var account = useContext(AccountContext);
  if (!account) return null;
  var routes;
  if (account.is_admin) routes = admin_routes;
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
