import { CCol, CRow } from "@coreui/react";
import ModifyCard from "components/ModifyCard";
import { GroupContext } from "hooks/context";
import { useContext, useEffect, useState } from "react";
import { firebase } from "db/firebase";
import { loading } from "components";
const ModifyGroup = () => {
  const groupMap = useContext(GroupContext);
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
    FetchMember();
  }, []);
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
