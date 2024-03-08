import {
  CCol,
  CRow
} from "@coreui/react";
import {
  FirestoreCollection
} from "@react-firebase/firestore";
import { loading } from "components";
import ModifyCard from "components/ModifyCard";
import { GroupContext } from "hooks/context";
import { useContext } from "react";

const ModifyGroup = () => {
  const groupMap = useContext(GroupContext);
  return (
    <>
      <CRow>
        <FirestoreCollection path="/accounts/">
          {(d) => {
            return !(d && d.value) ? (
              loading
            ) : (
              <CCol>
                <ModifyCard default_data={d} page={"group"} map={groupMap} title={"住戶活力組管理"}/>
              </CCol>
            );
          }}
        </FirestoreCollection>
      </CRow>
    </>
  );
};

export default ModifyGroup;
