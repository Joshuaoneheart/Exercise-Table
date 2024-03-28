import { CRow } from "@coreui/react";
import {
  FirestoreDocument
} from "@react-firebase/firestore";
import { loading } from "components";
import Form from "components/Form";
import { AccountContext } from "hooks/context";
import { useContext } from "react";
import { GetWeeklyBase } from "utils/date";

const SubmitForm = () => {
  const account = useContext(AccountContext);
  return (
    <CRow>
      <FirestoreDocument
        path={"/accounts/" + account.id + "/data/" + GetWeeklyBase()}
      >
        {(default_data) => {
          if (default_data.isLoading) return loading;
          return (
            <Form default_data={default_data} account={account}/>
          );
        }}
      </FirestoreDocument>
    </CRow>
  );
};

export default SubmitForm;
