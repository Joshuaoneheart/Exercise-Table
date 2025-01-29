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
    <Suspense fallback={loading}>
      <Switch>
        {
          <div id="content" style={{ overflowY: "scroll", width: "100%" }}>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => <route.component {...props} />}
                  />
                )
              );
            })}
          </div>
        }
        <Redirect from="/" to="/form" />
      </Switch>
    </Suspense>
  );
};

export default memo(TheContent);
