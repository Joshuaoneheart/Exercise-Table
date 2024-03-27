import { CCardHeader, CCard, CCardBody } from "@coreui/react";
import { loading } from "components";
import TrackingTable from "components/TrackingTable";
import { DB } from "db/firebase";
import { AccountContext } from "hooks/context";
import { useContext, useEffect, useState } from "react";
import { GetWeeklyBase } from "utils/date";

const Schedule = () => {
  const account = useContext(AccountContext);
  const [default_data, setDefaultData] = useState(null);
  useEffect(() => {
    const GetData = async () => {
      let data = await DB.getByUrl(
        "/accounts/" + account.id + "/schedule/" + GetWeeklyBase()
      );
      setDefaultData(data ? data : {});
    };
    GetData();
  }, [account.id]);
  return (
    <CCard>
      <CCardHeader>時間表</CCardHeader>
      <CCardBody>
        {default_data ? (
          <TrackingTable
            isChangeable={true}
            default_data={default_data}
            account_id={account.id}
          />
        ) : (
          loading
        )}
      </CCardBody>
    </CCard>
  );
};

export default Schedule;
