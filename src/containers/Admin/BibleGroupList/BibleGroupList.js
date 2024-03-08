import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { FirestoreCollection } from "@react-firebase/firestore";
import { firebase } from "db/firebase";
import { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { loading } from "components";
const BibleGroupListBody = ({ data }) => {
  const [member, setMember] = useState({});
  const fields = [
    { key: "name", label: "名稱", _style: { width: "7%" } },
    { key: "member", label: "成員", _style: { width: "40%" } },
    { key: "table", label: "上週主日聚會", _style: { width: "20%" } },
    { key: "score", label: "上週總分", _style: { width: "20%" } },
    {
      key: "show_details",
      label: "",
      _style: { width: "1%" },
      sorter: false,
      filter: false,
    },
  ];
  useEffect(() => {
    let FetchMember = async () => {
      let tmp = {};
      await firebase
        .firestore()
        .collection("accounts")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const account = doc.data();
            if (!account.group) return;
            if (!(account.group in tmp))
              tmp[account.group] = [account.displayName];
            else tmp[account.group].push(account.displayName);
          });
          setMember(tmp);
        });
    };
    FetchMember();
  }, [data]);
  return (
    <CCardBody>
      <CDataTable
        items={data}
        fields={fields}
        columnFilter
        tableFilter
        itemsPerPage={10}
        hover
        sorter
        pagination
        scopedSlots={{
          member: (item) => {
            if(!(item.id in member)) return <td></td>
            return <td>{member[item.id].join(",")}</td>
          },
          show_details: (item) => {
            return (
              <Link to={"/biblegroup/" + item.id}>
                <CIcon name="cil-info" style={{ marginTop: "40%" }} />
              </Link>
            );
          },
        }}
      />
    </CCardBody>
  );
};

const BibleGroupList = () => {
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>活力組操練情形</CCardHeader>
          <FirestoreCollection path="/group/">
            {(d) => {
              if (d.isLoading) return loading;
              if (d && d.value) {
                // add "id" to data
                for (var i = 0; i < d.value.length; i++) {
                  d.value[i]["id"] = d.ids[i];
                }
                return <BibleGroupListBody data={d.value} />;
              } else return null;
            }}
          </FirestoreCollection>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default BibleGroupList;
