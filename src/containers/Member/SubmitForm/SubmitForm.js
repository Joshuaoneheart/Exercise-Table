import { FirestoreDocument } from "@react-firebase/firestore";
import { loading } from "components";
import Form from "components/Form";
import { AccountContext } from "hooks/context";
import { useContext, useState } from "react";
import { GetWeeklyBase } from "utils/date";

const SubmitForm = () => {
  const account = useContext(AccountContext);
  const [thisWeek, setThisWeek] = useState(true);
  return (
    <FirestoreDocument
      path={
        "/accounts/" +
        account.id +
        "/data/" +
        (thisWeek ? GetWeeklyBase() : GetWeeklyBase() - 1)
      }
    >
      {(default_data) => {
        if (default_data.isLoading) return loading;
        return (
          <Form
            default_data={default_data}
            account={account}
            thisWeek={thisWeek}
            setThisWeek={setThisWeek}
          />
        );
      }}
    </FirestoreDocument>
  );
};

export default SubmitForm;
