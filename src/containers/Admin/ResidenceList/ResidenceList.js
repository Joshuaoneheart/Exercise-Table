import {
    CCol,
    CRow,
    CCard,
    CCardBody,
    CCardHeader,
    CDataTable,
  } from "@coreui/react";
  import { FirestoreCollection } from "@react-firebase/firestore";
  import { firebase } from "db/firebase";
  import { useEffect, useState } from "react";
  import { loading } from "components";
  import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
  const ResidenceListBody = ({ data }) => {
    const [member, setMember] = useState({});
    const history = useHistory()
    const fields = [
      { key: "name", label: "名稱", _style: { width: "7%" } },
      { key: "member", label: "成員", _style: { width: "40%" } },
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
              if (!account.residence) return;
              if (!(account.residence in tmp))
                tmp[account.residence] = [account.displayName];
              else tmp[account.residence].push(account.displayName);
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
          onRowClick={(item) => {
            history.push(`/residence/${item.id}`);
          }}
          scopedSlots={{
            member: (item) => {
              if (!(item.id in member)) return <td></td>;
              return <td>{member[item.id].join(",")}</td>;
            },
          }}
        />
      </CCardBody>
    );
  };
  
  const ResidenceList = () => {
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>活力組操練情形</CCardHeader>
            <FirestoreCollection path="/residence/">
              {(d) => {
                if (d.isLoading) return loading;
                if (d && d.value) {
                  // add "id" to data
                  for (var i = 0; i < d.value.length; i++) {
                    d.value[i]["id"] = d.ids[i];
                  }
                  return <ResidenceListBody data={d.value} />;
                } else return null;
              }}
            </FirestoreCollection>
          </CCard>
        </CCol>
      </CRow>
    );
  };
  export default ResidenceList;
  