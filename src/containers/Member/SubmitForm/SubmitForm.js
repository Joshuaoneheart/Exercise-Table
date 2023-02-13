import { CRow } from "@coreui/react";
import {
  FirestoreDocument
} from "@react-firebase/firestore";
import { loading } from "Components";
import Form from "Components/Form";
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
            <Form default_data={default_data} is_footer={true} account={account}/>
          );
        }}
      </FirestoreDocument>
    </CRow>
  );
};

export default SubmitForm;
