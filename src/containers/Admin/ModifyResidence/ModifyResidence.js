import { CCol, CRow } from "@coreui/react";
import { FirestoreCollection } from "@react-firebase/firestore";
import { loading } from "components";
import ModifyCard from "components/ModifyCard";
import { DB } from "db/firebase";
import { useEffect, useState } from "react";

const ModifyResidence = () => {
  const [residenceMap, setResidenceMap] = useState(null);
  useEffect(() => {
    let FetchResidenceMap = async () => {
      let tmp = {};
      let residence = await DB.getByUrl("/residence");
      await residence.forEach((doc) => {
        tmp[doc.id] = doc.data().name;
      });
      setResidenceMap(tmp);
    };
    FetchResidenceMap();
  }, []);
  if (residenceMap === null) return loading;
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
