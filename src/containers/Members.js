import CIcon from "@coreui/icons-react";
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
  CForm,
  CInput,
  CRow
} from "@coreui/react";
import {
  CChartLine
} from "@coreui/react-chartjs";
import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";
import { AccountContext } from "hooks/context";
import { useContext, useState } from "react";
import { WeeklyBase2String } from "utils/date";
// import { FirestoreCollection } from "@react-firebase/firestore";

// TODO:
// 1. Set a function that takes input from firebase and renders the charts accordingly

// FIXME:
// Saaaaaaaaaaaameeeeeeeeeeeeeee
const RenderLineChart = ({ data }) => {
  let labels = [];
  let chart_data = [];
  let ids = data.ids.map((x) => parseInt(x));
  let lower = Math.min(...ids);
  let upper = Math.max(...ids);
  for (let i = lower; i <= upper; i++) {
    labels.push(WeeklyBase2String(i));
    if (ids.includes(i)) {
      chart_data.push(data.value[ids.indexOf(i)].scores);
    } else chart_data.push(null);
  }
  const line = {
    labels,
    datasets: [
      {
        label: "Total Score",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        cubicInterpolationMode: "default",
        data: chart_data,
        spanGaps: true,
      },
    ],
  };
  return (
    <CRow className="col-md-6">
      <CCol>
        <h4>Total Score Curve</h4>
        <div className="chart-wrapper">
          <CChartLine datasets={line.datasets} labels={line.labels} />
        </div>
        <hr />
      </CCol>
    </CRow>
  );
};
const AdminCardHeader = ({
  is_admin,
  accounts,
  activeAccount,
  setActiveAccount,
}) => {
  let menu = [];
  if (is_admin) {
    for (let i = 0; i < accounts.length; i++) {
      menu.push(
        <CDropdownItem onClick={() => setActiveAccount(accounts[i])}>
          {" "}
          {accounts[i].displayName}{" "}
        </CDropdownItem>
      );
    }
  }
  return (
    <CCardHeader>
      <CRow className="align-items-center">
        {is_admin ? (
          <CCol>
            <CDropdown>
              <CDropdownToggle caret color="info">
                <CIcon name="cil-user" /> {activeAccount.displayName}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem header> List of Users</CDropdownItem>
                {menu}
              </CDropdownMenu>
            </CDropdown>
          </CCol>
        ) : (
          <CCol xs="5" md="7" lg="7" xl="8">
            個人操練情況查詢
          </CCol>
        )}
        <CForm inline style={{ visibility: is_admin ? "visible" : "hidden" }}>
          <CInput className="mr-sm-2" placeholder="Search" size="sm" />
          <CButton color="dark" type="submit" size="sm">
            <CIcon name="cil-search" size="sm" />
          </CButton>
        </CForm>
      </CRow>
    </CCardHeader>
  );
};

// FIXME:
// May need to add the necessary hooks
const StatisticCard = ({ is_admin, account, accounts }) => {
  const [activeAccount, setActiveAccount] = useState(account);
  return (
    <FirestoreCollection path={"/accounts/" + activeAccount.id + "/data/"}>
      {(data) => {
        if (data.isLoadin) return loading;
        if (data && data.value) {
          return (
            <CCard>
              <AdminCardHeader
                is_admin={is_admin}
                accounts={accounts}
                activeAccount={activeAccount}
                setActiveAccount={setActiveAccount}
              />
              <CCardBody>
                <CRow>
                  <RenderLineChart data={data} />
                </CRow>
              </CCardBody>
            </CCard>
          );
        }
      }}
    </FirestoreCollection>
  );
};
// FIXME:
// Need to add hooks for each dropdown item
// Also needed for search
const Members = () => {
  const account = useContext(AccountContext);
  if (account.role === "Admin") {
    return (
      <CRow>
        <FirestoreCollection path="/accounts/">
          {(d) => {
            if (d && d.value) {
              for (let i = 0; i < d.value.length; i++) d.value[i].id = d.ids[i];
              return (
                <CCol>
                  <StatisticCard
                    account={d.value[0]}
                    accounts={d.value}
                    is_admin={true}
                  />
                </CCol>
              );
            } else return loading;
          }}
        </FirestoreCollection>
      </CRow>
    );
  } else {
    return (
      <CRow>
        <CCol>
          <StatisticCard account={account} is_admin={false} />
        </CCol>
      </CRow>
    );
  }
};

export default Members;
