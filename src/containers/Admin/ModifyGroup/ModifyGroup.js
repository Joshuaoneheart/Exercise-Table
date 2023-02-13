import {
  CCol,
  CRow
} from "@coreui/react";
import {
  FirestoreCollection
} from "@react-firebase/firestore";
import { loading } from "Components";
import ModifyCard from "Components/ModifyCard";

const ModifyGroup = () => {
  return (
    <>
      <CRow>
        <FirestoreCollection path="/accounts/">
          {(d) => {
            return !(d && d.value) ? (
              loading
            ) : (
              <CCol>
                <ModifyCard default_data={d} page={"group"} title={"住戶活力組管理"}/>
              </CCol>
            );
          }}
        </FirestoreCollection>
      </CRow>
    </>
  );
};

export default ModifyGroup;