import { CCol, CRow } from "@coreui/react";
import {
  FirestoreCollection,
  FirestoreDocument,
} from "@react-firebase/firestore";
import { loading } from "components";
import GFFormContent from "components/GFFormContent";
import { AccountContext } from "hooks/context";
import { useContext } from "react";
import { GetWeeklyBase } from "utils/date";

const GFForm = () => {
  const account = useContext(AccountContext);
  return (
    <CRow>
      <CCol>
        <FirestoreDocument
          path={"/accounts/" + account.id + "/GF/" + GetWeeklyBase()}
        >
          {(default_data) => {
            if (default_data.isLoading) return loading;
            return (
              <FirestoreCollection path="/GF/">
                {(d) => {
                  if (d.isLoading) return loading;
                  if (d && d.value) {
                    // add "id" to data
                    for (var i = 0; i < d.value.length; i++) {
                      d.value[i]["id"] = d.ids[i];
                    }
                    return (
                      <GFFormContent
                        default_data={default_data}
                        data={d}
                        account={account}
                      />
                    );
                  } else return loading;
                }}
              </FirestoreCollection>
            );
          }}
        </FirestoreDocument>
      </CCol>
    </CRow>
  );
};

export default GFForm;
