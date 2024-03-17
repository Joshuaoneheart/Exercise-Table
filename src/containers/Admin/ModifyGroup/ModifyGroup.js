import { CCol, CRow } from "@coreui/react";
import ModifyCard from "components/ModifyCard";
import { useEffect, useState } from "react";
import { DB, firebase } from "db/firebase";
import { loading } from "components";
const ModifyGroup = () => {
  const [groupMap, setGroupMap] = useState(null);
  const [d, setD] = useState(false);
  useEffect(() => {
    let FetchMember = async () => {
      let tmp = { ids: [], value: [] };
      await firebase
        .firestore()
        .collection("accounts")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            tmp.ids.push(doc.id);
            tmp.value.push(doc.data());
          });
          setD(tmp);
        });
    };
    let FetchGroupMap = async () => {
      let tmp = {};
      let group = await DB.getByUrl("/group");
      await group.forEach((doc) => {
        tmp[doc.id] = doc.data().name;
      });
      setGroupMap(tmp);
    };
    FetchMember();
    FetchGroupMap();
  }, []);
  if(groupMap === null) return loading;
  return (
    <>
      <CRow>
        <CCol>
          {d ? (
            <ModifyCard
              default_data={d}
              page={"group"}
              map={groupMap}
              title={"住戶活力組管理"}
            />
          ) : (
            loading
          )}
        </CCol>
      </CRow>
    </>
  );
};

export default ModifyGroup;
