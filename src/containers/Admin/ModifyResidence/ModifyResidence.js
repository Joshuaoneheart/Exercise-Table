import { CCol, CRow } from "@coreui/react";
import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";
import ModifyCard from "components/ModifyCard";
import { ResidenceContext } from "hooks/context";
import { useContext } from "react";

const ModifyResidence = () => {
  const residenceMap = useContext(ResidenceContext);
  return (
    <>
      <CRow>
        <FirestoreCollection path="/accounts/">
          {(d) => {
            return !(d && d.value) ? (
              loading
            ) : (
              <CCol>
                <ModifyCard
                  map={residenceMap}
                  default_data={d}
                  page={"residence"}
                  title={"住戶住處管理"}
                />
              </CCol>
            );
          }}
        </FirestoreCollection>
      </CRow>
    </>
  );
};

export default ModifyResidence;
